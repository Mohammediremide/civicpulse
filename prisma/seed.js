// Seeds the database with a demo admin account and a set of sample reports
// so the dashboard, map, and analytics aren't empty on first deploy.
// Run with: npx prisma db seed
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const AREAS = [
  { name: 'Ikeja', lat: 6.6018, lng: 3.3515 },
  { name: 'Surulere', lat: 6.5010, lng: 3.3608 },
  { name: 'Yaba', lat: 6.5158, lng: 3.3707 },
  { name: 'Agege', lat: 6.6152, lng: 3.3255 },
  { name: 'Lekki', lat: 6.4698, lng: 3.5852 },
  { name: 'Victoria Island', lat: 6.4281, lng: 3.4219 },
  { name: 'Apapa', lat: 6.4489, lng: 3.3595 },
  { name: 'Ajah', lat: 6.4698, lng: 3.6012 },
  { name: 'Ikorodu', lat: 6.6194, lng: 3.5105 },
  { name: 'Oshodi', lat: 6.5550, lng: 3.3441 },
]

const SAMPLES = [
  { title: 'Broken Streetlight', typeId: 'community', categoryId: 'streetlights', categoryLabel: 'Streetlights & Electrical', department: 'Infrastructure & Electrical', priority: 'High', status: 'In Progress' },
  { title: 'Blocked Drainage', typeId: 'community', categoryId: 'flooding', categoryLabel: 'Flooding & Drainage', department: 'Environmental Services', priority: 'Medium', status: 'Resolved' },
  { title: 'Road Damage', typeId: 'community', categoryId: 'roads', categoryLabel: 'Road Infrastructure', department: 'Public Works', priority: 'Medium', status: 'Under Review' },
  { title: 'Uncollected Waste Pile', typeId: 'community', categoryId: 'waste', categoryLabel: 'Waste Management', department: 'Waste Management', priority: 'High', status: 'Assigned' },
  { title: 'No Water Supply for 2 Weeks', typeId: 'community', categoryId: 'water', categoryLabel: 'Water Infrastructure', department: 'Water Services', priority: 'Critical', status: 'Investigation' },
  { title: 'Long Wait Times at Clinic', typeId: 'government', categoryId: 'hospital', categoryLabel: 'Public Hospital', department: 'Health Services', priority: 'Medium', status: 'Verified' },
  { title: 'Overcrowded Classroom', typeId: 'government', categoryId: 'school', categoryLabel: 'Public School', department: 'Education Services', priority: 'Normal', status: 'Received' },
  { title: 'Internet Service Not Activated After Payment', typeId: 'consumer', categoryId: 'telecom', categoryLabel: 'Telecommunications', organization: 'Service provider complaint workflow', priority: 'Medium', status: 'Submitted' },
  { title: 'Unauthorized Account Debit', typeId: 'consumer', categoryId: 'banking', categoryLabel: 'Bank / Financial Service', organization: 'Service provider complaint workflow', priority: 'High', status: 'Under Review' },
  { title: 'Order Never Delivered', typeId: 'consumer', categoryId: 'online-vendor', categoryLabel: 'Online Vendor', organization: 'Business complaint workflow', priority: 'Normal', status: 'Resolved' },
]

function randomOffset() {
  return (Math.random() - 0.5) * 0.03
}

async function main() {
  console.log('Seeding CivicPulse demo data…')

  const adminPasswordHash = await bcrypt.hash('demo1234', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@civicpulse.ng' },
    update: {},
    create: {
      fullName: 'Admin Demo',
      email: 'admin@civicpulse.ng',
      passwordHash: adminPasswordHash,
      role: 'administrator',
    },
  })
  console.log(`Admin account ready: ${admin.email} / demo1234`)

  const existingCount = await prisma.report.count()
  if (existingCount > 0) {
    console.log(`Reports already exist (${existingCount}) — skipping report seed.`)
    return
  }

  let seq = 4500
  for (let i = 0; i < 40; i++) {
    const sample = SAMPLES[i % SAMPLES.length]
    const area = AREAS[i % AREAS.length]
    seq += 1
    const referenceId = `CIV-2026-${String(seq).padStart(6, '0')}`
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 45) * 86400000)

    await prisma.report.create({
      data: {
        referenceId,
        title: sample.title,
        description: `Demo report generated for CivicPulse near ${area.name}. This illustrates the reporting and tracking flow with seeded sample data.`,
        typeId: sample.typeId,
        categoryId: sample.categoryId,
        categoryLabel: sample.categoryLabel,
        priority: sample.priority,
        status: sample.status,
        address: `${area.name} Road`,
        city: area.name,
        state: 'Lagos',
        country: 'Nigeria',
        lat: area.lat + randomOffset(),
        lng: area.lng + randomOffset(),
        department: sample.department || null,
        organization: sample.organization || null,
        evidence: [],
        reporterDisplayName: 'Citizen',
        createdAt,
        updatedAt: createdAt,
        timeline: { create: [{ status: sample.status, note: 'Seeded demo status.', timestamp: createdAt }] },
      },
    })
  }

  console.log('Seeded 40 demo reports.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
