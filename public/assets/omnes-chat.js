(function () {
    console.log("OMNES CHAT ATTEMPTING LOAD...");

    /**
     * Re-escritura robusta del Widget de Chat para OMNES
     * Soporta: Construcción dinámica, Speech API, Cloudflare Functions.
     */
    const initOmnesChat = () => {
        // Evitar duplicados
        if (document.getElementById('omnes-chat-widget')) {
            console.log("OMNES CHAT already exists.");
            return;
        }

        console.log("OMNES CHAT INITIALIZING...");

        // 1) Inyectar Estilos Críticos (para que no dependa de nada externo)
        const style = document.createElement('style');
        style.id = 'omnes-chat-styles';
        style.textContent = `
            #omnes-chat-widget { font-family: 'Inter', system-ui, sans-serif; position: fixed; bottom: 25px; right: 25px; z-index: 2147483647; }
            #omnes-toggle { width: 65px; height: 65px; border-radius: 50%; background: linear-gradient(135deg, #00ecff, #34d399); border: none; color: white; font-size: 30px; cursor: pointer; box-shadow: 0 6px 20px rgba(0, 236, 255, 0.4); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center; }
            #omnes-toggle:hover { transform: scale(1.1); }
            #omnes-panel { position: absolute; bottom: 85px; right: 0; width: 380px; height: 550px; background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; display: none; flex-direction: column; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.6); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); }
            #omnes-panel.active { display: flex; }
            .omnes-header { padding: 20px; background: rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; }
            .omnes-header h3 { margin: 0; font-size: 16px; color: #00ecff; font-weight: 700; letter-spacing: 0.5px; }
            #omnes-log { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; scrollbar-width: thin; scrollbar-color: #334155 transparent; }
            #omnes-form { padding: 20px; background: rgba(0, 0, 0, 0.3); display: flex; gap: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
            #omnes-input { flex: 1; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 12px 15px; color: white; font-size: 14px; outline: none; transition: border-color 0.2s; }
            #omnes-input:focus { border-color: #00ecff; }
            .omnes-action-btn { background: rgba(255, 255, 255, 0.05); border: none; color: white; cursor: pointer; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.2s; }
            .omnes-action-btn:hover { background: rgba(255, 255, 255, 0.1); color: #00ecff; }
            .omnes-action-btn:disabled { opacity: 0.2; cursor: not-allowed; }
            .omnes-msg { padding: 12px 16px; border-radius: 16px; font-size: 14.5px; line-height: 1.5; max-width: 85%; word-wrap: break-word; animation: omnesIn 0.3s ease-out; }
            @keyframes omnesIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .omnes-msg.user { align-self: flex-end; background: #1e293b; color: #f8fafc; border-bottom-right-radius: 4px; }
            .omnes-msg.bot { align-self: flex-start; background: rgba(255, 255, 255, 0.05); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.1); border-bottom-left-radius: 4px; }
            .omnes-thinking { font-style: italic; color: #00ecff; opacity: 0.8; animation: omnesPulse 1.5s infinite; }
            @keyframes omnesPulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        `;
        document.head.appendChild(style);

        // 2) Crear el DOM del Widget
        const widget = document.createElement('div');
        widget.id = 'omnes-chat-widget';
        widget.innerHTML = `
            <button id="omnes-toggle" aria-label="Abrir Asistente Omnes">💬</button>
            <div id="omnes-panel">
                <div class="omnes-header">
                    <h3>OMNES AI ASSISTANT</h3>
                    <button type="button" class="omnes-action-btn" id="omnes-close" style="width:30px;height:30px">✕</button>
                </div>
                <div id="omnes-log"></div>
                <form id="omnes-form">
                    <input type="text" id="omnes-input" placeholder="¿En qué puedo ayudarte?" autocomplete="off">
                    <button type="button" id="omnes-talk" class="omnes-action-btn" title="Hablar">🎙️</button>
                    <button type="button" id="omnes-stop" class="omnes-action-btn" title="Detener">⏹️</button>
                    <button type="submit" class="omnes-action-btn" id="omnes-send" style="color:#00ecff">➔</button>
                </form>
            </div>
        `;
        document.body.appendChild(widget);

        // 3) Referencias de Elementos
        const el = {
            toggle: document.getElementById('omnes-toggle'),
            panel: document.getElementById('omnes-panel'),
            close: document.getElementById('omnes-close'),
            log: document.getElementById('omnes-log'),
            form: document.getElementById('omnes-form'),
            input: document.getElementById('omnes-input'),
            talk: document.getElementById('omnes-talk'),
            stop: document.getElementById('omnes-stop')
        };

        let history = [];
        const MAX_HIST = 12;

        // --- Configuración de Voz (Web Speech API) ---
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        let isActive = false;

        if (Speech) {
            recognition = new Speech();
            recognition.lang = 'es-CL';
            recognition.continuous = false;
            recognition.onresult = (e) => {
                const text = e.results[0][0].transcript;
                el.input.value = text;
                el.form.dispatchEvent(new Event('submit'));
            };
            recognition.onend = () => { isActive = false; el.talk.style.color = ''; };
        } else {
            el.talk.disabled = true;
            el.talk.title = "No disponible en este navegador";
        }

        const speak = (text) => {
            if (!window.speechSynthesis) return;
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = 'es-CL';
            utter.rate = 1.05;
            window.speechSynthesis.speak(utter);
        };

        const stopAll = () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (recognition && isActive) recognition.stop();
        };

        // --- Lógica del Chat ---
        const addMessage = (role, text, isThinking = false) => {
            const m = document.createElement('div');
            m.className = `omnes-msg ${role} ${isThinking ? 'omnes-thinking' : ''}`;
            m.innerText = isThinking ? 'Pensando...' : text;
            el.log.appendChild(m);
            el.log.scrollTop = el.log.scrollHeight;
            if (!isThinking) {
                history.push({ role, content: text });
                if (history.length > MAX_HIST) history.shift();
            }
            return m;
        };

        const sendMessage = async (e) => {
            e.preventDefault();
            const text = el.input.value.trim();
            if (!text) return;

            el.input.value = '';
            addMessage('user', text);
            const thinking = addMessage('bot', '', true);

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, history: history.slice(0, -1) })
                });

                if (!response.ok) throw new Error("API Error");

                const data = await response.json();
                thinking.remove();
                addMessage('bot', data.reply);
                speak(data.reply);
            } catch (err) {
                console.error("OMNES CHAT ERROR:", err);
                thinking.className = 'omnes-msg bot';
                thinking.innerText = "Lo siento, tuve un problema al procesar tu mensaje.";
                thinking.style.borderColor = "#ef4444";
            }
        };

        // --- Event Listeners ---
        el.form.addEventListener('submit', sendMessage);

        el.toggle.addEventListener('click', () => {
            el.panel.classList.toggle('active');
            if (el.panel.classList.contains('active')) el.input.focus();
        });

        el.close.addEventListener('click', () => el.panel.classList.remove('active'));

        el.talk.addEventListener('click', () => {
            if (isActive) return;
            stopAll();
            isActive = true;
            el.talk.style.color = '#00ecff';
            recognition.start();
        });

        el.stop.addEventListener('click', stopAll);

        console.log("OMNES CHAT SUCCESSFULLY INITIALIZED.");
    };

    // Bootstrap
    if (document.readyState === 'complete') {
        initOmnesChat();
    } else {
        window.addEventListener('load', initOmnesChat);
    }

    console.log("OMNES CHAT READY");
})();
