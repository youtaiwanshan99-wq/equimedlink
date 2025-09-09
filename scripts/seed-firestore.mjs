// Seed Firestore with sample hospitals and shifts (extended schema)
import { config } from 'dotenv'
import { resolve } from 'path'
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// 明示的に .env.local を読む（dotenv はデフォルトで .env のみ）
config({ path: resolve(process.cwd(), '.env.local') })

function getEnvAny(keys) {
  for (const k of keys) {
    if (process.env[k]) return process.env[k]
  }
  return undefined
}

function getRequiredEnv(nameOrNames) {
  const v = Array.isArray(nameOrNames) ? getEnvAny(nameOrNames) : process.env[nameOrNames]
  if (!v) throw new Error(`Missing env: ${Array.isArray(nameOrNames) ? nameOrNames.join('|') : nameOrNames}`)
  return v
}

function resolvePrivateKey() {
  const b64 = getEnvAny(['FIREBASE_PRIVATE_KEY_64','FIREBASE_PRIVATE_KEY_B64','FIREBASE_PRIVATE_KEY_BASE64'])
  if (b64) return Buffer.from(b64, 'base64').toString('utf8')
  const raw = getEnvAny(['FIREBASE_PRIVATE_KEY'])
  if (!raw) throw new Error('Missing FIREBASE_PRIVATE_KEY(_64/_B64/_BASE64)')
  return raw.includes('\\n') ? raw.replace(/\\n/g,'\n') : raw
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: getRequiredEnv('FIREBASE_PROJECT_ID'),
        clientEmail: getRequiredEnv('FIREBASE_CLIENT_EMAIL'),
        privateKey: resolvePrivateKey(),
      }),
    })

const db = getFirestore(app)

const now = Date.now()

async function upsert(col, id, data) {
  await db.collection(col).doc(id).set({ id, ...data, updated_at: now, created_at: data.created_at || now }, { merge: true })
}

