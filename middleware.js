// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Expresión regular para detectar si el hostname es una IP (v4 o v6)
  const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}|\[[a-fA-F0-9:]+\]$/;

  const mainDomain = process.env.NODE_ENV === 'development'
    ? 'localhost:3000'
    : 'gestularia.com';

  // Si el hostname es el dominio principal O es una dirección IP,
  // no hacemos nada y dejamos que muestre la página de inicio.
  if (hostname === mainDomain || hostname === `www.${mainDomain}` || IP_REGEX.test(hostname.split(':')[0])) {
    return NextResponse.next();
  }

  // Extraer el subdominio de manera segura
  const subdomain = hostname.replace(`.${mainDomain}`, '');

  const systemSubdomains = ['www', 'api', 'admin', 'mail', 'ftp', 'app'];
  if (systemSubdomains.includes(subdomain)) {
    return NextResponse.next();
  }

  // Si tenemos un subdominio válido, reescribimos la ruta a la página del sitio.
  if (subdomain) {
    // Rewrite to the [slug] page route, preserving the original path
    const originalPath = url.pathname === '/' ? '' : url.pathname;
    url.pathname = `/${subdomain}${originalPath}`;
    console.log('[MIDDLEWARE] Rewriting subdomain to:', url.pathname);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y recursos públicos del middleware
    '/((?!api|_next/static|_next/image|favicon.ico|block-behaviors.js|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webmanifest|.*\\.js|.*\\.css).*)',
  ],
};