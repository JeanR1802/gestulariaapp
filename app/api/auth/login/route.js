// app/api/auth/login/route.js
import { connectToDatabase } from '@/lib/database'
import { validateAndGetKey, createToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Buscar usuario
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // Validar contraseña
    const isValid = await validateAndGetKey(email, password, user.hashedPassword)
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // Crear token
    const token = await createToken(user.uniqueKey, email)
    
    return NextResponse.json({ 
      token,
      user: { email, key: user.uniqueKey }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
