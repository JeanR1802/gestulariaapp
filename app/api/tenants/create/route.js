// app/api/tenants/create/route.js
import { verifyToken } from '@/lib/auth'
import { createTenant } from '@/lib/tenant'
import { NextResponse } from 'next/server'

export async function POST(request) {
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

    const { name, slug } = await request.json()
    
    if (!name || !slug) {
      return NextResponse.json({ error: 'Nombre y slug requeridos' }, { status: 400 })
    }

    // Verificar que el slug no exista
    const { getTenantBySlug } = await import('@/lib/tenant')
    const existingTenant = await getTenantBySlug(slug)
    if (existingTenant) {
      return NextResponse.json({ error: 'Esta URL ya está en uso' }, { status: 400 })
    }

    const tenant = await createTenant(payload.key, {
      name,
      slug,
      initialContent: `<div class="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div class="container mx-auto px-4 py-16">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Bienvenido a ${name}</h1>
            <p class="text-xl text-gray-600">Tu sitio web está listo para ser personalizado</p>
          </div>
        </div>
      </div>`
    })
    
    return NextResponse.json({ tenant })
  } catch (error) {
    console.error('Create tenant error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
