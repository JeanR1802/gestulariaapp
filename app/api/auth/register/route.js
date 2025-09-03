// app/api/auth/register/route.js
import { connectToDatabase } from '@/lib/database'
import { generateUserKey, createToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Verificar si el usuario ya existe
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 })
    }

    // Crear usuario con llave única
    const userData = await generateUserKey(email, password)
    await db.collection('users').insertOne(userData)
    
    // Crear token
    const token = await createToken(userData.uniqueKey, email)
    
    return NextResponse.json({ 
      token,
      user: { email, key: userData.uniqueKey }
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
