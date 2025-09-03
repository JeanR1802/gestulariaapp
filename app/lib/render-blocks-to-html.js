// Usamos 'use server' para indicar que este código solo se ejecuta en el servidor,
// lo cual es una buena práctica en Next.js App Router.
'use server';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
// Importamos el REGISTRO OFICIAL de bloques. Esta es la clave.
import { BLOCKS } from '@/app/components/editor/blocks';

export function renderBlocksToHTML(blocks) {
  if (!Array.isArray(blocks)) return '';

  return blocks.map(block => {
    const blockConfig = BLOCKS[block.type];
    
    // Si el bloque no está en el registro oficial, no lo dibuja.
    if (!blockConfig) {
      console.warn(`AVISO: El tipo de bloque "${block.type}" existe en la base de datos pero no está registrado en 'app/components/editor/blocks/index.ts' y no será renderizado.`);
      return `<!-- Bloque de tipo '${block.type}' no reconocido -->`;
    }

    const Component = blockConfig.renderer;
    
    // Usamos React para convertir el componente a una cadena de HTML
    return ReactDOMServer.renderToStaticMarkup(<Component data={block.data} />);
  }).join('');
}