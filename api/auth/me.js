import { prisma } from '../../lib/prisma.js'
import { getSessionFromRequest, sendError } from '../../lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return sendError(res, 405, 'Method not allowed')

  const session = getSessionFromRequest(req)
  if (!session) return sendError(res, 401, 'Not authenticated.')

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user) return sendError(res, 401, 'Session is no longer valid.')

  return res.status(200).json({
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
  })
}
