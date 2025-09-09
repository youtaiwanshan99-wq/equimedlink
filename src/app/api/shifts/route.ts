import { NextResponse } from 'next/server'

// ダミーデータ
const dummyHospitals = [
  { id: '1', name: '地方総合病院A', lat: 35.6895, lng: 139.6917, ehr_type: 'HOPE', address: '栃木県宇都宮市' },
  { id: '2', name: '地域医療センターB', lat: 38.2682, lng: 140.8694, ehr_type: 'Hitachi', address: '群馬県前橋市' },
  { id: '3', name: '札幌総合病院', lat: 43.0621, lng: 141.3544, ehr_type: 'HOPE', address: '北海道札幌市' },
  { id: '4', name: '福岡医療センター', lat: 33.5904, lng: 130.4017, ehr_type: 'HOPE', address: '福岡県福岡市' },
]

const dummyShifts = [
  {
    id: '1',
    hospital_id: '1',
    dept: '救急科',
    role: '当直',
    start_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2時間後
    end_at: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(), // 10時間後
    required_skills: ['em', 'intubation'],
    comp_base: 25000,
    surcharge_factor: 1.5,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: false }
  },
  {
    id: '2',
    hospital_id: '2',
    dept: '内科',
    role: '外来',
    start_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8時間後
    end_at: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(), // 16時間後
    required_skills: ['em'],
    comp_base: 22000,
    surcharge_factor: 1.2,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: false }
  },
  {
    id: '3',
    hospital_id: '3',
    dept: '小児科',
    role: '外来',
    start_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12時間後
    end_at: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18時間後
    required_skills: ['suturing'],
    comp_base: 18000,
    surcharge_factor: 1.0,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: false }
  },
  {
    id: '4',
    hospital_id: '4',
    dept: '産婦人科',
    role: '当直',
    start_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間後
    end_at: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(), // 32時間後
    required_skills: ['em', 'intubation', 'suturing'],
    comp_base: 30000,
    surcharge_factor: 2.0,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: false }
  }
]

export async function GET() {
  try {
    // ENV が揃っていない場合はダミーデータを返す
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      // 緊急求人用のダミーデータを追加
      const urgentDummyShifts = [
        {
          id: 'urgent1',
          hospital_id: '1',
          dept: '救急科',
          role: '当直',
          start_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2時間後
          end_at: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18時間後
          required_skills: ['ACLS'],
          comp_base: 80000,
          surcharge_factor: 1.3,
          status: 'open',
          max_doctors: 1,
          highlight: { urgent: true, badge: '緊急募集中' },
          workation: { enabled: true }
        },
        {
          id: 'urgent2',
          hospital_id: '2',
          dept: '内科',
          role: '外来',
          start_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間後
          end_at: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(), // 32時間後
          required_skills: ['IM'],
          comp_base: 100000,
          surcharge_factor: 1.5,
          status: 'open',
          max_doctors: 2,
          highlight: { urgent: true, badge: '緊急募集中' },
          workation: { enabled: true }
        }
      ]
      
      return NextResponse.json([...dummyShifts, ...urgentDummyShifts])
    }

    // 動的インポートでFirebaseを読み込み
    const { db } = await import('@/lib/firestore')
    
    // Firestore から取得
    const shiftsSnap = await db.collection('shifts').get()
    const shifts = shiftsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    return NextResponse.json(shifts)
  } catch (e) {
    console.error('shifts api error', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
