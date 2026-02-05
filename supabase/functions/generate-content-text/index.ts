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
     const { content, brand, strategy } = await req.json();
     
     const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
     if (!LOVABLE_API_KEY) {
       throw new Error("LOVABLE_API_KEY is not configured");
     }
 
     const systemPrompt = `Você é um copywriter especializado em LinkedIn e marcas pessoais.
 Gere textos prontos para publicação seguindo o framework e tom de voz especificados.
 
 DIRETRIZES:
 - Siga a estrutura do framework rigorosamente
 - Use o tom de voz da marca
 - Mantenha o texto escaneável com quebras de linha
 - Inclua emojis estrategicamente (não excessivo)
 - O hook deve capturar atenção nos primeiros 3 segundos
 - O CTA deve ser claro e acionável
 - Gere 2-3 versões alternativas`;
 
     const userPrompt = `CONTEÚDO A GERAR:
 - Título: ${content.title}
 - Hook: ${content.hook}
 - Descrição: ${content.description}
 - Formato: ${content.format}
 - Framework: ${content.framework}
 - Estágio do Funil: ${content.funnelStage}
 - Intenção: ${content.intention}
 - CTA Sugerido: ${content.suggestedCta}
 
 ${brand ? `MARCA:
 - Nome: ${brand.name}
 - Tom de voz: ${JSON.stringify(brand.voice)}
 - Posicionamento: ${JSON.stringify(brand.positioning)}` : ''}
 
 ${strategy ? `CONTEXTO ESTRATÉGICO:
 - Objetivo: ${strategy.strategicGoal?.statement}
 - Arquétipo: ${strategy.diagnosticSummary?.brandArchetype}` : ''}
 
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
                 generatedText: { 
                   type: "string", 
                   description: "Texto principal completo pronto para publicação" 
                 },
                 alternativeVersions: { 
                   type: "array", 
                   items: { type: "string" },
                   description: "2-3 versões alternativas do texto"
                 },
                 hashtags: { 
                   type: "array", 
                   items: { type: "string" },
                   description: "5-7 hashtags relevantes"
                 },
                 estimatedReadTime: { 
                   type: "number", 
                   description: "Tempo estimado de leitura em segundos" 
                 }
               },
               required: ["generatedText", "alternativeVersions", "hashtags", "estimatedReadTime"]
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
       
       return new Response(JSON.stringify({ error: "Erro ao gerar texto." }), {
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
     console.error("Error generating content text:", error);
     return new Response(JSON.stringify({ 
       error: error instanceof Error ? error.message : "Erro desconhecido" 
     }), {
       status: 500,
       headers: { ...corsHeaders, "Content-Type": "application/json" },
     });
   }
 });