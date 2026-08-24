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
