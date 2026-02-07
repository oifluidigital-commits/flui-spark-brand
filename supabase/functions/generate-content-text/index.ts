import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, authenticateRequest, sanitizeString } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user } = await authenticateRequest(req);

    const { content, brand, strategy } = await req.json();

    if (!content || !content.title) {
      return new Response(JSON.stringify({ error: "Dados de conteúdo ausentes." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!content.framework) {
      return new Response(JSON.stringify({ error: "Framework é obrigatório para gerar texto." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const title = sanitizeString(content.title, 200);
    const hook = sanitizeString(content.hook, 300);
    const description = sanitizeString(content.description, 500);
    const format = sanitizeString(content.format, 100);
    const framework = sanitizeString(content.framework, 100);
    const funnelStage = sanitizeString(content.funnelStage, 50);
    const intention = sanitizeString(content.intention, 50);
    const suggestedCta = sanitizeString(content.suggestedCta, 200);

    // Build framework structure section
    const frameworkStructure: string[] = Array.isArray(content.frameworkStructure)
      ? content.frameworkStructure.slice(0, 10).map((s: unknown) => sanitizeString(s, 300))
      : [];

    const frameworkSection = frameworkStructure.length > 0
      ? `\nESTRUTURA DO FRAMEWORK (siga rigorosamente cada etapa na ordem):\n${frameworkStructure.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}`
      : '';

    const brandName = sanitizeString(brand?.name, 100);
    const brandVoice = brand?.voice ? JSON.stringify(brand.voice).substring(0, 1000) : '';
    const brandPositioning = brand?.positioning ? JSON.stringify(brand.positioning).substring(0, 1000) : '';
    const strategyGoal = sanitizeString(strategy?.strategicGoal?.statement, 300);
    const strategyArchetype = sanitizeString(strategy?.diagnosticSummary?.brandArchetype, 100);

    const systemPrompt = `Você é um copywriter especializado em LinkedIn e marcas pessoais.
Gere textos prontos para publicação seguindo o framework e tom de voz especificados.

DIRETRIZES:
- Siga a estrutura do framework rigorosamente, etapa por etapa, na ordem fornecida
- Cada etapa do framework deve gerar um bloco correspondente no texto final
- Nunca omita, reordene ou funda etapas do framework
- Use o tom de voz da marca
- Mantenha o texto escaneável com quebras de linha
- Inclua emojis estrategicamente (não excessivo)
- O hook deve capturar atenção nos primeiros 3 segundos
- O CTA deve ser claro e acionável
- Gere 2-3 versões alternativas`;

    const userPrompt = `CONTEÚDO A GERAR:
- Título: ${title}
- Hook: ${hook}
- Descrição: ${description}
- Formato: ${format}
- Framework: ${framework}${frameworkSection}
- Estágio do Funil: ${funnelStage}
- Intenção: ${intention}
- CTA Sugerido: ${suggestedCta}

${brand ? `MARCA:
- Nome: ${brandName}
- Tom de voz: ${brandVoice}
- Posicionamento: ${brandPositioning}` : ''}

${strategy ? `CONTEXTO ESTRATÉGICO:
- Objetivo: ${strategyGoal}
- Arquétipo: ${strategyArchetype}` : ''}

Gere o texto completo do conteúdo com versões alternativas.`;

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
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_content_text",
            description: "Gera texto completo do conteúdo",
            parameters: {
              type: "object",
              properties: {
                generatedText: { type: "string" },
                alternativeVersions: { type: "array", items: { type: "string" } },
                hashtags: { type: "array", items: { type: "string" } },
                estimatedReadTime: { type: "number" }
              },
              required: ["generatedText", "alternativeVersions", "hashtags", "estimatedReadTime"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_content_text" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Erro ao gerar texto." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "Resposta inválida da IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Error generating content text:", error);
    return new Response(JSON.stringify({ 
      error: "Erro ao gerar texto. Tente novamente." 
    }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
