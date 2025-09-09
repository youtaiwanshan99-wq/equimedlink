import { NextRequest, NextResponse } from 'next/server'
import { scoreMatch, type Doctor, type Shift } from '@/lib/matching'

// ダミーデータ
const dummyHospitals = [
  { id: '1', name: 'Tokyo General', lat: 35.6895, lng: 139.6917, ehr_type: 'Fujitsu' },
  { id: '2', name: 'Sendai Central', lat: 38.2682, lng: 140.8694, ehr_type: 'NEC' },
  { id: '3', name: 'Sapporo West', lat: 43.0621, lng: 141.3544, ehr_type: 'Hitachi' },
  { id: '4', name: 'Fukuoka Bay', lat: 33.5904, lng: 130.4017, ehr_type: 'Fujitsu' },
]

const dummyShifts = [
  {
    id: '1',
    hospital_id: '1',
    dept: 'ER',
    role: 'night-shift',
    start_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    required_skills: ['em', 'intubation'],
    comp_base: 25000,
    surcharge_factor: 1.5,
    status: 'open'
  },
  {
    id: '2',
    hospital_id: '2',
    dept: 'IM',
    role: 'day-shift',
    start_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
    required_skills: ['em'],
    comp_base: 22000,
    surcharge_factor: 1.2,
    status: 'open'
  },
  {
    id: '3',
    hospital_id: '3',
    dept: 'Peds',
    role: 'halfday-outpatient',
    start_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    required_skills: ['suturing'],
    comp_base: 18000,
    surcharge_factor: 1.0,
    status: 'open'
  },
  {
    id: '4',
    hospital_id: '4',
    dept: 'OBGYN',
    role: 'night-shift',
    start_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    end_at: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(),
    required_skills: ['em', 'intubation', 'suturing'],
    comp_base: 30000,
    surcharge_factor: 2.0,
    status: 'open'
  }
]

const dummyDoctor: Doctor = {
  id: 'demo-doctor',
  name: 'Demo Doctor',
  years_of_exp: 8,
  skills: ['em', 'intubation', 'suturing'],
  ehr_experience: ['Fujitsu'],
  lat: 35.68,
  lng: 139.76,
  rating: 4.7,
  cancel_rate: 0.02
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get('doctorId')
    
    // デモ用の医師データを使用
    const doctor = dummyDoctor

    // ダミーのシフトデータを準備
    const shifts = dummyShifts.map(shift => {
      const hospital = dummyHospitals.find(h => h.id === shift.hospital_id)
      return {
        ...shift,
        hospital: {
          id: hospital?.id,
          name: hospital?.name,
          lat: hospital?.lat,
          lng: hospital?.lng,
          ehr_type: hospital?.ehr_type
        }
      }
    })

    const result = shifts.map((s: any) => ({
      shift: s,
      score: scoreMatch(doctor, s as Shift)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

    return NextResponse.json(result)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
