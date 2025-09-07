// app/api/ai/generate-page-content/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const blockPrompts = {
  hero: (description) => `Eres un experto en marketing. Genera un título y un subtítulo para una sección Hero de un sitio web. El negocio se describe como: "${description}". Responde únicamente con un objeto JSON: { "title": "...", "subtitle": "..." }`,
  cards: (description) => `Eres un experto en marketing. Genera 3 ideas para tarjetas de servicio para un negocio descrito como: "${description}". Responde únicamente con un objeto JSON: { "cards": [ { "icon": "emoji", "title": "...", "description": "..." }, { "icon": "emoji", "title": "...", "description": "..." }, { "icon": "emoji", "title": "...", "description": "..." } ] }`,
  text: (description) => `Eres un experto en marketing. Genera un párrafo de texto para la página. El negocio se describe como: "${description}". Responde únicamente con un objeto JSON: { "content": "..." }`,
  cta: (description) => `Eres un experto en marketing. Genera un título, subtítulo y texto para un botón de llamada a la acción (CTA) para un negocio descrito como: "${description}". Responde únicamente con un objeto JSON: { "title": "...", "subtitle": "...", "buttonText": "..." }`,
  
  // --- INICIO DE LA CORRECCIÓN DEL PROMPT ---
  catalog: (description) => `Eres un experto en e-commerce. Genera un título, subtítulo y 3 productos de ejemplo para un catálogo de un negocio descrito como: "${description}". Incluye nombre, precio y una descripción MUY BREVE (máximo 15 palabras) para cada producto. Responde únicamente con un objeto JSON: { "title": "Nuestro Catálogo", "subtitle": "Descubre nuestros productos destacados", "products": [ { "name": "...", "price": "$...", "description": "..." }, { "name": "...", "price": "$...", "description": "..." }, { "name": "...", "price": "$...", "description": "..." } ] }`,
  // --- FIN DE LA CORRECCIÓN DEL PROMPT ---

  pricing: (description) => `Eres un experto en precios. Genera un título, subtítulo y 3 planes de precios para un negocio descrito como: "${description}". Incluye 2-3 características para cada plan. Responde únicamente con un objeto JSON: { "title": "Nuestros Planes", "subtitle": "Elige la opción que mejor se adapte a ti", "plans": [ { "name": "Básico", "price": "...", "frequency": "/mes", "description": "...", "features": ["...", "..."] }, { "name": "Pro", "price": "...", "frequency": "/mes", "description": "...", "features": ["...", "..."], "highlighted": true }, { "name": "Empresarial", "price": "...", "frequency": "/mes", "description": "...", "features": ["...", "..."] } ] }`,
  faq: (description) => `Eres un experto en atención al cliente. Genera un título y 3 preguntas frecuentes con sus respuestas para un negocio descrito como: "${description}". Responde únicamente con un objeto JSON: { "title": "Preguntas Frecuentes", "items": [ { "question": "...", "answer": "..." }, { "question": "...", "answer": "..." }, { "question": "...", "answer": "..." } ] }`,
  testimonial: (description) => `Eres un experto en marketing. Genera un título y 2 testimonios de clientes para un negocio descrito como: "${description}". Incluye la cita, el autor y su cargo. Responde únicamente con un objeto JSON: { "title": "Lo que dicen nuestros clientes", "testimonials": [ { "quote": "...", "author": "...", "role": "..." }, { "quote": "...", "author": "...", "role": "..." } ] }`,
  team: (description) => `Eres un experto en recursos humanos. Genera un título, un subtítulo y 3 miembros de equipo de ejemplo para un negocio descrito como: "${description}". Incluye nombre y cargo. Responde únicamente con un objeto JSON: { "title": "Nuestro Equipo", "subtitle": "Conoce a los expertos detrás de nuestro éxito", "members": [ { "name": "...", "role": "..." }, { "name": "...", "role": "..." }, { "name": "...", "role": "..." } ] }`,
};

export async function POST(request) {
  try {
    const { userDescription, blocks } = await request.json();

    if (!userDescription || !blocks) {
      return NextResponse.json({ error: 'Faltan userDescription o bloques' }, { status: 400 });
    }

    const generatedBlocks = [];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    for (const block of blocks) {
      const { id, type, data } = block;
      const promptFunction = blockPrompts[type];

      if (promptFunction) {
        const prompt = promptFunction(userDescription);
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        
        let generatedData = {};
        try {
          const jsonMatch = responseText.match(/```json\n(.*)\n```/s);
          responseText = jsonMatch ? jsonMatch[1] : responseText;
          generatedData = JSON.parse(responseText);
        } catch (e) {
          console.error(`Error parseando JSON para el bloque ${id} (${type}):`, responseText, e);
          generatedData = { error: 'No se pudo interpretar la respuesta de la IA' };
        }
        
        generatedBlocks.push({
          ...block,
          data: { ...data, ...generatedData }
        });
      } else {
        generatedBlocks.push(block);
      }
    }

    return NextResponse.json({ blocks: generatedBlocks });

  } catch (error) {
    console.error('Error en generate-page-content:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}