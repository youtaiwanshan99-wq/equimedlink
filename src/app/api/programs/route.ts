import { NextResponse } from 'next/server'
import { db } from '@/lib/firestore'

export async function GET() {
  try {
    // Firestoreからプログラムデータを取得
    const programsSnapshot = await db.collection('programs').get()
    const programs = programsSnapshot.docs.map(doc => doc.data())
    
    return NextResponse.json(programs)
  } catch (error) {
    console.error('Programs API error:', error)
    
    // フォールバック用のダミーデータ
    const fallbackPrograms = [
      {
        id: 'prog_1',
        name: '短期集中プログラム',
        category: 'short_term',
        duration_weeks: 2,
        target_audience: '6-15年目医師',
        description: '2週間の集中研修で地域医療の実践を学ぶ',
        features: ['救急対応', '地域連携', '症例検討'],
        price_range: '50-80万円',
        photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&auto=format&fit=crop',
        popular: true
      },
      {
        id: 'prog_2',
        name: '中期実践プログラム',
        category: 'medium_term',
        duration_weeks: 4,
        target_audience: '6-15年目医師',
        description: '1ヶ月の実践プログラムで地域医療の深い理解を',
        features: ['総合診療', 'チーム医療', '地域交流'],
        price_range: '80-120万円',
        photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1200&auto=format&fit=crop',
        popular: true
      },
      {
        id: 'prog_3',
        name: '長期研修プログラム',
        category: 'long_term',
        duration_weeks: 12,
        target_audience: '6-15年目医師',
        description: '3ヶ月の長期研修で地域医療のリーダーシップを',
        features: ['医療管理', '政策立案', '人材育成'],
        price_range: '200-300万円',
        photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1200&auto=format&fit=crop',
        popular: false
      },
      {
        id: 'prog_4',
        name: '救急専門プログラム',
        category: 'specialty',
        duration_weeks: 3,
        target_audience: '6-15年目医師',
        description: '救急医療の専門スキルを地域で実践',
        features: ['外傷対応', '災害医療', 'チーム連携'],
        price_range: '70-100万円',
        photo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop',
        popular: true
      },
      {
        id: 'prog_5',
        name: '小児科専門プログラム',
        category: 'specialty',
        duration_weeks: 4,
        target_audience: '6-15年目医師',
        description: '小児医療の専門知識を地域で活用',
        features: ['小児救急', '発達支援', '家族支援'],
        price_range: '80-120万円',
        photo: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1200&auto=format&fit=crop',
        popular: false
      },
      {
        id: 'prog_6',
        name: 'オンライン研修プログラム',
        category: 'online',
        duration_weeks: 1,
        target_audience: '6-15年目医師',
        description: 'オンラインで地域医療の基礎を学ぶ',
        features: ['動画講義', '症例検討', 'ディスカッション'],
        price_range: '10-20万円',
        photo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
        popular: true
      }
    ]
    
    return NextResponse.json(fallbackPrograms)
  }
}