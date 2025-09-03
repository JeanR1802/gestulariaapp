// lib/tenant.js - Actualizado para subdominio
import { connectToDatabase } from './database'
import { nanoid } from 'nanoid'

export async function createTenant(userKey, tenantData) {
  const db = await connectToDatabase()
  
  const tenant = {
    id: nanoid(16),
    userKey, // Asociado a la llave del usuario
    name: tenantData.name,
    slug: tenantData.slug, // Este será el subdominio
    description: tenantData.description || `Sitio web de ${tenantData.name}`,
    domain: `${tenantData.slug}.gestularia.com`, // Dominio completo
    config: {
      theme: 'default',
      customCSS: '',
      favicon: null,
      googleAnalytics: null,
      showBranding: true, // Se puede quitar con plan premium
      ...tenantData.config
    },
    pages: [
      {
        id: 'home',
        title: tenantData.name,
        slug: '/',
        content: tenantData.initialContent || `<div class="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <div class="container mx-auto px-4 py-16">
            <div class="text-center max-w-4xl mx-auto">
              <h1 class="text-5xl font-bold text-gray-900 mb-6">Bienvenido a ${tenantData.name}</h1>
              <p class="text-xl text-gray-600 mb-8">Tu sitio web está listo para ser personalizado</p>
              <div class="grid md:grid-cols-3 gap-8 mt-16">
                <div class="text-center p-6">
                  <div class="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-blue-600 text-2xl">🚀</span>
                  </div>
                  <h3 class="text-lg font-semibold mb-2">Rápido</h3>
                  <p class="text-gray-600">Sitio optimizado para velocidad</p>
                </div>
                <div class="text-center p-6">
                  <div class="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-green-600 text-2xl">✨</span>
                  </div>
                  <h3 class="text-lg font-semibold mb-2">Moderno</h3>
                  <p class="text-gray-600">Diseño actual y profesional</p>
                </div>
                <div class="text-center p-6">
                  <div class="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-purple-600 text-2xl">📱</span>
                  </div>
                  <h3 class="text-lg font-semibold mb-2">Responsive</h3>
                  <p class="text-gray-600">Se ve perfecto en cualquier dispositivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>`,
        published: true
      }
    ],
    stats: {
      views: 0,
      visitors: 0,
      lastView: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  await db.collection('tenants').insertOne(tenant)
  return tenant
}

export async function getTenantByKey(userKey) {
  const db = await connectToDatabase()
  return await db.collection('tenants').find({ userKey }).toArray()
}

export async function getTenantBySlug(slug) {
  const db = await connectToDatabase()
  
  try {
    // Primero buscar sin actualizar para verificar que existe
    const tenant = await db.collection('tenants').findOne({ slug })
    
    if (!tenant) {
      return null // No existe el tenant
    }
    
    // Si existe, incrementar contador de vistas
    const updatedTenant = await db.collection('tenants').findOneAndUpdate(
      { slug },
      { 
        $inc: { 'stats.views': 1 },
        $set: { 'stats.lastView': new Date() }
      },
      { returnDocument: 'after' }
    )
    
    return updatedTenant?.value || tenant // Retornar el actualizado o el original
  } catch (error) {
    console.error('Error in getTenantBySlug:', error)
    // En caso de error, intentar solo buscar sin actualizar
    try {
      return await db.collection('tenants').findOne({ slug })
    } catch (fallbackError) {
      console.error('Fallback error in getTenantBySlug:', fallbackError)
      return null
    }
  }
}

export async function updateTenant(tenantId, userKey, updates) {
  const db = await connectToDatabase()
  
  // Remover campos que no se deben actualizar
  delete updates._id
  delete updates.id
  delete updates.userKey
  delete updates.createdAt
  delete updates.stats
  
  updates.updatedAt = new Date()

  return await db.collection('tenants').updateOne(
    { id: tenantId, userKey },
    { $set: updates }
  )
}
