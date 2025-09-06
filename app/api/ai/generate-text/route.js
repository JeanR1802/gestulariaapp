// app/api/ai/generate-text/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    // Acepta `prompt` y `wordCount` de la solicitud
    const { prompt, wordCount } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Elige el modelo correcto que ya has verificado
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Modifica el prompt para que sea más específico
    let finalPrompt = prompt;
    if (wordCount) {
      finalPrompt = `${prompt}. Genera una respuesta concisa de aproximadamente ${wordCount} palabras.`;
    }

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Failed to generate text' }, { status: 500 });
  }
}