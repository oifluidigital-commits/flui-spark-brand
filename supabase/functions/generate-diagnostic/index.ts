 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
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
     const { formData } = await req.json() as { formData: OnboardingFormData };
     
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
 - Nome: ${formData.name}
 - Cargo/Função: ${formData.role}
 - Nível de Experiência: ${formData.experienceLevel} (0=iniciante, 1=intermediário, 2=avançado, 3=expert)
 
 ÁREA DE ATUAÇÃO:
 - Área Principal: ${formData.primaryArea}
 - Subáreas: ${formData.subareas?.join(', ') || 'Não especificado'}
 
 OBJETIVOS:
 - Objetivo Primário: ${formData.primaryGoal}
 - Objetivo Secundário: ${formData.secondaryGoal}
 
 CONTEÚDO:
 - Tópicos de Interesse: ${formData.selectedTopics?.join(', ') || 'Não especificado'}
 - Tópicos Personalizados: ${formData.customTopics?.join(', ') || 'Nenhum'}
 
 AUDIÊNCIA:
 - Tipo de Audiência: ${formData.audienceType}
 - Desafios da Audiência: ${formData.challenges?.join(', ') || 'Não especificado'}
 
 ESTILO DE COMUNICAÇÃO (0-100):
 - Formalidade: ${formData.communicationStyle?.formality || 50}/100 (0=informal, 100=formal)
 - Abordagem: ${formData.communicationStyle?.approach || 50}/100 (0=storyteller, 100=data-driven)
 - Tom: ${formData.communicationStyle?.tone || 50}/100 (0=seguro/conservador, 100=provocativo/ousado)
 - Expressividade: ${formData.communicationStyle?.expression || 50}/100 (0=reservado, 100=expressivo)
 
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
                     title: { type: "string", description: "Título resumido do perfil (ex: 'Estrategista Digital em Ascensão')" },
                     summary: { type: "string", description: "Resumo de 2-3 frases do perfil estratégico" },
                     strengths: { 
                       type: "array", 
                       items: { type: "string" },
                       description: "3-4 pontos fortes identificados"
                     },
                     opportunities: { 
                       type: "array", 
                       items: { type: "string" },
                       description: "2-3 oportunidades de desenvolvimento"
                     }
                   },
                   required: ["title", "summary", "strengths", "opportunities"]
                 },
                 strategicPatterns: {
                   type: "object",
                   description: "Padrões estratégicos identificados",
                   properties: {
                     patterns: {
                       type: "array",
                       items: {
                         type: "object",
                         properties: {
                           name: { type: "string", description: "Nome do padrão" },
                           description: { type: "string", description: "Descrição breve" },
                           match: { type: "number", description: "Nível de match 0-100" }
                         },
                         required: ["name", "description", "match"]
                       },
                       description: "3-4 padrões estratégicos"
                     }
                   },
                   required: ["patterns"]
                 },
                 personaMap: {
                   type: "object",
                   description: "Mapa da persona alvo",
                   properties: {
                     primaryPersona: { type: "string", description: "Nome/título da persona principal" },
                     characteristics: { 
                       type: "array", 
                       items: { type: "string" },
                       description: "4-5 características da persona"
                     },
                     contentPreferences: { 
                       type: "array", 
                       items: { type: "string" },
                       description: "3-4 preferências de conteúdo"
                     }
                   },
                   required: ["primaryPersona", "characteristics", "contentPreferences"]
                 },
                 brandArchetype: {
                   type: "object",
                   description: "Arquétipo de marca identificado",
                   properties: {
                     archetype: { type: "string", description: "Nome do arquétipo (ex: Sábio, Criador, Herói)" },
                     description: { type: "string", description: "Descrição do arquétipo aplicado ao contexto" },
                     traits: { 
                       type: "array", 
                       items: { type: "string" },
                       description: "4-5 traços do arquétipo"
                     }
                   },
                   required: ["archetype", "description", "traits"]
                 },
                 toneCalibration: {
                   type: "object",
                   description: "Calibração do tom de voz",
                   properties: {
                     dimensions: {
                       type: "array",
                       items: {
                         type: "object",
                         properties: {
                           name: { type: "string", description: "Nome da dimensão" },
                           value: { type: "number", description: "Valor 0-100" },
                           description: { type: "string", description: "Descrição do calibre" }
                         },
                         required: ["name", "value", "description"]
                       },
                       description: "4 dimensões: Formalidade, Abordagem, Tom, Expressividade"
                     }
                   },
                   required: ["dimensions"]
                 },
                 contentPillars: {
                   type: "object",
                   description: "Pilares de conteúdo recomendados",
                   properties: {
                     pillars: {
                       type: "array",
                       items: {
                         type: "object",
                         properties: {
                           name: { type: "string", description: "Nome do pilar" },
                           percentage: { type: "number", description: "Porcentagem de foco (soma deve ser 100)" },
                           description: { type: "string", description: "Descrição do pilar" },
                           color: { type: "string", description: "Cor em hexadecimal (ex: #6366f1)" }
                         },
                         required: ["name", "percentage", "description", "color"]
                       },
                       description: "3-4 pilares que somam 100%"
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
     
     // Adicionar metadados
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
     console.error("Error generating diagnostic:", error);
     return new Response(JSON.stringify({ 
       error: error instanceof Error ? error.message : "Erro desconhecido ao gerar diagnóstico" 
     }), {
       status: 500,
       headers: { ...corsHeaders, "Content-Type": "application/json" },
     });
   }
 });