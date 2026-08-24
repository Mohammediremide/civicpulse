import { prisma } from '../../lib/prisma.js'
import { comparePassword, signToken, sendError } from '../../lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed')

  try {
    const { email, password } = req.body || {}
    if (!email || !password) return sendError(res, 400, 'Email and password are required.')

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) return sendError(res, 401, 'No account found with this email.')

    const valid = await comparePassword(password, user.passwordHash)
    if (!valid) return sendError(res, 401, 'Incorrect password.')

    if (user.suspended) {
      return sendError(res, 403, 'This account has been suspended. Contact an administrator.')
    }

    const token = signToken({ id: user.id, role: user.role })
    return res.status(200).json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('login error', err)
    return sendError(res, 500, 'Something went wrong logging in.')
  }
}
