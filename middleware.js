// middleware.js - Middleware para manejar subdominio
import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Extraer el subdominio
  const parts = hostname.split('.')
  
  // Si es gestularia.com o www.gestularia.com (dominio principal)
  if (hostname === 'gestularia.com' || hostname === 'www.gestularia.com' || hostname === 'localhost:3000') {
    // Permitir acceso normal al dashboard y páginas principales
    return NextResponse.next()
  }
  
  // Si tiene subdominio: algo.gestularia.com
  if (parts.length >= 3 && (hostname.endsWith('.gestularia.com') || hostname.includes('localhost'))) {
    const subdomain = parts[0]
    
    // Evitar subdominios del sistema
    const systemSubdomains = ['www', 'api', 'admin', 'mail', 'ftp', 'app']
    if (systemSubdomains.includes(subdomain)) {
      return NextResponse.next()
    }
    
    // Redirigir a la API que renderiza el sitio del tenant
    url.pathname = `/api/site/${subdomain}${url.pathname}`
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
