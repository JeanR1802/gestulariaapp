// app/api/ai/list-models/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const availableModels = data.models.map(model => ({
      name: model.name,
      supportedGenerationMethods: model.supportedGenerationMethods,
    }));

    return NextResponse.json({ models: availableModels });
  } catch (error) {
    console.error('Error listing models:', error);
    return NextResponse.json({ error: 'Failed to list models' }, { status: 500 });
  }
}