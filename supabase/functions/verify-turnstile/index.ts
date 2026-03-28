import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT_THRESHOLD = 3; // max submissions per hour before alert

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
