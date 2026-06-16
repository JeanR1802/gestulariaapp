// app/api/auth/register/route.js
import { connectToDatabase } from '@/lib/database'
import { generateUserKey, createToken } from '@/lib/auth'
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
    
    // Verificar si el usuario ya existe
    const emailRegex = new RegExp(`^${escapeRegex(emailNormalized)}$`, 'i')
    const existingUser = await db.collection('users').findOne({ email: emailRegex })
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 })
    }

    // Crear usuario con llave única
    const userData = await generateUserKey(emailNormalized, password)
    await db.collection('users').insertOne(userData)
    
    // Crear token
    const token = await createToken(userData.uniqueKey, userData.email)
    
    return NextResponse.json({ 
      token,
      user: { email: userData.email, key: userData.uniqueKey }
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
