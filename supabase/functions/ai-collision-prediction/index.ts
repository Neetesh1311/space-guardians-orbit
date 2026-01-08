import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SatelliteData {
  id: string;
  name: string;
  altitude: number;
  velocity: number;
  position: { x: number; y: number; z: number };
  orbitType: string;
}

interface CollisionRequest {
  satellites: SatelliteData[];
  debris?: { id: string; position: { x: number; y: number; z: number }; altitude: number }[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { satellites, debris = [] } = await req.json() as CollisionRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare data summary for AI analysis
    const satelliteSummary = satellites.map(s => 
      `${s.name}: altitude ${s.altitude}km, velocity ${s.velocity}km/s, position (${s.position.x.toFixed(2)}, ${s.position.y.toFixed(2)}, ${s.position.z.toFixed(2)}), orbit ${s.orbitType}`
    ).join('\n');

    const debrisSummary = debris.length > 0 
      ? debris.slice(0, 10).map(d => 
          `Debris ${d.id}: altitude ${d.altitude}km, position (${d.position.x.toFixed(2)}, ${d.position.y.toFixed(2)}, ${d.position.z.toFixed(2)})`
        ).join('\n')
      : 'No debris data available';

    const systemPrompt = `You are an expert space traffic management AI system. Analyze satellite positions and trajectories to predict potential collisions. 
    
Your analysis should:
1. Calculate relative distances between objects
2. Identify potential collision risks based on orbital mechanics
3. Provide risk scores from 0-100
4. Suggest avoidance maneuvers if needed
5. Consider Kessler syndrome implications

Respond with a JSON object containing:
{
  "predictions": [
    {
      "object1_name": "string",
      "object2_name": "string",
      "risk_score": number (0-100),
      "time_to_closest_approach_hours": number,
      "minimum_distance_km": number,
      "risk_level": "safe" | "warning" | "critical",
      "recommended_action": "string",
      "analysis": "string"
    }
  ],
  "overall_risk_assessment": "string",
  "kessler_risk": "low" | "medium" | "high",
  "summary": "string"
}`;

    const userPrompt = `Analyze these space objects for collision risks:

SATELLITES:
${satelliteSummary}

DEBRIS:
${debrisSummary}

Provide collision predictions and risk assessment.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    // Parse JSON from AI response
    let predictions;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      predictions = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      predictions = {
        predictions: [],
        overall_risk_assessment: "Unable to parse prediction data",
        kessler_risk: "low",
        summary: content
      };
    }

    return new Response(JSON.stringify(predictions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Collision prediction error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});