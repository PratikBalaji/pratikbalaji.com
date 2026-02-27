import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Pratik Balaji's AI Resume Assistant. You help visitors learn about Pratik's background, skills, and experience. Be friendly, concise, and professional.

About Pratik Balaji:
- Computer Science student at Temple University (Expected May 2027), GPA: 3.55
- Located in Philadelphia, PA
- Email: balajipratik8@gmail.com | Phone: (346) 446-8717

Experience:
1. IoT Python Developer at Yan IT Solution (July 2025 – September 2025, Remote)
   - Built Python pipelines to process IoT sensor data from MongoDB
   - Developed FastAPI web service and Chart.js dashboard for real-time monitoring
   - Used Linear Regression for predictive device maintenance
   - Deployed to Azure App Services

2. DJ Assistant at Nataraj Beats (Mar 2025 – December 2025, Philadelphia)
   - Sound system configuration, lighting, and playlist coordination
   - Designed and launched natarajbeats.com website

3. Customer Service Associate at Regal Cinemas (Aug 2023 – May 2024, Downingtown, PA)
   - POS operations, food safety compliance, theater inspections

Skills:
- Languages: Python, Java, SQL, JavaScript, TypeScript, LaTeX
- Frontend/Backend: React, Next.js, TailwindCSS, Node.js, MongoDB, PostgreSQL, FastAPI
- AI/ML: Machine Learning, Generative AI, AI Agents
- Tools: Git, Docker, AWS
- Spoken Languages: Tamil, English, Hindi (all fluent), Spanish (novice)

Certifications: Google Data Analytics, Databricks Generative AI, Santander Business Intelligence, Google IT Automation with Python, WhitehatJr Instructor Certification

Keep responses under 150 words unless asked for detail. If asked something unrelated to Pratik, politely redirect.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Convert messages to Gemini format
    const geminiMessages = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "Understood! I'm Pratik's AI Resume Assistant. How can I help you learn about Pratik?" }] },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform Gemini SSE to OpenAI-compatible SSE format
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (content) {
              const openAIFormat = {
                choices: [{ delta: { content } }],
              };
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify(openAIFormat)}\n\n`)
              );
            }
          } catch {
            // skip malformed chunks
          }
        }
      },
      flush(controller) {
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
      },
    });

    return new Response(response.body!.pipeThrough(transformStream), {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
