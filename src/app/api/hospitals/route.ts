import { NextResponse } from 'next/server'
import { db } from '@/lib/firestore'

export async function GET() {
  try {
    // Firestoreから病院データを取得
    const hospitalsSnapshot = await db.collection('hospitals').get()
    const hospitals = hospitalsSnapshot.docs.map(doc => doc.data())
    
    return NextResponse.json(hospitals)
  } catch (error) {
    console.error('Hospitals API error:', error)
    
    // フォールバック用のダミーデータ
    const fallbackHospitals = [
      {
        id: 'h1',
        name: '宇都宮総合病院',
        lat: 36.5551,
        lng: 139.8828,
        ehr_type: 'HOPE',
        address: '栃木県宇都宮市本町1-1',
        region: 'region_2',
        facility_type: 'general',
        bed_count: 450,
        dept_list: ['ER', 'IM', 'Pediatrics', 'Surgery', 'Orthopedics'],
        transport_access: { station: '宇都宮駅 車15分', airport: '成田空港 70分' },
        accommodation_support: { has_dorm: true, subsidy_jpy: 3000 },
        amenities: ['cafeteria', 'parking', 'gym'],
        photos: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop'],
        catch_copy: '餃子と自然に囲まれた医療拠点',
        rating_avg: 4.5,
        review_count: 12,
        specialties: ['救急医療', '総合診療'],
        features: ['自然が豊か', '新幹線アクセス', '温泉'],
        programs: ['prog_1', 'prog_2', 'prog_4']
      },
      {
        id: 'h2',
        name: '前橋医療センター',
        lat: 36.3895,
        lng: 139.0634,
        ehr_type: 'Hitachi',
        address: '群馬県前橋市大手町2-2',
        region: 'region_2',
        facility_type: 'general',
        bed_count: 280,
        dept_list: ['IM', 'Outpatient', 'Cardiology', 'Neurology'],
        transport_access: { station: '前橋駅 車10分', airport: '成田空港 60分' },
        accommodation_support: { has_dorm: false, subsidy_jpy: 0 },
        amenities: ['parking', 'library'],
        photos: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop'],
        catch_copy: '赤城山の麓で落ち着いた地域医療',
        rating_avg: 4.2,
        review_count: 5,
        specialties: ['循環器', '神経内科'],
        features: ['自然が豊か', '車移動', '温泉'],
        programs: ['prog_2', 'prog_5']
      },
      {
        id: 'h3',
        name: '札幌中央病院',
        lat: 43.0642,
        lng: 141.3469,
        ehr_type: 'HOPE',
        address: '北海道札幌市中央区大通西1-1',
        region: 'region_1',
        facility_type: 'general',
        bed_count: 600,
        dept_list: ['ER', 'IM', 'Pediatrics', 'Surgery', 'Orthopedics', 'Cardiology'],
        transport_access: { station: '札幌駅 徒歩5分', airport: '新千歳空港 40分' },
        accommodation_support: { has_dorm: true, subsidy_jpy: 5000 },
        amenities: ['cafeteria', 'parking', 'gym', 'library'],
        photos: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop'],
        catch_copy: '雪国の医療の中心で実践を積む',
        rating_avg: 4.7,
        review_count: 18,
        specialties: ['救急医療', '循環器', '小児科'],
        features: ['自然が豊か', '雪国医療', '都市アクセス'],
        programs: ['prog_1', 'prog_3', 'prog_4', 'prog_5']
      },
      {
        id: 'h4',
        name: '福岡総合病院',
        lat: 33.5904,
        lng: 130.4017,
        ehr_type: 'HOPE',
        address: '福岡県福岡市博多区博多駅前1-1',
        region: 'region_6',
        facility_type: 'general',
        bed_count: 520,
        dept_list: ['ER', 'IM', 'Pediatrics', 'Surgery', 'Orthopedics', 'Cardiology', 'Neurology'],
        transport_access: { station: '博多駅 徒歩3分', airport: '福岡空港 15分' },
        accommodation_support: { has_dorm: true, subsidy_jpy: 4000 },
        amenities: ['cafeteria', 'parking', 'gym', 'library'],
        photos: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop'],
        catch_copy: 'アジアの玄関口で国際医療を学ぶ',
        rating_avg: 4.6,
        review_count: 15,
        specialties: ['救急医療', '国際医療', '循環器'],
        features: ['都市アクセス', '国際交流', '温暖気候'],
        programs: ['prog_1', 'prog_2', 'prog_4', 'prog_6']
      },
      {
        id: 'h5',
        name: '沖縄中央病院',
        lat: 26.2124,
        lng: 127.6792,
        ehr_type: 'HOPE',
        address: '沖縄県那覇市泉崎1-1',
        region: 'region_6',
        facility_type: 'general',
        bed_count: 380,
        dept_list: ['ER', 'IM', 'Pediatrics', 'Surgery', 'Orthopedics'],
        transport_access: { station: '那覇空港駅 車20分', airport: '那覇空港 20分' },
        accommodation_support: { has_dorm: true, subsidy_jpy: 6000 },
        amenities: ['cafeteria', 'parking', 'gym'],
        photos: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop'],
        catch_copy: '南国の楽園で地域医療を実践',
        rating_avg: 4.8,
        review_count: 22,
        specialties: ['救急医療', '小児科', '国際医療'],
        features: ['温暖気候', '離島', '国際交流'],
        programs: ['prog_2', 'prog_5']
      },
      {
        id: 'h6',
        name: '京都大学病院',
        lat: 35.0116,
        lng: 135.7681,
        ehr_type: 'HOPE',
        address: '京都府京都市左京区聖護院川原町54',
        region: 'region_4',
        facility_type: 'university',
        bed_count: 1200,
        dept_list: ['ER', 'IM', 'Pediatrics', 'Surgery', 'Orthopedics', 'Cardiology', 'Neurology', 'Oncology'],
        transport_access: { station: '出町柳駅 徒歩10分', airport: '関西空港 90分' },
        accommodation_support: { has_dorm: true, subsidy_jpy: 2000 },
        amenities: ['cafeteria', 'parking', 'gym', 'library', 'research'],
        photos: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop'],
        catch_copy: '千年の都で最先端医療を学ぶ',
        rating_avg: 4.9,
        review_count: 35,
        specialties: ['研究医療', '高度医療', '教育'],
        features: ['文化体験', '都市部', '学会多数'],
        programs: ['prog_3', 'prog_6']
      }
    ]
    
    return NextResponse.json(fallbackHospitals)
  }
}