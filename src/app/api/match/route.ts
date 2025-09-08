import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { scoreMatch, type Doctor, type Shift } from '@/lib/matching'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const doctorId = searchParams.get('doctorId')
    if (!doctorId) return NextResponse.json({ error: 'doctorId required' }, { status: 400 })

    const { data: doctor, error: dErr } = await supabaseAdmin
      .from('doctors').select('*').eq('id', doctorId).single()
    if (dErr || !doctor) {
      console.error('Doctor not found:', dErr)
      return NextResponse.json({ error: dErr?.message || 'doctor not found' }, { status: 404 })
    }

    const now = new Date()
    const later = new Date(Date.now() + 72 * 60 * 60 * 1000)
    const { data: shifts, error: sErr } = await supabaseAdmin
      .from('shifts')
      .select('*, hospital:hospital_id(id, name, lat, lng, ehr_type)')
      .eq('status', 'open')
      .gte('start_at', now.toISOString())
      .lte('start_at', later.toISOString())

    if (sErr) {
      console.error('Shifts error:', sErr)
      return NextResponse.json({ error: sErr.message }, { status: 500 })
    }

    const result = (shifts || []).map((s: any) => ({
      shift: s,
      score: scoreMatch(doctor as Doctor, s as Shift)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

    return NextResponse.json(result)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
