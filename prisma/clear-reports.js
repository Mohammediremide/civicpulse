import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.report.count()
  await prisma.report.deleteMany({})
  console.log(`Deleted ${count} report(s). User accounts untouched.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())