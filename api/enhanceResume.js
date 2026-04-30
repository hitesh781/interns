import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge',
};

// Simple in-memory map for basic rate limiting
// Note: In Edge, this memory is per-isolate. 
// For strict global rate limiting, use Vercel KV.
const rateLimitMap = new Map();

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  // --- 1. Rate Limiting ---
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute
  const maxRequests = 5;

  if (rateLimitMap.has(ip)) {
    const data = rateLimitMap.get(ip);
    if (now - data.timestamp < limitWindow) {
      if (data.count >= maxRequests) {
        return new Response(JSON.stringify({ error: 'Too many requests. Please wait a minute.' }), { 
          status: 429,
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      data.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
  }

  try {
    const { currentDesc, roleOrTitle } = await req.json();

    if (!currentDesc) {
      return new Response(JSON.stringify({ error: 'Description is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key not configured' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // --- 2. Prompt Improvement ---
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Act as a professional resume expert.

Rewrite this for ${roleOrTitle || 'Not specified'}:
"${currentDesc}"

- Use bullet points
- Add action verbs
- Keep it ATS optimized
- Make it concise and impactful`;
    
    // --- 3. Streaming Response ---
    const result = await model.generateContentStream(prompt);
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            // Clean markdown bold tags
            const cleanText = chunkText.replace(/\*\*/g, '');
            controller.enqueue(encoder.encode(cleanText));
          }
          controller.close();
        } catch (e) {
          console.error('Streaming error', e);
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      }
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to enhance text using AI' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
