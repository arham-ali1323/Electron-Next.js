import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: Request) {
  const body = await request.json();
  const messages = body.messages ?? [];

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ result: 'Jani needs his API key to think! Please set GEMINI_API_KEY in your environment.' }, { status: 500 });
  }

  try {
    const chatHistory = messages.map((message: { role: string; text: string }) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.text }]
    }));

    const chat = model.startChat({
      history: chatHistory.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.text);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text || 'Jani could not generate a response right now.' });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ result: 'Jani is having trouble connecting right now. Please try again!' }, { status: 500 });
  }
}
