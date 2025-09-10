'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, Users, Award, ChevronRight, Play, CheckCircle, Heart, MessageCircle, Phone, Mail, Menu, X, MapPin, Navigation } from 'lucide-react'

export default function MapPage() {
  const [regions, setRegions] = useState<any[]>([])
  const [hospitals, setHospitals] = useState<any[]>([])
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [selectedHospital, setSelectedHospital] = useState<any>(null)
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)

  // データ取得
  useEffect(() => {
    fetchData()
  }, [])

  // 地域データが読み込まれた後にURLパラメータをチェック
  useEffect(() => {
    if (regions.length > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const selectedRegionId = urlParams.get('region')
      if (selectedRegionId) {
        const region = regions.find(r => r.id === selectedRegionId)
        if (region) {
          setSelectedRegion(region)
        }
      }
    }
  }, [regions])

  const fetchData = async () => {
    try {
      // 地域データ取得
      const regionsRes = await fetch('/api/regions')
      if (regionsRes.ok) {
        const regionsData = await regionsRes.json()
        setRegions(Array.isArray(regionsData) ? regionsData : [])
      }

      // 病院データ取得
      const hospitalsRes = await fetch('/api/hospitals')
      if (hospitalsRes.ok) {
        const hospitalsData = await hospitalsRes.json()
        setHospitals(Array.isArray(hospitalsData) ? hospitalsData : [])
      }
    } catch (error) {
      console.error('データ取得エラー:', error)
    }
  }


  // ヘッダーコンポーネント
  const Header = () => (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">地域別ワーケーション</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/programs"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              プログラム
            </a>
            <a
              href="/shifts"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              求人一覧
            </a>
          </div>
        </div>
      </div>
    </header>
  )

  // 地図セクション
  const MapSection = () => {
    // 座標変換関数（緯度経度をSVG座標に変換）
    const latLngToSvg = (lat: number, lng: number) => {
      // 日本の地理的範囲
      const minLat = 24.0
      const maxLat = 46.0
      const minLng = 122.0
      const maxLng = 146.0
      
      // SVGの表示範囲（余白を考慮）
      const svgWidth = 800
      const svgHeight = 600
      const margin = 50
      
      // 座標変換
      const x = margin + ((lng - minLng) / (maxLng - minLng)) * (svgWidth - 2 * margin)
      const y = margin + ((maxLat - lat) / (maxLat - minLat)) * (svgHeight - 2 * margin)
      
      return { x: Math.max(margin, Math.min(svgWidth - margin, x)), y: Math.max(margin, Math.min(svgHeight - margin, y)) }
    }

    return (
      <div className="relative">
        <div className="h-screen bg-gray-50 relative">
          {/* 地図タイトル */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-white rounded-lg shadow-lg px-6 py-3">
              <h2 className="text-xl font-bold text-gray-900">病院を見つける</h2>
              <p className="text-sm text-gray-600">日本全国には{hospitals.length}の病院があります</p>
            </div>
          </div>

          {/* SVG日本地図 */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-w-5xl max-h-full">
              <svg
                viewBox="0 0 800 600"
                className="w-full h-full"
                style={{ backgroundColor: '#f0f9ff' }}
              >
                {/* 日本列島のシンプルなSVGパス */}
                <g fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2">
                  {/* 北海道 */}
                  <path d="M 200 80 L 250 75 L 300 85 L 320 105 L 315 135 L 300 155 L 270 165 L 240 160 L 210 145 L 190 120 L 195 95 Z" />
                  
                  {/* 本州 */}
                  <path d="M 220 150 L 280 145 L 340 140 L 400 135 L 460 140 L 520 145 L 580 150 L 640 160 L 680 180 L 690 210 L 685 240 L 675 270 L 660 295 L 640 315 L 615 330 L 585 340 L 555 345 L 525 340 L 495 330 L 465 315 L 435 295 L 405 270 L 375 245 L 345 220 L 315 195 L 285 175 L 255 160 L 225 155 Z" />
                  
                  {/* 四国 */}
                  <path d="M 440 300 L 470 295 L 500 300 L 520 310 L 525 330 L 520 350 L 500 360 L 470 365 L 440 360 L 420 350 L 415 330 L 420 310 Z" />
                  
                  {/* 九州 */}
                  <path d="M 340 380 L 380 375 L 420 380 L 450 390 L 470 405 L 475 425 L 470 445 L 450 455 L 420 460 L 380 455 L 350 445 L 330 425 L 325 405 L 330 390 Z" />
                  
                  {/* 沖縄 */}
                  <path d="M 200 500 L 220 495 L 240 500 L 250 510 L 245 525 L 230 535 L 210 540 L 190 535 L 175 525 L 170 510 L 175 500 Z" />
                </g>

                {/* 病院マーカー */}
                {Array.isArray(hospitals) && hospitals.length > 0 ? hospitals.map((hospital: any) => {
                  if (!hospital.lat || !hospital.lng) {
                    return null
                  }
                  
                  const { x, y } = latLngToSvg(hospital.lat, hospital.lng)
                  const isHovered = hoveredMarker === hospital.id
                  
                  return (
                    <g key={hospital.id}>
                      {/* ホバー時の背景円 */}
                      <circle
                        cx={x}
                        cy={y}
                        r="15"
                        fill={isHovered ? "#fef3c7" : "transparent"}
                        className="cursor-pointer transition-all duration-200"
                        onClick={() => {
                          console.log('Hospital clicked:', hospital)
                          setSelectedHospital(hospital)
                        }}
                        onMouseEnter={() => setHoveredMarker(hospital.id)}
                        onMouseLeave={() => setHoveredMarker(null)}
                      />
                      {/* メインのマーカー */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#dc2626"
                        stroke="#ffffff"
                        strokeWidth="3"
                        className="cursor-pointer hover:fill-red-700 transition-colors"
                        onClick={() => {
                          console.log('Hospital clicked:', hospital)
                          setSelectedHospital(hospital)
                        }}
                        onMouseEnter={() => setHoveredMarker(hospital.id)}
                        onMouseLeave={() => setHoveredMarker(null)}
                      />
                      {/* 病院名ラベル（ホバー時のみ表示） */}
                      {isHovered && (
                        <text
                          x={x}
                          y={y - 20}
                          textAnchor="middle"
                          className="text-xs fill-gray-800 pointer-events-none font-medium"
                          style={{ fontSize: '12px' }}
                        >
                          {hospital.name}
                        </text>
                      )}
                    </g>
                  )
                }) : null}
              </svg>
            </div>
          </div>
        </div>
        
        {/* 病院詳細ポップアップ */}
        {selectedHospital && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-80 border border-gray-200">
              {/* 閉じるボタン */}
              <button
                onClick={() => setSelectedHospital(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* 病院名 */}
              <h3 className="text-lg font-bold text-gray-900 mb-4 pr-8">{selectedHospital.name}</h3>
              
              {/* 住所 */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">住所</p>
                <p className="text-sm text-gray-900">{selectedHospital.address}</p>
              </div>
              
              {/* 連絡先 */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Eメールアドレス</p>
                <p className="text-sm text-gray-900">{selectedHospital.name.toLowerCase().replace(/\s+/g, '')}@equimedlink.com</p>
              </div>
              
              {/* アクションボタン */}
              <div className="flex space-x-3 mb-4">
                <button className="flex-1 text-sm text-blue-600 hover:text-blue-800 transition-colors border-b border-blue-600 pb-1">
                  病院詳細
                </button>
                <button className="flex-1 text-sm text-blue-600 hover:text-blue-800 transition-colors border-b border-blue-600 pb-1 flex items-center justify-center">
                  ルート・乗換
                  <ChevronRight className="h-3 w-3 ml-1" />
                </button>
              </div>
              
              {/* 電話番号 */}
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-900">050-1743-1430</span>
              </div>
            </div>
          </div>
        )}

        {/* 地図の凡例 */}
        <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-4 z-20">
          <h3 className="font-semibold text-gray-900 mb-3">凡例</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-red-500 rounded-full mr-3 border-2 border-white"></div>
              <span className="text-sm text-gray-700 font-medium">病院</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              マーカーをクリックして詳細を表示
            </p>
          </div>
        </div>

        {/* 病院リスト */}
        <div className="absolute bottom-4 left-4 w-80 bg-white rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto z-20">
          <h3 className="font-semibold text-gray-900 mb-3">病院一覧</h3>
          <div className="space-y-2">
            {Array.isArray(hospitals) && hospitals.length > 0 ? hospitals.map((hospital: any) => (
              <div
                key={hospital.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  console.log('Hospital list item clicked:', hospital)
                  setSelectedHospital(hospital)
                }}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{hospital.catch_copy}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-xs text-gray-500">{hospital.rating_avg} ({hospital.review_count}件)</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
              </div>
            )) : (
              <div className="text-center py-4">
                <p className="text-gray-500">病院データを読み込み中...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 地域詳細ページ
  const RegionDetailPage = () => {
    if (!selectedRegion) return null

    return (
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{selectedRegion.name}</h1>
              <button
                onClick={() => setSelectedRegion(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-lg text-gray-600 mb-6">{selectedRegion.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">地域の特徴</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRegion.features?.map((feature: any, index: number) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">アクセス</h3>
                <div className="flex items-center text-gray-600">
                  <Navigation className="h-4 w-4 mr-2" />
                  <span>{selectedRegion.access_info}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 病院詳細ページ
  const HospitalDetailPage = () => {
    if (!selectedHospital) return null

    return (
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{selectedHospital.name}</h1>
              <button
                onClick={() => setSelectedHospital(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-lg text-gray-600 mb-6">{selectedHospital.catch_copy}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">病院情報</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">住所:</span>
                    <span className="font-medium">{selectedHospital.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">病床数:</span>
                    <span className="font-medium">{selectedHospital.bed_count}床</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">EHR:</span>
                    <span className="font-medium">{selectedHospital.ehr_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">評価:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{selectedHospital.rating_avg}</span>
                      <span className="text-gray-500 ml-1">({selectedHospital.review_count}件)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">特徴</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHospital.features?.map((feature: any, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a
                href="/shifts"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                求人を見る
              </a>
              <button
                onClick={() => setSelectedHospital(null)}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {selectedHospital ? (
          <HospitalDetailPage />
        ) : selectedRegion ? (
          <RegionDetailPage />
        ) : (
          <MapSection />
        )}
      </main>
    </div>
  )
}