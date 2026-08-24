// Fictional demo report data for the CivicPulse MVP.
// No real citizen data. Replace with a real API/service in production.
import { CATEGORIES, DEPARTMENTS, STATUS_FLOW } from './taxonomy'

const AREAS = [
  { name: 'Ikeja', state: 'Lagos', lat: 6.6018, lng: 3.3515 },
  { name: 'Surulere', state: 'Lagos', lat: 6.5010, lng: 3.3608 },
  { name: 'Yaba', state: 'Lagos', lat: 6.5158, lng: 3.3707 },
  { name: 'Agege', state: 'Lagos', lat: 6.6152, lng: 3.3255 },
  { name: 'Lekki', state: 'Lagos', lat: 6.4698, lng: 3.5852 },
  { name: 'Victoria Island', state: 'Lagos', lat: 6.4281, lng: 3.4219 },
  { name: 'Apapa', state: 'Lagos', lat: 6.4489, lng: 3.3595 },
  { name: 'Ajah', state: 'Lagos', lat: 6.4698, lng: 3.6012 },
  { name: 'Ikorodu', state: 'Lagos', lat: 6.6194, lng: 3.5105 },
  { name: 'Oshodi', state: 'Lagos', lat: 6.5550, lng: 3.3441 },
]

const TITLES = {
  roads: ['Large Pothole on Access Road', 'Collapsed Road Shoulder', 'Damaged Bridge Approach', 'Untarred Road Causing Delays'],
  flooding: ['Blocked Drainage Causing Flooding', 'Overflowing Gutter', 'Recurring Flood After Rainfall', 'Clogged Canal'],
  waste: ['Uncollected Waste Pile', 'Illegal Dumpsite', 'Overflowing Public Bin', 'Waste Truck Missed Route'],
  streetlights: ['Broken Streetlight', 'Faulty Electrical Pole', 'Dark Street at Night', 'Exposed Live Wire'],
  water: ['Burst Water Pipe', 'No Water Supply for 2 Weeks', 'Contaminated Borehole Water', 'Leaking Public Tap'],
  facilities: ['Damaged Public Toilet', 'Unmaintained Community Center', 'Broken Park Equipment'],
  environment: ['Air Pollution From Nearby Site', 'Noise Pollution Complaint', 'Bush Burning Hazard'],
  traffic: ['Malfunctioning Traffic Light', 'Dangerous Junction', 'Illegal Motor Park Congestion'],
  safety: ['Unsafe Pedestrian Crossing', 'Collapsed Fence Near School', 'Open Manhole Hazard'],
  'service-delivery': ['Delayed Certificate Processing', 'Slow Response at Local Office'],
  hospital: ['Long Wait Times at Clinic', 'Understaffed Public Hospital Ward'],
  school: ['Overcrowded Classroom', 'Damaged School Roof'],
  'gov-office': ['Unresponsive Local Government Office', 'Registry Delay'],
  'public-facility': ['Poorly Maintained Public Facility'],
  'local-govt': ['Local Government Service Delay'],
  'other-public': ['General Public Service Complaint'],
  telecom: ['Internet Service Not Activated After Payment', 'Frequent Network Downtime', 'SIM Registration Issue'],
  banking: ['Unauthorized Account Debit', 'ATM Failed to Dispense Cash', 'Delayed Transfer Reversal'],
  refund: ['Refund Not Processed After 30 Days', 'Denied Return for Faulty Item'],
  billing: ['Unexpected Charges on Bill', 'Overbilled Subscription'],
  'online-vendor': ['Order Never Delivered', 'Wrong Item Received From Vendor'],
  'transport-company': ['Damaged Goods in Transit', 'Rider Overcharged for Delivery'],
  'other-consumer': ['General Consumer Complaint'],
}

const EVIDENCE_TYPES = ['photo', 'photo', 'video', 'document']

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)]
}

function buildTimeline(status, baseDate) {
  const idx = STATUS_FLOW.indexOf(status)
  const steps = STATUS_FLOW.slice(0, idx + 1)
  return steps.map((s, i) => ({
    status: s,
    timestamp: new Date(baseDate.getTime() + i * 1000 * 60 * 60 * (6 + i * 3)).toISOString(),
    note: TIMELINE_NOTES[s] ?? 'Status updated.',
  }))
}

const TIMELINE_NOTES = {
  Submitted: 'Report submitted by citizen.',
  Received: 'Report received into the CivicPulse system.',
  'Under Review': 'Report is being reviewed by CivicPulse staff.',
  Verified: 'Report has been verified as a valid complaint.',
  Assigned: 'Report assigned to responsible department.',
  Investigation: 'Department is investigating the reported issue.',
  'In Progress': 'Work is underway to resolve the issue.',
  Resolved: 'Issue has been resolved.',
  Closed: 'Report closed.',
}

function statusToPriorityWeight(rand) {
  const roll = rand()
  if (roll < 0.08) return 'Critical'
  if (roll < 0.28) return 'High'
  if (roll < 0.65) return 'Medium'
  return 'Normal'
}

