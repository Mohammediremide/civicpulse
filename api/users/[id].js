import { prisma } from '../../lib/prisma.js'
import { getSessionFromRequest, sendError } from '../../lib/auth.js'

const SAFE_SELECT = {
  id: true, fullName: true, email: true, phone: true, role: true, suspended: true, createdAt: true,
}

const VALID_ROLES = ['citizen', 'government_staff', 'department_manager', 'administrator']

export default async function handler(req, res) {
  if (req.method !== 'PATCH') return sendError(res, 405, 'Method not allowed')

  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'administrator') {
    return sendError(res, 403, 'Only administrators can update users.')
  }

  const { id } = req.query
  const { fullName, phone, role, suspended } = req.body || {}

  if (role && !VALID_ROLES.includes(role)) {
    return sendError(res, 400, 'Invalid role.')
  }

  // Prevent an admin from locking themselves out.
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
