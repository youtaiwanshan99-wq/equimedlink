'use client'
import { useEffect, useRef, useState } from 'react'
import maplibregl, { Map as MLMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface JobDetail {
  id: string
  hospital: string
  dept: string
  role: string
  start_at: string
  end_at: string
  surcharge: number
  comp_base: number
  required_skills: string[]
  ehr_type: string
}

export default function MapView() {
  const ref = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MLMap | null>(null)
  const [mode, setMode] = useState<'heat' | 'pins' | 'shortage'>('shortage')
  const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null)
  const [showJobModal, setShowJobModal] = useState(false)

  useEffect(() => {
    if (!ref.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: ref.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [139.6917, 35.6895], // Tokyo
      zoom: 6
    })
    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.on('load', async () => {
      const res = await fetch('/api/shifts')
      const geojson = await res.json()
      map.addSource('shifts', { type: 'geojson', data: geojson })

      // スタッフ不足レベル表示（ヒートマップ）
      map.addLayer({
        id: 'shortage-heat',
        type: 'heatmap',
        source: 'shifts',
        layout: { visibility: mode === 'shortage' ? 'visible' : 'none' },
        paint: {
          'heatmap-weight': ['coalesce', ['get', 'weight'], 1],
          'heatmap-intensity': 1.5,
          'heatmap-radius': 40,
          'heatmap-opacity': 0.8,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)', // 充足（青）
            0.3, 'rgba(0, 255, 0, 0.5)', // 普通（緑）
            0.6, 'rgba(255, 255, 0, 0.7)', // やや不足（黄）
            1, 'rgba(255, 0, 0, 0.9)' // 深刻な不足（赤）
          ]
        }
      })

      // 従来のヒートマップ
      map.addLayer({
        id: 'shifts-heat',
        type: 'heatmap',
        source: 'shifts',
        layout: { visibility: mode === 'heat' ? 'visible' : 'none' },
        paint: {
          'heatmap-weight': ['coalesce', ['get', 'weight'], 1],
          'heatmap-intensity': 1,
          'heatmap-radius': 30,
          'heatmap-opacity': 0.85
        }
      })

      // ピン表示（スタッフ不足レベル別の色分け）
      map.addLayer({
        id: 'shortage-points',
        type: 'circle',
        source: 'shifts',
        layout: { visibility: mode === 'shortage' ? 'visible' : 'none' },
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'weight'],
            1, 8,
            2, 12,
            3, 16,
            4, 20,
            5, 24
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'weight'],
            1, '#3B82F6', // 青（充足）
            2, '#10B981', // 緑（普通）
            3, '#F59E0B', // 黄（やや不足）
            4, '#EF4444', // 赤（不足）
            5, '#DC2626'  // 濃い赤（深刻な不足）
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
          'circle-opacity': 0.8
        }
      })

      // 従来のピン表示
      map.addLayer({
        id: 'shifts-points',
        type: 'circle',
        source: 'shifts',
        layout: { visibility: mode === 'pins' ? 'visible' : 'none' },
        paint: {
          'circle-radius': 8,
          'circle-color': '#3B82F6',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
          'circle-opacity': 0.8
        }
      })

      // ピンクリック時の詳細表示
      const handleClick = (e: any) => {
        const f = e.features?.[0]
        if (!f) return
        
        const { hospital, dept, role, start_at, end_at, surcharge, id, comp_base, required_skills, ehr_type } = f.properties
        
        setSelectedJob({
          id,
          hospital,
          dept,
          role,
          start_at,
          end_at,
          surcharge,
          comp_base,
          required_skills: required_skills || [],
          ehr_type
        })
        setShowJobModal(true)
      }

      map.on('click', 'shortage-points', handleClick)
      map.on('click', 'shifts-points', handleClick)

      // ホバー時のカーソル変更
      map.on('mouseenter', 'shortage-points', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'shortage-points', () => {
        map.getCanvas().style.cursor = ''
      })
      map.on('mouseenter', 'shifts-points', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'shifts-points', () => {
        map.getCanvas().style.cursor = ''
      })

      mapRef.current = map
    })

    return () => { mapRef.current?.remove(); mapRef.current = null }
  }, [])

  // モードの反映
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    
    const layers = ['shortage-heat', 'shortage-points', 'shifts-heat', 'shifts-points']
    layers.forEach(layer => {
      const layerObj = map.getLayer(layer)
      if (layerObj) {
        const isVisible = 
          (mode === 'shortage' && (layer === 'shortage-heat' || layer === 'shortage-points')) ||
          (mode === 'heat' && layer === 'shifts-heat') ||
          (mode === 'pins' && layer === 'shifts-points')
        map.setLayoutProperty(layer, 'visibility', isVisible ? 'visible' : 'none')
      }
    })
  }, [mode])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getShortageLevel = (weight: number) => {
    if (weight <= 1.5) return { level: '充足', color: 'text-blue-600' }
    if (weight <= 2.5) return { level: '普通', color: 'text-green-600' }
    if (weight <= 3.5) return { level: 'やや不足', color: 'text-yellow-600' }
    if (weight <= 4.5) return { level: '不足', color: 'text-red-600' }
    return { level: '深刻な不足', color: 'text-red-800' }
  }

  return (
    <div className="w-full h-screen relative">
      {/* コントロールパネル */}
      <div className="absolute z-10 left-4 top-4 bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3">表示モード</h3>
        <div className="space-y-2">
          <button
            onClick={() => setMode('shortage')}
            className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'shortage' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🏥 スタッフ不足レベル
          </button>
          <button
            onClick={() => setMode('heat')}
            className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'heat' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔥 従来ヒートマップ
          </button>
          <button
            onClick={() => setMode('pins')}
            className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'pins' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📍 ピン表示
          </button>
        </div>
        
        {/* 凡例 */}
        {mode === 'shortage' && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">スタッフ不足レベル</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>充足</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>普通</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>やや不足</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>不足</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-800 rounded-full mr-2"></div>
                <span>深刻な不足</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 地図 */}
      <div ref={ref} className="w-full h-full" />

      {/* 求人詳細モーダル */}
      {showJobModal && selectedJob && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedJob.hospital}</h3>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">求人ID</span>
                  <span className="font-mono text-sm">No.{selectedJob.id}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">診療科・役職</span>
                  <span className="font-medium">{selectedJob.dept} / {selectedJob.role}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">勤務時間</span>
                  <span className="font-medium">
                    {formatTime(selectedJob.start_at)} - {formatTime(selectedJob.end_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">報酬</span>
                  <span className="font-bold text-lg text-green-600">
                    ¥{selectedJob.comp_base.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">緊急度</span>
                  <span className={`font-medium ${getShortageLevel(selectedJob.surcharge).color}`}>
                    ×{selectedJob.surcharge} {getShortageLevel(selectedJob.surcharge).level}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">EHR</span>
                  <span className="font-medium">{selectedJob.ehr_type}</span>
                </div>

                <div>
                  <span className="text-sm text-gray-500">必要スキル</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedJob.required_skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  応募する
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
