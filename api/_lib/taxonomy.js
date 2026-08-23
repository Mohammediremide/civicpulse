// Server-side mirror of src/data/taxonomy.js — duplicated (not imported) so
// serverless functions have no dependency on frontend/React code.

export const CATEGORIES = {
  community: [
    { id: 'roads', label: 'Road Infrastructure', department: 'Public Works' },
    { id: 'flooding', label: 'Flooding & Drainage', department: 'Environmental Services' },
    { id: 'waste', label: 'Waste Management', department: 'Waste Management' },
    { id: 'streetlights', label: 'Streetlights & Electrical', department: 'Infrastructure & Electrical' },
    { id: 'water', label: 'Water Infrastructure', department: 'Water Services' },
    { id: 'facilities', label: 'Public Facilities', department: 'Public Works' },
    { id: 'environment', label: 'Environmental Problems', department: 'Environmental Services' },
    { id: 'traffic', label: 'Traffic & Transport', department: 'Transport Authority' },
    { id: 'safety', label: 'Safety Concerns', department: 'Emergency Services' },
  ],
  government: [
    { id: 'service-delivery', label: 'Service Delivery Delay', department: 'Public Works' },
    { id: 'hospital', label: 'Public Hospital', department: 'Health Services' },
    { id: 'school', label: 'Public School', department: 'Education Services' },
    { id: 'gov-office', label: 'Government Office', department: 'Public Works' },
    { id: 'public-facility', label: 'Public Facility', department: 'Public Works' },
    { id: 'local-govt', label: 'Local Government', department: 'Public Works' },
    { id: 'other-public', label: 'Other Public Service', department: 'Public Works' },
  ],
  consumer: [
    { id: 'product', label: 'Product Problem', organization: 'Business complaint workflow' },
    { id: 'refund', label: 'Refund Problem', organization: 'Business complaint workflow' },
    { id: 'online-vendor', label: 'Online Vendor', organization: 'Business complaint workflow' },
    { id: 'unfair-charges', label: 'Unfair Charges', organization: 'Service provider complaint workflow' },
    { id: 'service-not-provided', label: 'Service Not Provided', organization: 'Service provider complaint workflow' },
    { id: 'billing', label: 'Billing Issue', organization: 'Service provider complaint workflow' },
    { id: 'telecom', label: 'Telecommunications', organization: 'Service provider complaint workflow' },
    { id: 'banking', label: 'Bank / Financial Service', organization: 'Service provider complaint workflow' },
    { id: 'transport-company', label: 'Transport Company', organization: 'Business complaint workflow' },
    { id: 'other-consumer', label: 'Other Consumer Complaint', organization: 'Business complaint workflow' },
  ],
}

export const STATUS_FLOW = [
  'Submitted', 'Received', 'Under Review', 'Verified', 'Assigned',
  'Investigation', 'In Progress', 'Resolved', 'Closed',
]

const RULES = {
  community: [
    { test: /pothole|road|bridge|tarmac/, category: 'roads' },
    { test: /flood|drain|gutter|blocked drainage/, category: 'flooding' },
    { test: /waste|dump|refuse|garbage|trash/, category: 'waste' },
    { test: /streetlight|light pole|electric/, category: 'streetlights' },
    { test: /water|pipe|borehole/, category: 'water' },
    { test: /traffic|bus stop|congestion/, category: 'traffic' },
    { test: /unsafe|crime|danger|safety/, category: 'safety' },
  ],
  government: [
    { test: /hospital|clinic|nurse|doctor/, category: 'hospital' },
    { test: /school|teacher|classroom/, category: 'school' },
    { test: /delay|slow|waiting/, category: 'service-delivery' },
    { test: /office|civil servant|registry/, category: 'gov-office' },
  ],
  consumer: [
    { test: /internet|network|telecom|airtime|data plan|sim/, category: 'telecom' },
    { test: /bank|transfer|atm|account debited/, category: 'banking' },
    { test: /refund|return/, category: 'refund' },
    { test: /bill|charged|overcharged/, category: 'billing' },
    { test: /delivery|vendor|order/, category: 'online-vendor' },
    { test: /transport|logistics|dispatch rider/, category: 'transport-company' },
  ],
}

export function classifyComplaint(typeId, text = '') {
  const t = text.toLowerCase()
  const set = RULES[typeId] || []
  const match = set.find((r) => r.test.test(t))
  const categoryId = match ? match.category : (CATEGORIES[typeId]?.[0]?.id ?? 'other-public')
  const category = CATEGORIES[typeId]?.find((c) => c.id === categoryId)
  return {
    categoryId,
    categoryLabel: category?.label ?? 'General',
    department: category?.department ?? null,
    organization: category?.organization ?? null,
  }
}

export function nextReferenceId(sequenceNumber) {
  const year = new Date().getFullYear()
  return `CIV-${year}-${String(sequenceNumber).padStart(6, '0')}`
}
