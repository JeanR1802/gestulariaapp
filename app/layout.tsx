// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gestularia',
  description: 'Plataforma multi-tenant con editor avanzado',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Gestularia</title>
        {/* Iconos y manifest: usa los archivos en /public */}
        <link rel="icon" href="/favicon.ico" />
        {/* Usar favicon.ico como favicon principal */}
        {/* Ajustar proporciones del logo para evitar recortes */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content="Gestularia" />
        <meta property="og:image" content="/saas-logo.jpg" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>{children}</body>
    </html>
  )
}