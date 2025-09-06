// app/api/ai/generate-page-content/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const blockPrompts = {
  hero: (description) => `Eres un experto en marketing. Genera un título y un subtítulo para una sección Hero de un sitio web. El negocio se describe como: "${description}". Responde únicamente con un objeto JSON: { "title": "...", "subtitle": "..." }`,
  cards: (description) => `Eres un experto en marketing. Genera 3 ideas para tarjetas de servicio de un sitio web. El negocio se describe como: "${description}". Responde únicamente con un objeto JSON: { "cards": [ { "icon": "emoji", "title": "...", "description": "..." }, { "icon": "emoji", "title": "...", "description": "..." }, { "icon": "emoji", "title": "...", "description": "..." } ] }`,
  text: (description) => `Eres un experto en marketing. Genera un párrafo de texto para la página. El negocio se describe como: "${description}". Responde únicamente con un objeto JSON: { "content": "..." }`,
  cta: (description) => `Eres un experto en marketing. Genera un título, subtítulo y texto para un botón de llamada a la acción (CTA). El negocio se describe como: "${description}". Responde únicamente con un objeto JSON: { "title": "...", "subtitle": "...", "buttonText": "..." }`,
  // ... añadir prompts para otros bloques
};

export async function POST(request) {
  try {
    const { userDescription, blocks } = await request.json();

    if (!userDescription || !blocks) {
      return NextResponse.json({ error: 'Faltan userDescription o bloques' }, { status: 400 });
    }

    const generatedBlocks = [];

    for (const block of blocks) {
      const { id, type, data } = block;
      const promptFunction = blockPrompts[type];

      if (promptFunction) {
        const prompt = promptFunction(userDescription);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        let generatedData = {};
        try {
          const jsonMatch = responseText.match(/```json\n(.*)\n```/s);
          generatedData = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(responseText);
        } catch (e) {
          console.error(`Error parsing JSON for block ${id}:`, e);
          generatedData = { error: 'Failed to parse AI response' };
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
    console.error('Error in generate-page-content:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}