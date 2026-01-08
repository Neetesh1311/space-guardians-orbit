import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LaunchRequest {
  missionName: string;
  satelliteName: string;
  targetOrbit: string;
  targetAltitude: number;
  targetInclination: number;
  launchSite: string;
  payloadMass: number;
  existingSatellites?: { name: string; altitude: number; inclination: number }[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const launchData = await req.json() as LaunchRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert spacecraft launch planning AI. Analyze launch parameters and provide optimal launch windows, trajectory recommendations, and collision avoidance strategies.

Your analysis should include:
1. Optimal launch windows based on target orbit
2. Fuel efficiency calculations
3. Stage separation timings
4. Orbital insertion parameters
5. Collision risk assessment with existing satellites
6. Weather considerations

Respond with a JSON object:
{
  "optimal_launch_windows": [
    {
      "date": "YYYY-MM-DD",
      "time_utc": "HH:MM",
      "window_duration_minutes": number,
      "confidence_score": number
    }
  ],
  "trajectory": {
    "ascent_profile": "string",
    "max_q_altitude_km": number,
    "stage1_separation_altitude_km": number,
    "stage2_burn_duration_seconds": number,
    "orbital_insertion_time_minutes": number
  },
  "fuel_analysis": {
    "estimated_delta_v_km_s": number,
    "fuel_margin_percent": number,
    "efficiency_rating": "excellent" | "good" | "acceptable" | "marginal"
  },
  "collision_avoidance": {
    "risk_level": "low" | "medium" | "high",
    "conflicting_objects": ["string"],
    "recommended_maneuvers": ["string"]
  },
  "recommendations": ["string"],
  "summary": "string"
}`;

    const existingSatsInfo = launchData.existingSatellites?.length 
      ? launchData.existingSatellites.slice(0, 20).map(s => 
          `${s.name}: ${s.altitude}km altitude, ${s.inclination}° inclination`
        ).join('\n')
      : 'No existing satellite data provided';

    const userPrompt = `Plan a satellite launch with these parameters:

Mission: ${launchData.missionName}
Satellite: ${launchData.satelliteName}
Target Orbit: ${launchData.targetOrbit}
Target Altitude: ${launchData.targetAltitude} km
Target Inclination: ${launchData.targetInclination}°
Launch Site: ${launchData.launchSite}
Payload Mass: ${launchData.payloadMass} kg

EXISTING SATELLITES IN SIMILAR ORBITS:
${existingSatsInfo}

Provide comprehensive launch planning recommendations.`;

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
        temperature: 0.4,
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
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    let planData;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      planData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      planData = {
        optimal_launch_windows: [],
        trajectory: {},
        fuel_analysis: {},
        collision_avoidance: { risk_level: "low", conflicting_objects: [], recommended_maneuvers: [] },
        recommendations: [],
        summary: content
      };
    }

    return new Response(JSON.stringify(planData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Launch planner error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});