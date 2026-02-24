/* OMNES - Cinematic Experience Engine */
import '../css/variables.css';
import '../css/global.css';
import '../css/home.css';

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initIntro();
    initHeroEffects();
    initNeuralField();
    initScrollProgress(); // New: Neural Progress Bar
    initHorizontalScroll(); // New: Drag-to-Scroll
    initReveals();
    initHeader();
    initLanguage();
    initStats();
    initInteractiveCards();
    initContactForm();
    initGlobalMap();
});

/**
 * Contact Form Handler - Ready for API integration
 */
function initContactForm() {
    const form = document.getElementById('omnes-contact');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'PROCESANDO...';
        btn.disabled = true;

        const formData = new FormData(form);

        try {
            // Using FormSubmit - High success rate with Gmail
            const response = await fetch('https://formsubmit.co/ajax/radiomegustacl@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            });

            if (response.ok) {
                alert('¡Mensaje enviado con éxito! REVISA TU GMAIL (radiomegustacl@gmail.com) y confirma el correo de FormSubmit para activar el sistema.');
                form.reset();
            } else {
                throw new Error();
            }
        } catch (error) {
            alert('Atención: Revisa tu Gmail (incluyendo SPAM). Debes activar el sistema en el mensaje de FormSubmit para recibir consultas.');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

/**
 * Custom Cursor System - Optimized for Performance
 */
function initCursor() {
    if (window.matchMedia("(hover: none)").matches) return;

    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animate = () => {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

        // Essential for the hovering class in CSS to not break movement
        follower.style.setProperty('--f-x', `${followerX}px`);
        follower.style.setProperty('--f-y', `${followerY}px`);

        requestAnimationFrame(animate);
    };
    animate();

    // Hover logic
    const interactives = document.querySelectorAll('a, button, .pillar-card, .service-card-3d, .perspective-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hovering');
        });
    });
}

/**
 * Cinematic Intro Sequence
 */
function initIntro() {
    const intro = document.getElementById('intro-overlay');
    if (!intro) return;

    document.body.classList.add('start-intro');

    setTimeout(() => {
        intro.classList.add('hidden');
        document.body.classList.add('intro-complete');
    }, 2500);
}

/**
 * Hero & Dynamic Backgrounds
 */
function initHeroEffects() {
    const hero = document.querySelector('.hero-institutional');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        // Subtle parallax
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    });
}

/**
 * Intersection Observer for Reveals
 */
function initReveals() {
    const options = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
}

/**
 * Header Scroll Effect
 */
function initHeader() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Smooth Scroll Logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Close mobile menu if open (future proofing)
                const nav = document.querySelector('.nav-desktop');
                if (nav) nav.classList.remove('active');
            }
        });
    });

    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const nav = document.querySelector('.nav-desktop');
            if (nav) nav.classList.toggle('active');
        });
    }
}

/**
 * Language System Data
 */
