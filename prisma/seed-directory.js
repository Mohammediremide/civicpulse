// Seeds the department and organization reference lists your report
// classification and admin dropdowns rely on. This is configuration data,
// not demo content — safe to re-run any time (upserts by name).
// Run with: npm run db:seed-directory
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEPARTMENTS = [
  { name: 'Public Works', lead: null },
  { name: 'Waste Management', lead: null },
  { name: 'Water Services', lead: null },
  { name: 'Environmental Services', lead: null },
  { name: 'Transport Authority', lead: null },
  { name: 'Infrastructure & Electrical', lead: null },
  { name: 'Emergency Services', lead: null },
  { name: 'Health Services', lead: null },
  { name: 'Education Services', lead: null },
]

const ORGANIZATIONS = []

async function main() {
  for (const d of DEPARTMENTS) {
    await prisma.department.upsert({ where: { name: d.name }, update: {}, create: d })
  }
  console.log(`Ensured ${DEPARTMENTS.length} department(s) exist.`)

  for (const o of ORGANIZATIONS) {
    await prisma.organization.upsert({ where: { name: o.name }, update: {}, create: o })
  }
  console.log(`Ensured ${ORGANIZATIONS.length} organization(s) exist.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
