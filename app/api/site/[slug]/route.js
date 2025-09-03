// app/api/site/[slug]/route.js - Renderizar sitio por subdominio
import { getTenantBySlug } from '@/lib/tenant'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { slug } = params
    
    const tenant = await getTenantBySlug(slug)
    
    if (!tenant) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sitio no encontrado - Gestularia</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50 flex items-center justify-center min-h-screen">
          <div class="text-center max-w-md mx-auto p-8">
            <div class="text-6xl mb-4">🌐</div>
            <h1 class="text-2xl font-bold text-gray-900 mb-4">Sitio no encontrado</h1>
            <p class="text-gray-600 mb-6">El sitio <strong>${slug}.gestularia.com</strong> no existe o ha sido eliminado.</p>
            <a href="https://gestularia.com" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
              Crear mi sitio web
            </a>
          </div>
        </body>
        </html>`,
        { 
          status: 404,
          headers: { 'Content-Type': 'text/html' }
        }
      )
    }

    // Buscar la página específica o mostrar home
    const page = tenant.pages.find(p => p.slug === '/' && p.published) || tenant.pages[0]
    
    if (!page) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>En construcción - ${tenant.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gradient-to-br from-blue-50 to-white min-h-screen flex items-center justify-center">
          <div class="text-center max-w-md mx-auto p-8">
            <div class="text-6xl mb-4">🚧</div>
            <h1 class="text-2xl font-bold text-gray-900 mb-4">${tenant.name}</h1>
            <p class="text-gray-600 mb-6">Este sitio está siendo configurado. ¡Pronto estará disponible!</p>
            <div class="text-sm text-gray-500">
              Powered by <a href="https://gestularia.com" class="text-blue-600 hover:underline">Gestularia</a>
            </div>
          </div>
        </body>
        </html>`,
        { 
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        }
      )
    }

    // Generar HTML completo del sitio
    const html = `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${page.title} - ${tenant.name}</title>
      <meta name="description" content="${tenant.description || `Sitio web de ${tenant.name} creado con Gestularia`}">
      
      <!-- Tailwind CSS -->
      <script src="https://cdn.tailwindcss.com"></script>
      
      <!-- Custom CSS -->
      ${tenant.config.customCSS ? `<style>${tenant.config.customCSS}</style>` : ''}
      
      <!-- Favicon -->
      <link rel="icon" href="${tenant.config.favicon || '/favicon.ico'}" />
      
      <!-- SEO Meta Tags -->
      <meta property="og:title" content="${page.title} - ${tenant.name}">
      <meta property="og:description" content="${tenant.description || `Sitio web de ${tenant.name}`}">
      <meta property="og:url" content="https://${tenant.slug}.gestularia.com">
      <meta property="og:type" content="website">
      
      <!-- Analytics -->
      ${tenant.config.googleAnalytics ? `
      <!-- Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=${tenant.config.googleAnalytics}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${tenant.config.googleAnalytics}');
      </script>
      ` : ''}
    </head>
    <body>
      ${page.content}
      
      <!-- Branding Footer (removible con plan premium) -->
      ${tenant.config.showBranding !== false ? `
      <div style="position: fixed; bottom: 10px; right: 10px; z-index: 1000;">
        <a href="https://gestularia.com" target="_blank" 
           style="background: rgba(0,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 11px;">
          Powered by Gestularia
        </a>
      </div>
      ` : ''}
      
      <!-- Scripts adicionales -->
      <script>
        // Track page view
        if (typeof gtag !== 'undefined') {
          gtag('event', 'page_view', {
            'page_title': '${page.title}',
            'page_location': window.location.href,
            'custom_parameter': 'gestularia_site'
          });
        }
        
        // Console branding
        console.log('%cPowered by Gestularia 🚀', 'color: #3B82F6; font-size: 16px; font-weight: bold;');
        console.log('Create your website at https://gestularia.com');
      </script>
    </body>
    </html>`

    return new NextResponse(html, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' // Cache para mejor rendimiento
      }
    })
  } catch (error) {
    console.error('Site render error:', error)
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="es">
      <head>
        <title>Error - Gestularia</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 flex items-center justify-center min-h-screen">
        <div class="text-center max-w-md mx-auto p-8">
          <div class="text-6xl mb-4">⚠️</div>
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Error del servidor</h1>
          <p class="text-gray-600 mb-6">No se pudo cargar el sitio. Intenta nuevamente más tarde.</p>
          <a href="https://gestularia.com" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
            Ir a Gestularia
          </a>
        </div>
      </body>
      </html>`,
      { 
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}
