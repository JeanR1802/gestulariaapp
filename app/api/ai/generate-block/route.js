// app/api/ai/generate-block/route.js (CORREGIDO)
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const blockPrompts = {
  hero: (description) => `Eres un asistente experto en marketing digital. Genera un título y un subtítulo para una sección de héroe de un sitio web. El negocio se describe como: "${description}". Responde únicamente con un objeto JSON en este formato: { "title": "...", "subtitle": "..." }`,
  cards: (description) => `Eres un asistente experto en marketing digital. Genera 3 ideas para tarjetas de presentación de una empresa. El negocio se describe como: "${description}". Responde únicamente con un objeto JSON en este formato: { "cards": [ { "icon": "emoji", "title": "...", "description": "..." }, { "icon": "emoji", "title": "...", "description": "..." }, { "icon": "emoji", "title": "...", "description": "..." } ] }`,
  cta: (description) => `Eres un asistente de marketing. Crea un título, subtítulo y texto para un botón de llamada a la acción (CTA). El negocio se describe como: "${description}". Responde únicamente con un objeto JSON en este formato: { "title": "...", "subtitle": "...", "buttonText": "..." }`,
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    // --- CORRECCIÓN AQUÍ: Limpia la respuesta de la IA ---
    // Extrae el contenido JSON de un posible bloque de código markdown.
    const jsonMatch = responseText.match(/```json\n(.*)\n```/s);
    if (jsonMatch && jsonMatch[1]) {
      responseText = jsonMatch[1];
    }
    // Si no hay bloque de código, asume que el texto es JSON puro.
    
    const jsonResponse = JSON.parse(responseText);
    // ----------------------------------------------------
    
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Error al generar contenido' }, { status: 500 });
  }
}