const translations = {
    es: {
        inicio: "Inicio",
        impacto: "Impacto",
        servicios: "Servicios",
        capacitacion: "Capacitación",
        proyectos: "Proyectos",
        perspectivas: "Perspectivas",
        contacto: "Contacto",
        introClaim: "DONDE EL CAMBIO SE CONVIERTE EN LEGADO.",
        heroClaim: "INTEGRANDO ESTRATEGIA • TRANSFORMANDO EL FUTURO",
        heroTitle: "Consultoría Estratégica Internacional",
        heroSubtitle: "Lideramos la evolución de instituciones globales con rigor estratégico y liderazgo consciente.",
        exploreImpact: "Ver Impacto",
        consultancy: "Consultoría",
        philTitle: "Filosofía Institucional",
        philDesc: "En OMNES fundamentamos nuestra intervención en la integración estratégica de sistemas sociales y productivos, asegurando que cada transformación sea robusta, humana y sostenible en el tiempo.",
        impactSurtitle: "EL ALCANCE OMNES",
        impactTitle: "Impacto Integral Multidimensional",
        bento1Title: "Organizaciones de Alto Nivel",
        bento1Desc: "Rediseñamos el ADN corporativo para la era de la inteligencia y la sostenibilidad global.",
        bento2Title: "Capital Humano",
        bento2Desc: "Potenciamos el liderazgo adaptativo en niveles ejecutivos.",
        bento3Title: "Impacto Social",
        bento3Desc: "Construimos valor compartido con legados comunitarios.",
        servicesSurtitle: "MODELOS PROPIOS",
        servicesTitle: "Servicios de Transformación Elite",
        service1Title: "Consultoría Estratégica Compleja",
        service1Desc: "Diseño de arquitecturas organizacionales de alto rendimiento para escenarios volátiles.",
        service2Title: "Outplacement de Alta Dirección",
        service2Desc: "Acompañamiento premium para la transición de líderes que definen industrias.",
        service3Title: "Gestión del Cambio Disruptivo",
        service3Desc: "Garantizamos la adopción cultural de nuevos paradigmas operativos y tecnológicos.",
        service4Title: "Liderazgo Consciente",
        service4Desc: "Programas de inmersión para el desarrollo de la consciencia ejecutiva y legado.",
        perspectivesTitle: "Perspectivas Estratégicas",
        globalExpansionTitle: "EXPANSIÓN GLOBAL OMNES",
        globalMapSub: "Presencia estratégica en los mercados que definen el futuro.",
        commTitle: "ESTRUCTURA COMERCIAL OMNES",
        commSubtitle: "Soluciones estratégicas diseñadas para transformar organizaciones, personas y comunidades.",
        div1Title: "División I – Transformación Organizacional",
        div1Desc: "Arquitectura de soluciones enfocadas en la solidez estructural y la agilidad institucional.",
        plan1Name: "PLAN ESTRUCTURA",
        plan1Desc: "Diagnóstico estratégico integral para identificar brechas, oportunidades y líneas de optimización.",
        plan1B1: "Mapeo de procesos críticos",
        plan1B2: "Análisis de cultura organizacional",
        plan1B3: "Detección de ineficiencias",
        plan2Name: "PLAN EVOLUCIÓN",
        plan2Desc: "Acompañamiento estructurado con diseño de hoja de ruta, indicadores y seguimiento estratégico.",
        plan2B1: "Hoja de ruta personalizada",
        plan2B2: "KPIs de gestión estratégica",
        plan2B3: "Mentoría directiva continua",
        plan3Name: "PLAN LEGADO",
        plan3Desc: "Reestructuración integral, implementación supervisada y medición de impacto sostenible.",
        plan3B1: "Cambio organizacional integral",
        plan3B2: "Medición de impacto ESG",
        plan3B3: "Legado institucional garantizado",
        customProposal: "Propuesta personalizada",
        btnEvaluation: "Solicitar Evaluación Estratégica",
        div2Title: "División II – Desarrollo Profesional",
        div2Desc: "Programas de inmersión técnica y humana que potencian la consciencia ejecutiva.",
        level1Name: "Taller Estratégico",
        level1Desc: "Sesiones intensivas de alineación y resolución de desafíos tácticos inmediatos.",
        level2Name: "Programa Intensivo",
        level2Desc: "Formación profunda en competencias críticas de liderazgo y gestión del cambio.",
        level3Name: "Programa Integral Certificado",
        level3Desc: "Malla curricular completa con validación de competencias a nivel internacional.",
        btnProgram: "Solicitar Programa",
        div3Title: "División III – Impacto Territorial",
        div3Desc: "Estrategias territoriales enfocadas en la equidad social y la reinserción sostenible.",
        impactItem1Name: "Proyecto Comunitario Base",
        impactItem1Desc: "Iniciativas locales de fortalecimiento del tejido social y económico microterritorial.",
        impactItem2Name: "Programa de Reinserción",
        impactItem2Desc: "Estructura profesional de apoyo para la vuelta al mercado laboral con dignidad y enfoque.",
        impactItem3Name: "Intervención Territorial Integral",
        impactItem3Desc: "Transformación sistémica de ecosistemas locales con medición de impacto estructural.",
        btnInitiative: "Proponer Iniciativa",
        startupTitle: "Desarrollo de software para startups",
        startupSub: "Llevemos tu startup al siguiente nivel",
        startupBody: "Para evitar problemas con un diseño o arquitectura de sistema deficiente dentro de una base de código, los fundadores de startups suelen buscar desarrolladores integrales y con experiencia para trabajar en el nuevo producto. Devro LABS cuenta con casi 3 años de experiencia en el desarrollo de productos de software desde la fase de generación de ideas. Hemos demostrado nuestra fiabilidad al prestar servicio a millones de usuarios en todo el mundo. ¡Hagamos realidad tu idea juntos! Podemos ayudarte a convertir tus ideas de startup en máquinas generadoras de ingresos.",
        startupCtaTitle: "¿Tienes una idea brillante para una startup?",
        startupCtaSub: "Cuéntanos el reto que quieres resolver y encontraremos una solución digital.",
        contactNeeds: "Por favor, cuéntenos cuáles son sus necesidades.",
        contactTitle: "Inicie la Transformación",
        contactDesc: "Estamos listos para conversar sobre el legado que desea construir.",
        contactName: "Nombre Completo",
        contactEmail: "Email Corporativo",
        contactMessage: "Mensaje Estratégico",
        sendMessage: "Enviar Mensaje",
        footerClaim: "DONDE EL CAMBIO SE CONVIERTE EN LEGADO.",
        rights: "© 2026 OMNES Global. Todos los derechos reservados.",
        privacy: "Privacidad",
        terms: "Términos"
    },
    en: {
        inicio: "Home",
        impacto: "Impact",
        servicios: "Services",
        capacitacion: "Training",
        proyectos: "Projects",
        perspectivas: "Insights",
        contacto: "Contact",
        introClaim: "WHERE CHANGE BECOMES LEGACY.",
        heroClaim: "INTEGRATING STRATEGY • TRANSFORMING THE FUTURE",
        heroTitle: "International Strategic Consultancy",
        heroSubtitle: "We lead the evolution of global institutions with strategic rigor and conscious leadership.",
        exploreImpact: "View Impact",
        consultancy: "Consultancy",
        philTitle: "Institutional Philosophy",
        philDesc: "At OMNES we base our intervention on the strategic integration of social and productive systems, ensuring that each transformation is robust, human and sustainable over time.",
        impactSurtitle: "THE OMNES SCOPE",
        impactTitle: "Multidimensional Integral Impact",
        bento1Title: "High-Level Organizations",
        bento1Desc: "We redesign corporate DNA for the era of intelligence and global sustainability.",
        bento2Title: "Human Capital",
        bento2Desc: "We empower adaptive leadership at executive levels.",
        bento3Title: "Social Impact",
        bento3Desc: "We build shared value with community legacies.",
        servicesSurtitle: "PROPRIETARY MODELS",
        servicesTitle: "Elite Transformation Services",
        service1Title: "Complex Strategic Consultancy",
        service1Desc: "Design of high-performance organizational architectures for volatile scenarios.",
        service2Title: "Executive Outplacement",
        service2Desc: "Premium guidance for the transition of industry-defining leaders.",
        service3Title: "Disruptive Change Management",
        service3Desc: "We guarantee cultural adoption of new operational and technological paradigms.",
        service4Title: "Conscious Leadership",
        service4Desc: "Immersion programs for the development of executive awareness and legacy.",
        perspectivesTitle: "Strategic Perspectives",
        globalExpansionTitle: "OMNES GLOBAL EXPANSION",
        globalMapSub: "Strategic presence in markets that define the future.",
        commTitle: "OMNES COMMERCIAL ARCHITECTURE",
        commSubtitle: "Strategic solutions designed to transform organizations, people, and communities.",
        div1Title: "Division I – Organizational Transformation",
        div1Desc: "Solution architecture focused on structural solidity and institutional agility.",
        plan1Name: "STRUCTURE PLAN",
        plan1Desc: "Comprehensive strategic diagnosis to identify gaps, opportunities, and optimization lines.",
        plan1B1: "Critical process mapping",
        plan1B2: "Organizational culture analysis",
        plan1B3: "Inefficiency detection",
        plan2Name: "EVOLUTION PLAN",
        plan2Desc: "Structured accompaniment with roadmap design, indicators, and strategic monitoring.",
        plan2B1: "Personalized roadmap",
        plan2B2: "Strategic management KPIs",
        plan2B3: "Continuous executive mentoring",
        plan3Name: "LEGACY PLAN",
        plan3Desc: "Comprehensive restructuring, supervised implementation, and sustainable impact measurement.",
        plan3B1: "Integral organizational change",
        plan3B2: "ESG impact measurement",
        plan3B3: "Guaranteed institutional legacy",
        customProposal: "Customized Proposal",
        btnEvaluation: "Request Strategic Evaluation",
        div2Title: "Division II – Professional Development",
        div2Desc: "Technical and human immersion programs that empower executive awareness.",
        level1Name: "Strategic Workshop",
        level1Desc: "Intensive alignment sessions and resolution of immediate tactical challenges.",
        level2Name: "Intensive Program",
        level2Desc: "Deep formation in critical leadership and change management competencies.",
        level3Name: "Certified Integral Program",
        level3Desc: "Complete curriculum with international competency validation.",
        btnProgram: "Request Program",
        div3Title: "Division III – Territorial Impact",
        div3Desc: "Territorial strategies focused on social equity and sustainable reinsertion.",
        impactItem1Name: "Base Community Project",
        impactItem1Desc: "Local initiatives to strengthen the micro-territorial social and economic fabric.",
        impactItem2Name: "Reinsertion Program",
        impactItem2Desc: "Professional support structure for returning to the labor market with dignity and focus.",
        impactItem3Name: "Integral Territorial Intervention",
        impactItem3Desc: "Systemic transformation of local ecosystems with structural impact measurement.",
        btnInitiative: "Propose Initiative",
        startupTitle: "Software Development for Startups",
        startupSub: "Take your startup to the next level",
        startupBody: "To avoid problems with poor design or system architecture within a codebase, startup founders often seek comprehensive and experienced developers to work on the new product. Devro LABS has nearly 3 years of experience in software product development from the ideation phase. We have proven our reliability by serving millions of users worldwide. Let's make your idea a reality together! We can help you turn your startup ideas into revenue-generating machines.",
        startupCtaTitle: "Do you have a brilliant idea for a startup?",
        startupCtaSub: "Tell us the challenge you want to solve and we will find a digital solution.",
        contactNeeds: "Please tell us about your needs.",
        contactTitle: "Start the Transformation",
        contactDesc: "We are ready to talk about the legacy you wish to build.",
        contactName: "Full Name",
        contactEmail: "Corporate Email",
        contactMessage: "Strategic Message",
        sendMessage: "Send Message",
        footerClaim: "WHERE CHANGE BECOMES LEGACY.",
        rights: "© 2026 OMNES Global. All rights reserved.",
        privacy: "Privacy",
        terms: "Terms"
    },
    pt: {
        inicio: "Início",
        impacto: "Impacto",
        servicios: "Serviços",
        capacitacion: "Capacitação",
        proyectos: "Projetos",
        perspectivas: "Perspectivas",
        contacto: "Contato",
        introClaim: "ONDE A MUDANÇA SE TORNA LEGADO.",
        heroClaim: "INTEGRANDO ESTRATÉGIA • TRANSFORMANDO O FUTURO",
        heroTitle: "Consultoria Estratégica Internacional",
        heroSubtitle: "Lideramos a evolução de instituições globais com rigor estratégico e liderança consciente.",
        exploreImpact: "Ver Impacto",
        consultancy: "Consultoria",
        philTitle: "Filosofia Institucional",
        philDesc: "Na OMNES fundamentamos nossa intervenção na integração estratégica de sistemas sociais e produtivos, assegurando que cada transformação seja robusta, humana e sustentável no tempo.",
        impactSurtitle: "O ALCANCE OMNES",
        impactTitle: "Impacto Integral Multidimensional",
        bento1Title: "Organizações de Alto Nível",
        bento1Desc: "Redesenhamos o DNA corporativo para a era da inteligência e sustentabilidade global.",
        bento2Title: "Capital Humano",
        bento2Desc: "Potencializamos a liderança adaptativa em níveis executivos.",
        bento3Title: "Impacto Social",
        bento3Desc: "Construímos valor compartilhado com legados comunitários.",
        servicesSurtitle: "MODELOS PRÓPRIOS",
        servicesTitle: "Serviços de Transformação Elite",
        service1Title: "Consultoria Estratégica Complexa",
        service1Desc: "Projeto de arquiteturas organizacionais de alto desempenho para cenários voláteis.",
        service2Title: "Outplacement Executivo",
        service2Desc: "Acompanhamento premium para a transição de líderes que definem indústrias.",
        service3Title: "Gestão da Mudança Disruptiva",
        service3Desc: "Garantimos a adoção cultural de novos paradigmas operacionais e tecnológicos.",
        service4Title: "Liderazgo Consciente",
        service4Desc: "Programas de imersão para o desenvolvimento da consciência executiva e legado.",
        perspectivesTitle: "Perspectivas Estratégicas",
        globalExpansionTitle: "EXPANSÃO GLOBAL OMNES",
        globalMapSub: "Presença estratégica nos mercados que definem o futuro.",
        commTitle: "ESTRUTURA COMERCIAL OMNES",
        commSubtitle: "Soluções estratégicas desenhadas para transformar organizações, pessoas e comunidades.",
        div1Title: "Divisão I – Transformação Organizacional",
        div1Desc: "Arquitetura de soluções focadas na solidez estrutural e agilidad institucional.",
        plan1Name: "PLANO ESTRUTURA",
        plan1Desc: "Diagnóstico estratégico integral para identificar lacunas, oportunidades e linhas de optimização.",
        plan1B1: "Mapeamento de processos críticos",
        plan1B2: "Análise da cultura organizacional",
        plan1B3: "Detecção de ineficiências",
        plan2Name: "PLANO EVOLUÇÃO",
        plan2Desc: "Acompanhamento estruturado com desenho de roteiro, indicadores e monitoramento estratégico.",
        plan2B1: "Roteiro personalizado",
        plan2B2: "KPIs de gestão estratégica",
        plan2B3: "Mentoria diretiva contínua",
        plan3Name: "PLANO LEGADO",
        plan3Desc: "Reestruturação integral, implementação supervisionada e medição de impacto sustentável.",
        plan3B1: "Mudança organizacional integral",
        plan3B2: "Medição de impacto ESG",
        plan3B3: "Legado institucional garantido",
        customProposal: "Proposta personalizada",
        btnEvaluation: "Solicitar Avaliação Estratégica",
        div2Title: "Divisão II – Desenvolvimento Profissional",
        div2Desc: "Programas de imersão técnica e humana que potencializam a consciência executiva.",
        level1Name: "Workshop Estratégico",
        level1Desc: "Sessões intensivas de alinhamento e resolução de desafios táticos imediatos.",
        level2Name: "Programa Intensivo",
        level2Desc: "Formação profunda em competências críticas de liderança e gestão da mudança.",
        level3Name: "Programa Integral Certificado",
        level3Desc: "Grade curricular completa com validação de competências em nível internacional.",
        btnProgram: "Solicitar Programa",
        div3Title: "Divisão III – Impacto Territorial",
        div3Desc: "Estratégias territoriais focadas na equidade social e reinserção sustentável.",
        impactItem1Name: "Projeto Comunitário Base",
        impactItem1Desc: "Iniciativas locais de fortalecimento do tecido social e económico microterritorial.",
        impactItem2Name: "Programa de Reinserción",
        impactItem2Desc: "Estrutura profissional de apoio para o retorno ao mercado de trabalho com dignidade e foco.",
        impactItem3Name: "Intervención Territorial Integral",
        impactItem3Desc: "Transformação sistémica de ecossistemas locais com medição de impacto estrutural.",
        btnInitiative: "Propor Iniciativa",
        startupTitle: "Desenvolvimento de software para startups",
        startupSub: "Levemos sua startup ao próximo nível",
        startupBody: "Para evitar problemas com design ou arquitetura de sistema deficiente dentro de uma base de código, fundadores de startups costumam buscar desenvolvedores integrais e experientes para trabalhar no novo produto. Devro LABS conta con quase 3 anos de experiência em desenvolvimento de produtos de software desde a fase de ideação. Demonstramos nossa confiabilidade atendendo a milhões de usuários em todo o mundo. Vamos tornar sua ideia realidade juntos! Podemos ajudá-lo a transformar suas ideias de startup em máquinas geradoras de receita.",
        startupCtaTitle: "Você tem uma ideia brilhante para uma startup?",
        startupCtaSub: "Conte-nos o desafio que deseja resolver e encontraremos uma solução digital.",
        contactNeeds: "Por favor, conte-nos sobre suas necessidades.",
        contactTitle: "Inicie a Transformação",
        contactDesc: "Estamos prontos para conversar sobre o legado que deseja construir.",
        contactName: "Nome Completo",
        contactEmail: "Email Corporativo",
        contactMessage: "Mensagem Estratégica",
        sendMessage: "Enviar Mensagem",
        footerClaim: "ONDE A MUDANÇA SE TORNA LEGADO.",
        rights: "© 2026 OMNES Global. Todos os direitos reservados.",
        privacy: "Privacidade",
        terms: "Termos"
    }
};

