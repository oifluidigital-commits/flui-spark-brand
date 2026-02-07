import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, authenticateRequest, sanitizeString, sanitizeStringArray, clampNumber } from "../_shared/auth.ts";

interface OnboardingFormData {
  name: string;
  role: string;
  experienceLevel: number;
  primaryArea: string;
  subareas: string[];
  primaryGoal: string;
  secondaryGoal: string;
  selectedTopics: string[];
  customTopics: string[];
  audienceType: string;
  challenges: string[];
  communicationStyle: {
    formality: number;
    approach: number;
    tone: number;
    expression: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate
    const { user } = await authenticateRequest(req);

    const { formData } = await req.json() as { formData: OnboardingFormData };
    
    // Sanitize all inputs
    const name = sanitizeString(formData.name, 100);
    const role = sanitizeString(formData.role, 100);
    const experienceLevel = clampNumber(formData.experienceLevel, 0, 3, 1);
    const primaryArea = sanitizeString(formData.primaryArea, 200);
    const subareas = sanitizeStringArray(formData.subareas, 10, 100);
    const primaryGoal = sanitizeString(formData.primaryGoal, 200);
    const secondaryGoal = sanitizeString(formData.secondaryGoal, 200);
    const selectedTopics = sanitizeStringArray(formData.selectedTopics, 20, 100);
    const customTopics = sanitizeStringArray(formData.customTopics, 10, 100);
    const audienceType = sanitizeString(formData.audienceType, 100);
    const challenges = sanitizeStringArray(formData.challenges, 10, 200);
    const formality = clampNumber(formData.communicationStyle?.formality, 0, 100, 50);
    const approach = clampNumber(formData.communicationStyle?.approach, 0, 100, 50);
    const tone = clampNumber(formData.communicationStyle?.tone, 0, 100, 50);
    const expression = clampNumber(formData.communicationStyle?.expression, 0, 100, 50);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é um estrategista de conteúdo especializado em marcas pessoais e posicionamento no LinkedIn.
Analise os dados do usuário e gere um diagnóstico estratégico completo.

DIRETRIZES:
- Seja preciso, prático e baseado em padrões reais de criadores de conteúdo de sucesso
- Use linguagem profissional mas acessível
- Personalize as recomendações com base nos dados fornecidos
- Gere insights acionáveis e específicos para o contexto do usuário
- Os pilares de conteúdo devem somar 100% e ter cores distintas
- Use cores em formato hexadecimal (#XXXXXX)`;

    const userPrompt = `Dados do usuário para diagnóstico:

IDENTIDADE:
- Nome: ${name}
- Cargo/Função: ${role}
- Nível de Experiência: ${experienceLevel} (0=iniciante, 1=intermediário, 2=avançado, 3=expert)

ÁREA DE ATUAÇÃO:
- Área Principal: ${primaryArea}
- Subáreas: ${subareas.join(', ') || 'Não especificado'}

OBJETIVOS:
- Objetivo Primário: ${primaryGoal}
- Objetivo Secundário: ${secondaryGoal}

CONTEÚDO:
- Tópicos de Interesse: ${selectedTopics.join(', ') || 'Não especificado'}
- Tópicos Personalizados: ${customTopics.join(', ') || 'Nenhum'}

AUDIÊNCIA:
- Tipo de Audiência: ${audienceType}
- Desafios da Audiência: ${challenges.join(', ') || 'Não especificado'}

ESTILO DE COMUNICAÇÃO (0-100):
- Formalidade: ${formality}/100 (0=informal, 100=formal)
- Abordagem: ${approach}/100 (0=storyteller, 100=data-driven)
- Tom: ${tone}/100 (0=seguro/conservador, 100=provocativo/ousado)
- Expressividade: ${expression}/100 (0=reservado, 100=expressivo)

Gere um diagnóstico estratégico completo analisando estes dados.`;

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
            name: "generate_diagnostic",
            description: "Gera diagnóstico estratégico completo para marca pessoal",
            parameters: {
              type: "object",
              properties: {
                profileAnalysis: {
                  type: "object",
                  description: "Análise do perfil profissional",
                  properties: {
                    title: { type: "string" },
                    summary: { type: "string" },
                    strengths: { type: "array", items: { type: "string" } },
                    opportunities: { type: "array", items: { type: "string" } }
                  },
                  required: ["title", "summary", "strengths", "opportunities"]
                },
                strategicPatterns: {
                  type: "object",
                  properties: {
                    patterns: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          description: { type: "string" },
                          match: { type: "number" }
                        },
                        required: ["name", "description", "match"]
                      }
                    }
                  },
                  required: ["patterns"]
                },
                personaMap: {
                  type: "object",
                  properties: {
                    primaryPersona: { type: "string" },
                    characteristics: { type: "array", items: { type: "string" } },
                    contentPreferences: { type: "array", items: { type: "string" } }
                  },
                  required: ["primaryPersona", "characteristics", "contentPreferences"]
                },
                brandArchetype: {
                  type: "object",
                  properties: {
                    archetype: { type: "string" },
                    description: { type: "string" },
                    traits: { type: "array", items: { type: "string" } }
                  },
                  required: ["archetype", "description", "traits"]
                },
                toneCalibration: {
                  type: "object",
                  properties: {
                    dimensions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          value: { type: "number" },
                          description: { type: "string" }
                        },
                        required: ["name", "value", "description"]
                      }
                    }
                  },
                  required: ["dimensions"]
                },
                contentPillars: {
                  type: "object",
                  properties: {
                    pillars: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          percentage: { type: "number" },
                          description: { type: "string" },
                          color: { type: "string" }
                        },
                        required: ["name", "percentage", "description", "color"]
                      }
                    }
                  },
                  required: ["pillars"]
                }
              },
              required: ["profileAnalysis", "strategicPatterns", "personaMap", "brandArchetype", "toneCalibration", "contentPillars"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_diagnostic" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione mais créditos para continuar." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Erro ao gerar diagnóstico. Tente novamente." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Resposta inválida da IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const diagnosticResult = JSON.parse(toolCall.function.arguments);
    
    const result = {
      ...diagnosticResult,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: "google/gemini-3-flash-preview",
        version: "1.0"
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Error generating diagnostic:", error);
    return new Response(JSON.stringify({ 
      error: "Erro ao gerar diagnóstico. Tente novamente." 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
