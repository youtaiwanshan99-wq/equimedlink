import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 動的インポートでFirebaseを読み込み
    const { db } = await import('@/lib/firestore')
    
    const now = Date.now()

    async function upsert(col: string, id: string, data: any) {
      await db.collection(col).doc(id).set({ id, ...data, updated_at: now, created_at: data.created_at || now }, { merge: true })
    }

    // Hospitals
    const hospitals = [
      { id: 'h1', name: '地方総合病院A', lat: 36.5551, lng: 139.8828, ehr_type: 'HOPE' },
      { id: 'h2', name: '地域医療センターB', lat: 36.3895, lng: 139.0634, ehr_type: 'Hitachi' },
    ]
    for (const h of hospitals) await upsert('hospitals', h.id, h)

    // Shifts
    const shifts = [
      { id: 's1', hospital_id: 'h1', dept: '救急科', role: '当直', start_at: '2025-09-10T09:00:00Z', end_at: '2025-09-10T17:00:00Z', required_skills: ['ACLS'], comp_base: 80000, surcharge_factor: 1.3, status: 'open' },
      { id: 's2', hospital_id: 'h2', dept: '内科', role: '外来', start_at: '2025-09-11T09:00:00Z', end_at: '2025-09-11T17:00:00Z', required_skills: ['IM'], comp_base: 50000, surcharge_factor: 1.0, status: 'open' },
    ]
    for (const s of shifts) await upsert('shifts', s.id, s)

    const hospitalsSnap = await db.collection('hospitals').get()
    const shiftsSnap = await db.collection('shifts').get()
    return NextResponse.json({ ok: true, counts: { hospitals: hospitalsSnap.size, shifts: shiftsSnap.size } })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}




