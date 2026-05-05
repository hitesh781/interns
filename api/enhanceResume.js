import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge',
};

// Simple in-memory map for basic rate limiting
// Note: In Edge, this memory is per-isolate. 
// For strict global rate limiting, use Vercel KV.
const rateLimitMap = new Map();

// Helper for sending CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Update to specific domain in production
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req) {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders } 
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
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '60',
            ...corsHeaders 
          } 
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
    const body = await req.json();
    const { currentDesc, roleOrTitle } = body;

    // --- 2. Input Validation & Sanitization ---
    if (!currentDesc || typeof currentDesc !== 'string' || currentDesc.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Description is required and must be valid text.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }

    if (currentDesc.length > 5000) {
      return new Response(JSON.stringify({ error: 'Description is too long. Maximum 5000 characters allowed.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Critical Error: GEMINI_API_KEY is not configured in the environment.");
      return new Response(JSON.stringify({ error: 'Internal Server Error. API Key not configured.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      });
    }

    // --- 3. Prompt Improvement ---
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Sanitize the inputs before injecting into prompt
    const safeRole = roleOrTitle ? String(roleOrTitle).substring(0, 100) : 'Not specified';
    const safeDesc = String(currentDesc).replace(/[<>{}]/g, ''); // basic injection prevention
    
    const prompt = `Act as a professional resume expert.

Rewrite this for ${safeRole}:
"${safeDesc}"

- Use bullet points
- Add action verbs
- Keep it ATS optimized
- Make it concise and impactful`;
    
    // --- 4. Streaming Response ---
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
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to enhance text using AI' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders } 
    });
  }
}
