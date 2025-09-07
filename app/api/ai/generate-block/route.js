// app/api/ai/generate-block/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const blockPrompts = {
  hero: (description) => `Eres un asistente experto en marketing digital. Genera un título y un subtítulo para una sección de héroe de un sitio web. El negocio se describe como: "${description}". Responde únicamente con un objeto JSON en este formato: { "title": "...", "subtitle": "..." }`,
  cards: (description) => `Eres un asistente experto en marketing digital. Genera 3 ideas para tarjetas de presentación de una empresa. El negocio se describe como: "${description}". Responde únicamente con un objeto JSON en este formato: { "cards": [ { "icon": "emoji", "title": "...", "description": "..." }, { "icon": "emoji", "title": "...", "description": "..." }, { "icon": "emoji", "title": "...", "description": "..." } ] }`,
  cta: (description) => `Eres un asistente de marketing. Crea un título, subtítulo y texto para un botón de llamada a la acción (CTA). El negocio se describe como: "${description}". Responde únicamente con un objeto JSON en este formato: { "title": "...", "subtitle": "...", "buttonText": "..." }`,
  text: (description) => `Eres un asistente de marketing. Genera un párrafo de texto para una página web sobre un negocio descrito como: "${description}". Responde únicamente con un objeto JSON en este formato: { "content": "..." }`,
  pricing: (description) => `Eres un experto en marketing y precios. Genera un título, un subtítulo y 3 planes de precios para un negocio descrito como: "${description}". Incluye características para cada plan. Responde únicamente con un objeto JSON en este formato: { "title": "...", "subtitle": "...", "plans": [ { "name": "...", "price": "...", "frequency": "/mes", "description": "...", "features": ["...", "..."], "buttonText": "Elegir Plan" }, { "name": "...", "price": "...", "frequency": "/mes", "description": "...", "features": ["...", "..."], "buttonText": "Elegir Plan", "highlighted": true }, { "name": "...", "price": "...", "frequency": "/mes", "description": "...", "features": ["...", "..."], "buttonText": "Elegir Plan" } ] }`,
  faq: (description) => `Eres un experto en atención al cliente. Genera un título y 3 preguntas frecuentes con sus respuestas para un negocio descrito como: "${description}". Responde únicamente con un objeto JSON en este formato: { "title": "Preguntas Frecuentes", "items": [ { "question": "...", "answer": "..." }, { "question": "...", "answer": "..." }, { "question": "...", "answer": "..." } ] }`,
  catalog: (description) => `Eres un experto en e-commerce. Genera un título, subtítulo y 2 productos de ejemplo para un catálogo de un negocio descrito como: "${description}". Incluye nombre, precio y descripción para cada producto. Responde únicamente con un objeto JSON en este formato: { "title": "Nuestro Catálogo", "subtitle": "...", "products": [ { "name": "...", "price": "$...", "description": "...", "buttonText": "Comprar Ahora" }, { "name": "...", "price": "$...", "description": "...", "buttonText": "Comprar Ahora" } ] }`,
  testimonial: (description) => `Eres un experto en marketing. Genera 2 testimonios de clientes para un negocio descrito como: "${description}". Incluye cita, autor y cargo. Responde únicamente con un objeto JSON en este formato: { "testimonials": [ { "quote": "...", "author": "...", "role": "..." }, { "quote": "...", "author": "...", "role": "..." } ] }`,
  team: (description) => `Eres un experto en recursos humanos. Genera un título, subtítulo y 2 miembros de equipo de ejemplo para un negocio descrito como: "${description}". Incluye nombre y cargo. Responde únicamente con un objeto JSON en este formato: { "title": "Nuestro Equipo", "subtitle": "...", "members": [ { "name": "...", "role": "..." }, { "name": "...", "role": "..." } ] }`,
};

export async function POST(request) {
  try {
    const { blockType, userDescription } = await request.json();

    if (!blockType || !userDescription) {
      return NextResponse.json({ error: 'blockType y userDescription son requeridos' }, { status: 400 });
    }
    
    const promptFunction = blockPrompts[blockType];
    if (!promptFunction) {
      return NextResponse.json({ error: `Tipo de bloque '${blockType}' no soportado` }, { status: 400 });
    }

    const prompt = promptFunction(userDescription);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    const jsonMatch = responseText.match(/```json\n(.*)\n```/s);
    if (jsonMatch && jsonMatch[1]) {
      responseText = jsonMatch[1];
    }
    
    const jsonResponse = JSON.parse(responseText);
    
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Error al generar contenido' }, { status: 500 });
  }
}