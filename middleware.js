// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // --- INICIO DE LA CORRECCIÓN ---
  // Se extrae el dominio principal sin el puerto para que funcione en localhost y producción.
  const mainDomain = process.env.NODE_ENV === 'development' 
    ? 'localhost:3000' 
    : 'gestularia.com'; // Asegúrate de que este sea tu dominio de producción

  // Si el hostname es el dominio principal, no hacemos nada y mostramos la landing page.
  if (hostname === mainDomain || hostname === `www.${mainDomain}`) {
    return NextResponse.next();
  }

  // Extraer el subdominio de manera segura
  // Reemplazamos el dominio principal del hostname para quedarnos solo con el subdominio.
  const subdomain = hostname.replace(`.${mainDomain}`, '');
  // --- FIN DE LA CORRECCIÓN ---

  // Evitar que subdominios del sistema (como 'api' o 'www') sean tratados como tenants
  const systemSubdomains = ['www', 'api', 'admin', 'mail', 'ftp', 'app'];
  if (systemSubdomains.includes(subdomain)) {
    return NextResponse.next();
  }

  // Si tenemos un subdominio válido, reescribimos la ruta a la API del sitio.
  if (subdomain) {
    url.pathname = `/api/site/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluimos las rutas de la API, assets de Next.js, y archivos estáticos.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};