function updateContent(lang) {
    const t = translations[lang];
    if (!t) return;
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.getAttribute('data-lang-key');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.innerText = t[key];
            }
        }
    });
}

function initLanguage() {
    const toggle = document.getElementById('lang-toggle');
    const dropdown = document.getElementById('lang-dropdown');
    const currentLangText = document.querySelector('.lang-current');

    let currentLang = localStorage.getItem('omnes_lang') || 'es';
    updateContent(currentLang);

    if (toggle && dropdown) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });

        dropdown.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = a.getAttribute('data-lang');
                currentLang = lang;
                localStorage.setItem('omnes_lang', lang);
                if (currentLangText) currentLangText.innerText = lang.toUpperCase();
                updateContent(lang);
                dropdown.classList.remove('show');
            });
        });
    }
}

/**
 * Stats Counter - One-time activation
 */
function initStats() {
    const stats = document.querySelectorAll('.stat-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valEl = entry.target.querySelector('.stat-value');
                if (valEl && !entry.target.classList.contains('counted')) {
                    const target = parseInt(valEl.getAttribute('data-target'));
                    animateCount(valEl, target);
                    entry.target.classList.add('active');
                    entry.target.classList.add('counted');
                }
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
}

function animateCount(el, target) {
    let current = 0;
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = target + '+';
            clearInterval(timer);
        } else {
            el.innerText = Math.floor(current) + '+';
        }
    }, stepTime);
}

