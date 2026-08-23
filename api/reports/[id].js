import { prisma } from '../_lib/prisma.js'
import { getSessionFromRequest, sendError } from '../_lib/auth.js'

const FULL_SELECT = {
  id: true, referenceId: true, title: true, description: true, typeId: true,
  categoryId: true, categoryLabel: true, priority: true, status: true,
  address: true, city: true, state: true, country: true, lat: true, lng: true,
  department: true, organization: true, evidence: true, reporterDisplayName: true,
  createdAt: true, updatedAt: true,
  timeline: { orderBy: { timestamp: 'asc' } },
}

async function findReport(idOrRef) {
  return prisma.report.findFirst({
    where: { OR: [{ id: idOrRef }, { referenceId: idOrRef }] },
    select: FULL_SELECT,
  })
}

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const report = await findReport(id)
    if (!report) return sendError(res, 404, 'Report not found.')
    return res.status(200).json({ report })
  }

  if (req.method === 'PATCH') {
    const session = getSessionFromRequest(req)
    if (!session || !['administrator', 'government_staff', 'department_manager'].includes(session.role)) {
      return sendError(res, 403, 'Only authorized staff can update reports.')
    }

    const existing = await prisma.report.findFirst({ where: { OR: [{ id }, { referenceId: id }] } })
    if (!existing) return sendError(res, 404, 'Report not found.')

    const { status, priority, department, note } = req.body || {}
    const data = {}
    if (priority) data.priority = priority
    if (department) data.department = department

    const timelineCreates = []
    if (status && status !== existing.status) {
      data.status = status
      timelineCreates.push({ status, note: note || `Status updated to ${status}.` })
    } else if (note) {
      timelineCreates.push({ status: existing.status, note })
    }
    if (department && department !== existing.department && !status) {
      timelineCreates.push({ status: existing.status, note: `Assigned to ${department}.` })
    }

    const updated = await prisma.report.update({
      where: { id: existing.id },
      data: {
        ...data,
        ...(timelineCreates.length ? { timeline: { create: timelineCreates } } : {}),
      },
      select: FULL_SELECT,
    })

    return res.status(200).json({ report: updated })
  }

  return sendError(res, 405, 'Method not allowed')
}
