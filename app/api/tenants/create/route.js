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

    // --- INICIO DE LA CORRECCIÓN ---
    // Se cambia el contenido inicial a un JSON de bloques por defecto
    const tenant = await createTenant(payload.key, {
      name,
      slug,
      initialContent: JSON.stringify([
        {
          "id": Date.now() + 1,
          "type": "hero",
          "data": {
            "variant": "default",
            "title": `Bienvenido a ${name}`,
            "subtitle": "Tu sitio web está listo para ser personalizado. Edita este texto para empezar.",
            "buttonText": "Comenzar",
            "backgroundColor": "bg-slate-100",
            "titleColor": "text-slate-800",
            "subtitleColor": "text-slate-600",
            "buttonBgColor": "bg-blue-600",
            "buttonTextColor": "text-white"
          }
        },
        {
          "id": Date.now() + 2,
          "type": "text",
          "data": {
            "variant": "default",
            "content": "Este es un bloque de texto inicial. Puedes hacer clic en él para editarlo o añadir nuevos bloques desde el panel de componentes para construir tu página.",
            "backgroundColor": "bg-white",
            "textColor": "text-slate-800"
          }
        }
      ])
    })
    // --- FIN DE LA CORRECCIÓN ---
    
    return NextResponse.json({ tenant })
  } catch (error) {
    console.error('Create tenant error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}