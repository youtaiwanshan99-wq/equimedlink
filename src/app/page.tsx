'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Star, Clock, Users, Award, ChevronRight, Play, CheckCircle, Heart, MessageCircle, Phone, Mail, Menu, X, MapPin, Calendar, DollarSign, Bell, Settings, AlertCircle } from 'lucide-react'

export default function HomePage() {
  const [programs, setPrograms] = useState([])
  const [regions, setRegions] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [shifts, setShifts] = useState([])
  const [testimonials, setTestimonials] = useState([])

  // データ取得
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // プログラムデータ取得
      const programsRes = await fetch('/api/programs')
      if (programsRes.ok) {
        const programsData = await programsRes.json()
        setPrograms(Array.isArray(programsData) ? programsData : [])
      }

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

      // シフトデータ取得
      const shiftsRes = await fetch('/api/shifts')
      if (shiftsRes.ok) {
        const shiftsData = await shiftsRes.json()
        setShifts(Array.isArray(shiftsData) ? shiftsData : [])
      }

      // 体験談データ取得
      const testimonialsRes = await fetch('/api/testimonials')
      if (testimonialsRes.ok) {
        const testimonialsData = await testimonialsRes.json()
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : [])
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
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">EquiMed Link</h1>
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
            <a
              href="/map"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              地図
            </a>
            <a
              href="/debug"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Debug
            </a>
          </div>
        </div>
      </div>
    </header>
  )

  // ヒーローセクション
  const HeroSection = () => (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            地域医療ワーケーション留学
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            日本全国の地域で医療を学べる場所
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/programs"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              プログラムを見る
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/map"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center"
            >
              地図で探す
              <MapPin className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )

  // プログラムセクション
  const ProgramsSection = () => (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">プログラムを選ぶ</h2>
          <p className="text-lg text-gray-600">あなたの経験年数と目標に合わせたプログラム</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(programs) && programs.length > 0 ? programs.slice(0, 3).map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                // プログラム詳細ページに遷移
                window.location.href = `/programs?selected=${program.id}`
              }}
            >
              <div className="relative">
                <img
                  src={program.photo}
                  alt={program.name}
                  className="w-full h-48 object-cover"
                />
                {program.popular && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
                    人気
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{program.name}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{program.target_audience}</span>
                  <span className="text-lg font-semibold text-blue-600">{program.price_range}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {program.features.slice(0, 2).map((feature, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">プログラムを読み込み中...</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-8">
          <a
            href="/programs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            すべてのプログラムを見る
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )

  // 地域セクション
  const RegionsSection = () => (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">地域を選ぶ</h2>
          <p className="text-lg text-gray-600">日本全国の魅力的な地域で医療を学ぶ</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(regions) && regions.length > 0 ? regions.slice(0, 6).map((region) => (
            <div
              key={region.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                // 地図ページで地域を選択して表示
                window.location.href = `/map?region=${region.id}`
              }}
            >
              <div className="relative">
                <img
                  src={region.photo}
                  alt={region.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{region.name}</h3>
                <p className="text-gray-600 mb-4">{region.description}</p>
                <div className="flex flex-wrap gap-2">
                  {region.features.slice(0, 2).map((feature, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">地域情報を読み込み中...</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-8">
          <a
            href="/map"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
          >
            地図で地域を探す
            <MapPin className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )

  // 緊急求人セクション
  const UrgentShiftsSection = () => {
    // 72時間以内の緊急求人をフィルタリング
    const now = new Date()
    const urgentShifts = Array.isArray(shifts) ? shifts.filter(shift => {
      const shiftDate = new Date(shift.start_at)
      const timeDiff = shiftDate.getTime() - now.getTime()
      const hoursDiff = timeDiff / (1000 * 3600)
      const isUrgent = shift.highlight?.urgent
      const isWithin72Hours = hoursDiff <= 72 && hoursDiff >= 0
      
      // デバッグ情報
      console.log('Shift:', shift.id, 'Hours diff:', hoursDiff, 'Is urgent:', isUrgent, 'Within 72h:', isWithin72Hours)
      
      return isWithin72Hours && isUrgent
    }) : []

    console.log('Total shifts:', shifts.length, 'Urgent shifts:', urgentShifts.length)

    // 緊急求人がない場合でも、デバッグ用に表示
    if (urgentShifts.length === 0) {
      return (
        <section className="py-16 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  緊急募集中
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">72時間以内の緊急求人</h2>
              <p className="text-lg text-gray-600">今すぐ対応が必要なスポット求人</p>
            </div>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">現在緊急求人はありません</p>
              <p className="text-sm text-gray-400 mt-2">総シフト数: {shifts.length}</p>
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className="py-16 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                緊急募集中
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">72時間以内の緊急求人</h2>
            <p className="text-lg text-gray-600">今すぐ対応が必要なスポット求人</p>
          </div>
          
          <div className="space-y-6">
            {urgentShifts.map((shift) => {
              const hospital = Array.isArray(hospitals) ? hospitals.find(h => h.id === shift.hospital_id) : null
              const shiftDate = new Date(shift.start_at)
              const isToday = shiftDate.toDateString() === now.toDateString()
              const isTomorrow = shiftDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString()
              
              return (
                <div key={shift.id} className="bg-white rounded-lg shadow-lg border-l-4 border-red-500 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 mr-4">
                          {hospital?.name} - {shift.dept}{shift.role}
                        </h3>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                          緊急募集中
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {isToday ? '今夜' : isTomorrow ? '明日' : shiftDate.toLocaleDateString('ja-JP')} 
                            {shiftDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}-{new Date(shift.end_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{hospital?.address} | 車45分</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>募集人数: {shift.max_doctors}名</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {hospital?.ehr_type} ✓
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {shift.dept}
                        </span>
                        {shift.workation?.enabled && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                            宿泊あり
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="text-sm text-gray-600 mb-1">
                        基準 × サージ{shift.surcharge_factor}
                      </div>
                      <div className="text-3xl font-bold text-red-600 mb-4">
                        ¥{Math.round(shift.comp_base * shift.surcharge_factor).toLocaleString()}
                      </div>
                      <a
                        href="/shifts"
                        className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center"
                      >
                        詳細を見る・応募
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // 求人セクション
  const ShiftsSection = () => (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">最新の求人</h2>
          <p className="text-lg text-gray-600">現在募集中のシフト</p>
        </div>
        
        <div className="space-y-6">
          {Array.isArray(shifts) && shifts.length > 0 ? shifts.slice(0, 3).map((shift) => {
            const hospital = Array.isArray(hospitals) ? hospitals.find(h => h.id === shift.hospital_id) : null
            return (
              <div 
                key={shift.id} 
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  // 求人詳細ページに遷移
                  window.location.href = `/shifts?hospital=${shift.hospital_id}`
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-4">
                        {hospital?.name} - {shift.dept}
                      </h3>
                      {shift.highlight?.urgent && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
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
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">求人情報を読み込み中...</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-8">
          <a
            href="/shifts"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center"
          >
            すべての求人を見る
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )

  // 体験談セクション
  const TestimonialsSection = () => (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">先輩医師の体験談</h2>
          <p className="text-lg text-gray-600">実際に参加した医師の声</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(testimonials) && testimonials.length > 0 ? testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">
                    {testimonial.doctor_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.doctor_name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.specialty}</p>
                </div>
              </div>
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 italic">&ldquo;{testimonial.content}&rdquo;</p>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">体験談を読み込み中...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )

  // フッター
  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EquiMed Link</h3>
            <p className="text-gray-400">
              地域医療ワーケーション留学で、新しい医療体験を始めましょう。
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">プログラム</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/programs" className="hover:text-white">プログラム一覧</a></li>
              <li><a href="/shifts" className="hover:text-white">求人一覧</a></li>
              <li><a href="/map" className="hover:text-white">地図</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">サポート</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">よくある質問</a></li>
              <li><a href="#" className="hover:text-white">お問い合わせ</a></li>
              <li><a href="#" className="hover:text-white">利用規約</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">お問い合わせ</h4>
            <div className="space-y-2 text-gray-400">
              <p>Email: info@equimedlink.com</p>
              <p>Tel: 03-1234-5678</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 EquiMed Link. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ProgramsSection />
        <RegionsSection />
        <UrgentShiftsSection />
        <ShiftsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}