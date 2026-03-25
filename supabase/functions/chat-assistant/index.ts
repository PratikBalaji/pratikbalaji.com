import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Resume knowledge base chunks for tool simulation
const KNOWLEDGE_BASE: Record<string, string> = {
  "IoT": "YAN IT Solutions: Implemented Python pipelines to process IoT sensor data from MongoDB. Monitored device health and predicted refill needs with ML (Linear Regression). Achieved 40% improvement in predictive accuracy and 35% reduction in downtime for 230+ devices. Developed FastAPI-based web service and dashboard (Chart.js) for live health status and refill trend visuals. Enabled 33% faster decision-making and increased user interaction by 45% among 200+ stakeholders. Deployed to Azure App Services with secure configuration and scalable design. 85% uptime, 55% increase in data output for enterprise-level IoT operations.",
  "AROMA": "AROMA - Agentic Restaurant Order Management Automation (Fall 2025): Automated restaurant order processing via n8n agentic workflows, cutting manual time by 40%. Integrated Vapi conversational AI voice agent to manage inbound customer inquiries. Engineered real-time WhatsApp order notification system, decreasing follow-up calls by 60%. Synchronized voice, order, and messaging systems to achieve 95% automated response rate.",
  "SSP": "SSP - Startup Success Predictor (Spring 2026): Built ML pipeline with 4 models (Random Forest, XGBoost, Gradient Boosting, Logistic Regression). Applied label encoding and StandardScaler to preprocess categorical and numerical features. Developed Flask REST API with probability-based predictions across 3 success classes (IPO, Acquired, Private). Deployed model to production using WSGI server; 69.6% CV score and 70% test accuracy. Built interactive web dashboard with real-time prediction capabilities using JSON API endpoints.",
  "skills": "Programming: Python, C, C++, Java, JavaScript, SQL, R, Bash. Stack: TensorFlow, PyTorch, MongoDB, scikit-learn, Pandas, NumPy, Flask, FastAPI, Docker, Git. Adobe: AEP, Real-Time CDP, CJA. Other: Cloud Computing, ML/AI, Quantitative Research, Data Visualization, AWS, EDA, AI Agents, n8n, IoT.",
  "education": "Temple University, Philadelphia, PA. BS Data Science with Computational Analytics (Expected 2027). Coursework: Calc I-III, Mathematical Concepts in Computing I-II, Data Structures & Algorithms, Computer Systems & Low-Level Programming, Principles of Data Science(s), Linear Algebra, Principles of Database Systems, Probability Theory. Extracurriculars: Temple Data Analytics Club, Temple Data Science Community, Research Scholars Club.",
  "experience": "Auxilior Capital Partners Inc. (IT Intern, May-Sep 2026): Running AI operations under VP leadership to integrate automated tools and optimize secure financial systems. Automate data workflows and deploy custom AI agents to streamline internal reporting and enhance efficiency. YAN IT Solutions (Data Analyst Intern, June-Sept 2025): IoT data pipelines, ML predictions, FastAPI dashboard, Azure deployment, 40% accuracy improvement, 35% downtime reduction across 230+ devices.",
  "certifications": "AI: AI & Productivity (Google), Generative AI Mastermind (Outskill), AI Agent Fundamentals (Databricks). Development: Quantitative Research J.P. Morgan (Forage), Software Engineering J.P. Morgan (Forage). Other: Claude Code In Action (Anthropic), SQL Essential Training (LinkedIn), Python (Santander).",
  "contact": "Pratik Balaji, Philadelphia PA 19122. Phone: (346) 446-8717. Email: balajipratik8@gmail.com. LinkedIn: linkedin.com/in/pratikbalaji. GitHub: github.com/PratikBalaji. Kaggle. Portfolio: pratikbalaji.lovable.app",
  "cover_letter": "Pratik Balaji's Cover Letter: As a Data Science with Computational Analytics student at Temple University, he has developed a deep foundation in predictive modeling, statistical analysis, and artificial intelligence. At YAN IT Solutions, he built Python pipelines to process IoT sensor data from MongoDB, improving predictive accuracy by 40% and reducing device downtime by 35% across hundreds of endpoints. He developed the Startup Success Predictor, an end-to-end ML pipeline utilizing Random Forest and XGBoost algorithms with 70% test accuracy. For the AROMA project, he engineered agentic workflows using n8n and integrated Vapi conversational AI voice agent, achieving a 95% automated response rate. As Technical Consultant for Natraj Beats LLC, he engineered data-tracking telemetry systems and reduced time-to-market by 60%. His technical stack spans Python, TensorFlow, scikit-learn, AWS, and modern AI agent frameworks.",
};

