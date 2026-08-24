// Deletes all reports (and their timeline entries, via cascade) without
// touching user accounts — so your admin login still works afterward.
// Run with: npm run db:clear-reports
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.report.count()
  await prisma.report.deleteMany({})
  console.log(`Deleted ${count} report(s) and their timeline entries. User accounts were left untouched.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
