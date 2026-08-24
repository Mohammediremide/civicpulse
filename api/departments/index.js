import { prisma } from '../../lib/prisma.js'
import { getSessionFromRequest, sendError } from '../../lib/auth.js'

function requireAdmin(req) {
  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'administrator') return null
  return session
}

export default async function handler(req, res) {
  if (req.method === 'GET') return handleList(req, res)
  if (req.method === 'POST') return handleCreate(req, res)
  return sendError(res, 405, 'Method not allowed')
}

async function handleList(req, res) {
  // Any authenticated staff member can view the department list (needed for
  // report assignment dropdowns) — not admin-only to read.
  const session = getSessionFromRequest(req)
  if (!session) return sendError(res, 401, 'Not authenticated.')

  try {
    const departments = await prisma.department.findMany({ orderBy: { name: 'asc' } })
    return res.status(200).json({ departments })
  } catch (err) {
    console.error('list departments error', err)
    return sendError(res, 500, 'Unable to load departments.')
  }
}

async function handleCreate(req, res) {
  const session = requireAdmin(req)
  if (!session) return sendError(res, 403, 'Only administrators can add departments.')

  try {
    const { name, lead } = req.body || {}
    if (!name?.trim()) return sendError(res, 400, 'Department name is required.')

    const existing = await prisma.department.findUnique({ where: { name: name.trim() } })
    if (existing) return sendError(res, 409, 'A department with this name already exists.')

    const department = await prisma.department.create({ data: { name: name.trim(), lead: lead?.trim() || null } })
    return res.status(201).json({ department })
  } catch (err) {
    console.error('create department error', err)
    return sendError(res, 500, 'Unable to create department.')
  }
}
