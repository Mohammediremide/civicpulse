// Handles /api/organizations (list, create) and /api/organizations/:id
// (update, delete) in one serverless function via an optional catch-all
// route, to stay under Vercel Hobby's function-count limit.
import { prisma } from '../../lib/prisma.js'
import { getSessionFromRequest, sendError } from '../../lib/auth.js'

function requireAdmin(req) {
  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'administrator') return null
  return session
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

  if (req.method === 'PATCH') return handleUpdate(req, res, id)
  if (req.method === 'DELETE') return handleDelete(req, res, id)
  return sendError(res, 405, 'Method not allowed')
}

async function handleList(req, res) {
  const session = getSessionFromRequest(req)
  if (!session) return sendError(res, 401, 'Not authenticated.')

  try {
    const organizations = await prisma.organization.findMany({ orderBy: { name: 'asc' } })
    return res.status(200).json({ organizations })
  } catch (err) {
    console.error('list organizations error', err)
    return sendError(res, 500, 'Unable to load organizations.')
  }
}

async function handleCreate(req, res) {
  const session = requireAdmin(req)
  if (!session) return sendError(res, 403, 'Only administrators can add organizations.')

  try {
    const { name, type } = req.body || {}
    if (!name?.trim()) return sendError(res, 400, 'Organization name is required.')
    if (!type?.trim()) return sendError(res, 400, 'Organization type is required.')

    const existing = await prisma.organization.findUnique({ where: { name: name.trim() } })
    if (existing) return sendError(res, 409, 'An organization with this name already exists.')

    const organization = await prisma.organization.create({ data: { name: name.trim(), type: type.trim() } })
    return res.status(201).json({ organization })
  } catch (err) {
    console.error('create organization error', err)
    return sendError(res, 500, 'Unable to create organization.')
  }
}

async function handleUpdate(req, res, id) {
  const session = requireAdmin(req)
  if (!session) return sendError(res, 403, 'Only administrators can manage organizations.')

  try {
    const { name, type } = req.body || {}
    const data = {}
    if (name !== undefined) data.name = name.trim()
    if (type !== undefined) data.type = type.trim()
    const organization = await prisma.organization.update({ where: { id }, data })
    return res.status(200).json({ organization })
  } catch (err) {
    console.error('update organization error', err)
    return sendError(res, 500, 'Unable to update organization.')
  }
}

async function handleDelete(req, res, id) {
  const session = requireAdmin(req)
  if (!session) return sendError(res, 403, 'Only administrators can manage organizations.')

  try {
    await prisma.organization.delete({ where: { id } })
    return res.status(200).json({ deleted: true })
  } catch (err) {
    console.error('delete organization error', err)
    return sendError(res, 500, 'Unable to delete organization.')
  }
}
