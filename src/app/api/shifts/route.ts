import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    // 直近72hの open シフト
    const now = new Date()
    const later = new Date(Date.now() + 72 * 60 * 60 * 1000)

    const { data: shifts, error } = await supabaseAdmin
      .from('shifts')
      .select('*, hospital:hospital_id(id, name, lat, lng, ehr_type)')
      .eq('status', 'open')
      .gte('start_at', now.toISOString())
      .lte('start_at', later.toISOString())

    if (error) {
      console.error('Supabase error:', error)
      // ダミーデータを返す
      return NextResponse.json({ 
        type: 'FeatureCollection', 
        features: [] 
      })
    }

    // GeoJSON に変換
    const features = (shifts || []).map(s => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [s.hospital?.lng, s.hospital?.lat] },
      properties: {
        id: s.id,
        hospital: s.hospital?.name,
        dept: s.dept,
        role: s.role,
        start_at: s.start_at,
        end_at: s.end_at,
        surcharge: s.surcharge_factor ?? 1,
        weight: Math.max(1, Math.min(5, Number(s.surcharge_factor || 1) * 1.5))
      }
    }))

    return NextResponse.json({ type: 'FeatureCollection', features })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      type: 'FeatureCollection', 
      features: [] 
    })
  }
}
