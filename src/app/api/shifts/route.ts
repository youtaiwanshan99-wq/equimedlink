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
    hospital_id: 'h1',
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
    hospital_id: 'h2',
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
    hospital_id: 'h3',
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
    hospital_id: 'h4',
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
  },
  {
    id: '5',
    hospital_id: 'h5',
    dept: '循環器科',
    role: '外来',
    start_at: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), // 36時間後
    end_at: new Date(Date.now() + 44 * 60 * 60 * 1000).toISOString(), // 44時間後
    required_skills: ['cardiology'],
    comp_base: 28000,
    surcharge_factor: 1.3,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
  },
  {
    id: '6',
    hospital_id: 'h6',
    dept: '神経内科',
    role: '病棟',
    start_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48時間後
    end_at: new Date(Date.now() + 56 * 60 * 60 * 1000).toISOString(), // 56時間後
    required_skills: ['neurology'],
    comp_base: 32000,
    surcharge_factor: 1.4,
    status: 'open',
    max_doctors: 2,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
  },
  {
    id: '7',
    hospital_id: 'h1',
    dept: '整形外科',
    role: '手術',
    start_at: new Date(Date.now() + 60 * 60 * 60 * 1000).toISOString(), // 60時間後
    end_at: new Date(Date.now() + 68 * 60 * 60 * 1000).toISOString(), // 68時間後
    required_skills: ['orthopedics', 'surgery'],
    comp_base: 35000,
    surcharge_factor: 1.6,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: false }
  },
  {
    id: '8',
    hospital_id: 'h2',
    dept: '皮膚科',
    role: '外来',
    start_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72時間後
    end_at: new Date(Date.now() + 80 * 60 * 60 * 1000).toISOString(), // 80時間後
    required_skills: ['dermatology'],
    comp_base: 20000,
    surcharge_factor: 1.1,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: false }
  },
  {
    id: '9',
    hospital_id: 'h3',
    dept: '眼科',
    role: '外来',
    start_at: new Date(Date.now() + 84 * 60 * 60 * 1000).toISOString(), // 84時間後
    end_at: new Date(Date.now() + 92 * 60 * 60 * 1000).toISOString(), // 92時間後
    required_skills: ['ophthalmology'],
    comp_base: 24000,
    surcharge_factor: 1.2,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
  },
  {
    id: '10',
    hospital_id: 'h4',
    dept: '耳鼻咽喉科',
    role: '外来',
    start_at: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(), // 96時間後
    end_at: new Date(Date.now() + 104 * 60 * 60 * 1000).toISOString(), // 104時間後
    required_skills: ['otolaryngology'],
    comp_base: 23000,
    surcharge_factor: 1.1,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: false }
  },
  {
    id: '11',
    hospital_id: 'h5',
    dept: '泌尿器科',
    role: '手術',
    start_at: new Date(Date.now() + 108 * 60 * 60 * 1000).toISOString(), // 108時間後
    end_at: new Date(Date.now() + 116 * 60 * 60 * 1000).toISOString(), // 116時間後
    required_skills: ['urology', 'surgery'],
    comp_base: 33000,
    surcharge_factor: 1.5,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
  },
  {
    id: '12',
    hospital_id: 'h6',
    dept: '脳神経外科',
    role: '当直',
    start_at: new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString(), // 120時間後
    end_at: new Date(Date.now() + 128 * 60 * 60 * 1000).toISOString(), // 128時間後
    required_skills: ['neurosurgery', 'emergency'],
    comp_base: 40000,
    surcharge_factor: 1.8,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
  },
  {
    id: '13',
    hospital_id: 'h1',
    dept: '麻酔科',
    role: '手術',
    start_at: new Date(Date.now() + 132 * 60 * 60 * 1000).toISOString(), // 132時間後
    end_at: new Date(Date.now() + 140 * 60 * 60 * 1000).toISOString(), // 140時間後
    required_skills: ['anesthesiology'],
    comp_base: 30000,
    surcharge_factor: 1.4,
    status: 'open',
    max_doctors: 2,
    highlight: { urgent: false, badge: null },
    workation: { enabled: false }
  },
  {
    id: '14',
    hospital_id: 'h2',
    dept: '放射線科',
    role: '外来',
    start_at: new Date(Date.now() + 144 * 60 * 60 * 1000).toISOString(), // 144時間後
    end_at: new Date(Date.now() + 152 * 60 * 60 * 1000).toISOString(), // 152時間後
    required_skills: ['radiology'],
    comp_base: 26000,
    surcharge_factor: 1.3,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: false }
  },
  {
    id: '15',
    hospital_id: 'h3',
    dept: '総合診療科',
    role: '外来',
    start_at: new Date(Date.now() + 156 * 60 * 60 * 1000).toISOString(), // 156時間後
    end_at: new Date(Date.now() + 164 * 60 * 60 * 1000).toISOString(), // 164時間後
    required_skills: ['general_practice'],
    comp_base: 22000,
    surcharge_factor: 1.1,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
  },
  {
    id: '16',
    hospital_id: 'h7',
    dept: '救急科',
    role: '当直',
    start_at: new Date(Date.now() + 168 * 60 * 60 * 1000).toISOString(), // 168時間後
    end_at: new Date(Date.now() + 176 * 60 * 60 * 1000).toISOString(), // 176時間後
    required_skills: ['em', 'intubation'],
    comp_base: 28000,
    surcharge_factor: 1.4,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
  },
  {
    id: '17',
    hospital_id: 'h8',
    dept: '循環器科',
    role: '外来',
    start_at: new Date(Date.now() + 180 * 60 * 60 * 1000).toISOString(), // 180時間後
    end_at: new Date(Date.now() + 188 * 60 * 60 * 1000).toISOString(), // 188時間後
    required_skills: ['cardiology'],
    comp_base: 30000,
    surcharge_factor: 1.3,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: false }
  },
  {
    id: '18',
    hospital_id: 'h9',
    dept: '小児科',
    role: '外来',
    start_at: new Date(Date.now() + 192 * 60 * 60 * 1000).toISOString(), // 192時間後
    end_at: new Date(Date.now() + 200 * 60 * 60 * 1000).toISOString(), // 200時間後
    required_skills: ['pediatrics'],
    comp_base: 26000,
    surcharge_factor: 1.2,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
  },
  {
    id: '19',
    hospital_id: 'h10',
    dept: '整形外科',
    role: '手術',
    start_at: new Date(Date.now() + 204 * 60 * 60 * 1000).toISOString(), // 204時間後
    end_at: new Date(Date.now() + 212 * 60 * 60 * 1000).toISOString(), // 212時間後
    required_skills: ['orthopedics', 'surgery'],
    comp_base: 32000,
    surcharge_factor: 1.5,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
  },
  {
    id: '20',
    hospital_id: 'h11',
    dept: '産婦人科',
    role: '当直',
    start_at: new Date(Date.now() + 216 * 60 * 60 * 1000).toISOString(), // 216時間後
    end_at: new Date(Date.now() + 224 * 60 * 60 * 1000).toISOString(), // 224時間後
    required_skills: ['obstetrics', 'gynecology'],
    comp_base: 35000,
    surcharge_factor: 1.6,
    status: 'open',
    max_doctors: 1,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
  },
  {
    id: '21',
    hospital_id: 'h12',
    dept: '神経内科',
    role: '病棟',
    start_at: new Date(Date.now() + 228 * 60 * 60 * 1000).toISOString(), // 228時間後
    end_at: new Date(Date.now() + 236 * 60 * 60 * 1000).toISOString(), // 236時間後
    required_skills: ['neurology'],
    comp_base: 29000,
    surcharge_factor: 1.3,
    status: 'open',
    max_doctors: 2,
    highlight: { urgent: false, badge: null },
    workation: { enabled: true }
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
          hospital_id: 'h1',
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
          hospital_id: 'h2',
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
        },
        {
          id: 'urgent3',
          hospital_id: 'h3',
          dept: '小児科',
          role: '当直',
          start_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4時間後
          end_at: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20時間後
          required_skills: ['pediatrics', 'emergency'],
          comp_base: 90000,
          surcharge_factor: 1.4,
          status: 'open',
          max_doctors: 1,
          highlight: { urgent: true, badge: '緊急募集中' },
          workation: { enabled: true }
        },
        {
          id: 'urgent4',
          hospital_id: 'h4',
          dept: '産婦人科',
          role: '当直',
          start_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6時間後
          end_at: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(), // 22時間後
          required_skills: ['obstetrics', 'gynecology'],
          comp_base: 95000,
          surcharge_factor: 1.6,
          status: 'open',
          max_doctors: 1,
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
