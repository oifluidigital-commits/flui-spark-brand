import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, authenticateRequest, sanitizeString } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user } = await authenticateRequest(req);

    const { sprint, strategy, brand, existingContents } = await req.json();

    if (!sprint || !strategy) {
      return new Response(JSON.stringify({ error: "Dados de sprint ou estratégia ausentes." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const sprintTitle = sanitizeString(sprint.title, 200);
    const sprintDesc = sanitizeString(sprint.description, 500);
    const sprintTheme = sanitizeString(sprint.theme, 200);
    const strategyJson = JSON.stringify(strategy, null, 2).substring(0, 6000);
    const brandName = sanitizeString(brand?.name, 100);
    const brandVoice = brand?.voice ? JSON.stringify(brand.voice).substring(0, 1000) : '';

    const systemPrompt = `Você é um estrategista de conteúdo especializado em sprints de produção.
Gere sugestões de conteúdo alinhadas com a estratégia do usuário e o tema da sprint.

DIRETRIZES:
- Cada conteúdo deve ter título, hook, descrição, formato e framework
- Distribua entre TOFU (topo), MOFU (meio) e BOFU (fundo) do funil
- Sugira CTAs específicos e acionáveis
- Evite duplicar conteúdos já existentes na sprint
- Use formatos variados: Carrossel, Post único, Artigo, Vídeo curto, Enquete`;

    const existingTitles = Array.isArray(existingContents)
      ? existingContents.slice(0, 20).map((c: any) => sanitizeString(c.title, 200)).join(', ')
      : 'Nenhum';

    const userPrompt = `SPRINT:
- Título: ${sprintTitle}
- Descrição: ${sprintDesc || 'Não especificada'}
- Tema: ${sprintTheme || 'Geral'}

ESTRATÉGIA DO USUÁRIO:
${strategyJson}

${brand ? `MARCA:
- Nome: ${brandName}
- Tom de voz: ${brandVoice}` : ''}

CONTEÚDOS JÁ EXISTENTES (evitar duplicar):
${existingTitles}

Gere 5 sugestões de conteúdo para esta sprint.`;

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
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "suggest_contents",
            description: "Sugere conteúdos para a sprint",
            parameters: {
              type: "object",
              properties: {
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      hook: { type: "string" },
                      description: { type: "string" },
                      format: { type: "string" },
                      funnelStage: { type: "string", enum: ["tofu", "mofu", "bofu"] },
                      framework: { type: "string" },
                      frameworkReason: { type: "string" },
                      intention: { type: "string", enum: ["educate", "engage", "convert"] },
                      suggestedCta: { type: "string" }
                    },
                    required: ["title", "hook", "description", "format", "funnelStage", "framework", "frameworkReason", "intention", "suggestedCta"]
                  }
                }
              },
              required: ["suggestions"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "suggest_contents" } }
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
      return new Response(JSON.stringify({ error: "Erro ao gerar sugestões." }), {
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
    console.error("Error suggesting contents:", error);
    return new Response(JSON.stringify({ 
      error: "Erro ao gerar sugestões. Tente novamente." 
    }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
