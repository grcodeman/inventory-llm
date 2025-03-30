import { NextResponse } from 'next/server';
const OpenAI = require('openai');

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(request) {
  console.log("DEBUG: got post :)");
  try {
    const body = await request.json();
    const { messages } = body;
    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      max_tokens: 512,
      temperature: 0.3,
      top_p: 0.95,
      messages,
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return NextResponse.json({ error: "Error calling OpenAI API" }, { status: 500 });
  }
}
