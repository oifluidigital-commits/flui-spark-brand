import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, authenticateRequest, sanitizeString } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user } = await authenticateRequest(req);

    const { diagnosticResult, brandInfo } = await req.json();

    if (!diagnosticResult || typeof diagnosticResult !== "object") {
      return new Response(JSON.stringify({ error: "Dados de diagnóstico inválidos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Truncate serialized diagnostic to prevent token abuse
    const diagnosticJson = JSON.stringify(diagnosticResult, null, 2).substring(0, 8000);

    const brandName = sanitizeString(brandInfo?.name, 100);
    const brandValue = sanitizeString(brandInfo?.valueProposition, 300);
    const brandAudience = sanitizeString(brandInfo?.targetAudience, 200);

    const systemPrompt = `Você é um estrategista de conteúdo sênior especializado em marcas pessoais e LinkedIn.
Com base no diagnóstico estratégico do usuário, gere uma estratégia editorial completa e acionável.

DIRETRIZES:
- A estratégia deve ser prática e implementável
- Foque em resultados mensuráveis
- Considere o tom de voz e arquétipo identificados
- Os pilares devem ter exemplos concretos de tópicos
- As diretrizes devem ser claras e específicas`;

    const userPrompt = `Diagnóstico do usuário:
${diagnosticJson}

${brandInfo ? `Informações da marca:
- Nome: ${brandName}
- Proposta de valor: ${brandValue}
- Audiência alvo: ${brandAudience}` : ''}

Gere uma estratégia editorial completa baseada neste diagnóstico.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_strategy",
            description: "Gera estratégia editorial completa",
            parameters: {
              type: "object",
              properties: {
                diagnosticSummary: {
                  type: "object",
                  properties: {
                    targetAudience: { type: "string" },
                    primaryGoal: { type: "string" },
                    brandArchetype: { type: "string" },
                    dominantTone: { type: "string" }
                  },
                  required: ["targetAudience", "primaryGoal", "brandArchetype", "dominantTone"]
                },
                strategicGoal: {
                  type: "object",
                  properties: {
                    statement: { type: "string" },
                    description: { type: "string" }
                  },
                  required: ["statement", "description"]
                },
                contentPillars: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      focusPercentage: { type: "number" },
                      exampleTopics: { type: "array", items: { type: "string" } },
                      color: { type: "string" }
                    },
                    required: ["name", "description", "focusPercentage", "exampleTopics", "color"]
                  }
                },
                contentTypes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      icon: { type: "string" },
                      relatedPillars: { type: "array", items: { type: "string" } }
                    },
                    required: ["name", "icon", "relatedPillars"]
                  }
                },
                guidelines: {
                  type: "object",
                  properties: {
                    frequency: { type: "string" },
                    depthLevel: { type: "string" },
                    ctaPosture: { type: "string" },
                    brandStance: { type: "string" }
                  },
                  required: ["frequency", "depthLevel", "ctaPosture", "brandStance"]
                }
              },
              required: ["diagnosticSummary", "strategicGoal", "contentPillars", "contentTypes", "guidelines"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_strategy" } }
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
      return new Response(JSON.stringify({ error: "Erro ao gerar estratégia." }), {
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

    const strategyResult = JSON.parse(toolCall.function.arguments);
    
    const result = {
      ...strategyResult,
      contentPillars: strategyResult.contentPillars.map((pillar: any, index: number) => ({
        ...pillar,
        id: `pillar-${index + 1}`
      })),
      contentTypes: strategyResult.contentTypes.map((type: any, index: number) => ({
        ...type,
        id: `type-${index + 1}`
      })),
      metadata: {
        generatedAt: new Date().toISOString(),
        model: "google/gemini-2.5-pro",
        version: "1.0"
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Error generating strategy:", error);
    return new Response(JSON.stringify({ 
      error: "Erro ao gerar estratégia. Tente novamente." 
    }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
