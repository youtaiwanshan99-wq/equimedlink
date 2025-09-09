import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 動的インポートでFirebaseを読み込み
    const { db } = await import('@/lib/firestore')
    
    // Firestoreから地域データを取得
    const regionsSnapshot = await db.collection('regions').get()
    const regions = regionsSnapshot.docs.map(doc => doc.data())
    
    return NextResponse.json(regions)
  } catch (error) {
    console.error('Regions API error:', error)
    
    // フォールバック用のダミーデータ（緯度経度付き）
    const fallbackRegions = [
      {
        id: 'region_1',
        name: '北海道・東北',
        prefectures: ['北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島'],
        description: '雄大な自然と地域密着の医療',
        features: ['自然豊か', '温泉', '雪国医療'],
        photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
        popular: true,
        lat: 43.0642,
        lng: 141.3469,
        access_info: '新千歳空港から車で1時間'
      },
      {
        id: 'region_2',
        name: '関東',
        prefectures: ['茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川'],
        description: '都市と地方の医療格差解消',
        features: ['都市アクセス', '新幹線', '学会多数'],
        photo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop',
        popular: true,
        lat: 35.6762,
        lng: 139.6503,
        access_info: '成田・羽田空港から電車で1時間'
      },
      {
        id: 'region_3',
        name: '中部・北陸',
        prefectures: ['新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知'],
        description: '山間部と都市部の医療連携',
        features: ['山間医療', '温泉', '車移動'],
        photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
        popular: false,
        lat: 36.2048,
        lng: 138.2529,
        access_info: '新幹線で東京から2時間'
      },
      {
        id: 'region_4',
        name: '関西',
        prefectures: ['三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山'],
        description: '歴史と文化のまちの医療',
        features: ['文化体験', '都市部', '交通便利'],
        photo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
        popular: true,
        lat: 34.6937,
        lng: 135.5023,
        access_info: '関西空港から電車で1時間'
      },
      {
        id: 'region_5',
        name: '中国・四国',
        prefectures: ['鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知'],
        description: '離島と山間部の医療支援',
        features: ['離島医療', '自然豊か', '地域密着'],
        photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
        popular: false,
        lat: 34.3853,
        lng: 132.4553,
        access_info: '広島空港から車で30分'
      },
      {
        id: 'region_6',
        name: '九州・沖縄',
        prefectures: ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄'],
        description: '南国の温暖な気候での医療',
        features: ['温暖気候', '離島', '国際交流'],
        photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
        popular: true,
        lat: 33.5904,
        lng: 130.4017,
        access_info: '福岡空港から地下鉄で15分'
      }
    ]
    
    return NextResponse.json(fallbackRegions)
  }
}