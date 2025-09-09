'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, Users, Award, ChevronRight, Play, CheckCircle, Heart, MessageCircle, Phone, Mail, Menu, X, MapPin, Navigation } from 'lucide-react'

export default function MapPage() {
  const [regions, setRegions] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedHospital, setSelectedHospital] = useState(null)

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
    const [mapImageSrc, setMapImageSrc] = useState('/japan-map-green.png')
    const [showFallback, setShowFallback] = useState(false)
    
    // デバッグ用のログ
    console.log('MapSection rendered')
    console.log('Regions:', regions)
    console.log('Hospitals:', hospitals)

    const handleImageError = () => {
      console.log('Primary image failed, trying alternatives...')
      
      // 代替画像を試す
      const alternatives = [
        '/japan-map-green.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Map_of_Japan_with_prefectures.svg/800px-Map_of_Japan_with_prefectures.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Map_of_Japan_with_prefectures.svg/600px-Map_of_Japan_with_prefectures.svg.png'
      ]
      
      const currentIndex = alternatives.indexOf(mapImageSrc)
      if (currentIndex < alternatives.length - 1) {
        setMapImageSrc(alternatives[currentIndex + 1])
      } else {
        setShowFallback(true)
      }
    }

    return (
      <div className="relative">
        <div className="h-screen bg-gray-100 relative">
          {/* 日本地図画像 */}
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="relative w-full h-full">
              {!showFallback ? (
                <img
                  src={mapImageSrc}
                  alt="日本地図"
                  className="w-full h-full object-contain"
                  style={{ 
                    backgroundColor: '#f8f9fa'
                  }}
                  onLoad={() => {
                    console.log('Map image loaded successfully:', mapImageSrc)
                  }}
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center text-gray-600">
                    <div className="text-6xl mb-4">🗾</div>
                    <div className="text-2xl font-bold">日本地図</div>
                    <div className="text-lg">地域を選択してください</div>
                    <button 
                      onClick={() => {
                        setShowFallback(false)
                        setMapImageSrc('/japan-map-green.png')
                      }}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      地図を再読み込み
                    </button>
                  </div>
                </div>
              )}
              
              {/* 地域マーカーを地図上に配置 */}
              <div className="absolute inset-0">
                {Array.isArray(regions) && regions.length > 0 ? regions.map((region) => {
                  if (!region.lat || !region.lng) {
                    console.log('Region missing coordinates:', region)
                    return null
                  }
                  
                  // 日本地図用の座標変換（より正確な位置）
                  // 日本の経度範囲: 129°E - 146°E (17度)
                  // 日本の緯度範囲: 24°N - 46°N (22度)
                  const x = ((region.lng - 129) / 17) * 100 // 経度を0-100%に変換
                  const y = ((46 - region.lat) / 22) * 100 // 緯度を0-100%に変換
                  
                  console.log(`Region ${region.name}: lat=${region.lat}, lng=${region.lng}, x=${x}%, y=${y}%`)
                  
                  return (
                    <div
                      key={region.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                      style={{ left: `${Math.max(0, Math.min(100, x))}%`, top: `${Math.max(0, Math.min(100, y))}%` }}
                      onClick={() => {
                        console.log('Region clicked:', region)
                        setSelectedRegion(region)
                      }}
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg hover:bg-blue-600 transition-colors"></div>
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                        {region.name}
                      </div>
                    </div>
                  )
                }) : (
                  <div className="absolute top-4 left-4 bg-yellow-100 p-2 rounded">
                    <p className="text-sm">地域データがありません</p>
                  </div>
                )}
                
                {/* 病院マーカー */}
                {Array.isArray(hospitals) && hospitals.length > 0 ? hospitals.map((hospital) => {
                  if (!hospital.lat || !hospital.lng) {
                    console.log('Hospital missing coordinates:', hospital)
                    return null
                  }
                  
                  const x = ((hospital.lng - 129) / 17) * 100
                  const y = ((46 - hospital.lat) / 22) * 100
                  
                  console.log(`Hospital ${hospital.name}: lat=${hospital.lat}, lng=${hospital.lng}, x=${x}%, y=${y}%`)
                  
                  return (
                    <div
                      key={hospital.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                      style={{ left: `${Math.max(0, Math.min(100, x))}%`, top: `${Math.max(0, Math.min(100, y))}%` }}
                      onClick={() => {
                        console.log('Hospital clicked:', hospital)
                        setSelectedHospital(hospital)
                      }}
                    >
                      <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg hover:bg-red-600 transition-colors"></div>
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                        {hospital.name}
                      </div>
                    </div>
                  )
                }) : (
                  <div className="absolute top-16 left-4 bg-yellow-100 p-2 rounded">
                    <p className="text-sm">病院データがありません</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 地図の凡例 */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-20">
          <h3 className="font-semibold text-gray-900 mb-2">凡例</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">地域</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">病院</span>
            </div>
          </div>
        </div>

        {/* 地域リスト */}
        <div className="absolute bottom-4 left-4 w-80 bg-white rounded-lg shadow-lg p-4 max-h-64 overflow-y-auto z-20">
          <h3 className="font-semibold text-gray-900 mb-3">地域一覧</h3>
          <div className="space-y-2">
            {Array.isArray(regions) && regions.length > 0 ? regions.map((region) => (
              <div
                key={region.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  console.log('Region list item clicked:', region)
                  setSelectedRegion(region)
                }}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{region.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{region.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
              </div>
            )) : (
              <div className="text-center py-4">
                <p className="text-gray-500">地域データを読み込み中...</p>
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

    // 地域名で病院をフィルタリング（より柔軟なマッチング）
    const regionHospitals = Array.isArray(hospitals) ? hospitals.filter(h => {
      if (!h.region) return false
      // 地域名の部分一致で検索
      return h.region.includes(selectedRegion.name) || selectedRegion.name.includes(h.region)
    }) : []

    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="relative">
              <img
                src={selectedRegion.photo}
                alt={selectedRegion.name}
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedRegion.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{selectedRegion.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">地域の特徴</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegion.features.map((feature, index) => (
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
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Navigation className="h-4 w-4 mr-2" />
                      <span>{selectedRegion.access_info}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              この地域の病院 ({regionHospitals.length}件)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(regionHospitals) && regionHospitals.length > 0 ? regionHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedHospital(hospital)}
                >
                  <div className="relative">
                    <img
                      src={hospital.photos?.[0] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop'}
                      alt={hospital.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{hospital.name}</h3>
                    <p className="text-gray-600 mb-4">{hospital.catch_copy || '地域医療を支える病院'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">{hospital.rating_avg || '4.0'}</span>
                      </div>
                      <span className="text-sm text-gray-500">{hospital.bed_count || 'N/A'}床</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">EHR: {hospital.ehr_type || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">この地域の病院はありません</p>
                  <p className="text-sm text-gray-400 mt-2">
                    総病院数: {hospitals.length} | 地域: {selectedRegion.name}
                  </p>
                </div>
              )}
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
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={selectedHospital.photos[0]}
                alt={selectedHospital.name}
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedHospital.name}</h1>
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
                    {selectedHospital.features.map((feature, index) => (
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