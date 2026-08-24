import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { markerColorFor } from '../utils/status'

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY
const DEFAULT_CENTER = [6.5244, 3.3792] // Lagos

function markerIcon(color, selected) {
  return L.divIcon({
    className: '',
    html: `
      <span style="position:relative;display:flex;align-items:center;justify-content:center;width:22px;height:22px;">
        ${selected ? `<span style="position:absolute;width:16px;height:16px;border-radius:9999px;background:${color};animation:pulse-ring 2.2s cubic-bezier(0.2,0.7,0.4,1) infinite;"></span>` : ''}
        <span style="position:relative;z-index:1;width:${selected ? 16 : 11}px;height:${selected ? 16 : 11}px;border-radius:9999px;background:${color};box-shadow:0 0 0 2px rgba(255,255,255,0.85);"></span>
      </span>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView([points[0].location.lat, points[0].location.lng], 14)
      return
    }
    const bounds = L.latLngBounds(points.map((p) => [p.location.lat, p.location.lng]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points.length, map])
  return null
}

export default function DemoMap({ reports = [], selectedId, onSelect, height = 'h-full' }) {
  const points = useMemo(() => reports.filter((r) => r.location?.lat && r.location?.lng), [reports])

  if (!GEOAPIFY_KEY) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-navy-900 px-6 text-center text-sm text-slate-400 ${height}`}>
        Map unavailable — set VITE_GEOAPIFY_API_KEY to enable the live map.
      </div>
    )
  }

  return (
    <div className={`isolate overflow-hidden rounded-2xl ${height}`}>
      <MapContainer center={DEFAULT_CENTER} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%', background: '#0a1b33' }}>
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`}
          attribution='Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
        />
        <FitBounds points={points} />
        {points.map((r) => (
          <Marker
            key={r.id}
            position={[r.location.lat, r.location.lng]}
            icon={markerIcon(markerColorFor(r), selectedId === r.id)}
            eventHandlers={{ click: () => onSelect?.(r) }}
          />
        ))}
      </MapContainer>
    </div>
  )
}
