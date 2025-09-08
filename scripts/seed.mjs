import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY
const supa = createClient(url, service)

function rand(arr) { return arr[Math.floor(Math.random()*arr.length)] }

async function main() {
  // 病院を数件
  const hospitals = [
    { name: 'Tokyo General', region: 'Kanto', facility_type: 'secondary', ehr_type: 'Fujitsu', lat: 35.6895, lng: 139.6917 },
    { name: 'Sendai Central', region: 'Tohoku', facility_type: 'secondary', ehr_type: 'NEC', lat: 38.2682, lng: 140.8694 },
    { name: 'Sapporo West', region: 'Hokkaido', facility_type: 'secondary', ehr_type: 'Hitachi', lat: 43.0621, lng: 141.3544 },
    { name: 'Fukuoka Bay', region: 'Kyushu', facility_type: 'secondary', ehr_type: 'Fujitsu', lat: 33.5904, lng: 130.4017 },
  ]
  const { data: hos, error: hErr } = await supa.from('hospitals').insert(hospitals).select()
  if (hErr) { console.error(hErr); process.exit(1) }

  // 医師を1名（デモ用）
  const { data: docs, error: dErr } = await supa.from('doctors').insert([
    { name: 'Demo Doctor', years_of_exp: 8, skills: ['em', 'intubation', 'suturing'], ehr_experience: ['Fujitsu'], lat: 35.68, lng: 139.76, rating: 4.7, cancel_rate: 0.02 }
  ]).select()
  if (dErr) { console.error(dErr); process.exit(1) }

  const hid = hos.map(h => h.id)
  const now = Date.now()
  const shifts = Array.from({ length: 20 }).map(() => {
    const start = new Date(now + Math.floor(Math.random()* (72*60*60*1000)))
    const end = new Date(start.getTime() + (4 + Math.floor(Math.random()*12)) * 60 * 60 * 1000)
    return {
      hospital_id: rand(hid),
      dept: rand(['ER','IM','Peds','OBGYN','Surg']),
      role: rand(['night-shift','day-shift','halfday-outpatient']),
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      required_skills: rand([['em'], ['intubation'], ['suturing'], ['em','intubation']]),
      comp_base: rand([18000, 22000, 26000, 30000]),
      surcharge_factor: rand([1.0, 1.2, 1.5, 2.0]),
      status: 'open'
    }
  })

  const { error: sErr } = await supa.from('shifts').insert(shifts)
  if (sErr) { console.error(sErr); process.exit(1) }

  console.log('Seed completed.')
  console.log('Doctor for demo:', docs[0].id)
}

main()
