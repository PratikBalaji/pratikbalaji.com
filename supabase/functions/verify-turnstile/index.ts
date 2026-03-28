import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT_THRESHOLD = 3; // max submissions per hour before alert

// Patterns that indicate XSS or SQL injection attempts
const SUSPICIOUS_PATTERNS = [
  /<script[\s>]/i,
  /javascript\s*:/i,
  /on(load|error|click|mouseover|focus|blur)\s*=/i,
  /\bUNION\s+(ALL\s+)?SELECT\b/i,
  /\bDROP\s+(TABLE|DATABASE)\b/i,
  /\bINSERT\s+INTO\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bUPDATE\s+\w+\s+SET\b/i,
  /\b(ALTER|CREATE|TRUNCATE)\s+(TABLE|DATABASE)\b/i,
  /(['";])\s*(OR|AND)\s+\1?\s*\d+\s*=\s*\d+/i,
  /'\s*OR\s+'1'\s*=\s*'1/i,
  /--\s*$/m,
  /<iframe[\s>]/i,
  /<embed[\s>]/i,
  /<object[\s>]/i,
  /\beval\s*\(/i,
  /\bdocument\.(cookie|location|write)/i,
  /\bwindow\.(location|open)\b/i,
];

function detectSuspiciousContent(fields: Record<string, string>): string[] {
  const matches: string[] = [];
  for (const [field, value] of Object.entries(fields)) {
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(value)) {
        matches.push(`${field} matched ${pattern.source}`);
      }
    }
  }
  return matches;
}

async function fireSecurityAlert(alert: Record<string, unknown>) {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    // Fire-and-forget — don't block the main response
    await fetch(`${supabaseUrl}/functions/v1/security-alert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(alert),
    });
  } catch (err) {
    console.error("Failed to fire security alert:", err);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, table, data } = await req.json();

    // Validate required fields
    if (!token || typeof token !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing Turnstile token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!table || !["meeting_requests", "contact_messages"].includes(table)) {
      return new Response(
        JSON.stringify({ error: "Invalid table" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify Turnstile token with Cloudflare
    const secretKey = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (!secretKey) {
      console.error("TURNSTILE_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      console.warn("Turnstile verification failed:", verifyData);
      // Fire alert for failed Turnstile
      fireSecurityAlert({
        type: "turnstile_fail",
        table,
        email: data?.email || "unknown",
        details: `Turnstile codes: ${(verifyData["error-codes"] || []).join(", ")}`,
      });
      return new Response(
        JSON.stringify({ error: "Bot verification failed. Please try again." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Turnstile passed — insert into database using service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate and sanitize data based on table
    let insertData: Record<string, unknown>;
    let emailForRateCheck: string;

    if (table === "meeting_requests") {
      const { name, email, requested_date, requested_time, message } = data || {};
      if (!name || !email || !requested_date || !requested_time) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      emailForRateCheck = String(email).trim().slice(0, 255);
      insertData = {
        name: String(name).replace(/<[^>]*>/g, "").trim().slice(0, 100),
        email: emailForRateCheck,
        requested_date: String(requested_date),
        requested_time: String(requested_time),
        message: message ? String(message).replace(/<[^>]*>/g, "").trim().slice(0, 1000) : null,
      };

      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(emailForRateCheck)) {
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // contact_messages
      const { name, email, message } = data || {};
      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      emailForRateCheck = String(email).trim().slice(0, 255);
      insertData = {
        name: String(name).replace(/<[^>]*>/g, "").trim().slice(0, 100),
        email: emailForRateCheck,
        message: String(message).replace(/<[^>]*>/g, "").trim().slice(0, 2000),
      };

      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(emailForRateCheck)) {
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Check for XSS/SQL injection patterns in raw input BEFORE sanitization
    const rawFields: Record<string, string> = {};
    if (data?.name) rawFields.name = String(data.name);
    if (data?.email) rawFields.email = String(data.email);
    if (data?.message) rawFields.message = String(data.message);
    const suspiciousMatches = detectSuspiciousContent(rawFields);
    if (suspiciousMatches.length > 0) {
      // Fire alert but still block the request
      fireSecurityAlert({
        type: "suspicious_submission",
        table,
        email: emailForRateCheck,
        details: `Injection/XSS patterns detected:\n${suspiciousMatches.join("\n")}`,
      });
      return new Response(
        JSON.stringify({ error: "Your submission contains invalid content." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check rate limit BEFORE inserting
    const { data: withinLimit, error: rlError } = await supabase.rpc("check_rate_limit", {
      table_name: table,
      ip_or_email: emailForRateCheck,
      max_per_hour: RATE_LIMIT_THRESHOLD,
    });

    if (rlError) {
      console.error("Rate limit check error:", rlError);
    }

    if (withinLimit === false) {
      // Rate limit exceeded — fire security alert
      fireSecurityAlert({
        type: "rate_limit",
        table,
        email: emailForRateCheck,
        count: RATE_LIMIT_THRESHOLD,
        threshold: RATE_LIMIT_THRESHOLD,
        details: `Email ${emailForRateCheck} exceeded ${RATE_LIMIT_THRESHOLD} submissions/hour on ${table}`,
      });

      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: dbError } = await supabase.from(table).insert(insertData);

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send admin email notification via Resend (fire-and-forget)
    try {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (resendKey) {
        const subject = table === "meeting_requests"
          ? `☕ New Meeting Request from ${insertData.name}`
          : `💬 New Contact Message from ${insertData.name}`;

        let htmlBody: string;
        if (table === "meeting_requests") {
          htmlBody = `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
              <h2 style="color:#7C3AED;margin:0 0 16px;">New Meeting Request</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#666;width:110px;">Name</td><td style="padding:8px 0;font-weight:600;">${insertData.name}</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${insertData.email}" style="color:#7C3AED;">${insertData.email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#666;">Date</td><td style="padding:8px 0;">${insertData.requested_date}</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Time</td><td style="padding:8px 0;">${insertData.requested_time}</td></tr>
                ${insertData.message ? `<tr><td style="padding:8px 0;color:#666;vertical-align:top;">Message</td><td style="padding:8px 0;">${insertData.message}</td></tr>` : ''}
              </table>
            </div>`;
        } else {
          htmlBody = `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
              <h2 style="color:#7C3AED;margin:0 0 16px;">New Contact Message</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#666;width:110px;">Name</td><td style="padding:8px 0;font-weight:600;">${insertData.name}</td></tr>
                <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${insertData.email}" style="color:#7C3AED;">${insertData.email}</a></td></tr>
              </table>
              <div style="margin-top:16px;padding:16px;background:#f9f9fb;border-radius:8px;color:#333;line-height:1.6;">
                ${insertData.message}
              </div>
            </div>`;
        }

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "notifications@pratikbalaji.com",
            to: ["balajipratik8@gmail.com"],
            reply_to: String(insertData.email),
            subject,
            html: htmlBody,
          }),
        });
      }
    } catch (emailErr) {
      console.error("Email notification failed (non-blocking):", emailErr);
    }

    // Send Discord notification (fire-and-forget)
    try {
      const discordWebhook = Deno.env.get("DISCORD_SUBMISSIONS_WEBHOOK_URL");
      if (discordWebhook) {
        const emoji = table === "meeting_requests" ? "☕" : "💬";
        const label = table === "meeting_requests" ? "Meeting Request" : "Contact Message";
        let description = `**Name:** ${insertData.name}\n**Email:** ${insertData.email}`;
        if (table === "meeting_requests") {
          description += `\n**Date:** ${insertData.requested_date}\n**Time:** ${insertData.requested_time}`;
        }
        if (insertData.message) {
          description += `\n**Message:** ${String(insertData.message).slice(0, 500)}`;
        }

        await fetch(discordWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [{
              title: `${emoji} New ${label}`,
              description,
              color: 0x7C3AED,
              timestamp: new Date().toISOString(),
            }],
          }),
        });
      }
    } catch (discordErr) {
      console.error("Discord notification failed (non-blocking):", discordErr);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