// Tool definitions for the agent
const TOOLS = [
  {
    type: "function",
    function: {
      name: "search_resume",
      description: "Search Pratik's resume knowledge base for specific topics like projects, skills, education, experience, certifications, or contact info.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The topic to search for (e.g., 'IoT', 'AROMA', 'skills', 'education')" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "compare_topics",
      description: "Compare two topics from Pratik's resume side by side.",
      parameters: {
        type: "object",
        properties: {
          topic_a: { type: "string", description: "First topic to compare" },
          topic_b: { type: "string", description: "Second topic to compare" },
        },
        required: ["topic_a", "topic_b"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_summary",
      description: "Generate a formatted summary document from gathered data.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the summary" },
          data: { type: "string", description: "Data to summarize" },
        },
        required: ["title", "data"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "send_email",
      description: "Send an email with the generated content (simulated).",
      parameters: {
        type: "object",
        properties: {
          to: { type: "string", description: "Email recipient" },
          subject: { type: "string", description: "Email subject" },
          body: { type: "string", description: "Email body content" },
        },
        required: ["to", "subject", "body"],
      },
    },
  },
];

function searchKnowledgeBase(query: string): string {
  const q = query.toLowerCase();
  for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
    if (q.includes(key.toLowerCase()) || key.toLowerCase().includes(q)) {
      return value;
    }
  }
  // Fuzzy match: search all values
  const matches = Object.entries(KNOWLEDGE_BASE)
    .filter(([_, v]) => v.toLowerCase().includes(q))
    .map(([k, v]) => `[${k}]: ${v}`);
  return matches.length > 0 ? matches.join("\n\n") : `No specific data found for "${query}". Available topics: ${Object.keys(KNOWLEDGE_BASE).join(", ")}`;
}

