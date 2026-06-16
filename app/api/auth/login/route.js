// app/api/auth/login/route.js
import { connectToDatabase } from '@/lib/database'
import { validateAndGetKey, createToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

const normalizeEmail = (value) => value?.trim().toLowerCase()
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    const emailNormalized = normalizeEmail(email)
    
    if (!emailNormalized || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Buscar usuario
    const emailRegex = new RegExp(`^${escapeRegex(emailNormalized)}$`, 'i')
    const user = await db.collection('users').findOne({ email: emailRegex })
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // Validar contraseña
    const isValid = await validateAndGetKey(email, password, user.hashedPassword)
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // Crear token
    const token = await createToken(user.uniqueKey, user.email)
    
    return NextResponse.json({ 
      token,
      user: { email: user.email, key: user.uniqueKey }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
