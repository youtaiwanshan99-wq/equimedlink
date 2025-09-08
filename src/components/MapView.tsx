'use client'
import { useEffect, useRef, useState } from 'react'
import maplibregl, { Map as MLMap } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function MapView() {
  const ref = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MLMap | null>(null)
  const [mode, setMode] = useState<'heat' | 'pins'>('heat')

  useEffect(() => {
    if (!ref.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: ref.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [139.6917, 35.6895], // Tokyo
      zoom: 5
    })
    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.on('load', async () => {
      const res = await fetch('/api/shifts')
      const geojson = await res.json()
      map.addSource('shifts', { type: 'geojson', data: geojson })

      map.addLayer({
        id: 'shifts-heat',
        type: 'heatmap',
        source: 'shifts',
        layout: { visibility: mode === 'heat' ? 'visible' : 'none' },
        paint: {
          'heatmap-weight': ['coalesce', ['get', 'weight'], 1],
          'heatmap-intensity': 1,
          'heatmap-radius': 30,
          'heatmap-opacity': 0.85
        }
      })

      map.addLayer({
        id: 'shifts-points',
        type: 'circle',
        source: 'shifts',
        layout: { visibility: mode === 'pins' ? 'visible' : 'none' },
        paint: {
          'circle-radius': 6,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      })

      map.on('click', 'shifts-points', (e: any) => {
        const f = e.features?.[0]
        if (!f) return
        const { hospital, dept, role, start_at, end_at, surcharge } = f.properties
        const coords = f.geometry.coordinates.slice()
        new maplibregl.Popup()
          .setLngLat(coords)
          .setHTML(
            `<div style="font-size:14px;line-height:1.4">
              <b>${hospital ?? ''}</b><br/>
              ${dept ?? ''} / ${role ?? ''}<br/>
              ${new Date(start_at).toLocaleString()} – ${new Date(end_at).toLocaleString()}<br/>
              Surge × ${surcharge}
            </div>`
          )
          .addTo(map)
      })

      mapRef.current = map
    })

    return () => { mapRef.current?.remove(); mapRef.current = null }
  }, [])

  // モードの反映
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const heat = map.getLayer('shifts-heat')
    const pts = map.getLayer('shifts-points')
    if (heat) map.setLayoutProperty('shifts-heat', 'visibility', mode === 'heat' ? 'visible' : 'none')
    if (pts) map.setLayoutProperty('shifts-points', 'visibility', mode === 'pins' ? 'visible' : 'none')
  }, [mode])

  return (
    <div className="w-full h-[80vh] relative">
      <div className="absolute z-10 left-3 top-3 flex gap-2 bg-white/90 rounded px-3 py-2 shadow">
        <button
          onClick={() => setMode('heat')}
          className={`text-sm ${mode==='heat'?'font-bold underline':''}`}
        >Heat</button>
        <button
          onClick={() => setMode('pins')}
          className={`text-sm ${mode==='pins'?'font-bold underline':''}`}
        >Pins</button>
      </div>
      <div ref={ref} className="w-full h-full" />
    </div>
  )
}
