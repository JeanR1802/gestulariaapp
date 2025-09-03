import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { BLOCKS } from '@/app/components/editor/blocks';

// Esta es la función final. NO incluye 'use server'.
export function renderBlocksToHTML(blocks) {
  if (!Array.isArray(blocks)) return '';

  return blocks.map(block => {
    // Aseguramos que el tipo de bloque existe en nuestro registro
    const blockConfig = BLOCKS[block.type];
    
    if (!blockConfig) {
      console.warn(`AVISO: El tipo de bloque "${block.type}" existe en la base de datos pero no está registrado en 'app/components/editor/blocks/index.ts' y no será renderizado.`);
      return `<!-- Bloque de tipo '${block.type}' no reconocido -->`;
    }

    const Component = blockConfig.renderer;
    
    // Usamos React para convertir el componente a una cadena de HTML
    // Esto es seguro porque se ejecuta en un entorno de servidor (la ruta de la API)
    return ReactDOMServer.renderToStaticMarkup(<Component data={block.data} />);
  }).join('');
}