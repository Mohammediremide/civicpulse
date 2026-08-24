import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET

export function signToken(payload) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not set')
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyToken(token) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not set')
  return jwt.verify(token, JWT_SECRET)
}

export function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

// Reads the Bearer token from the request, verifies it, and returns the
// decoded session — or null if missing/invalid. Does not throw.
export function getSessionFromRequest(req) {
  const header = req.headers.authorization || req.headers.Authorization
  if (!header || !header.startsWith('Bearer ')) return null
  const token = header.slice('Bearer '.length)
  try {
    return verifyToken(token)
  } catch {
    return null
  }
}

// Small helper for consistent error responses across endpoints.
export function sendError(res, status, message) {
  res.status(status).json({ error: message })
}
