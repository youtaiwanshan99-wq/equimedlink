'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, Users, Award, ChevronRight, Play, CheckCircle, Heart, MessageCircle, Phone, Mail, Menu, X, MapPin, Calendar, DollarSign, AlertCircle, Car, Train, Home, Navigation } from 'lucide-react'

export default function ShiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [shift, setShift] = useState<any>(null)
  const [hospital, setHospital] = useState<any>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [shiftId, setShiftId] = useState<string>('')

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setShiftId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (shiftId) {
      fetchShiftDetail()
    }
  }, [shiftId])

  const fetchShiftDetail = async () => {
    try {
      // シフトデータ取得
      const shiftsRes = await fetch('/api/shifts')
      if (shiftsRes.ok) {
        const shiftsData = await shiftsRes.json()
        const foundShift = shiftsData.find((s: any) => s.id === shiftId)
        if (foundShift) {
          setShift(foundShift)
          
          // 病院データ取得
          const hospitalsRes = await fetch('/api/hospitals')
          if (hospitalsRes.ok) {
            const hospitalsData = await hospitalsRes.json()
            const foundHospital = hospitalsData.find((h: any) => h.id === foundShift.hospital_id)
            setHospital(foundHospital)
          }
        }
      }
    } catch (error) {
      console.error('データ取得エラー:', error)
    }
  }

  if (!shift || !hospital) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  const shiftDate = new Date(shift.start_at)
  const endDate = new Date(shift.end_at)
  const isToday = shiftDate.toDateString() === new Date().toDateString()
  const isTomorrow = shiftDate.toDateString() === new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString()

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/shifts"
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">求人詳細</h1>
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

      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左側：求人詳細 */}
            <div className="lg:col-span-2">
              {/* 求人タイトル */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="flex items-center mb-4">
                  {shift.highlight?.urgent && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold mr-4">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      緊急募集中
                    </span>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900">
                    {hospital.name} - {shift.dept} {shift.role}
                  </h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">勤務情報</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">勤務日:</span>
                        <span className="font-medium">
                          {isToday ? '今日' : isTomorrow ? '明日' : shiftDate.toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">勤務時間:</span>
                        <span className="font-medium">
                          {shiftDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} - 
                          {endDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">勤務先:</span>
                        <span className="font-medium">{hospital.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">募集科目:</span>
                        <span className="font-medium">{shift.dept}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">募集人数:</span>
                        <span className="font-medium">{shift.max_doctors}名</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">経験:</span>
                        <span className="font-medium">不問</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">報酬・条件</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">基本報酬:</span>
                        <span className="font-medium">¥{shift.comp_base.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">サージ係数:</span>
                        <span className="font-medium">{shift.surcharge_factor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">総報酬:</span>
                        <span className="font-bold text-red-600 text-lg">
                          ¥{Math.round(shift.comp_base * shift.surcharge_factor).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">交通費:</span>
                        <span className="font-medium">10,000円/一回</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">備考</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      地域医療の充実を図るため、経験豊富な医師の方を募集しております。
                      当院では最新の医療機器と充実したスタッフ体制で、安心して医療に従事していただけます。
                      研修医の指導も積極的に行っており、教育環境も整っております。
                      宿泊施設も完備しており、遠方からの参加も可能です。
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">担当コンサルタント</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-semibold">田</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">田中 太郎</h4>
                      <p className="text-sm text-gray-600">医療人材コンサルタント</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowApplicationModal(true)}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                  >
                    この求人に問い合わせる
                  </button>
                </div>
              </div>

              {/* 同じエリアの求人 */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">同じエリアにある{shift.dept}のスポット求人</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* サンプル求人1 */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold mr-2">NEW</span>
                      <h3 className="font-semibold text-gray-900">宇都宮市 {shift.dept}</h3>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-2">3.6万円</div>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span>月・火・水・木・金・土・日</span>
                      <span>午前</span>
                      <span>{shift.dept}</span>
                      <span>宇都宮市</span>
                    </div>
                  </div>
                  
                  {/* サンプル求人2 */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold mr-2">NEW</span>
                      <h3 className="font-semibold text-gray-900">栃木市 {shift.dept}</h3>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-2">4.2万円</div>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span>月・火・水・木・金</span>
                      <span>午後</span>
                      <span>{shift.dept}</span>
                      <span>栃木市</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：病院情報・関連情報 */}
            <div className="space-y-6">
              {/* 病院情報 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">病院情報</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <img
                      src={hospital.photos?.[0] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop'}
                      alt={hospital.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{hospital.name}</h4>
                      <p className="text-sm text-gray-600">{hospital.catch_copy}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">病床数:</span>
                      <span className="font-medium">{hospital.bed_count}床</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">EHR:</span>
                      <span className="font-medium">{hospital.ehr_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">評価:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{hospital.rating_avg}</span>
                        <span className="text-gray-500 ml-1">({hospital.review_count}件)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* アクセス情報 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">アクセス</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Train className="h-4 w-4 mr-2" />
                    <span>{hospital.transport_access?.station || '最寄り駅 車15分'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Car className="h-4 w-4 mr-2" />
                    <span>駐車場完備</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Navigation className="h-4 w-4 mr-2" />
                    <span>{hospital.address}</span>
                  </div>
                </div>
              </div>

              {/* 特徴・設備 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">特徴・設備</h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.features?.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* 希望求人メール */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">ご希望に沿った求人を随時お届けいたします</h3>
                  <p className="text-blue-100 mb-4">希望求人メールを受け取る</p>
                  <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    希望条件を登録する
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* アプリケーション モーダル */}
      {showApplicationModal && (
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
                shift_id: shift?.id,
                hospital_id: shift?.hospital_id,
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
      )}
    </div>
  )
}
