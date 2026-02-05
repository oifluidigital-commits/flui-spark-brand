 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const { sprint, strategy, brand, existingContents } = await req.json();
     
     const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
     if (!LOVABLE_API_KEY) {
       throw new Error("LOVABLE_API_KEY is not configured");
     }
 
     const systemPrompt = `Você é um estrategista de conteúdo especializado em sprints de produção.
 Gere sugestões de conteúdo alinhadas com a estratégia do usuário e o tema da sprint.
 
 DIRETRIZES:
 - Cada conteúdo deve ter título, hook, descrição, formato e framework
 - Distribua entre TOFU (topo), MOFU (meio) e BOFU (fundo) do funil
 - Sugira CTAs específicos e acionáveis
 - Evite duplicar conteúdos já existentes na sprint
 - Use formatos variados: Carrossel, Post único, Artigo, Vídeo curto, Enquete`;
 
     const existingTitles = existingContents?.map((c: any) => c.title).join(', ') || 'Nenhum';
 
     const userPrompt = `SPRINT:
 - Título: ${sprint.title}
 - Descrição: ${sprint.description || 'Não especificada'}
 - Tema: ${sprint.theme || 'Geral'}
 
 ESTRATÉGIA DO USUÁRIO:
 ${JSON.stringify(strategy, null, 2)}
 
 ${brand ? `MARCA:
 - Nome: ${brand.name}
 - Tom de voz: ${JSON.stringify(brand.voice)}` : ''}
 
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
                       title: { type: "string", description: "Título do conteúdo" },
                       hook: { type: "string", description: "Gancho/abertura do conteúdo" },
                       description: { type: "string", description: "Breve descrição do que abordar" },
                       format: { type: "string", description: "Formato: Carrossel, Post único, Artigo, Vídeo curto, Enquete" },
                       funnelStage: { type: "string", enum: ["tofu", "mofu", "bofu"], description: "Estágio do funil" },
                       framework: { type: "string", description: "Framework sugerido: AIDA, PAS, Storytelling Herói, Lista Numerada, etc." },
                       frameworkReason: { type: "string", description: "Por que este framework é ideal" },
                       intention: { type: "string", enum: ["educate", "engage", "convert"], description: "Intenção principal" },
                       suggestedCta: { type: "string", description: "CTA sugerido" }
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
           status: 429,
           headers: { ...corsHeaders, "Content-Type": "application/json" },
         });
       }
       
       if (response.status === 402) {
         return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
           status: 402,
           headers: { ...corsHeaders, "Content-Type": "application/json" },
         });
       }
       
       return new Response(JSON.stringify({ error: "Erro ao gerar sugestões." }), {
         status: 500,
         headers: { ...corsHeaders, "Content-Type": "application/json" },
       });
     }
 
     const data = await response.json();
     const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
     
     if (!toolCall?.function?.arguments) {
       return new Response(JSON.stringify({ error: "Resposta inválida da IA" }), {
         status: 500,
         headers: { ...corsHeaders, "Content-Type": "application/json" },
       });
     }
 
     const result = JSON.parse(toolCall.function.arguments);
 
     return new Response(JSON.stringify(result), {
       headers: { ...corsHeaders, "Content-Type": "application/json" },
     });
 
   } catch (error) {
     console.error("Error suggesting contents:", error);
     return new Response(JSON.stringify({ 
       error: error instanceof Error ? error.message : "Erro desconhecido" 
     }), {
       status: 500,
       headers: { ...corsHeaders, "Content-Type": "application/json" },
     });
   }
 });