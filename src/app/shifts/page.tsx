'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, Users, Award, ChevronRight, Play, CheckCircle, Heart, MessageCircle, Phone, Mail, Menu, X, AlertCircle, Car, Train, Home, Calendar, DollarSign, MapPin } from 'lucide-react'

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([])
  const [hospitals, setHospitals] = useState<any[]>([])
  const [selectedHospital, setSelectedHospital] = useState<any>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedShift, setSelectedShift] = useState<any>(null)
  const [keyword, setKeyword] = useState('')
  const [dept, setDept] = useState('')
  const [role, setRole] = useState('')
  const [area, setArea] = useState('')
  const [conditions, setConditions] = useState<string[]>([])

  // データ取得
  useEffect(() => {
    fetchData()
  }, [])

  // 病院データが読み込まれた後にURLパラメータをチェック
  useEffect(() => {
    if (hospitals.length > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const selectedHospitalId = urlParams.get('hospital')
      if (selectedHospitalId) {
        const hospital = hospitals.find(h => h.id === selectedHospitalId)
        if (hospital) {
          setSelectedHospital(hospital)
        }
      }
    }
  }, [hospitals])

  const fetchData = async () => {
    try {
      // シフトデータ取得
      const shiftsRes = await fetch('/api/shifts')
      if (shiftsRes.ok) {
        const shiftsData = await shiftsRes.json()
        setShifts(Array.isArray(shiftsData) ? shiftsData : [])
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
              <h1 className="text-xl font-bold text-gray-900">求人一覧</h1>
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
              href="/map"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              地図
            </a>
          </div>
        </div>
      </div>
    </header>
  )

  // 求人一覧セクション
  const ShiftsSection = () => {
    const filteredShifts = Array.isArray(shifts) ? shifts.filter((s:any) => {
      const hospital = hospitals.find(h => h.id === s.hospital_id)
      const inDept = !dept || s.dept?.includes(dept)
      const inRole = !role || s.role?.includes(role)
      
      // 地域フィルタリングの修正
      let inArea = true
      if (area) {
        const regionMapping: { [key: string]: string[] } = {
          '北海道・東北': ['北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島'],
          '関東': ['茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川'],
          '中部・北陸': ['新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知'],
          '関西': ['三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山'],
          '中国・四国': ['鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知'],
          '九州・沖縄': ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄']
        }
        
        const targetPrefectures = regionMapping[area] || []
        const hospitalPrefecture = hospital?.address?.match(/(北海道|青森|岩手|宮城|秋田|山形|福島|茨城|栃木|群馬|埼玉|千葉|東京|神奈川|新潟|富山|石川|福井|山梨|長野|岐阜|静岡|愛知|三重|滋賀|京都|大阪|兵庫|奈良|和歌山|鳥取|島根|岡山|広島|山口|徳島|香川|愛媛|高知|福岡|佐賀|長崎|熊本|大分|宮崎|鹿児島|沖縄)/)?.[1]
        
        inArea = hospitalPrefecture ? targetPrefectures.includes(hospitalPrefecture) : false
      }
      
      const inKeyword = !keyword || (hospital?.name?.includes(keyword) || hospital?.features?.some((t:string)=>t.includes(keyword)) || hospital?.specialties?.some((t:string)=>t.includes(keyword)))
      const inConditions = conditions.length === 0 || conditions.every(c => (c==='寮あり' && hospital?.accommodation_support?.has_dorm) || hospital?.features?.includes(c))
      return inDept && inRole && inArea && inKeyword && inConditions
    }) : []

    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">求人一覧</h2>
            <p className="text-lg text-gray-600">現在募集中のシフト</p>
          </div>
          
          <div className="flex gap-8">
            {/* 左側：求人一覧 */}
            <div className="flex-1">
              <div className="space-y-6">
                {filteredShifts.length > 0 ? filteredShifts.map((shift: any) => {
                  const hospital = Array.isArray(hospitals) ? hospitals.find(h => h.id === shift.hospital_id) : null
                  return (
                    <div key={shift.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                      // 求人詳細ページに遷移
                      window.location.href = `/shifts/detail/${shift.id}`
                    }}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 mr-4">
                              {hospital?.name} - {shift.dept}
                            </h3>
                            {shift.highlight?.urgent && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                                <AlertCircle className="h-4 w-4 inline mr-1" />
                                緊急募集中
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{new Date(shift.start_at).toLocaleDateString('ja-JP')} {shift.role}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{hospital?.address}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Car className="h-4 w-4 mr-2" />
                              <span>車45分</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {hospital?.ehr_type} ✓
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {shift.dept}
                            </span>
                            {shift.workation?.enabled && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                宿泊あり
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right ml-6">
                          <div className="text-sm text-gray-600 mb-1">
                            基準 × サージ{shift.surcharge_factor}
                          </div>
                          <div className="text-2xl font-bold text-red-600 mb-4">
                            ¥{Math.round(shift.comp_base * shift.surcharge_factor).toLocaleString()}
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedHospital(hospital) }} className="px-4 py-2 text-sm rounded border mr-2">病院詳細</button>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedShift(shift); setShowApplicationModal(true) }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">応募する</button>
                        </div>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">現在募集中のシフトはありません</p>
                  </div>
                )}
              </div>
            </div>

            {/* 右側：検索バー */}
            <div className="w-80 bg-white rounded-lg shadow-lg p-6 h-fit">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">求人検索</h3>
              
              {/* キーワード検索 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">キーワード</label>
                <input 
                  value={keyword} 
                  onChange={e => setKeyword(e.target.value)} 
                  placeholder="病院名・タグで検索" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>

              {/* 勤務地 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">勤務地</label>
                <div className="space-y-2">
                  {['北海道・東北', '関東', '中部・北陸', '関西', '中国・四国', '九州・沖縄'].map((region) => (
                    <label key={region} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="accent-blue-600 mr-2" 
                        checked={area === region}
                        onChange={e => setArea(e.target.checked ? region : '')}
                      />
                      <span className="text-sm text-gray-700">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 診療科 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">診療科</label>
                <select 
                  value={dept} 
                  onChange={e => setDept(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">すべて</option>
                  <option value="救急科">救急科</option>
                  <option value="内科">内科</option>
                  <option value="小児科">小児科</option>
                  <option value="外科">外科</option>
                  <option value="産婦人科">産婦人科</option>
                  <option value="循環器科">循環器科</option>
                  <option value="神経内科">神経内科</option>
                  <option value="整形外科">整形外科</option>
                  <option value="皮膚科">皮膚科</option>
                  <option value="眼科">眼科</option>
                  <option value="耳鼻咽喉科">耳鼻咽喉科</option>
                  <option value="泌尿器科">泌尿器科</option>
                  <option value="脳神経外科">脳神経外科</option>
                  <option value="麻酔科">麻酔科</option>
                  <option value="放射線科">放射線科</option>
                  <option value="総合診療科">総合診療科</option>
                </select>
              </div>

              {/* 勤務形態 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">勤務形態</label>
                <select 
                  value={role} 
                  onChange={e => setRole(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">すべて</option>
                  <option value="当直">当直</option>
                  <option value="外来">外来</option>
                  <option value="病棟">病棟</option>
                  <option value="手術">手術</option>
                </select>
              </div>

              {/* こだわり条件 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">こだわり条件</label>
                <div className="space-y-2">
                  {['寮あり', '温泉', '自然が豊か', '宿泊あり', '車通勤可', '駅チカ'].map((condition) => (
                    <label key={condition} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="accent-blue-600 mr-2" 
                        checked={conditions.includes(condition)}
                        onChange={e => setConditions(prev => e.target.checked ? [...prev, condition] : prev.filter(v => v !== condition))}
                      />
                      <span className="text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 検索ボタン */}
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setKeyword('')
                    setDept('')
                    setRole('')
                    setArea('')
                    setConditions([])
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  検索条件をクリア
                </button>
                <div className="text-center text-sm text-gray-500">
                  {filteredShifts.length}件の求人が見つかりました
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // 病院詳細ページ
  const HospitalDetailPage = () => {
    if (!selectedHospital) return null

    const hospitalShifts = Array.isArray(shifts) ? shifts.filter(s => s.hospital_id === selectedHospital.id) : []

    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
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
              <div className="flex flex-wrap gap-2 mb-4">
                {(selectedHospital.features || []).slice(0,6).map((t:string, i:number)=> (
                  <span key={i} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{t}</span>
                ))}
              </div>
              
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
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">募集中のシフト</h2>
            <div className="space-y-4">
              {Array.isArray(hospitalShifts) && hospitalShifts.length > 0 ? hospitalShifts.map((shift: any) => (
                <div key={shift.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {shift.dept} - {shift.role}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(shift.start_at).toLocaleDateString('ja-JP')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{shift.role}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>募集人数: {shift.max_doctors}名</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="text-sm text-gray-600 mb-1">
                        基準 × サージ{shift.surcharge_factor}
                      </div>
                      <div className="text-2xl font-bold text-red-600 mb-4">
                        ¥{Math.round(shift.comp_base * shift.surcharge_factor).toLocaleString()}
                      </div>
                      <button onClick={() => { setSelectedShift(shift); setShowApplicationModal(true) }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">応募する</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">現在募集中のシフトはありません</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // アプリケーション モーダル
  const ApplicationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">シフトに応募</h3>
          <button
            onClick={() => setShowApplicationModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault()
          const form = e.currentTarget as HTMLFormElement
          const formData = new FormData(form)
          const payload: any = {
            name: formData.get('name'),
            specialty: formData.get('specialty'),
            experience_years: formData.get('exp'),
            comment: formData.get('comment'),
            shift_id: selectedShift?.id,
            hospital_id: selectedShift?.hospital_id,
          }
          try {
            const res = await fetch('/api/applications', { method: 'POST', body: JSON.stringify(payload) })
            const json = await res.json()
            if (json.ok) {
              alert('応募を送信しました。担当者よりご連絡します。')
              setShowApplicationModal(false)
            } else {
              alert('送信に失敗しました。時間をおいて再度お試しください。')
            }
          } catch (err) {
            alert('送信時にエラーが発生しました。')
          }
        }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">お名前</label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="山田 太郎"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">専門科</label>
            <select name="specialty" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>内科</option>
              <option>外科</option>
              <option>救急科</option>
              <option>小児科</option>
              <option>循環器科</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">経験年数</label>
            <select name="exp" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>6-8年</option>
              <option>9-12年</option>
              <option>13-15年</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">コメント</label>
            <textarea
              rows={3}
              name="comment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="参加動機や希望をお聞かせください"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowApplicationModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              応募する
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {selectedHospital ? <HospitalDetailPage /> : <ShiftsSection />}
      </main>
      
      {showApplicationModal && <ApplicationModal />}
    </div>
  )
}
