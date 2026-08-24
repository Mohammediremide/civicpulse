import { prisma } from '../../lib/prisma.js'
import { getSessionFromRequest, sendError } from '../../lib/auth.js'

function requireAdmin(req) {
  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'administrator') return null
  return session
}

export default async function handler(req, res) {
  const session = requireAdmin(req)
  if (!session) return sendError(res, 403, 'Only administrators can manage departments.')

  const { id } = req.query

  if (req.method === 'PATCH') {
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

  if (req.method === 'DELETE') {
    try {
      await prisma.department.delete({ where: { id } })
      return res.status(200).json({ deleted: true })
    } catch (err) {
      console.error('delete department error', err)
      return sendError(res, 500, 'Unable to delete department.')
    }
  }

  return sendError(res, 405, 'Method not allowed')
}
