// Demo taxonomy for CivicPulse. This is fictional/demo data for the MVP.
// In production, this would be served from a categories/routing API.

export const COMPLAINT_TYPES = [
  {
    id: 'community',
    label: 'Community Issue',
    short: 'Community',
    description: 'Roads, drainage, waste, streetlights, water, safety and other local infrastructure problems.',
    icon: 'MapPinned',
  },
  {
    id: 'government',
    label: 'Government Service',
    short: 'Government',
    description: 'Delays or problems with public offices, hospitals, schools and other government-delivered services.',
    icon: 'Landmark',
  },
  {
    id: 'consumer',
    label: 'Consumer / Business Complaint',
    short: 'Consumer',
    description: 'Problems with a business, vendor, telecom, bank or other paid service.',
    icon: 'ShoppingBag',
  },
]

export const CATEGORIES = {
  community: [
    { id: 'roads', label: 'Road Infrastructure', department: 'public-works' },
    { id: 'flooding', label: 'Flooding & Drainage', department: 'environmental' },
    { id: 'waste', label: 'Waste Management', department: 'waste-management' },
    { id: 'streetlights', label: 'Streetlights & Electrical', department: 'infrastructure' },
    { id: 'water', label: 'Water Infrastructure', department: 'water-services' },
    { id: 'facilities', label: 'Public Facilities', department: 'public-works' },
    { id: 'environment', label: 'Environmental Problems', department: 'environmental' },
    { id: 'traffic', label: 'Traffic & Transport', department: 'transport' },
    { id: 'safety', label: 'Safety Concerns', department: 'emergency-services' },
  ],
  government: [
    { id: 'service-delivery', label: 'Service Delivery Delay', department: 'public-works' },
    { id: 'hospital', label: 'Public Hospital', department: 'health-services' },
    { id: 'school', label: 'Public School', department: 'education-services' },
    { id: 'gov-office', label: 'Government Office', department: 'public-works' },
    { id: 'public-facility', label: 'Public Facility', department: 'public-works' },
    { id: 'local-govt', label: 'Local Government', department: 'public-works' },
    { id: 'other-public', label: 'Other Public Service', department: 'public-works' },
  ],
  consumer: [
    { id: 'product', label: 'Product Problem', organizationType: 'business' },
    { id: 'refund', label: 'Refund Problem', organizationType: 'business' },
    { id: 'online-vendor', label: 'Online Vendor', organizationType: 'business' },
    { id: 'unfair-charges', label: 'Unfair Charges', organizationType: 'service-provider' },
    { id: 'service-not-provided', label: 'Service Not Provided', organizationType: 'service-provider' },
    { id: 'billing', label: 'Billing Issue', organizationType: 'service-provider' },
    { id: 'telecom', label: 'Telecommunications', organizationType: 'service-provider' },
    { id: 'banking', label: 'Bank / Financial Service', organizationType: 'service-provider' },
    { id: 'transport-company', label: 'Transport Company', organizationType: 'business' },
    { id: 'other-consumer', label: 'Other Consumer Complaint', organizationType: 'business' },
  ],
}

export const DEPARTMENTS = [
  { id: 'public-works', name: 'Public Works', lead: 'Eng. Ade Fashola' },
  { id: 'waste-management', name: 'Waste Management', lead: 'Mrs. Bimpe Alade' },
  { id: 'water-services', name: 'Water Services', lead: 'Eng. Chuka Obi' },
  { id: 'environmental', name: 'Environmental Services', lead: 'Dr. Funke Bello' },
  { id: 'transport', name: 'Transport Authority', lead: 'Mr. Segun Adeyemi' },
  { id: 'infrastructure', name: 'Infrastructure & Electrical', lead: 'Eng. Ifeoma Nwosu' },
  { id: 'emergency-services', name: 'Emergency Services', lead: 'Cdr. Tunde Balogun' },
  { id: 'health-services', name: 'Health Services', lead: 'Dr. Ngozi Eze' },
  { id: 'education-services', name: 'Education Services', lead: 'Mrs. Kemi Salako' },
]

export const ORGANIZATIONS = [
  { id: 'org-1', name: 'Lagos Metro Telecom', type: 'Service Provider' },
  { id: 'org-2', name: 'Naira Trust Bank', type: 'Service Provider' },
  { id: 'org-3', name: 'QuickCart Nigeria', type: 'Business' },
  { id: 'org-4', name: 'SwiftRide Logistics', type: 'Transport Company' },
  { id: 'org-5', name: 'BrightHome Retail', type: 'Business' },
]

export const STATUS_FLOW = [
  'Submitted',
  'Received',
  'Under Review',
  'Verified',
  'Assigned',
  'Investigation',
  'In Progress',
  'Resolved',
  'Closed',
]

export const PRIORITIES = ['Normal', 'Medium', 'High', 'Critical']

// Simple demo classification engine. NOT real AI — deterministic keyword rules
// so the architecture can be swapped for a real classification service later.
export function classifyComplaint(type, text = '') {
  const t = text.toLowerCase()

  const rules = {
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

  const set = rules[type] || []
  const match = set.find((r) => r.test.test(t))
  const categoryId = match ? match.category : (CATEGORIES[type]?.[0]?.id ?? null)
  const category = CATEGORIES[type]?.find((c) => c.id === categoryId)

  let suggestion = null
  if (category?.department) {
    const dept = DEPARTMENTS.find((d) => d.id === category.department)
    suggestion = { kind: 'department', name: dept?.name ?? 'Public Works' }
  } else if (category?.organizationType) {
    suggestion = { kind: 'organization-type', name: category.organizationType === 'service-provider' ? 'Service provider complaint workflow' : 'Business complaint workflow' }
  }

  return {
    typeId: type,
    categoryId,
    categoryLabel: category?.label ?? 'General',
    suggestion,
  }
}
