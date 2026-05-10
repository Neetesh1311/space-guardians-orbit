// Space assistant chatbot — answers questions about satellites, debris, collisions
// Uses Lovable AI Gateway (Gemini). Streams SSE back to the client.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are SpaceShield AI — an expert assistant for an orbital safety dashboard.
You help users understand:
- Satellite tracking (LEO/MEO/GEO/HEO orbits, NORAD catalog, TLE, ISRO/ISS/Starlink)
- Space debris and the Kessler syndrome
- Collision risk, conjunction analysis, Δv avoidance maneuvers
- Solar weather (CMEs, flares, geomagnetic storms via NASA DONKI)
- Near-Earth asteroids (NASA NEO API)
- ISRO missions (Chandrayaan, Mangalyaan, Aditya-L1, NavIC, GSAT, Cartosat)

Site context the user can rely on:
- Pages: Dashboard, Satellites, Space Debris, Solar Activity, Solar System, Launch Planner, Rocket Launch
- Data sources: NASA NEO, NASA DONKI, NORAD-style TLE, ISRO catalog
- Features: 3D Earth view, click-to-select satellites, AI collision prediction, debris heatmap, Kessler index

Style: concise, technically accurate, use markdown lists/tables when helpful. Cite real numbers (km, m/s, %).
Never make up source URLs. Decline politely if asked about unrelated topics.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI gateway not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...(Array.isArray(messages) ? messages : []),
          ],
        }),
      },
    );

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please try again shortly." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Add funds in Workspace > Usage." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("space-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
