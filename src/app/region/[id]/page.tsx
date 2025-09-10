'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Navigation, Star } from 'lucide-react'

export default function RegionDetail() {
  const [region, setRegion] = useState<any>(null)
  const [hospitals, setHospitals] = useState<any[]>([])

  useEffect(() => {
    const id = window.location.pathname.split('/').pop() || ''
    ;(async () => {
      const r = await fetch('/api/regions').then(r=>r.json())
      const h = await fetch('/api/hospitals').then(r=>r.json())
      const reg = (Array.isArray(r) ? r : []).find((x:any)=>x.id===id)
      setRegion(reg)
      setHospitals(Array.isArray(h)?h:[])
    })()
  }, [])

  if (!region) return null

  const prefectures: string[] = region.prefectures || []
  const regionHospitals = hospitals.filter((h:any)=>{
    const regionField: string = h.region || h.region_id || h.regionName || ''
    const address: string = h.address || ''
    const prefecture: string = h.prefecture || ''
    const byRegionId = regionField === region.id || regionField.includes(region.id)
    const byRegionName = regionField.includes(region.name)
    const byPref = prefectures.some((p)=>address.includes(p) || prefecture.includes(p))
    return byRegionId || byRegionName || byPref
  })

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="mr-3 p-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-xl font-bold">{region.name}</h1>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <img src={region.photo} alt={region.name} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{region.name}</h2>
              {region.catchphrase && <p className="text-lg mb-2">{region.catchphrase}</p>}
              <p className="text-gray-600">{region.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(region.features||[]).map((t:any,i:number)=>(<span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{t}</span>))}
              </div>
              <div className="mt-4 flex items-center text-gray-600"><Navigation className="h-4 w-4 mr-2" />{region.access_info}</div>
            </div>
          </section>

          {Array.isArray(prefectures) && prefectures.length>0 && (
            <section className="mb-10">
              <h3 className="text-xl font-semibold mb-4">都道府県を選ぶ</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {prefectures.map((p:string)=>(
                  <a key={p} href={`/prefecture?name=${encodeURIComponent(p)}`} className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                    <img src={`https://source.unsplash.com/400x240/?${encodeURIComponent(p)}`} alt={p} className="w-full h-28 object-cover" />
                    <div className="px-3 py-3 text-center font-semibold">{p}</div>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-xl font-semibold mb-4">この地域の病院（{regionHospitals.length}件）</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionHospitals.map((h:any)=>(
                <a key={h.id} href={`/shifts?hospital=${h.id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  <img src={h.photos?.[0] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop'} alt={h.name} className="w-full h-44 object-cover" />
                  <div className="p-4">
                    <div className="font-semibold mb-1">{h.name}</div>
                    <div className="flex items-center text-sm text-gray-600"><Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />{h.rating_avg || '4.0'}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}



