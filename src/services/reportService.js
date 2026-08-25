// Real report service — talks to /api/reports and /api/stats, backed by
// Postgres via Prisma. Replaces the old localStorage-only demo dataset.
import { apiFetch } from './apiClient'

// The API returns flat address fields (address/city/state/country/lat/lng).
// The UI was originally built around a nested `location` object, so we
// reconstruct that shape here — this keeps every page that consumes reports
// unchanged apart from switching to async fetching.
function normalize(report) {
  if (!report) return report
  return {
    ...report,
    location: {
      address: report.address,
      city: report.city,
      state: report.state,
      country: report.country,
      lat: report.lat,
      lng: report.lng,
    },
  }
}

export async function listReports(filters = {}) {
  const data = await apiFetch('/api/reports', { params: filters })
  return { ...data, reports: data.reports.map(normalize) }
}

// Back-compat helper used across pages that previously read the whole demo
// dataset synchronously. Fetches a generous page size in one call.
export async function getAllReports(filters = {}) {
  const data = await listReports({ pageSize: 100, ...filters })
  return data.reports
}

export async function getReport(refOrId) {
  try {
    const data = await apiFetch('/api/reports', { params: { id: refOrId } })
    return normalize(data.report)
  } catch {
    return null
  }
}

export async function submitReport(form) {
  const data = await apiFetch('/api/reports', {
    method: 'POST',
    body: {
      typeId: form.typeId,
      title: form.title,
      description: form.description,
      priority: form.priority,
      location: form.location,
      evidence: form.evidence,
      reporterName: form.reporterName,
    },
  })
  return normalize(data.report)
}

// Admin actions
export async function verifyReport(refOrId) {
  const data = await apiFetch('/api/reports', { method: 'PATCH', params: { id: refOrId }, body: { status: 'Verified', note: 'Report verified by CivicPulse staff.' } })
  return normalize(data.report)
}

export async function assignDepartment(refOrId, department) {
  const data = await apiFetch('/api/reports', { method: 'PATCH', params: { id: refOrId }, body: { department, status: 'Assigned', note: `Assigned to ${department}.` } })
  return normalize(data.report)
}

export async function changePriority(refOrId, priority) {
  const data = await apiFetch('/api/reports', { method: 'PATCH', params: { id: refOrId }, body: { priority, note: `Priority set to ${priority}.` } })
  return normalize(data.report)
}

export async function changeStatus(refOrId, status) {
  const data = await apiFetch('/api/reports', { method: 'PATCH', params: { id: refOrId }, body: { status } })
  return normalize(data.report)
}

export async function addUpdateNote(refOrId, note) {
  const data = await apiFetch('/api/reports', { method: 'PATCH', params: { id: refOrId }, body: { note } })
  return normalize(data.report)
}

export async function getStats() {
  return apiFetch('/api/stats')
}

export async function getHotspots() {
  const stats = await getStats()
  return stats.hotspots // [{ city, count }]
}

// Simple client-side duplicate check against whatever page of reports is
// already loaded (kept lightweight — a real implementation would do this
// as a spatial query in the database).
export function getDuplicateCandidates(report, allReports = [], radiusKm = 1.2) {
  if (!report?.location?.lat || !report?.location?.lng) return []
  const toRad = (v) => (v * Math.PI) / 180
  const dist = (a, b) => {
    const R = 6371
    const dLat = toRad(b.lat - a.lat)
    const dLng = toRad(b.lng - a.lng)
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.asin(Math.sqrt(s))
  }
  return allReports.filter((r) => r.id !== report.id && r.categoryId === report.categoryId && r.location?.lat && dist(report.location, r.location) <= radiusKm)
}

export async function geocodeAddress(query) {
  const data = await apiFetch('/api/geocode', { params: { q: query } })
  return data.results
}
