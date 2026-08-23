import { useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { AnimatePresence, motion } from 'framer-motion'
import L from 'leaflet'
import { MARKER_COLORS } from '../utils/status'

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY
const CENTER = [6.5244, 3.3792] // Lagos

const MARKERS = [
  { id: 1, lat: 6.6018, lng: 3.3515, type: 'Community Issue', title: 'Broken Streetlight', location: 'Ikeja, Lagos', priority: 'High', status: 'In Progress' },
  { id: 2, lat: 6.5010, lng: 3.3608, type: 'Community Issue', title: 'Flooding', location: 'Surulere, Lagos', priority: 'Critical', status: 'Investigation' },
  { id: 3, lat: 6.5158, lng: 3.3707, type: 'Government Service', title: 'Road Damage', location: 'Yaba, Lagos', priority: 'Medium', status: 'Under Review' },
  { id: 4, lat: 6.4698, lng: 3.5852, type: 'Consumer Complaint', title: 'Service Complaint', location: 'Lekki, Lagos', priority: 'Normal', status: 'Assigned' },
  { id: 5, lat: 6.6152, lng: 3.3255, type: 'Resolved', title: 'Waste Collection', location: 'Agege, Lagos', priority: 'Medium', status: 'Resolved' },
  { id: 6, lat: 6.4698, lng: 3.6012, type: 'Community Issue', title: 'Water Problem', location: 'Ajah, Lagos', priority: 'High', status: 'Assigned' },
  { id: 7, lat: 6.4489, lng: 3.3595, type: 'Government Service', title: 'Clinic Delay', location: 'Apapa, Lagos', priority: 'Medium', status: 'Verified' },
]

function colorFor(marker) {
  if (marker.status === 'Resolved') return MARKER_COLORS.Resolved
  return MARKER_COLORS[marker.priority] ?? MARKER_COLORS.Normal
}

function markerIcon(color, selected) {
  return L.divIcon({
    className: '',
    html: `
      <span style="position:relative;display:flex;align-items:center;justify-content:center;width:24px;height:24px;">
        <span style="position:absolute;width:14px;height:14px;border-radius:9999px;background:${color};animation:pulse-ring 2.2s cubic-bezier(0.2,0.7,0.4,1) infinite;"></span>
        <span style="position:relative;z-index:1;width:${selected ? 15 : 12}px;height:${selected ? 15 : 12}px;border-radius:9999px;background:${color};box-shadow:0 0 0 2px rgba(255,255,255,0.85);transition:all .15s ease;"></span>
      </span>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

export default function HeroMap() {
  const [active, setActive] = useState(MARKERS[0].id)
  const activeMarker = MARKERS.find((m) => m.id === active)

  return (
    <div className="relative aspect-[4/3.4] w-full isolate overflow-hidden rounded-3xl border border-white/10 bg-navy-900 shadow-2xl shadow-black/40">
      {GEOAPIFY_KEY ? (
        <MapContainer center={CENTER} zoom={10.4} zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false} attributionControl={false} style={{ height: '100%', width: '100%', background: '#0a1b33' }}>
          <TileLayer url={`https://maps.geoapify.com/v1/tile/dark-matter/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`} />
          {MARKERS.map((m) => (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              icon={markerIcon(colorFor(m), active === m.id)}
              eventHandlers={{ click: () => setActive(m.id) }}
            />
          ))}
        </MapContainer>
      ) : (
        <div className="grid h-full place-items-center px-6 text-center text-sm text-slate-400">
          Map unavailable — set VITE_GEOAPIFY_API_KEY to enable the live map.
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeMarker && (
          <motion.div
            key={activeMarker.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute bottom-4 left-4 right-4 z-[400] rounded-2xl border border-white/10 bg-navy-950/90 p-4 backdrop-blur-md sm:left-4 sm:right-auto sm:w-72"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ backgroundColor: `${colorFor(activeMarker)}22`, color: colorFor(activeMarker) }}>
                {activeMarker.type}
              </span>
              <span className="font-mono text-[10px] text-slate-500">LIVE MAP</span>
            </div>
            <h4 className="mt-2 font-display text-base font-semibold text-white">{activeMarker.title}</h4>
            <p className="text-xs text-slate-400">{activeMarker.location}</p>
            <div className="mt-3 flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-500">Priority </span>
                <span className="font-medium text-white">{activeMarker.priority}</span>
              </div>
              <div>
                <span className="text-slate-500">Status </span>
                <span className="font-medium text-white">{activeMarker.status}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
