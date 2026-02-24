(function () {
    // 1) Construcción dinámica del widget al cargar la página
    const injectWidget = () => {
        if (document.getElementById('omnes-chat-widget')) return;

        // Estilos integrados para asegurar que sea "funcional" sin tocar CSS externo
        const style = document.createElement('style');
        style.textContent = `
            #omnes-chat-widget { font-family: 'Inter', sans-serif; z-index: 10000; position: fixed; bottom: 20px; right: 20px; }
            #omnes-toggle { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #00ecff, #34d399); border: none; color: white; font-size: 24px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.3s; }
            #omnes-toggle:hover { transform: scale(1.1); }
            #omnes-panel { position: absolute; bottom: 75px; right: 0; width: 350px; height: 500px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 15px; display: none; flex-direction: column; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px); }
            #omnes-panel.active { display: flex; }
            .omnes-head { padding: 15px; background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; color: #00ecff; font-weight: bold; }
            #omnes-log { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
            #omnes-form { padding: 15px; background: rgba(0,0,0,0.2); display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.1); }
            #omnes-input { flex: 1; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 12px; color: white; font-size: 14px; outline: none; }
            #omnes-input:focus { border-color: #00ecff; }
            .omnes-btn { background: none; border: none; color: white; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: color 0.2s; }
            .omnes-btn:hover { color: #00ecff; }
            .omnes-btn:disabled { opacity: 0.3; cursor: not-allowed; }
            .msg { padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.4; max-width: 80%; word-wrap: break-word; }
            .msg.user { align-self: flex-end; background: #1e293b; color: #f8fafc; border-bottom-right-radius: 2px; }
            .msg.bot { align-self: flex-start; background: #334155; color: #f8fafc; border-bottom-left-radius: 2px; border-left: 3px solid #00ecff; }
            .thinking { font-style: italic; opacity: 0.7; }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'omnes-chat-widget';
        container.innerHTML = `
            <button id="omnes-toggle" title="Abrir Chat">💬</button>
            <div id="omnes-panel">
                <div class="omnes-head">
                    <span>OMNES ASISTENTE</span>
                    <button type="button" class="omnes-btn" onclick="document.getElementById('omnes-panel').classList.remove('active'); document.getElementById('omnes-panel').style.display='none';">✕</button>
                </div>
                <div id="omnes-log"></div>
                <form id="omnes-form">
                    <input type="text" id="omnes-input" placeholder="Escribe aquí..." autocomplete="off">
                    <button type="button" id="omnes-talk" class="omnes-btn" title="Hablar">🎙️</button>
                    <button type="button" id="omnes-stop" class="omnes-btn" title="Parar voz">⏹️</button>
                    <button type="submit" class="omnes-btn" style="color:#00ecff">➔</button>
                </form>
            </div>
        `;
        document.body.appendChild(container);

        // Referencias con IDs exactos
        const nodes = {
            toggle: document.getElementById('omnes-toggle'),
            panel: document.getElementById('omnes-panel'),
            log: document.getElementById('omnes-log'),
            form: document.getElementById('omnes-form'),
            input: document.getElementById('omnes-input'),
            talk: document.getElementById('omnes-talk'),
            stop: document.getElementById('omnes-stop'),
        };

        let chatHistory = [];
        const MAX_HISTORY = 12;

        // Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        let isListening = false;

        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.lang = 'es-CL';
            recognition.continuous = false;
            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                nodes.input.value = text;
                // Disparar envío automáticamente tras hablar
                nodes.form.dispatchEvent(new Event('submit'));
            };
            recognition.onend = () => {
                isListening = false;
                nodes.talk.style.color = '';
            };
        } else {
            nodes.talk.disabled = true;
            nodes.talk.title = "Usa Chrome para hablar";
            nodes.talk.style.opacity = '0.3';
        }

        const stopAll = () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (recognition && isListening) recognition.stop();
        };

        const addMsg = (role, text, thinking = false) => {
            const div = document.createElement('div');
            div.className = `msg ${role} ${thinking ? 'thinking' : ''}`;
            div.innerText = thinking ? 'Pensando...' : text;
            nodes.log.appendChild(div);
            nodes.log.scrollTop = nodes.log.scrollHeight;
            if (!thinking) {
                chatHistory.push({ role, content: text });
                if (chatHistory.length > MAX_HISTORY) chatHistory.shift();
            }
            return div;
        };

        const callApi = async (message) => {
            const thinking = addMsg('bot', '', true);
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, history: chatHistory.slice(0, -1) })
                });
                const data = await response.json();
                thinking.remove();
                addMsg('bot', data.reply);

                if (window.speechSynthesis) {
                    const utter = new SpeechSynthesisUtterance(data.reply);
                    utter.lang = 'es-CL';
                    utter.rate = 1.05;
                    window.speechSynthesis.speak(utter);
                }
            } catch (err) {
                thinking.innerText = "Error: No se pudo conectar con el asistente.";
                console.error(err);
            }
        };

        // EVENT LISTENERS

        // 3) El formulario tenga un addEventListener("submit", ...) correctamente conectado
        nodes.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = nodes.input.value.trim();
            if (!text) return;
            nodes.input.value = '';
            addMsg('user', text);
            callApi(text);
        });

        // Toggle
        nodes.toggle.onclick = () => {
            const isActive = nodes.panel.classList.contains('active');
            if (isActive) {
                nodes.panel.classList.remove('active');
                nodes.panel.style.display = 'none';
            } else {
                nodes.panel.classList.add('active');
                nodes.panel.style.display = 'flex';
                nodes.input.focus();
            }
        };

        // 4) El botón 🎙️ tenga addEventListener("click", ...)
        nodes.talk.addEventListener('click', () => {
            if (!recognition || isListening) return;
            stopAll();
            isListening = true;
            nodes.talk.style.color = '#00ecff';
            recognition.start();
        });

        // 5) El botón ⏹️ detenga speechSynthesis y recognition
        nodes.stop.addEventListener('click', stopAll);
    };

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectWidget);
    } else {
        injectWidget();
    }

    // 7) Confirmación de carga
    console.log("OMNES CHAT READY");

})();
