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
        {/* Favicon SVG moderno con fallback */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {/* Apple touch icon y PWA icons */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:title" content="Gestularia" />
        <meta property="og:image" content="/saas-logo.jpg" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}