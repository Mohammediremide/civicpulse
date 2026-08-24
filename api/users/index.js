import { prisma } from '../../lib/prisma.js'
import { getSessionFromRequest, hashPassword, sendError } from '../../lib/auth.js'

const SAFE_SELECT = {
  id: true, fullName: true, email: true, phone: true, role: true, suspended: true, createdAt: true,
}

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
