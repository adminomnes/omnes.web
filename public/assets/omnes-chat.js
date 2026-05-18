(function () {
    'use strict';

    // ------------------------------------------------------------------
    // OMNES FAQ CHAT WIDGET — Sin IA, sin voz, sin dependencias externas
    // Soporta data-calendly-url en el script tag para configuración
    // ------------------------------------------------------------------
    const SCRIPT = document.querySelector('script[src*="omnes-chat.js"]');
    const CALENDLY_URL = SCRIPT?.getAttribute('data-calendly-url') || 'https://calendly.com/john-laserena/validacion-de-finiquito-20-minutos';
    const LS_PROFILE = 'omnes_chat_profile';
    const LS_HISTORY = 'omnes_chat_history';
    const MAX_HISTORY = 20;

    // ---- RESPUESTAS ------------------------------------------------
    const RESPONSES = {
        trabajador_inicio: {
            text: 'Entendido. ¿Qué necesitas revisar?',
            chips: ['Revisar finiquito', 'Qué necesito enviar', 'Valores', 'Agendar']
        },
        empresa_inicio: {
            text: 'Perfecto. ¿Qué te gustaría explorar?',
            chips: ['Niveles de servicio', 'Desvinculaciones', 'Fiscalizaciones', 'Agendar']
        },
        'Revisar finiquito': {
            text: 'Puedo orientarte para revisar si tu finiquito está bien aplicado. Cada caso depende de causal, antigüedad, remuneración fija/variable y feriado. Si quieres, agenda una revisión de 20 minutos por Google Meet.',
            chips: ['Qué necesito enviar', 'Agendar']
        },
        'Qué necesito enviar': {
            text: 'Para revisar tu caso, ayuda contar con: contrato (si lo tienes), liquidaciones recientes (ideal 3), carta de despido o aviso, y borrador de finiquito (si existe). Si falta algo, lo vemos igual y te indico qué pedir.',
            chips: ['Agendar', 'Valores']
        },
        'Valores': {
            text: 'La reunión es una revisión preliminar (20 min). Si se requiere validación formal escrita o gestión adicional, se informa previamente la tarifa correspondiente.',
            chips: ['Agendar']
        },
        'Niveles de servicio': {
            text: 'Trabajamos en dos niveles: (1) Implementación Omnes (30 días): diagnóstico, orden contractual/documental y plan de control. (2) Dirección Laboral Externa (mensual): supervisión continua, prevención y apoyo en decisiones sensibles.',
            chips: ['Agendar']
        },
        'Desvinculaciones': {
            text: 'Te ayudamos a ejecutar desvinculaciones con respaldo: revisión de causal, cálculo, documentación y prevención de riesgos. Si quieres, agenda una revisión y lo vemos según tu caso.',
            chips: ['Agendar']
        },
        'Fiscalizaciones': {
            text: 'Revisamos brechas y dejamos un plan simple de cumplimiento: orden documental, contratos/anexos y recomendaciones prácticas para operar con tranquilidad.',
            chips: ['Agendar']
        },
        'Agendar': {
            text: 'Puedes agendar una revisión de 20 minutos por Google Meet aquí:',
            chips: [],
            calendly: true
        }
    };

    // Keyword matching para texto libre
    const KEYWORDS = [
        { keys: ['finiquito', 'despido', 'causal', 'feriado', 'carta', 'desvinculac'], action: 'Revisar finiquito' },
        { keys: ['contrato', 'anexo', 'reglamento', 'documental', 'documentos'], action: 'Niveles de servicio' },
        { keys: ['precio', 'valor', 'cobro', 'tarifa', 'costo', 'cuánto', 'cuanto'], action: 'Valores' },
        { keys: ['agenda', 'agendar', 'reunión', 'reunion', 'calendly', 'meet'], action: 'Agendar' },
        { keys: ['fiscaliz', 'inspección', 'inspeccion', 'dt ', 'dirección del trabajo'], action: 'Fiscalizaciones' }
    ];

    const ANTI_TAROT = 'Puedo ayudarte solo con orientación sobre Omnes y temas laborales relacionados. Si quieres, agenda una revisión y lo conversamos con contexto.';

    // ---- ESTILOS INLINE --------------------------------------------
    const CSS = `
    #omnes-faq-widget {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      position: fixed; bottom: 24px; right: 24px;
      z-index: 2147483647;
    }
    #omnes-faq-btn {
      width: 62px; height: 62px; border-radius: 50%;
      background: linear-gradient(135deg, #00ecff, #34d399);
      border: none; color: white; font-size: 28px; cursor: pointer;
      box-shadow: 0 6px 24px rgba(0,236,255,0.45);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
    }
    #omnes-faq-btn:hover { transform: scale(1.1); }
    #omnes-faq-panel {
      position: absolute; bottom: 78px; right: 0;
      width: 370px; max-width: 92vw;
      height: 540px; max-height: 70vh;
      background: rgba(10, 18, 35, 0.92);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7);
      opacity: 0; transform: translateY(20px);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    #omnes-faq-panel.open {
      opacity: 1; transform: translateY(0); pointer-events: all;
    }
    .ofaq-header {
      padding: 16px 18px;
      background: rgba(255,255,255,0.04);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex; justify-content: space-between; align-items: center;
      border-radius: 20px 20px 0 0;
      flex-shrink: 0;
    }
    .ofaq-header-info { display: flex; align-items: center; gap: 10px; }
    .ofaq-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg,#00ecff,#34d399);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .ofaq-header-text { display: flex; flex-direction: column; }
    .ofaq-header-text strong { color: #00ecff; font-size: 14px; letter-spacing: 0.3px; }
    .ofaq-header-text span { color: rgba(255,255,255,0.45); font-size: 11px; margin-top: 1px; }
    .ofaq-close-btn {
      background: none; border: none; color: rgba(255,255,255,0.4);
      font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px;
      transition: color 0.2s, background 0.2s; line-height: 1;
    }
    .ofaq-close-btn:hover { color: white; background: rgba(255,255,255,0.1); }
    #ofaq-log {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
      scrollbar-width: thin; scrollbar-color: #334155 transparent;
    }
    .ofaq-msg {
      padding: 11px 15px; border-radius: 16px;
      font-size: 14px; line-height: 1.55; max-width: 88%; word-wrap: break-word;
      animation: ofaqIn 0.22s ease-out;
    }
    @keyframes ofaqIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    .ofaq-msg.bot {
      align-self: flex-start;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: #f1f5f9;
      border-bottom-left-radius: 4px;
    }
    .ofaq-msg.user {
      align-self: flex-end;
      background: rgba(0,236,255,0.12);
      border: 1px solid rgba(0,236,255,0.2);
      color: #f1f5f9;
      border-bottom-right-radius: 4px;
    }
    .ofaq-chips {
      display: flex; flex-wrap: wrap; gap: 8px;
      margin-top: 4px; padding: 0 0 4px 0;
      align-self: flex-start; max-width: 100%;
    }
    .ofaq-chip {
      background: rgba(0,236,255,0.07);
      border: 1px solid rgba(0,236,255,0.35);
      color: #00ecff; font-size: 12.5px;
      padding: 6px 13px; border-radius: 20px;
      cursor: pointer; transition: background 0.2s, transform 0.15s;
      white-space: nowrap; font-family: inherit;
    }
    .ofaq-chip:hover { background: rgba(0,236,255,0.2); transform: scale(1.03); }
    .ofaq-calendly-btn {
      display: inline-block; margin-top: 10px;
      background: linear-gradient(135deg,#00ecff,#34d399);
      color: #0a1223; font-weight: 700; font-size: 13px;
      padding: 10px 18px; border-radius: 10px; border: none;
      cursor: pointer; transition: opacity 0.2s, transform 0.2s;
      font-family: inherit;
    }
    .ofaq-calendly-btn:hover { opacity: 0.88; transform: scale(1.02); }
    .ofaq-input-row {
      padding: 12px 14px;
      background: rgba(0,0,0,0.2);
      border-top: 1px solid rgba(255,255,255,0.08);
      border-radius: 0 0 20px 20px;
      display: flex; gap: 8px; flex-shrink: 0;
    }
    #ofaq-input {
      flex: 1; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 10px 14px;
      color: white; font-size: 13.5px; outline: none;
      transition: border-color 0.2s; font-family: inherit;
    }
    #ofaq-input:focus { border-color: rgba(0,236,255,0.5); }
    #ofaq-input::placeholder { color: rgba(255,255,255,0.3); }
    #ofaq-send {
      background: linear-gradient(135deg,#00ecff,#34d399);
      border: none; border-radius: 10px;
      width: 40px; height: 40px; flex-shrink: 0;
      color: #0a1223; font-size: 18px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.2s, transform 0.2s;
    }
    #ofaq-send:hover { opacity: 0.85; transform: scale(1.05); }
    @media (max-width: 440px) {
      #omnes-faq-panel { width: 92vw; right: 0; }
    }
  `;

    // ---- INIT ------------------------------------------------------
    const init = () => {
        if (document.getElementById('omnes-faq-widget')) return;

        // Estilos
        const styleEl = document.createElement('style');
        styleEl.id = 'omnes-faq-styles';
        styleEl.textContent = CSS;
        document.head.appendChild(styleEl);

        // Cargar Calendly CSS + JS (una sola vez)
        if (!document.querySelector('link[href*="calendly.com"]')) {
            const cl = document.createElement('link');
            cl.rel = 'stylesheet';
            cl.href = 'https://assets.calendly.com/assets/external/widget.css';
            document.head.appendChild(cl);
        }
        if (!document.querySelector('script[src*="calendly.com"]')) {
            const cs = document.createElement('script');
            cs.src = 'https://assets.calendly.com/assets/external/widget.js';
            cs.async = true;
            document.head.appendChild(cs);
        }

        // DOM
        const widget = document.createElement('div');
        widget.id = 'omnes-faq-widget';
        widget.innerHTML = `
      <button id="omnes-faq-btn" aria-label="Asistente Omnes">💬</button>
      <div id="omnes-faq-panel" role="dialog" aria-label="Asistente Omnes">
        <div class="ofaq-header">
          <div class="ofaq-header-info">
            <div class="ofaq-avatar">🏢</div>
            <div class="ofaq-header-text">
              <strong>Asistente Omnes</strong>
              <span>Orientación laboral · Chile</span>
            </div>
          </div>
          <button class="ofaq-close-btn" id="ofaq-close" aria-label="Cerrar">✕</button>
        </div>
        <div id="ofaq-log"></div>
        <div class="ofaq-input-row">
          <input type="text" id="ofaq-input" placeholder="Escribe tu consulta…" autocomplete="off" maxlength="300">
          <button id="ofaq-send" aria-label="Enviar">➔</button>
        </div>
      </div>
    `;
        document.body.appendChild(widget);

        // Referencias
        const btn = document.getElementById('omnes-faq-btn');
        const panel = document.getElementById('omnes-faq-panel');
        const closeBtn = document.getElementById('ofaq-close');
        const log = document.getElementById('ofaq-log');
        const input = document.getElementById('ofaq-input');
        const sendBtn = document.getElementById('ofaq-send');

        // Estado
        let isOpen = false;
        let profile = null; // 'trabajador' | 'empresa'
        let history = [];

        // Cargar desde localStorage
        const savedProfile = localStorage.getItem(LS_PROFILE);
        if (savedProfile) profile = savedProfile;
        try {
            const savedHistory = JSON.parse(localStorage.getItem(LS_HISTORY) || '[]');
            history = Array.isArray(savedHistory) ? savedHistory : [];
        } catch (_) { history = []; }

        // ---- helpers ----
        const saveState = () => {
            if (profile) localStorage.setItem(LS_PROFILE, profile);
            const trimmed = history.slice(-MAX_HISTORY);
            localStorage.setItem(LS_HISTORY, JSON.stringify(trimmed));
        };

        const scrollBottom = () => { log.scrollTop = log.scrollHeight; };

        const addMsg = (role, text) => {
            const el = document.createElement('div');
            el.className = `ofaq-msg ${role}`;
            el.textContent = text;
            log.appendChild(el);
            history.push({ role, text });
            if (history.length > MAX_HISTORY) history.shift();
            saveState();
            scrollBottom();
            return el;
        };

        const addChips = (options) => {
            if (!options || options.length === 0) return;
            const row = document.createElement('div');
            row.className = 'ofaq-chips';
            options.forEach(label => {
                const chip = document.createElement('button');
                chip.className = 'ofaq-chip';
                chip.textContent = label;
                chip.addEventListener('click', () => {
                    row.remove();
                    handleChip(label);
                });
                row.appendChild(chip);
            });
            log.appendChild(row);
            scrollBottom();
        };

        const addCalendlyBtn = () => {
            const btn = document.createElement('button');
            btn.className = 'ofaq-calendly-btn';
            btn.textContent = 'Agendar revisión (20 min)';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.Calendly) {
                    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
                } else {
                    window.open(CALENDLY_URL, '_blank');
                }
            });
            // Wrap in a bot-bubble-like container
            const wrap = document.createElement('div');
            wrap.className = 'ofaq-msg bot';
            wrap.style.cssText = 'background:transparent;border:none;padding:4px 0;';
            wrap.appendChild(btn);
            log.appendChild(wrap);
            scrollBottom();
        };

        const respond = (key) => {
            const resp = RESPONSES[key];
            if (!resp) {
                addMsg('bot', ANTI_TAROT);
                addChips(['Agendar']);
                return;
            }
            addMsg('bot', resp.text);
            if (resp.calendly) addCalendlyBtn();
            if (resp.chips && resp.chips.length) addChips(resp.chips);
        };

        const handleChip = (label) => {
            addMsg('user', label);
            if (label === 'Trabajador') {
                profile = 'trabajador';
                saveState();
                respond('trabajador_inicio');
            } else if (label === 'Empresa') {
                profile = 'empresa';
                saveState();
                respond('empresa_inicio');
            } else {
                respond(label);
            }
        };

        const matchKeyword = (text) => {
            const lower = text.toLowerCase();
            for (const { keys, action } of KEYWORDS) {
                if (keys.some(k => lower.includes(k))) return action;
            }
            return null;
        };

        const handleInput = () => {
            const text = input.value.trim();
            if (!text) return;
            input.value = '';
            addMsg('user', text);

            // Si no eligió perfil aún
            if (!profile) {
                addMsg('bot', 'Antes de continuar, ¿eres trabajador o empresa?');
                addChips(['Trabajador', 'Empresa']);
                return;
            }

            const matched = matchKeyword(text);
            if (matched) {
                respond(matched);
            } else {
                addMsg('bot', ANTI_TAROT);
                addChips(['Agendar']);
            }
        };

        // ---- Abrir/cerrar ----
        const openPanel = () => {
            isOpen = true;
            panel.classList.add('open');
            input.focus();
            // Bienvenida solo si no hay historial en pantalla
            if (log.children.length === 0) {
                if (history.length > 0) {
                    // Mostrar historial guardado (últimos MAX_HISTORY)
                    history.slice(-MAX_HISTORY).forEach(m => {
                        const el = document.createElement('div');
                        el.className = `ofaq-msg ${m.role}`;
                        el.textContent = m.text;
                        log.appendChild(el);
                    });
                    scrollBottom();
                    // Si hay perfil guardado, mostrar chips correspondientes
                    if (profile === 'trabajador') addChips(['Revisar finiquito', 'Qué necesito enviar', 'Valores', 'Agendar']);
                    else if (profile === 'empresa') addChips(['Niveles de servicio', 'Desvinculaciones', 'Fiscalizaciones', 'Agendar']);
                } else {
                    // Primera vez
                    addMsg('bot', 'Hola 👋 Soy el asistente de Omnes. ¿Eres trabajador o empresa?');
                    addChips(['Trabajador', 'Empresa']);
                }
            }
        };

        const closePanel = () => {
            isOpen = false;
            panel.classList.remove('open');
        };

        btn.addEventListener('click', () => isOpen ? closePanel() : openPanel());
        closeBtn.addEventListener('click', closePanel);
        sendBtn.addEventListener('click', handleInput);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleInput(); });

        // Importar historial previo desde la variable de la sesión (si se abrió antes)
        // Nada extra necesario — ya está en history.
    };

    // Bootstrap seguro
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
