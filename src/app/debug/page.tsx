'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Database, RefreshCw } from 'lucide-react'

interface DbStatus {
  connected: boolean
  error?: string
  reason?: string
  env?: any
}

interface ApiStatus {
  [key: string]: {
    status: string
    statusCode?: number
    dataCount?: number | string
    sample?: any
    error?: string
  }
}

export default function DebugPage() {
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null)
  const [apiStatus, setApiStatus] = useState<ApiStatus>({})
  const [loading, setLoading] = useState(false)

  // データベース接続状況を確認
  const checkDbConnection = async () => {
    try {
      const response = await fetch('/api/debug/db')
      const data = await response.json()
      setDbStatus(data)
    } catch (error: any) {
      setDbStatus({ connected: false, error: error.message })
    }
  }

  // 各APIの接続状況を確認
  const checkApiConnections = async () => {
    setLoading(true)
    const apis = ['programs', 'regions', 'hospitals', 'shifts', 'testimonials']
    const results: ApiStatus = {}

    for (const api of apis) {
      try {
        const response = await fetch(`/api/${api}`)
        const data = await response.json()
        results[api] = {
          status: response.ok ? 'success' : 'error',
          statusCode: response.status,
          dataCount: Array.isArray(data) ? data.length : 'N/A',
          sample: Array.isArray(data) && data.length > 0 ? data[0] : null
        }
      } catch (error: any) {
        results[api] = {
          status: 'error',
          error: error.message
        }
      }
    }

    setApiStatus(results)
    setLoading(false)
  }

  // データベースにシードデータを投入
  const seedDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/seed')
      const data = await response.json()
      alert(`シードデータの投入が完了しました: ${data.message}`)
      // データ投入後にAPI接続状況を再確認
      await checkApiConnections()
    } catch (error: any) {
      alert(`シードデータの投入に失敗しました: ${error.message}`)
    }
    setLoading(false)
  }

  useEffect(() => {
    checkDbConnection()
    checkApiConnections()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
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
                <Database className="h-6 w-6 mr-2 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">デバッグページ</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={checkDbConnection}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                disabled={loading}
              >
                DB接続確認
              </button>
              <button
                onClick={checkApiConnections}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                disabled={loading}
              >
                API確認
              </button>
              <button
                onClick={seedDatabase}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                disabled={loading}
              >
                データ投入
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* データベース接続状況 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2" />
            データベース接続状況
          </h2>
          
          {dbStatus ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">接続状態:</span>
                <div className="flex items-center">
                  {getStatusIcon(dbStatus.connected ? 'success' : 'error')}
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                    dbStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {dbStatus.connected ? '接続済み' : '未接続'}
                  </span>
                </div>
              </div>
              
              {dbStatus.reason && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">理由:</span>
                  <span className="text-sm text-gray-600">{dbStatus.reason}</span>
                </div>
              )}
              
              {dbStatus.error && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">エラー:</span>
                  <span className="text-sm text-red-600">{dbStatus.error}</span>
                </div>
              )}
              
              {dbStatus.env && (
                <div>
                  <span className="text-sm font-medium text-gray-700">環境変数:</span>
                  <div className="mt-2 space-y-1">
                    {Object.entries(dbStatus.env).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{key}:</span>
                        <span className={value ? 'text-green-600' : 'text-red-600'}>
                          {value ? '設定済み' : '未設定'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <RefreshCw className="h-8 w-8 text-gray-400 mx-auto animate-spin" />
              <p className="text-gray-500 mt-2">接続状況を確認中...</p>
            </div>
          )}
        </div>

        {/* API接続状況 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2" />
            API接続状況
          </h2>
          
          {Object.keys(apiStatus).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(apiStatus).map(([api, status]) => (
                <div key={api} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">/api/{api}</h3>
                    <div className="flex items-center">
                      {getStatusIcon(status.status)}
                      <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${getStatusColor(status.status)}`}>
                        {status.status === 'success' ? '成功' : 'エラー'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">ステータスコード:</span>
                      <span className="ml-2 font-medium">{status.statusCode || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">データ数:</span>
                      <span className="ml-2 font-medium">{status.dataCount || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">エラー:</span>
                      <span className="ml-2 text-red-600">{status.error || 'なし'}</span>
                    </div>
                  </div>
                  
                  {status.sample && (
                    <div className="mt-3">
                      <span className="text-gray-600 text-sm">サンプルデータ:</span>
                      <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(status.sample, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              {loading ? (
                <>
                  <RefreshCw className="h-8 w-8 text-gray-400 mx-auto animate-spin" />
                  <p className="text-gray-500 mt-2">API接続状況を確認中...</p>
                </>
              ) : (
                <p className="text-gray-500">API接続状況を確認してください</p>
              )}
            </div>
          )}
        </div>

        {/* 操作ボタン */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">操作</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={checkDbConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              DB接続再確認
            </button>
            <button
              onClick={checkApiConnections}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              API接続再確認
            </button>
            <button
              onClick={seedDatabase}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              サンプルデータ投入
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}