function generateReports(count = 64) {
  const rand = seededRandom(42)
  const types = ['community', 'community', 'community', 'government', 'consumer']
  const reports = []

  for (let i = 0; i < count; i++) {
    const type = pick(rand, types)
    const cats = CATEGORIES[type]
    const category = pick(rand, cats)
    const area = pick(rand, AREAS)
    const titleOptions = TITLES[category.id] ?? ['Reported Issue']
    const title = pick(rand, titleOptions)
    const priority = statusToPriorityWeight(rand)
    const statusIdx = Math.min(STATUS_FLOW.length - 1, Math.floor(rand() * STATUS_FLOW.length))
    const status = STATUS_FLOW[statusIdx]
    const daysAgo = Math.floor(rand() * 60)
    const baseDate = new Date(Date.now() - daysAgo * 86400000)
    const jitterLat = (rand() - 0.5) * 0.035
    const jitterLng = (rand() - 0.5) * 0.035
    const department = category.department ? DEPARTMENTS.find((d) => d.id === category.department) : null
    const refNum = `CIV-2026-${String(4500 + i).padStart(6, '0')}`

    reports.push({
      id: `rep-${i + 1}`,
      referenceId: refNum,
      title,
      typeId: type,
      categoryId: category.id,
      categoryLabel: category.label,
      description: `Reported near ${area.name}. ${title}. This is a demo description generated for the CivicPulse MVP to illustrate the reporting and tracking flow.`,
      location: {
        address: `${area.name} Road`,
        city: area.name,
        state: area.state,
        country: 'Nigeria',
        lat: area.lat + jitterLat,
        lng: area.lng + jitterLng,
      },
      priority,
      status,
      department: department?.name ?? null,
      departmentId: department?.id ?? null,
      createdAt: baseDate.toISOString(),
      updatedAt: new Date(baseDate.getTime() + 86400000 * Math.floor(rand() * daysAgo || 1)).toISOString(),
      evidence: Array.from({ length: Math.floor(rand() * 3) }, (_, k) => ({
        type: pick(rand, EVIDENCE_TYPES),
        name: `evidence-${i}-${k}.jpg`,
      })),
      timeline: buildTimeline(status, baseDate),
      reporter: {
        // demo-only, not a real citizen
        displayName: 'Citizen',
      },
    })
  }
  return reports
}

export const DEMO_REPORTS = generateReports(64)

// A few featured/pinned reports matching the spec examples, kept consistent
// across dashboard, tracking, and detail views.
export const FEATURED_REPORTS = [
  {
    ...DEMO_REPORTS[0],
    id: 'featured-1',
    referenceId: 'CIV-2026-004821',
    title: 'Broken Streetlight',
    typeId: 'community',
    categoryId: 'streetlights',
    categoryLabel: 'Streetlights & Electrical',
    status: 'In Progress',
    priority: 'High',
    location: { address: 'Allen Avenue', city: 'Ikeja', state: 'Lagos', country: 'Nigeria', lat: 6.6018, lng: 3.3515 },
    department: 'Infrastructure & Electrical',
  },
  {
    ...DEMO_REPORTS[1],
    id: 'featured-2',
    referenceId: 'CIV-2026-004617',
    title: 'Blocked Drainage',
    typeId: 'community',
    categoryId: 'flooding',
    categoryLabel: 'Flooding & Drainage',
    status: 'Resolved',
    priority: 'Medium',
    location: { address: 'Adeniran Ogunsanya St', city: 'Surulere', state: 'Lagos', country: 'Nigeria', lat: 6.5010, lng: 3.3608 },
    department: 'Environmental Services',
  },
  {
    ...DEMO_REPORTS[2],
    id: 'featured-3',
    referenceId: 'CIV-2026-004512',
    title: 'Road Damage',
    typeId: 'community',
    categoryId: 'roads',
    categoryLabel: 'Road Infrastructure',
    status: 'Under Review',
    priority: 'Medium',
    location: { address: 'Herbert Macaulay Way', city: 'Yaba', state: 'Lagos', country: 'Nigeria', lat: 6.5158, lng: 3.3707 },
    department: 'Public Works',
  },
]

export const ALL_REPORTS = [...FEATURED_REPORTS, ...DEMO_REPORTS]

export function findReportByRef(refOrId) {
  return ALL_REPORTS.find((r) => r.referenceId === refOrId || r.id === refOrId)
}

export function getHotspots() {
  const counts = {}
  ALL_REPORTS.forEach((r) => {
    const key = r.location.city
    counts[key] = (counts[key] || 0) + 1
  })
  return Object.entries(counts)
    .map(([city, count]) => {
      const loc = ALL_REPORTS.find((r) => r.location.city === city)?.location
      return { city, count, lat: loc?.lat, lng: loc?.lng }
    })
    .sort((a, b) => b.count - a.count)
}
