'use server'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { BLOCKS } from '@/app/components/editor/blocks'

export async function renderBlocksToHTML(blocks) {
  if (!Array.isArray(blocks)) return ''

  return blocks.map(block => {
    const blockConfig = BLOCKS[block.type]
    if (!blockConfig) {
      console.warn(`Block type "${block.type}" is not registered`)
      return `<!-- Bloque no reconocido -->`
    }
    const Component = blockConfig.renderer
    return ReactDOMServer.renderToStaticMarkup(<Component data={block.data} />)
  }).join('')
}
