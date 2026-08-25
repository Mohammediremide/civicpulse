// Handles /api/departments (list, create) and /api/departments/:id
// (update, delete) in one serverless function via an optional catch-all
// route, to stay under Vercel Hobby's function-count limit.
import { prisma } from '../lib/prisma.js'
import { getSessionFromRequest, sendError } from '../lib/auth.js'

function requireAdmin(req) {
  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'administrator') return null
  return session
}

function getId(req) {
  return req.query.id || null
}

export default async function handler(req, res) {
  const id = getId(req)

  if (!id) {
    if (req.method === 'GET') return handleList(req, res)
    if (req.method === 'POST') return handleCreate(req, res)
    return sendError(res, 405, 'Method not allowed')
  }

  if (req.method === 'PATCH') return handleUpdate(req, res, id)
  if (req.method === 'DELETE') return handleDelete(req, res, id)
  return sendError(res, 405, 'Method not allowed')
}

async function handleList(req, res) {
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

async function handleUpdate(req, res, id) {
  const session = requireAdmin(req)
  if (!session) return sendError(res, 403, 'Only administrators can manage departments.')

  try {
    const { name, lead } = req.body || {}
    const data = {}
    if (name !== undefined) data.name = name.trim()
    if (lead !== undefined) data.lead = lead?.trim() || null
    const department = await prisma.department.update({ where: { id }, data })
    return res.status(200).json({ department })
  } catch (err) {
    console.error('update department error', err)
    return sendError(res, 500, 'Unable to update department.')
  }
}

async function handleDelete(req, res, id) {
  const session = requireAdmin(req)
  if (!session) return sendError(res, 403, 'Only administrators can manage departments.')

  try {
    await prisma.department.delete({ where: { id } })
    return res.status(200).json({ deleted: true })
  } catch (err) {
    console.error('delete department error', err)
    return sendError(res, 500, 'Unable to delete department.')
  }
}
