'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, Users, Award, ChevronRight, Play, CheckCircle, Heart, MessageCircle, Phone, Mail, Menu, X, MapPin, Navigation } from 'lucide-react'

export default function MapPage() {
  const [regions, setRegions] = useState<any[]>([])
  const [hospitals, setHospitals] = useState<any[]>([])
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [selectedHospital, setSelectedHospital] = useState<any>(null)

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
        <div className="h-screen bg-gray-100 relative">
          {/* SVG日本地図 */}
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="relative w-full h-full max-w-4xl max-h-full">
              <svg
                viewBox="0 0 800 600"
                className="w-full h-full"
                style={{ backgroundColor: '#f8f9fa' }}
              >
                {/* 日本列島の詳細SVGパス */}
                <g fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1">
                  {/* 北海道 */}
                  <path d="M 180 60 L 220 55 L 260 65 L 300 75 L 320 95 L 330 125 L 325 155 L 310 175 L 285 185 L 255 180 L 225 170 L 195 155 L 175 135 L 170 110 L 175 85 Z" />
                  
                  {/* 本州（より詳細な形状） */}
                  <path d="M 200 140 L 250 135 L 300 130 L 350 125 L 400 120 L 450 125 L 500 130 L 550 135 L 600 140 L 650 150 L 680 170 L 690 200 L 685 230 L 675 260 L 660 285 L 640 305 L 615 320 L 585 330 L 555 335 L 525 330 L 495 320 L 465 305 L 435 285 L 405 260 L 375 235 L 345 210 L 315 185 L 285 165 L 255 150 L 225 145 Z" />
                  
                  {/* 四国 */}
                  <path d="M 420 280 L 450 275 L 480 280 L 500 290 L 510 310 L 505 330 L 490 345 L 470 350 L 450 345 L 430 335 L 415 320 L 410 300 L 415 285 Z" />
                  
                  {/* 九州 */}
                  <path d="M 320 360 L 360 355 L 400 360 L 430 370 L 450 385 L 460 405 L 455 425 L 440 440 L 415 445 L 390 440 L 365 430 L 345 415 L 330 395 L 325 375 L 330 365 Z" />
                  
                  {/* 沖縄 */}
                  <path d="M 180 480 L 200 475 L 220 480 L 235 490 L 240 505 L 235 520 L 220 530 L 200 535 L 180 530 L 165 520 L 160 505 L 165 490 Z" />
                  
                  {/* 小島（伊豆諸島、小笠原諸島など） */}
                  <circle cx="520" cy="200" r="3" fill="#e5e7eb" stroke="#9ca3af" />
                  <circle cx="530" cy="180" r="2" fill="#e5e7eb" stroke="#9ca3af" />
                  <circle cx="540" cy="160" r="2" fill="#e5e7eb" stroke="#9ca3af" />
                </g>

                {/* 地域マーカー */}
                {Array.isArray(regions) && regions.length > 0 ? regions.map((region: any) => {
                  if (!region.lat || !region.lng) {
                    return null
                  }
                  
                  const { x, y } = latLngToSvg(region.lat, region.lng)
                  
                  return (
                    <g key={region.id}>
                      {/* ホバー時の背景円 */}
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="transparent"
                        className="cursor-pointer hover:fill-blue-100 transition-colors"
                        onClick={() => {
                          console.log('Region clicked:', region)
                          setSelectedRegion(region)
                        }}
                      />
                      {/* メインのマーカー */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#3b82f6"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="cursor-pointer hover:fill-blue-600 transition-colors"
                        onClick={() => {
                          console.log('Region clicked:', region)
                          setSelectedRegion(region)
                        }}
                      />
                      {/* 地域名ラベル */}
                      <text
                        x={x}
                        y={y - 20}
                        textAnchor="middle"
                        className="text-xs fill-gray-700 pointer-events-none font-medium"
                        style={{ fontSize: '11px' }}
                      >
                        {region.name}
                      </text>
                    </g>
                  )
                }) : null}
                
                {/* 病院マーカー */}
                {Array.isArray(hospitals) && hospitals.length > 0 ? hospitals.map((hospital: any) => {
                  if (!hospital.lat || !hospital.lng) {
                    return null
                  }
                  
                  const { x, y } = latLngToSvg(hospital.lat, hospital.lng)
                  
                  return (
                    <g key={hospital.id}>
                      {/* ホバー時の背景円 */}
                      <circle
                        cx={x}
                        cy={y}
                        r="10"
                        fill="transparent"
                        className="cursor-pointer hover:fill-red-100 transition-colors"
                        onClick={() => {
                          console.log('Hospital clicked:', hospital)
                          setSelectedHospital(hospital)
                        }}
                      />
                      {/* メインのマーカー */}
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="cursor-pointer hover:fill-red-600 transition-colors"
                        onClick={() => {
                          console.log('Hospital clicked:', hospital)
                          setSelectedHospital(hospital)
                        }}
                      />
                      {/* 病院名ラベル（ホバー時のみ表示） */}
                      <text
                        x={x}
                        y={y + 25}
                        textAnchor="middle"
                        className="text-xs fill-gray-700 pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
                        style={{ fontSize: '9px' }}
                      >
                        {hospital.name.length > 10 ? hospital.name.substring(0, 10) + '...' : hospital.name}
                      </text>
                    </g>
                  )
                }) : null}
              </svg>
            </div>
          </div>
        </div>
        
        {/* 地図の凡例 */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-20">
          <h3 className="font-semibold text-gray-900 mb-3">凡例</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full mr-3 border-2 border-white"></div>
              <span className="text-sm text-gray-700 font-medium">地域</span>
            </div>
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

        {/* 地域リスト */}
        <div className="absolute bottom-4 left-4 w-80 bg-white rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto z-20">
          <h3 className="font-semibold text-gray-900 mb-3">地域一覧</h3>
          <div className="space-y-2">
            {Array.isArray(regions) && regions.length > 0 ? regions.map((region: any) => (
              <div
                key={region.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  console.log('Region list item clicked:', region)
                  setSelectedRegion(region)
                }}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{region.name}</h4>
                  <p className="text-sm text-gray-600 truncate">{region.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {region.features?.slice(0, 2).map((feature: string, index: number) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
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

        {/* 病院統計情報 */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-20">
          <h3 className="font-semibold text-gray-900 mb-2">統計情報</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">地域数:</span>
              <span className="text-sm font-medium text-gray-900">{regions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">病院数:</span>
              <span className="text-sm font-medium text-gray-900">{hospitals.length}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 地域詳細ページ
  const RegionDetailPage = () => {
    if (!selectedRegion) return null

    // 地域に属する病院をフィルタ（ID/名称/住所/都道府県で幅広くマッチ）
    const regionHospitals = Array.isArray(hospitals) ? hospitals.filter(h => {
      const regionField: string = h.region || h.region_id || h.regionName || ''
      const address: string = h.address || ''
      const prefecture: string = h.prefecture || ''
      const prefectures: string[] = Array.isArray(selectedRegion.prefectures) ? selectedRegion.prefectures : []
      const byRegionId = regionField === selectedRegion.id || regionField.includes(selectedRegion.id) || selectedRegion.id?.includes(regionField)
      const byRegionName = regionField.includes(selectedRegion.name) || selectedRegion.name?.includes(regionField)
      const byPrefecture = prefectures.some((p: string) => address.includes(p) || prefecture.includes(p))
      return byRegionId || byRegionName || byPrefecture
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedRegion.name}</h1>
              {selectedRegion.catchphrase && (
                <p className="text-xl text-gray-800 mb-2">{selectedRegion.catchphrase}</p>
              )}
              <p className="text-lg text-gray-600 mb-6">{selectedRegion.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">地域の特徴</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegion.features.map((feature: any, index: number) => (
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
                    {selectedRegion.tourism_url && (
                      <div className="pt-2">
                        <a
                          href={selectedRegion.tourism_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:underline"
                        >
                          公式観光情報を見る
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 都道府県カード */}
          {Array.isArray(selectedRegion.prefectures) && selectedRegion.prefectures.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">都道府県を選ぶ</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {selectedRegion.prefectures.map((p: string) => (
                  <a key={p} href={`/prefecture?name=${encodeURIComponent(p)}`} className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                    <div className="relative">
                      <img src={`https://source.unsplash.com/400x240/?${encodeURIComponent(p)}`} alt={p} className="w-full h-28 object-cover" />
                    </div>
                    <div className="px-3 py-3">
                      <div className="text-center font-semibold text-gray-900">{p}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              この地域の病院 ({regionHospitals.length}件)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(regionHospitals) && regionHospitals.length > 0 ? regionHospitals.map((hospital: any) => (
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
                    {selectedHospital.features.map((feature: any, index: number) => (
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