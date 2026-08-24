import { prisma } from '../../lib/prisma.js'
import { getSessionFromRequest, sendError } from '../../lib/auth.js'

function requireAdmin(req) {
  const session = getSessionFromRequest(req)
  if (!session || session.role !== 'administrator') return null
  return session
}

export default async function handler(req, res) {
  const session = requireAdmin(req)
  if (!session) return sendError(res, 403, 'Only administrators can manage organizations.')

  const { id } = req.query

  if (req.method === 'PATCH') {
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

  if (req.method === 'DELETE') {
    try {
      await prisma.organization.delete({ where: { id } })
      return res.status(200).json({ deleted: true })
    } catch (err) {
      console.error('delete organization error', err)
      return sendError(res, 500, 'Unable to delete organization.')
    }
  }

  return sendError(res, 405, 'Method not allowed')
}
