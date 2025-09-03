// components/SitePreview.tsx - Componente para preview en tiempo real
'use client'
import { useEffect, useRef } from 'react'

interface SitePreviewProps {
  content: string
  customCSS?: string
}

export default function SitePreview({ content, customCSS = '' }: SitePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      
      if (doc) {
        doc.open()
        doc.write(`
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>${customCSS}</style>
          </head>
          <body>
            ${content}
          </body>
          </html>
        `)
        doc.close()
      }
    }
  }, [content, customCSS])

  return (
    <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b">
        Vista previa del sitio
      </div>
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
        title="Site Preview"
      />
    </div>
  )
}