/**
 * Scroll Progress Bar - Neural Aesthetic
 */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'neural-progress-bar';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    });
}

/**
 * Horizontal Scroll Drag Logic
 */
function initHorizontalScroll() {
    const slider = document.querySelector('.services-container-horizontal');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

function initInteractiveCards() {
    const cards = document.querySelectorAll('.service-card-luxury');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
}

/**
 * Neural Field - Cinematic Background Connectivity
 */
function initNeuralField() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h;
    let particles = [];
    const particleCount = 60;
    const connectDistance = 180;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
    }

    function init() {
        resize();
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();

            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 236, 255, 0.4)';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    const alpha = (1 - dist / connectDistance) * 0.2;
                    ctx.strokeStyle = `rgba(0, 236, 255, ${alpha})`;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
}

/**
 * National Presence Map - Strategic Visualization 3.0
 * Features a stylized map of Chile with tactical markers
 */
function initGlobalMap() {
    const container = document.getElementById('impact-map');
    if (!container) return;

    container.innerHTML = '';

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 400 800");
    svg.style.width = "100%";
    svg.style.height = "100%";

    // Hubs Data - Mapped to the new stylized silhouette
    const hubs = [
        { x: 235, y: 140, name: "Iquique", role: "Zona Norte" },
        { x: 230, y: 220, name: "Antofagasta", main: true, role: "HQ - Centro Estratégico" },
        { x: 210, y: 340, name: "Copiapó", role: "Minería & Energía" },
        { x: 195, y: 490, name: "Santiago", role: "Centro Institucional" },
        { x: 180, y: 590, name: "Concepción", role: "Zona Sur" }
    ];

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <linearGradient id="chileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(0, 236, 255, 0.05);stop-opacity:1" />
            <stop offset="50%" style="stop-color:rgba(0, 236, 255, 0.15);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(0, 236, 255, 0.05);stop-opacity:1" />
        </linearGradient>
        <filter id="hubGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    `;
    svg.appendChild(defs);

    // STYLIZED CHILE SILHOUETTE (Simplified but recognizable)
    const chilePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // Detailed spine of Chile
    const d = `
        M220,50 L245,130 L240,210 L230,280 L220,350 L210,420 
        L200,480 L195,540 L185,600 L175,650 L165,700 L150,760
        L130,750 L150,650 L170,550 L180,450 L195,350 L210,250 
        L225,150 L210,50 Z
    `;
    chilePath.setAttribute("d", d);
    chilePath.setAttribute("fill", "url(#chileGradient)");
    chilePath.setAttribute("stroke", "rgba(0, 236, 255, 0.2)");
    chilePath.setAttribute("stroke-width", "1");
    svg.appendChild(chilePath);

    const mainHub = hubs.find(h => h.main);

    hubs.forEach((hub, i) => {
        // Connection lines (Strategic arcs)
        if (!hub.main) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const midX = (hub.x + mainHub.x) / 2 + 40;
            const pathD = `M ${mainHub.x} ${mainHub.y} Q ${midX} ${(hub.y + mainHub.y) / 2} ${hub.x} ${hub.y}`;
            line.setAttribute("d", pathD);
            line.setAttribute("fill", "none");
            line.setAttribute("stroke", "rgba(0, 236, 255, 0.4)");
            line.setAttribute("stroke-width", "1");
            line.setAttribute("stroke-dasharray", "1000");
            line.setAttribute("stroke-dashoffset", "1000");
            line.style.animation = `lineReveal 4s ease forwards ${1 + i * 0.4}s`;
            svg.appendChild(line);
        }

        // Pulse
        const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pulse.setAttribute("cx", hub.x);
        pulse.setAttribute("cy", hub.y);
        pulse.setAttribute("r", "5");
        pulse.setAttribute("fill", "none");
        pulse.setAttribute("stroke", hub.main ? "#34d399" : "#00ecff");
        pulse.style.animation = `hubPulse 2.5s infinite ${i * 0.5}s`;
        svg.appendChild(pulse);

        // Dot
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", hub.x);
        dot.setAttribute("cy", hub.y);
        dot.setAttribute("r", hub.main ? "6" : "4");
        dot.setAttribute("fill", hub.main ? "#34d399" : "#00ecff");
        dot.setAttribute("filter", "url(#hubGlow)");
        svg.appendChild(dot);

        // HTML Label
        const pill = document.createElement('div');
        pill.className = `hub-pill ${hub.main ? 'main-hub' : ''}`;
        pill.innerHTML = `<span class="dot"></span> ${hub.name}`;
        pill.style.left = `${(hub.x / 400) * 100}%`;
        pill.style.top = `${(hub.y / 800) * 100}%`;
        container.appendChild(pill);

        setTimeout(() => pill.classList.add('active'), 2000 + i * 300);
    });

    container.appendChild(svg);
}
