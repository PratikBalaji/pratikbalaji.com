import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RESUME_TEXT = `
PRATIK BALAJI — RESUME
=======================
Contact: balajipratik8@gmail.com | (346) 446-8717 | Philadelphia, PA
LinkedIn: linkedin.com/in/pratikbalaji | GitHub: github.com/PratikBalaji

EDUCATION
Temple University, College of Science and Technology — B.S. Computer Science (Expected May 2027), GPA: 3.55

EXPERIENCE
1. IoT Python Developer — Yan IT Solution (July–Sep 2025, Remote)
   • Built Python pipelines to process IoT sensor data from MongoDB, monitor device health, and predict refill needs with ML (Linear Regression)
   • Developed FastAPI web service and Chart.js dashboard for real-time monitoring
   • Deployed to Azure App Services

2. DJ Assistant — Nataraj Beats (Mar–Dec 2025, Philadelphia)
   • Sound system configuration, lighting, playlist coordination
   • Designed and launched natarajbeats.com — increased client engagement by 40%

SKILLS
Languages: Python, Java, SQL, JavaScript, TypeScript, LaTeX
Frontend/Backend: React, Next.js, TailwindCSS, Node.js, MongoDB, PostgreSQL, FastAPI
AI/ML: Machine Learning, Generative AI, AI Agents
Tools: Git, Docker, AWS
Spoken: Tamil, English, Hindi (fluent), Spanish (novice)

CERTIFICATIONS
Google Data Analytics, Databricks Generative AI, Santander Business Intelligence, Google IT Automation with Python, WhitehatJr Instructor Certification

PROJECTS
• StartupSuccess_Prediction — ML model to predict startup success using Python, scikit-learn, and Jupyter notebooks
`;

const SYSTEM_PROMPT = `You are Pratik Balaji's AI Resume Assistant on his personal portfolio website. You help visitors learn about Pratik's background, skills, and experience. Be friendly, concise, and professional.

Here is Pratik's full resume for reference:
${RESUME_TEXT}

IMPORTANT RULES:
- If someone asks for Pratik's resume, share the key details from the resume above in a well-formatted way
- Keep responses under 150 words unless asked for detail or the full resume
- If asked something unrelated to Pratik, politely redirect
- Be enthusiastic about Pratik's accomplishments`;

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const response = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: apiMessages,
        stream: true,
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
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
