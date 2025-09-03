// app/api/auth/verify/route.js
import { verifyToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)
    
    if (payload) {
      return NextResponse.json({ 
        valid: true, 
        user: { email: payload.email, key: payload.key }
      })
    } else {
      return NextResponse.json({ valid: false }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}