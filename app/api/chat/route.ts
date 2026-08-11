import { NextResponse } from 'next/server';
import { PredictionServiceClient } from '@google-cloud/aiplatform';

const client = new PredictionServiceClient();
const modelName = process.env.GEMINI_MODEL_NAME || 'projects/YOUR_PROJECT/locations/us-central1/models/YOUR_GEMINI_MODEL';

export async function POST(request: Request) {
  const body = await request.json();
  const messages = body.messages ?? [];

  const prompt = messages.map((message: { role: string; text: string }) => {
    const prefix = message.role === 'user' ? 'User:' : 'Assistant:';
    return `${prefix} ${message.text}`;
  }).join('\n');

  const response = await client.predict({
    endpoint: modelName,
    instances: [{ content: prompt }],
  });

  const result = response[0]?.predictions?.[0]?.content || 'Jani could not generate a response right now.';
  return NextResponse.json({ result });
}
