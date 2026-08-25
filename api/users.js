// Handles BOTH /api/users (list, create) and /api/users/:id (update) in one
// serverless function via Vercel's optional catch-all route ([[...id]]).
import { prisma } from '../lib/prisma.js'
import { getSessionFromRequest, hashPassword, sendError } from '../lib/auth.js'

const SAFE_SELECT = {
  id: true, fullName: true, email: true, phone: true, role: true, suspended: true, createdAt: true,
}
const VALID_ROLES = ['citizen', 'government_staff', 'department_manager', 'administrator']

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
  return sendError(res, 405, 'Method not allowed')
}

async function handleList(req, res) {
  const session = requireAdmin(req)
  if (!session) return sendError(res, 403, 'Only administrators can view users.')

  try {
    const { role, q } = req.query
    const where = {}
    if (role && role !== 'All') where.role = role
    if (q) {
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ]
    }
    const users = await prisma.user.findMany({ where, select: SAFE_SELECT, orderBy: { createdAt: 'desc' } })
    return res.status(200).json({ users })
  } catch (err) {
    console.error('list users error', err)
    return sendError(res, 500, 'Unable to load users.')
  }
}

async function handleCreate(req, res) {
  const session = requireAdmin(req)
  if (!session) return sendError(res, 403, 'Only administrators can create users.')

  try {
    const { fullName, email, phone, password, role } = req.body || {}
    if (!fullName || !email || !password || !role) {
      return sendError(res, 400, 'Full name, email, password, and role are required.')
    }
    if (password.length < 8) return sendError(res, 400, 'Password must be at least 8 characters.')

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) return sendError(res, 409, 'An account with this email already exists.')

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: { fullName, email: email.toLowerCase(), phone, passwordHash, role },
      select: SAFE_SELECT,
    })
    return res.status(201).json({ user })
  } catch (err) {
    console.error('create user error', err)
    return sendError(res, 500, 'Unable to create user.')
  }
}

async function handleUpdate(req, res, id) {
  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'administrator') {
    return sendError(res, 403, 'Only administrators can update users.')
  }

  const { fullName, phone, role, suspended } = req.body || {}
  if (role && !VALID_ROLES.includes(role)) return sendError(res, 400, 'Invalid role.')

  if (id === session.id) {
    if (suspended === true) return sendError(res, 400, "You can't suspend your own account.")
    if (role && role !== 'administrator') return sendError(res, 400, "You can't remove your own administrator access.")
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) return sendError(res, 404, 'User not found.')

    const data = {}
    if (fullName !== undefined) data.fullName = fullName
    if (phone !== undefined) data.phone = phone
    if (role !== undefined) data.role = role
    if (suspended !== undefined) data.suspended = suspended

    const user = await prisma.user.update({ where: { id }, data, select: SAFE_SELECT })
    return res.status(200).json({ user })
  } catch (err) {
    console.error('update user error', err)
    return sendError(res, 500, 'Unable to update user.')
  }
}
