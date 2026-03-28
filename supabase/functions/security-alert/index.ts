import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AlertPayload {
  type: "rate_limit" | "suspicious_submission" | "turnstile_fail";
  email?: string;
  table?: string;
  ip?: string;
  details?: string;
  count?: number;
  threshold?: number;
}

function formatDiscordEmbed(alert: AlertPayload) {
  const timestamp = new Date().toISOString();
  const severityColor =
    alert.type === "rate_limit" ? 0xff4444 :
    alert.type === "turnstile_fail" ? 0xffaa00 :
    0xff6600;

  const typeLabel =
    alert.type === "rate_limit" ? "🚨 RATE LIMIT EXCEEDED" :
    alert.type === "turnstile_fail" ? "⚠️ TURNSTILE VERIFICATION FAILED" :
    "🔶 SUSPICIOUS SUBMISSION";

  const fields = [
    { name: "📋 Event Type", value: `\`${alert.type.toUpperCase()}\``, inline: true },
    { name: "📊 Table", value: `\`${alert.table || "N/A"}\``, inline: true },
    { name: "🕐 Timestamp", value: `\`${timestamp}\``, inline: false },
  ];

  if (alert.email) {
    fields.push({ name: "📧 Email", value: `\`${alert.email}\``, inline: true });
  }
  if (alert.ip) {
    fields.push({ name: "🌐 IP Address", value: `\`${alert.ip}\``, inline: true });
  }
  if (alert.count !== undefined && alert.threshold !== undefined) {
    fields.push({
      name: "📈 Rate",
      value: `\`${alert.count}/${alert.threshold} per hour\``,
      inline: true,
    });
  }
  if (alert.details) {
    fields.push({ name: "📝 Details", value: `\`\`\`\n${alert.details}\n\`\`\``, inline: false });
  }

  return {
    embeds: [
      {
        title: typeLabel,
        description: `\`\`\`ansi\n\u001b[2;31m[SECURITY]\u001b[0m \u001b[2;33m${timestamp}\u001b[0m\n→ Intrusion/abuse detected on \u001b[2;36m${alert.table || "unknown"}\u001b[0m\n→ Action: REQUEST BLOCKED\n\`\`\``,
        color: severityColor,
        fields,
        footer: {
          text: "pratikbalaji.lovable.app • Security Monitor",
        },
        timestamp,
      },
    ],
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const discordWebhookUrl = Deno.env.get("DISCORD_SECURITY_WEBHOOK_URL");
    if (!discordWebhookUrl) {
      console.error("DISCORD_SECURITY_WEBHOOK_URL not configured");
      return new Response(
        JSON.stringify({ error: "Webhook not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const alert: AlertPayload = await req.json();

    // Validate alert payload
    if (!alert.type || !["rate_limit", "suspicious_submission", "turnstile_fail"].includes(alert.type)) {
      return new Response(
        JSON.stringify({ error: "Invalid alert type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const embed = formatDiscordEmbed(alert);

    const discordRes = await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error("Discord webhook failed:", discordRes.status, errText);
      return new Response(
        JSON.stringify({ error: "Failed to send alert" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await discordRes.text(); // consume body

    console.log(`[SECURITY-ALERT] ${alert.type} alert sent for ${alert.email || alert.ip || "unknown"}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Security alert error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
