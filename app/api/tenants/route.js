import { verifyToken } from '@/lib/auth'
import { getTenantByKey } from '@/lib/tenant'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)
    
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const tenants = await getTenantByKey(payload.key)
    
    return NextResponse.json({ tenants })
  } catch (error) {
    console.error('Get tenants error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}