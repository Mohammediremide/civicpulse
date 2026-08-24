import { prisma } from '../../lib/prisma.js'
import { getSessionFromRequest, sendError } from '../../lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'PATCH') return sendError(res, 405, 'Method not allowed')

  const session = getSessionFromRequest(req)
  if (!session) return sendError(res, 401, 'Not authenticated.')

  try {
    const { fullName, phone } = req.body || {}
    const data = {}
    if (fullName !== undefined && fullName.trim()) data.fullName = fullName.trim()
    if (phone !== undefined) data.phone = phone.trim() || null

    const user = await prisma.user.update({ where: { id: session.id }, data })
    return res.status(200).json({
      user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role },
    })
  } catch (err) {
    console.error('update profile error', err)
    return sendError(res, 500, 'Unable to update your profile.')
  }
}
