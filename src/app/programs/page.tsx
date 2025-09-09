'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, Users, Award, ChevronRight, Play, CheckCircle, Heart, MessageCircle, Phone, Mail, Menu, X } from 'lucide-react'

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [selectedProgram, setSelectedProgram] = useState<any>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  // データ取得
  useEffect(() => {
    fetchPrograms()
  }, [])

  // プログラムデータが読み込まれた後にURLパラメータをチェック
  useEffect(() => {
    if (programs.length > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const selectedProgramId = urlParams.get('selected')
      if (selectedProgramId) {
        const program = programs.find(p => p.id === selectedProgramId)
        if (program) {
          setSelectedProgram(program)
        }
      }
    }
  }, [programs])

  const fetchPrograms = async () => {
    try {
      const programsRes = await fetch('/api/programs')
      if (programsRes.ok) {
        const programsData = await programsRes.json()
        console.log('プログラムデータ取得:', programsData)
        setPrograms(Array.isArray(programsData) ? programsData : [])
      } else {
        console.error('プログラムAPI エラー:', programsRes.status, programsRes.statusText)
      }
    } catch (error) {
      console.error('プログラムデータ取得エラー:', error)
    }
  }

  // フィルター機能
  const filteredPrograms = Array.isArray(programs) ? programs.filter(program => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'popular') return program.popular
    return program.category === activeFilter
  }) : []

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
              <h1 className="text-xl font-bold text-gray-900">プログラム一覧</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </div>
    </header>
  )

  // プログラムカテゴリセクション
  const ProgramCategories = () => (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">プログラムを選ぶ</h2>
          <p className="text-lg text-gray-600">あなたの経験年数と目標に合わせたプログラム</p>
          {/* デバッグ情報 */}
          <div className="mt-4 text-sm text-gray-500">
            総プログラム数: {programs.length} | フィルター後: {filteredPrograms.length}
          </div>
        </div>
        
        {/* フィルターボタン */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setActiveFilter('popular')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeFilter === 'popular' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              人気
            </button>
            <button
              onClick={() => setActiveFilter('short_term')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeFilter === 'short_term' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              短期
            </button>
            <button
              onClick={() => setActiveFilter('medium_term')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeFilter === 'medium_term' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              中期
            </button>
            <button
              onClick={() => setActiveFilter('long_term')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeFilter === 'long_term' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              長期
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(filteredPrograms) && filteredPrograms.length > 0 ? filteredPrograms.map((program: any) => (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedProgram(program)
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
                  {program.features.map((feature: any, index: number) => (
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
              <p className="text-gray-500 text-lg">プログラムが見つかりません</p>
              <p className="text-sm text-gray-400 mt-2">
                総プログラム数: {programs.length} | アクティブフィルター: {activeFilter}
              </p>
              <div className="mt-4">
                <a
                  href="/debug"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  デバッグページでデータ接続を確認
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )

  // プログラム詳細ページ
  const ProgramDetailPage = () => {
    if (!selectedProgram) return null

    return (
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img
                src={selectedProgram.photo}
                alt={selectedProgram.name}
                className="w-full h-64 object-cover"
              />
              {selectedProgram.popular && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
                  人気
                </div>
              )}
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedProgram.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{selectedProgram.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">プログラム詳細</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">期間:</span>
                      <span className="font-medium">{selectedProgram.duration_weeks}週間</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">対象:</span>
                      <span className="font-medium">{selectedProgram.target_audience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">料金:</span>
                      <span className="font-medium text-blue-600">{selectedProgram.price_range}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">特徴</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProgram.features.map((feature: any, index: number) => (
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
                <button
                  onClick={() => setShowApplicationModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  このプログラムに応募
                </button>
                <button
                  onClick={() => setSelectedProgram(null)}
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

  // アプリケーション モーダル
  const ApplicationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">プログラムに応募</h3>
          <button
            onClick={() => setShowApplicationModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">お名前</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="山田 太郎"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">専門科</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>内科</option>
              <option>外科</option>
              <option>救急科</option>
              <option>小児科</option>
              <option>循環器科</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">経験年数</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>6-8年</option>
              <option>9-12年</option>
              <option>13-15年</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">希望期間</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>2週間</option>
              <option>1ヶ月</option>
              <option>3ヶ月</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">コメント</label>
            <textarea
              rows={3}
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
        {selectedProgram ? <ProgramDetailPage /> : <ProgramCategories />}
      </main>
      
      {showApplicationModal && <ApplicationModal />}
    </div>
  )
}
