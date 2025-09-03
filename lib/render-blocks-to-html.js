import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { BLOCKS } from '@/app/components/editor/blocks';

// Esta función importa tu registro oficial de bloques y los convierte a HTML
export function renderBlocksToHTML(blocks) {
  if (!Array.isArray(blocks)) return '';

  return blocks.map(block => {
    const blockConfig = BLOCKS[block.type];
    
    // Si el bloque no está en el registro oficial, no lo dibuja.
    if (!blockConfig) {
      console.warn(`Block type "${block.type}" is not registered and will not be rendered.`);
      return `<!-- Bloque de tipo '${block.type}' no reconocido -->`;
    }

    const Component = blockConfig.renderer;
    
    // Usamos React para convertir el componente a una cadena de HTML en el servidor
    return ReactDOMServer.renderToStaticMarkup(<Component data={block.data} />);
  }).join('');
}