import { prisma } from '../lib/prisma.js'
import { sendError } from '../lib/auth.js'

const RESOLVED = ['Resolved', 'Closed']

export default async function handler(req, res) {
  if (req.method !== 'GET') return sendError(res, 405, 'Method not allowed')

  try {
    const [total, resolved, critical, byType, byCity] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: { in: RESOLVED } } }),
      prisma.report.count({ where: { priority: 'Critical', status: { notIn: RESOLVED } } }),
      prisma.report.groupBy({ by: ['typeId'], _count: { _all: true } }),
      prisma.report.groupBy({ by: ['city'], _count: { _all: true }, orderBy: { _count: { city: 'desc' } }, take: 8 }),
    ])

    const resolutionRate = total ? Math.round((resolved / total) * 1000) / 10 : 0

    return res.status(200).json({
      total,
      resolved,
      active: total - resolved,
      critical,
      resolutionRate,
      byType: byType.map((t) => ({ typeId: t.typeId, count: t._count._all })),
      hotspots: byCity.map((c) => ({ city: c.city, count: c._count._all })),
    })
  } catch (err) {
    console.error('stats error', err)
    return sendError(res, 500, 'Unable to load stats.')
  }
}
