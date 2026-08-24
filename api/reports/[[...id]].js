// Handles BOTH /api/reports (list, create) and /api/reports/:id (get, update)
// in a single serverless function via Vercel's optional catch-all route
// ([[...id]]) — keeps the total function count under the Hobby plan's limit.
import { prisma } from '../../lib/prisma.js'
import { getSessionFromRequest, sendError } from '../../lib/auth.js'
import { classifyComplaint, nextReferenceId } from '../../lib/taxonomy.js'

const SELECT = {
  id: true, referenceId: true, title: true, description: true, typeId: true,
  categoryId: true, categoryLabel: true, priority: true, status: true,
  address: true, city: true, state: true, country: true, lat: true, lng: true,
  department: true, organization: true, evidence: true, reporterDisplayName: true,
  createdAt: true, updatedAt: true,
  timeline: { orderBy: { timestamp: 'asc' } },
}

function getId(req) {
  const parts = req.query.id
  if (!parts) return null
  return Array.isArray(parts) ? parts[0] : parts
}

export default async function handler(req, res) {
  const id = getId(req)

  if (!id) {
    if (req.method === 'GET') return handleList(req, res)
    if (req.method === 'POST') return handleCreate(req, res)
    return sendError(res, 405, 'Method not allowed')
  }

  if (req.method === 'GET') return handleGetOne(req, res, id)
  if (req.method === 'PATCH') return handleUpdate(req, res, id)
  return sendError(res, 405, 'Method not allowed')
}

async function handleList(req, res) {
  try {
    const { type, status, priority, department, city, q, page = '1', pageSize = '20' } = req.query

    const where = {}
    if (type && type !== 'All') where.typeId = type
    if (status && status !== 'All') where.status = status
    if (priority && priority !== 'All') where.priority = priority
    if (department && department !== 'All') where.department = department
    if (city && city !== 'All') where.city = city
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { referenceId: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
      ]
    }

    const take = Math.min(100, Number(pageSize) || 20)
    const skip = (Math.max(1, Number(page) || 1) - 1) * take

    const [reports, total] = await Promise.all([
      prisma.report.findMany({ where, select: SELECT, orderBy: { createdAt: 'desc' }, take, skip }),
      prisma.report.count({ where }),
    ])

    return res.status(200).json({ reports, total, page: Number(page), pageSize: take })
  } catch (err) {
    console.error('list reports error', err)
    return sendError(res, 500, 'Unable to load reports.')
  }
}

async function handleCreate(req, res) {
  try {
    const session = getSessionFromRequest(req)
    const body = req.body || {}
    const { typeId, title, description, priority, location, evidence, reporterName } = body

    if (!typeId || !title || !description || !location?.address || !location?.city) {
      return sendError(res, 400, 'Missing required report fields.')
    }

    const classification = classifyComplaint(typeId, description || title)
    const count = await prisma.report.count()
    const referenceId = nextReferenceId(5300 + count + 1)

    const report = await prisma.report.create({
      data: {
        referenceId,
        title,
        description,
        typeId,
        categoryId: classification.categoryId,
        categoryLabel: classification.categoryLabel,
        priority: priority || 'Medium',
        status: 'Submitted',
        address: location.address,
        city: location.city,
        state: location.state || 'Lagos',
        country: location.country || 'Nigeria',
        lat: location.lat ?? null,
        lng: location.lng ?? null,
        department: classification.department,
        organization: classification.organization,
        evidence: evidence || [],
        reporterId: session?.id ?? null,
        reporterDisplayName: reporterName || 'Citizen',
        timeline: { create: [{ status: 'Submitted', note: 'Report submitted by citizen.' }] },
      },
      select: SELECT,
    })

    return res.status(201).json({ report })
  } catch (err) {
    console.error('create report error', err)
    return sendError(res, 500, 'Unable to submit report.')
  }
}

async function handleGetOne(req, res, id) {
  const report = await prisma.report.findFirst({ where: { OR: [{ id }, { referenceId: id }] }, select: SELECT })
  if (!report) return sendError(res, 404, 'Report not found.')
  return res.status(200).json({ report })
}

async function handleUpdate(req, res, id) {
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
    select: SELECT,
  })

  return res.status(200).json({ report: updated })
}
