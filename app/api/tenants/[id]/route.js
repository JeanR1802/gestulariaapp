// app/api/tenants/[id]/route.js (CORREGIDO)
import { connectToDatabase } from '@/lib/database'
import { verifyToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

//                                    👇 La corrección está aquí
export async function GET(request, { params }) {
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

    const db = await connectToDatabase()
    // Se utiliza el 'id' desestructurado de 'params'
    const { id } = params;
    const tenant = await db.collection('tenants').findOne({ 
      id: id, 
      userKey: payload.key 
    })
    
    if (!tenant) {
      return NextResponse.json({ error: 'Sitio no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ tenant })
  } catch (error) {
    console.error('Get tenant error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

//                                    👇 La corrección está aquí
export async function PUT(request, { params }) {
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

    const updates = await request.json()
    
    // Remover campos que no se deben actualizar
    delete updates._id
    delete updates.id
    delete updates.userKey
    delete updates.createdAt
    
    updates.updatedAt = new Date()

    const db = await connectToDatabase()
    // Se utiliza el 'id' desestructurado de 'params'
    const { id } = params;
    const result = await db.collection('tenants').updateOne(
      { id: id, userKey: payload.key },
      { $set: updates }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Sitio no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update tenant error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

//                                    👇 La corrección está aquí
export async function DELETE(request, { params }) {
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

    const db = await connectToDatabase()
    // Se utiliza el 'id' desestructurado de 'params'
    const { id } = params;
    const result = await db.collection('tenants').deleteOne({ 
      id: id, 
      userKey: payload.key 
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Sitio no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete tenant error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}