function executeTool(name: string, args: Record<string, string>): string {
  switch (name) {
    case "search_resume":
      return searchKnowledgeBase(args.query || "");
    case "compare_topics":
      const dataA = searchKnowledgeBase(args.topic_a || "");
      const dataB = searchKnowledgeBase(args.topic_b || "");
      return `=== ${args.topic_a} ===\n${dataA}\n\n=== ${args.topic_b} ===\n${dataB}`;
    case "generate_summary":
      return `Summary generated: "${args.title}"\n${args.data || ""}`;
    case "send_email":
      return `Email queued to ${args.to} with subject "${args.subject}" (simulated - email service not connected)`;
    default:
      return `Unknown tool: ${name}`;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, agent_mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // If not agent mode, use simple streaming (existing behavior)
    if (!agent_mode) {
      const RESUME_CONTEXT = Object.values(KNOWLEDGE_BASE).join("\n\n");
      const SYSTEM_PROMPT = `You are Pratik Balaji's AI Resume Assistant. Be friendly, concise, professional.\n\nResume:\n${RESUME_CONTEXT}\n\nRules:\n- For resume download requests, include: [Download Pratik's Resume (PDF)](/PratikBalaji-Resume.pdf)\n- For cover letter requests, include: [Download Pratik's Cover Letter (PDF)](/PratikBalaji-CoverLetter.pdf)\n- Keep responses under 150 words unless asked for detail\n- Use markdown formatting`;

      const response = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          stream: true,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        console.error("AI Gateway error:", response.status, t);
        return new Response(JSON.stringify({ error: "AI service error" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // === AGENT MODE ===
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        function sendEvent(type: string, data: unknown) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type, ...data as Record<string, unknown> })}\n\n`));
        }

        const AGENT_SYSTEM = `You are an autonomous AI agent for Pratik Balaji's portfolio. You have tools to search his resume, compare topics, generate summaries, and send emails. Use tools when needed to answer complex queries. Think step by step.

Available knowledge topics: ${Object.keys(KNOWLEDGE_BASE).join(", ")}

IMPORTANT: When you receive tool results, analyze them and either call more tools or provide a final answer. Always be thorough.`;

        const conversationMessages: Array<{ role: string; content?: string; tool_calls?: unknown[]; tool_call_id?: string; name?: string }> = [
          { role: "system", content: AGENT_SYSTEM },
          ...messages,
        ];

        const MAX_ITERATIONS = 5;
        let iteration = 0;

        try {
          while (iteration < MAX_ITERATIONS) {
            iteration++;
            sendEvent("thought", { 
              content: iteration === 1 
                ? "Analyzing user query and determining required actions..." 
                : "Evaluating tool results and planning next step..." 
            });

            // Call LLM with tools (non-streaming for agent loop)
            const llmResponse = await fetch(GATEWAY_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
              body: JSON.stringify({
                model: "google/gemini-2.5-flash",
                messages: conversationMessages,
                tools: TOOLS,
                max_tokens: 1024,
                temperature: 0.3,
              }),
            });

            if (!llmResponse.ok) {
              const errText = await llmResponse.text();
              console.error("Agent LLM error:", llmResponse.status, errText);
              sendEvent("error", { content: "Agent encountered an error." });
              break;
            }

            const llmData = await llmResponse.json();
            const choice = llmData.choices?.[0];
            const message = choice?.message;

            if (!message) {
              sendEvent("error", { content: "No response from agent." });
              break;
            }

            // Check if the model wants to call tools
            if (message.tool_calls && message.tool_calls.length > 0) {
              // Add assistant message with tool calls to conversation
              conversationMessages.push(message);

              for (const toolCall of message.tool_calls) {
                const fnName = toolCall.function?.name;
                let fnArgs: Record<string, string> = {};
                try {
                  fnArgs = JSON.parse(toolCall.function?.arguments || "{}");
                } catch { fnArgs = {}; }

                // Stream the action
                sendEvent("action", {
                  tool: fnName,
                  args: fnArgs,
                  content: `ToolCall(${fnName}, ${Object.values(fnArgs).map(v => `'${v}'`).join(", ")})`,
                });

                // Execute the tool
                await new Promise(r => setTimeout(r, 600)); // Dramatic pause
                const result = executeTool(fnName, fnArgs);

                // Stream the observation
                sendEvent("observation", {
                  tool: fnName,
                  content: result.length > 200 ? result.substring(0, 200) + "..." : result,
                });

                // Add tool result to conversation
                conversationMessages.push({
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: result,
                });
              }
            } else {
              // No tool calls — this is the final answer
              const finalContent = message.content || "I've completed the analysis.";
              sendEvent("thought", { content: "Synthesizing final response from gathered data..." });
              await new Promise(r => setTimeout(r, 400));

              // Stream the final answer token by token via SSE
              const finalResponse = await fetch(GATEWAY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
                body: JSON.stringify({
                  model: "google/gemini-2.5-flash",
                  messages: [
                    ...conversationMessages,
                    { role: "user", content: `Based on all the tool results above, provide a comprehensive, well-formatted markdown answer to the original question. Include specific details and metrics. If a resume download was relevant, include the link: [Download Resume (PDF)](/PratikBalaji-Resume.pdf). If a cover letter was relevant, include the link: [Download Cover Letter (PDF)](/PratikBalaji-CoverLetter.pdf)` },
                  ],
                  stream: true,
                  max_tokens: 1024,
                  temperature: 0.5,
                }),
              });

              if (finalResponse.ok && finalResponse.body) {
                // Forward the stream as answer tokens
                const reader = finalResponse.body.getReader();
                const decoder = new TextDecoder();
                let buf = "";

                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  buf += decoder.decode(value, { stream: true });

                  let idx: number;
                  while ((idx = buf.indexOf("\n")) !== -1) {
                    let line = buf.slice(0, idx);
                    buf = buf.slice(idx + 1);
                    if (line.endsWith("\r")) line = line.slice(0, -1);
                    if (!line.startsWith("data: ")) continue;
                    const json = line.slice(6).trim();
                    if (json === "[DONE]") break;
                    try {
                      const p = JSON.parse(json);
                      const c = p.choices?.[0]?.delta?.content;
                      if (c) {
                        sendEvent("answer_delta", { content: c });
                      }
                    } catch { /* partial */ }
                  }
                }
              } else {
                // Fallback: use the non-streamed content
                sendEvent("answer_delta", { content: finalContent });
              }

              sendEvent("done", { content: "" });
              break;
            }
          }

          if (iteration >= MAX_ITERATIONS) {
            sendEvent("thought", { content: "Maximum reasoning depth reached. Compiling results..." });
            sendEvent("answer_delta", { content: "I've gathered extensive information. Here's what I found based on my analysis." });
            sendEvent("done", { content: "" });
          }
        } catch (e) {
          console.error("Agent error:", e);
          sendEvent("error", { content: `Agent error: ${e instanceof Error ? e.message : "Unknown"}` });
          sendEvent("done", { content: "" });
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("chat-assistant error:", e);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
