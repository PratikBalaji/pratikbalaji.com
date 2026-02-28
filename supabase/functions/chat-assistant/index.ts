import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RESUME_TEXT = `PRATIK BALAJI
Philadelphia, PA 19122
(346) 446-8717 | balajipratik8@gmail.com | LinkedIn: linkedin.com/in/pratikbalaji | GitHub: github.com/PratikBalaji | Kaggle | Portfolio: pratikbalaji.lovable.app

EDUCATION
Temple University - Philadelphia, Pennsylvania
Bachelor of Science, Data Science with Computational Analytics (Expected Graduation: 2027)
Relevant Coursework: Calculus I-III, Mathematical Concepts In Computing I-II, Data Structures & Algorithms, Computer Systems & Low-Level Programming, Principles Of Data Science(s), Linear Algebra, Principles of Database Systems, Probability Theory
Extracurriculars: Temple Data Analytics Club, Temple Data Science Community, Research Scholars Club

SKILLS
Programming Languages: Python, C, C++, Java, JavaScript, SQL, R, Bash
Technical Stack: TensorFlow, PyTorch, MongoDB, scikit-learn, Pandas, NumPy, Flask, FastAPI, Docker, Git
Adobe Tools: Adobe Experience Platform (AEP), Real-Time CDP, Customer Journey Analytics (CJA)
Other: Cloud Computing, Machine Learning, Deep Learning, Data Visualization, AWS, EDA, AI Agents, n8n, IoT

WORK EXPERIENCE

YAN IT Solutions PVT. LTD., Pune, Maharashtra - Data Analyst Intern (June 2025 - September 2025)
- Implemented Python pipelines to process IoT sensor data from MongoDB
- Monitored device health and predicted refill needs with machine learning (Linear Regression)
- Achieved a 40% improvement in predictive accuracy and a 35% reduction in downtime for over 230 devices
- Developed a FastAPI-based web service and dashboard (Chart.js) for live health status and refill trend visuals
- Enabled 33% faster decision-making and increased user interaction by 45% among 200+ stakeholders
- Deployed solutions to Azure App Services with secure configuration and scalable design
- Achieved 85% uptime and supported a 55% increase in data output for enterprise-level IoT operations

Natraj Beats LLC, Exton, PA - Web Developer & Consultant (February 2025 - January 2026)
- Architected the NatrajBeats platform via Lovable AI framework, reducing time-to-market by 60%
- Engineered user telemetry and data-tracking mechanisms to drive quantitative client acquisition
- Automated the client booking pipeline and inquiry workflows, boosting inbound leads by 30%
- Optimized front-end UI/UX and technical SEO to improve cross-device performance and visibility

PROJECTS

SSP - Startup Success Predictor (Spring 2026)
- Built ML pipeline with 4 models (Random Forest, XGBoost, Gradient Boosting, Logistic Regression)
- Applied label encoding and StandardScaler to preprocess categorical and numerical features
- Developed Flask REST API with probability-based predictions across 3 success classes (IPO, Acquired, Private)
- Deployed model to production using WSGI server; model achieves 69.6% CV score and 70% test accuracy
- Built an interactive web dashboard with real-time prediction capabilities using JSON API endpoints

AROMA - Agentic Restaurant Order Management Automation (Fall 2025)
- Automated restaurant order processing via n8n agentic workflows, cutting manual time by 40%
- Integrated a Vapi conversational AI voice agent to manage inbound customer inquiries
- Engineered a real-time WhatsApp order notification system, decreasing follow-up calls by 60%
- Synchronized voice, order, and messaging systems to achieve a 95% automated response rate

CERTIFICATIONS
- AI: AI & Productivity (Google), Generative AI Mastermind (Outskill), AI Agent Fundamentals (Databricks)
- Development: Python (Santander), Intro to Data Science (Santander), SQL Essential Training (LinkedIn)`;

const SYSTEM_PROMPT = "You are Pratik Balaji's AI Resume Assistant on his personal portfolio website. You help visitors learn about Pratik's background, skills, and experience. Be friendly, concise, and professional.\n\nHere is Pratik's full resume for reference:\n" + RESUME_TEXT + "\n\nIMPORTANT RULES:\n- If someone asks for Pratik's resume or CV, share a summary AND always include this download link: [Download Pratik's Resume (PDF)](https://pratikbalaji.lovable.app/PratikBalaji-Resume.pdf)\n- Keep responses under 150 words unless asked for detail or the full resume\n- If asked something unrelated to Pratik, politely redirect\n- Be enthusiastic about Pratik's accomplishments\n- When sharing the resume, format it nicely with markdown sections and bullet points\n- Always use markdown formatting in your responses";

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
        max_tokens: 1024,
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
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
