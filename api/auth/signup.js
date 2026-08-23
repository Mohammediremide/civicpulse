import { prisma } from '../_lib/prisma.js'
import { hashPassword, signToken, sendError } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed')

  try {
    const { fullName, email, phone, password } = req.body || {}

    if (!fullName || !email || !password) {
      return sendError(res, 400, 'Full name, email, and password are required.')
    }
    if (password.length < 8) {
      return sendError(res, 400, 'Password must be at least 8 characters.')
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return sendError(res, 409, 'An account with this email already exists.')
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: { fullName, email: email.toLowerCase(), phone, passwordHash, role: 'citizen' },
    })

    const token = signToken({ id: user.id, role: user.role })
    return res.status(201).json({
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('signup error', err)
    return sendError(res, 500, 'Something went wrong creating your account.')
  }
}
