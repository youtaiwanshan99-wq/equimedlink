export type Doctor = {
  id: string
  years_of_exp?: number | null
  skills?: string[] | null
  ehr_experience?: string[] | null
  lat?: number | null
  lng?: number | null
  rating?: number | null
  cancel_rate?: number | null
}

export type Shift = {
  id: string
  hospital_id: string
  dept: string | null
  role: string | null
  start_at: string
  end_at: string
  required_skills: string[] | null
  comp_base: number | null
  surcharge_factor: number | null
  status: string | null
  hospital?: { lat: number; lng: number; ehr_type?: string | null }
}

const toRad = (v: number) => (v * Math.PI) / 180
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function scoreMatch(doctor: Doctor, shift: Shift) {
  let score = 0
  // 1) EHR一致（簡易）
  const ehrDoc = doctor.ehr_experience || []
  const ehrHos = shift.hospital?.ehr_type
  if (ehrHos && ehrDoc.includes(ehrHos)) score += 30
  // 2) スキル適合（重み）
  const req = new Set((shift.required_skills || []).map(s => s.toLowerCase()))
  const has = new Set((doctor.skills || []).map(s => s.toLowerCase()))
  let overlap = 0
  req.forEach(r => { if (has.has(r)) overlap++ })
  score += Math.min(20, overlap * 5)
  // 3) 距離（近いほど高評価）
  if (doctor.lat && doctor.lng && shift.hospital?.lat && shift.hospital?.lng) {
    const km = haversineKm({ lat: doctor.lat, lng: doctor.lng }, { lat: shift.hospital.lat, lng: shift.hospital.lng })
    const distScore = Math.max(0, 30 - Math.min(30, km / 10)) // 0–30
    score += distScore
  }
  // 4) 経験年数（5–15年帯にボーナス）
  const y = doctor.years_of_exp || 0
  if (y >= 5 && y <= 15) score += 10
  // 5) 緊急サージ係数
  score += Math.min(10, (shift.surcharge_factor || 1) * 2)
  return Math.round(score)
}
