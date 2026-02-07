import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, authenticateRequest, sanitizeString, sanitizeStringArray } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user } = await authenticateRequest(req);

    const { niche, keywords, audience, existingPillars } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const nicheClean = sanitizeString(niche, 200);
    const keywordsClean = sanitizeStringArray(keywords, 20, 100);
    const audienceClean = sanitizeString(audience, 200);
    const pillarsClean = Array.isArray(existingPillars)
      ? existingPillars.slice(0, 10).map((p: any) => ({
          name: sanitizeString(p.name, 100),
          description: sanitizeString(p.description, 300),
        }))
      : [];

    const systemPrompt = `Você é um especialista em tendências de conteúdo e marketing digital.
Sua função é identificar tendências relevantes e oportunidades de conteúdo para criadores.

REGRAS:
- Gere tendências realistas e acionáveis
- Considere o contexto brasileiro quando relevante
- Foque em tendências que podem ser transformadas em conteúdo
- Inclua mix de tendências quentes (curto prazo) e emergentes (médio prazo)
- Cada tendência deve ter ações concretas sugeridas

FORMATO DE RESPOSTA (JSON):
{
  "trends": [
    {
      "title": "Título da tendência",
      "description": "Descrição detalhada",
      "category": "Categoria",
      "relevance": "high" | "medium" | "low",
      "source": "Origem da tendência",
      "suggested_actions": ["Ação 1", "Ação 2", "Ação 3"],
      "expires_in_days": 7 | 14 | 30 | 60
    }
  ]
}`;

    const userPrompt = `Analise e identifique 5-7 tendências relevantes para o seguinte contexto:

**Nicho/Área de atuação:** ${nicheClean || "Não especificado"}

**Palavras-chave do negócio:** ${keywordsClean.join(", ") || "Não especificadas"}

**Audiência-alvo:** ${audienceClean || "Não especificada"}

**Pilares de conteúdo existentes:** 
${pillarsClean.map((p) => `- ${p.name}: ${p.description}`).join("\n") || "Nenhum definido"}

Gere tendências que:
1. Sejam relevantes para este nicho específico
2. Possam ser facilmente adaptadas para conteúdo
3. Tenham potencial de engajamento
4. Incluam oportunidades de posicionamento como autoridade

Retorne APENAS o JSON válido, sem markdown ou texto adicional.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from AI");
    }

    let trendsData;
    try {
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      trendsData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse trends data");
    }

    const now = new Date();
    const enrichedTrends = trendsData.trends.map((trend: any) => ({
      ...trend,
      discovered_at: now.toISOString(),
      expires_at: new Date(
        now.getTime() + (trend.expires_in_days || 14) * 24 * 60 * 60 * 1000
      ).toISOString(),
    }));

    return new Response(
      JSON.stringify({
        success: true,
        trends: enrichedTrends,
        generated_at: now.toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("discover-trends error:", error);
    return new Response(
      JSON.stringify({
        error: "Erro ao descobrir tendências. Tente novamente.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
