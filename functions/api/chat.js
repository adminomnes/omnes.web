export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const { message, history } = await request.json();

        if (!env.OPENAI_API_KEY) {
            return new Response(JSON.stringify({
                reply: "Configuración incompleta: Por favor, define la variable OPENAI_API_KEY en el panel de Cloudflare Pages."
            }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        const model = env.OPENAI_MODEL || "gpt-4o-mini";
        const systemPrompt = "Eres el asistente de Omnes (asesoría empresarial y RRHH en Chile). Responde en español chileno, claro y profesional. No inventes datos. Si falta información, pregunta. Mantén respuestas concisas.";

        // Usamos la API de Chat Completions tradicional por compatibilidad y estabilidad, 
        // pero configurada según los requisitos de prompt system.
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...history.map(m => ({
                        role: m.role === 'bot' ? 'assistant' : 'user',
                        content: m.content
                    })),
                    { role: "user", content: message }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("OpenAI Error:", error);
            return new Response(JSON.stringify({
                reply: "Lo siento, tuve un inconveniente técnico. ¿Podrías intentar de nuevo en un momento?"
            }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            reply: "Error crítico en la función de chat."
        }), {
            headers: { "Content-Type": "application/json" }
        });
    }
}
