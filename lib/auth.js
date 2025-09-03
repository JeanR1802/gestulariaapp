// ===========================
// lib/auth.js - Sistema de llaves único sin auth persistente
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function generateUserKey(email, password) {
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)
  const uniqueKey = nanoid(32) // Llave única de 32 caracteres
  
  return {
    email,
    hashedPassword,
    uniqueKey,
    createdAt: new Date()
  }
}

export async function validateAndGetKey(email, password, storedHash) {
  return await bcrypt.compare(password, storedHash)
}

export async function createToken(uniqueKey, email) {
  return await new SignJWT({ key: uniqueKey, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}
