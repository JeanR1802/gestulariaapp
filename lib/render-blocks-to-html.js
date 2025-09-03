'use server'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { BLOCKS } from '@/app/components/editor/blocks'

// Convierte tu registro oficial de bloques a HTML en el servidor
export async function renderBlocksToHTML(blocks) {
  if (!Array.isArray(blocks)) return ''

  return blocks.map(block => {
    const blockConfig = BLOCKS[block.type]

    // Si el bloque no está registrado, no lo dibuja
    if (!blockConfig) {
      console.warn(`Block type "${block.type}" is not registered and will not be rendered.`)
      return `<!-- Bloque de tipo '${block.type}' no reconocido -->`
    }

    const Component = blockConfig.renderer

    // Renderiza el componente a HTML estático
    return ReactDOMServer.renderToStaticMarkup(<Component data={block.data} />)
  }).join('')
}