async function main() {
  // Programs (EF Japan風のプログラムカテゴリ)
  const programs = [
    {
      id: 'prog_1', name: '短期集中プログラム', category: 'short_term', duration_weeks: 2,
      target_audience: '6-15年目医師', description: '2週間の集中研修で地域医療の実践を学ぶ',
      features: ['救急対応', '地域連携', '症例検討'], price_range: '50-80万円',
      photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1200&auto=format&fit=crop',
      popular: true
    },
    {
      id: 'prog_2', name: '中期実践プログラム', category: 'medium_term', duration_weeks: 4,
      target_audience: '6-15年目医師', description: '1ヶ月の実践プログラムで地域医療の深い理解を',
      features: ['総合診療', 'チーム医療', '地域交流'], price_range: '80-120万円',
      photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1200&auto=format&fit=crop',
      popular: true
    },
    {
      id: 'prog_3', name: '長期研修プログラム', category: 'long_term', duration_weeks: 12,
      target_audience: '6-15年目医師', description: '3ヶ月の長期研修で地域医療のリーダーシップを',
      features: ['医療管理', '政策立案', '人材育成'], price_range: '200-300万円',
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1200&auto=format&fit=crop',
      popular: false
    },
    {
      id: 'prog_4', name: '救急専門プログラム', category: 'specialty', duration_weeks: 3,
      target_audience: '6-15年目医師', description: '救急医療の専門スキルを地域で実践',
      features: ['外傷対応', '災害医療', 'チーム連携'], price_range: '70-100万円',
      photo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop',
      popular: true
    },
    {
      id: 'prog_5', name: '小児科専門プログラム', category: 'specialty', duration_weeks: 4,
      target_audience: '6-15年目医師', description: '小児医療の専門知識を地域で活用',
      features: ['小児救急', '発達支援', '家族支援'], price_range: '80-120万円',
      photo: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1200&auto=format&fit=crop',
      popular: false
    },
    {
      id: 'prog_6', name: 'オンライン研修プログラム', category: 'online', duration_weeks: 1,
      target_audience: '6-15年目医師', description: 'オンラインで地域医療の基礎を学ぶ',
      features: ['動画講義', '症例検討', 'ディスカッション'], price_range: '10-20万円',
      photo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      popular: true
    }
  ]

  for (const p of programs) await upsert('programs', p.id, p)

  // Regions (EF Japan風の地域カテゴリ)
  const regions = [
    {
      id: 'region_1', name: '北海道・東北', prefectures: ['北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島'],
      description: '雄大な自然と地域密着の医療', features: ['自然豊か', '温泉', '雪国医療'],
      photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
      popular: true
    },
    {
      id: 'region_2', name: '関東', prefectures: ['茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川'],
      description: '都市と地方の医療格差解消', features: ['都市アクセス', '新幹線', '学会多数'],
      photo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop',
      popular: true
    },
    {
      id: 'region_3', name: '中部・北陸', prefectures: ['新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知'],
      description: '山間部と都市部の医療連携', features: ['山間医療', '温泉', '車移動'],
      photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
      popular: false
    },
    {
      id: 'region_4', name: '関西', prefectures: ['三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山'],
      description: '歴史と文化のまちの医療', features: ['文化体験', '都市部', '交通便利'],
      photo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
      popular: true
    },
    {
      id: 'region_5', name: '中国・四国', prefectures: ['鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知'],
      description: '離島と山間部の医療支援', features: ['離島医療', '自然豊か', '地域密着'],
      photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
      popular: false
    },
    {
      id: 'region_6', name: '九州・沖縄', prefectures: ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄'],
      description: '南国の温暖な気候での医療', features: ['温暖気候', '離島', '国際交流'],
      photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
      popular: true
    }
  ]

  for (const r of regions) await upsert('regions', r.id, r)

  // Hospitals (extended with more comprehensive data)
  const hospitals = [
    {
      id: 'h1', name: '宇都宮総合病院', lat: 36.5551, lng: 139.8828, geohash: 'xn6c...',
      ehr_type: 'HOPE', address: '栃木県宇都宮市本町1-1', region: 'region_2', facility_type: 'general',
      bed_count: 450, dept_list: ['ER','IM','Pediatrics','Surgery','Orthopedics'],
      transport_access: { station: '宇都宮駅 車15分', airport: '成田空港 70分' },
      accommodation_support: { has_dorm: true, subsidy_jpy: 3000 }, amenities: ['cafeteria','parking','gym'],
      photos: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop'],
      catch_copy: '餃子と自然に囲まれた医療拠点', rating_avg: 4.5, review_count: 12,
      specialties: ['救急医療', '総合診療'], features: ['自然が豊か', '新幹線アクセス', '温泉'],
      programs: ['prog_1', 'prog_2', 'prog_4']
    },
    {
      id: 'h2', name: '前橋医療センター', lat: 36.3895, lng: 139.0634, geohash: 'xn6b...',
      ehr_type: 'Hitachi', address: '群馬県前橋市大手町2-2', region: 'region_2', facility_type: 'general',
      bed_count: 280, dept_list: ['IM','Outpatient','Cardiology','Neurology'],
      transport_access: { station: '前橋駅 車10分', airport: '成田空港 60分' },
      accommodation_support: { has_dorm: false, subsidy_jpy: 0 }, amenities: ['parking','library'],
      photos: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop'],
      catch_copy: '赤城山の麓で落ち着いた地域医療', rating_avg: 4.2, review_count: 5,
      specialties: ['循環器', '神経内科'], features: ['自然が豊か', '車移動', '温泉'],
      programs: ['prog_2', 'prog_5']
    },
    {
      id: 'h3', name: '札幌中央病院', lat: 43.0642, lng: 141.3469, geohash: 'xn7u...',
      ehr_type: 'HOPE', address: '北海道札幌市中央区大通西1-1', region: 'region_1', facility_type: 'general',
      bed_count: 600, dept_list: ['ER','IM','Pediatrics','Surgery','Orthopedics','Cardiology'],
      transport_access: { station: '札幌駅 徒歩5分', airport: '新千歳空港 40分' },
      accommodation_support: { has_dorm: true, subsidy_jpy: 5000 }, amenities: ['cafeteria','parking','gym','library'],
      photos: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop'],
      catch_copy: '雪国の医療の中心で実践を積む', rating_avg: 4.7, review_count: 18,
      specialties: ['救急医療', '循環器', '小児科'], features: ['自然が豊か', '雪国医療', '都市アクセス'],
      programs: ['prog_1', 'prog_3', 'prog_4', 'prog_5']
    },
    {
      id: 'h4', name: '福岡総合病院', lat: 33.5904, lng: 130.4017, geohash: 'xn3k...',
      ehr_type: 'HOPE', address: '福岡県福岡市博多区博多駅前1-1', region: 'region_6', facility_type: 'general',
      bed_count: 520, dept_list: ['ER','IM','Pediatrics','Surgery','Orthopedics','Cardiology','Neurology'],
      transport_access: { station: '博多駅 徒歩3分', airport: '福岡空港 15分' },
      accommodation_support: { has_dorm: true, subsidy_jpy: 4000 }, amenities: ['cafeteria','parking','gym','library'],
      photos: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop'],
      catch_copy: 'アジアの玄関口で国際医療を学ぶ', rating_avg: 4.6, review_count: 15,
      specialties: ['救急医療', '国際医療', '循環器'], features: ['都市アクセス', '国際交流', '温暖気候'],
      programs: ['prog_1', 'prog_2', 'prog_4', 'prog_6']
    },
    {
      id: 'h5', name: '沖縄中央病院', lat: 26.2124, lng: 127.6792, geohash: 'xn2u...',
      ehr_type: 'HOPE', address: '沖縄県那覇市泉崎1-1', region: 'region_6', facility_type: 'general',
      bed_count: 380, dept_list: ['ER','IM','Pediatrics','Surgery','Orthopedics'],
      transport_access: { station: '那覇空港駅 車20分', airport: '那覇空港 20分' },
      accommodation_support: { has_dorm: true, subsidy_jpy: 6000 }, amenities: ['cafeteria','parking','gym'],
      photos: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop'],
      catch_copy: '南国の楽園で地域医療を実践', rating_avg: 4.8, review_count: 22,
      specialties: ['救急医療', '小児科', '国際医療'], features: ['温暖気候', '離島', '国際交流'],
      programs: ['prog_2', 'prog_5']
    },
    {
      id: 'h6', name: '京都大学病院', lat: 35.0116, lng: 135.7681, geohash: 'xn7h...',
      ehr_type: 'HOPE', address: '京都府京都市左京区聖護院川原町54', region: 'region_4', facility_type: 'university',
      bed_count: 1200, dept_list: ['ER','IM','Pediatrics','Surgery','Orthopedics','Cardiology','Neurology','Oncology'],
      transport_access: { station: '出町柳駅 徒歩10分', airport: '関西空港 90分' },
      accommodation_support: { has_dorm: true, subsidy_jpy: 2000 }, amenities: ['cafeteria','parking','gym','library','research'],
      photos: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop'],
      catch_copy: '千年の都で最先端医療を学ぶ', rating_avg: 4.9, review_count: 35,
      specialties: ['研究医療', '高度医療', '教育'], features: ['文化体験', '都市部', '学会多数'],
      programs: ['prog_3', 'prog_6']
    }
  ]

  for (const h of hospitals) await upsert('hospitals', h.id, h)

  // Shifts (extended with more comprehensive data)
  const shifts = [
    {
      id: 's1', hospital_id: 'h1', dept: '救急科', role: '当直', shift_type: 'night',
      start_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2時間後
      end_at: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18時間後
      required_skills: ['ACLS'], required_experience_years: 2, ehr_required: ['HOPE'], max_doctors: 1,
      comp_base: 80000, surcharge_factor: 1.3, minimum_guarantee: 30000,
      cancel_policy: { same_day: 0.8, prev_day: 0.5 }, status: 'open',
      lat: 36.5551, lng: 139.8828, geohash: 'xn6c...',
      tags: ['温泉エリア','車通勤可'], workation: { enabled: true, travel_stipend: 5000, accommodation_id: 'a_01' },
      highlight: { urgent: true, badge: '連休前サージ' },
    },
    {
      id: 's2', hospital_id: 'h2', dept: '内科', role: '外来', shift_type: 'day',
      start_at: '2025-09-11T09:00:00Z', end_at: '2025-09-11T17:00:00Z',
      required_skills: ['IM'], required_experience_years: 1, ehr_required: ['Hitachi'], max_doctors: 1,
      comp_base: 50000, surcharge_factor: 1.0, minimum_guarantee: 20000,
      cancel_policy: { same_day: 0.5, prev_day: 0.3 }, status: 'open',
      lat: 36.3895, lng: 139.0634, geohash: 'xn6b...',
      tags: ['都市近郊'], workation: { enabled: true, travel_stipend: 3000, accommodation_id: null },
      highlight: { urgent: false, badge: null },
    },
    {
      id: 's3', hospital_id: 'h3', dept: '救急科', role: '当直', shift_type: 'night',
      start_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間後
      end_at: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), // 36時間後
      required_skills: ['ACLS', 'PALS'], required_experience_years: 3, ehr_required: ['HOPE'], max_doctors: 2,
      comp_base: 100000, surcharge_factor: 1.5, minimum_guarantee: 50000,
      cancel_policy: { same_day: 0.9, prev_day: 0.7 }, status: 'open',
      lat: 43.0642, lng: 141.3469, geohash: 'xn7u...',
      tags: ['雪国医療','都市アクセス'], workation: { enabled: true, travel_stipend: 8000, accommodation_id: 'a_02' },
      highlight: { urgent: true, badge: '冬期サージ' },
    },
    {
      id: 's4', hospital_id: 'h4', dept: '循環器科', role: '外来', shift_type: 'day',
      start_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48時間後
      end_at: new Date(Date.now() + 56 * 60 * 60 * 1000).toISOString(), // 56時間後
      required_skills: ['循環器'], required_experience_years: 5, ehr_required: ['HOPE'], max_doctors: 1,
      comp_base: 120000, surcharge_factor: 1.2, minimum_guarantee: 60000,
      cancel_policy: { same_day: 0.6, prev_day: 0.4 }, status: 'open',
      lat: 33.5904, lng: 130.4017, geohash: 'xn3k...',
      tags: ['国際医療','都市アクセス'], workation: { enabled: true, travel_stipend: 6000, accommodation_id: 'a_03' },
      highlight: { urgent: true, badge: '緊急募集中' },
    },
    {
      id: 's5', hospital_id: 'h5', dept: '小児科', role: '外来', shift_type: 'day',
      start_at: '2025-09-14T09:00:00Z', end_at: '2025-09-14T17:00:00Z',
      required_skills: ['小児科'], required_experience_years: 4, ehr_required: ['HOPE'], max_doctors: 1,
      comp_base: 90000, surcharge_factor: 1.4, minimum_guarantee: 45000,
      cancel_policy: { same_day: 0.7, prev_day: 0.5 }, status: 'open',
      lat: 26.2124, lng: 127.6792, geohash: 'xn2u...',
      tags: ['温暖気候','離島'], workation: { enabled: true, travel_stipend: 10000, accommodation_id: 'a_04' },
      highlight: { urgent: false, badge: '南国体験' },
    },
    {
      id: 's6', hospital_id: 'h6', dept: '研究科', role: '研究', shift_type: 'day',
      start_at: '2025-09-15T09:00:00Z', end_at: '2025-09-15T17:00:00Z',
      required_skills: ['研究'], required_experience_years: 8, ehr_required: ['HOPE'], max_doctors: 1,
      comp_base: 150000, surcharge_factor: 1.1, minimum_guarantee: 80000,
      cancel_policy: { same_day: 0.5, prev_day: 0.3 }, status: 'open',
      lat: 35.0116, lng: 135.7681, geohash: 'xn7h...',
      tags: ['文化体験','学会多数'], workation: { enabled: true, travel_stipend: 4000, accommodation_id: 'a_05' },
      highlight: { urgent: false, badge: '研究最前線' },
    }
  ]

  for (const s of shifts) await upsert('shifts', s.id, s)

  // Testimonials (EF Japan風の体験談)
  const testimonials = [
    {
      id: 'test_1', doctor_name: 'Dr. 田中', specialty: '救急科', experience_years: 8,
      hospital_id: 'h1', program_id: 'prog_1', rating: 5,
      content: '宇都宮での2週間は本当に充実していました。地域医療の実践的なスキルが身につき、温泉も楽しめました。',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop',
      created_at: now - 86400000 * 30
    },
    {
      id: 'test_2', doctor_name: 'Dr. 佐藤', specialty: '内科', experience_years: 12,
      hospital_id: 'h3', program_id: 'prog_2', rating: 5,
      content: '札幌での1ヶ月は雪国医療の貴重な経験でした。チーム医療の重要性を実感できました。',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop',
      created_at: now - 86400000 * 45
    },
    {
      id: 'test_3', doctor_name: 'Dr. 山田', specialty: '循環器科', experience_years: 10,
      hospital_id: 'h4', program_id: 'prog_4', rating: 4,
      content: '福岡での救急プログラムは国際的な視点も学べて、とても勉強になりました。',
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1200&auto=format&fit=crop',
      created_at: now - 86400000 * 60
    }
  ]

  for (const t of testimonials) await upsert('testimonials', t.id, t)

  // Accommodations (extended)
  const accommodations = [
    { id: 'a_01', hospital_id: 'h1', type: 'dorm', name: '宇都宮医師寮', price_jpy: 0, address: '栃木県宇都宮市本町1-1', photos: [], features: ['温泉','WiFi','駐車場'] },
    { id: 'a_02', hospital_id: 'h3', type: 'dorm', name: '札幌医師寮', price_jpy: 0, address: '北海道札幌市中央区大通西1-1', photos: [], features: ['暖房','WiFi','駐車場','ジム'] },
    { id: 'a_03', hospital_id: 'h4', type: 'hotel', name: '博多ビジネスホテル', price_jpy: 8000, address: '福岡県福岡市博多区博多駅前2-2', photos: [], features: ['WiFi','朝食','空港送迎'] },
    { id: 'a_04', hospital_id: 'h5', type: 'dorm', name: '沖縄医師寮', price_jpy: 0, address: '沖縄県那覇市泉崎1-1', photos: [], features: ['エアコン','WiFi','駐車場','プール'] },
    { id: 'a_05', hospital_id: 'h6', type: 'dorm', name: '京都大学医師寮', price_jpy: 0, address: '京都府京都市左京区聖護院川原町54', photos: [], features: ['WiFi','図書館','研究施設'] }
  ]
  for (const a of accommodations) await upsert('accommodations', a.id, a)

  console.log('Seed completed: project=%s programs=%d, regions=%d, hospitals=%d, shifts=%d, testimonials=%d, accommodations=%d', 
    process.env.FIREBASE_PROJECT_ID, programs.length, regions.length, hospitals.length, shifts.length, testimonials.length, accommodations.length)
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })


