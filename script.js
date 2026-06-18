/**
 * ============================================================================
 * XBOX TIMELINE AUTOMATION ENGINE - EDICÃO PREMIUM ULTIMATE
 * CORE APPS & GAME STATE ENGINE v3.0 (COMPLETE VERSION - NO OMISSION)
 * ============================================================================
 */

// CONFIGURAÇÕES GLOBAIS DO ECOSSISTEMA
const CONFIG = {
    totalEras: 8,
    maxScore: 1000,
    sfxEnabled: true,
    animationsEnabled: true,
    aiModel: "gpt-4o-mini",
    apiEndpoint: "https://api.openai.com/v1/chat/completions",
    adInterval: 7000 // Tempo de rotação dos anúncios (7 segundos)
};

// ESTADO CENTRAL DA APLICAÇÃO (PERSISTIDO VIA LOCALSTORAGE)
let gameState = {
    gamerscore: 0,
    exploredEras: [],
    solvedQuizzes: [],
    unlockedAchievements: [],
    userGamertag: "Guest",
    rank: "Recruta",
    loginTime: null,
    postsComunidade: []
};

// BANCO DE DADOS DE PATENTES SPARTAN
const RANKS_DB = [
    { min: 0, name: "Recruta", class: "init" },
    { min: 100, name: "Marine", class: "marine" },
    { min: 250, name: "ODST", class: "odst" },
    { min: 450, name: "Spartan-IV", class: "spartan4" },
    { min: 650, name: "Spartan-III", class: "spartan3" },
    { min: 850, name: "Spartan-II", class: "spartan2" },
    { min: 980, name: "Master Chief", class: "master" },
    { min: 1100, name: "Reclaimer", class: "reclaimer" }
];

// REPOSITÓRIO INTERATIVO DE DESAFIOS TÁTICOS (QUIZZES)
const QUIZ_DB = {
    'proto': {
        q: "Qual era a forma original do protótipo físico do primeiro console?",
        options: [
            { text: "Um cubo preto gigante", correct: false },
            { text: "Um 'X' de alumínio prateado", correct: true },
            { text: "Uma esfera verde neon", correct: false }
        ]
    },
    'classic': {
        q: "Qual foi o jogo de lançamento que revolucionou o multiplayer em tela dividida?",
        options: [
            { text: "Halo: Combat Evolved", correct: true },
            { text: "Forza Motorsport", correct: false },
            { text: "Gears of War", correct: false }
        ]
    },
    'live': {
        q: "Qual exigência polêmica a Xbox Live fez em 2002?",
        options: [
            { text: "Uso exclusivo de Banda Larga", correct: true },
            { text: "Assinatura vitalícia obrigatória", correct: false },
            { text: "Reconhecimento facial", correct: false }
        ]
    },
    '360': {
        q: "Qual era o nome do infame erro fatal de hardware do Xbox 360?",
        options: [
            { text: "Green Screen of Death", correct: false },
            { text: "Red Ring of Death (3RL)", correct: true },
            { text: "System Panic X", correct: false }
        ]
    },
    'kinect': {
        q: "Qual era o codinome do projeto Kinect durante seu desenvolvimento?",
        options: [
            { text: "Project Scorpio", correct: false },
            { text: "Project Natal", correct: true },
            { text: "Project Scarlett", correct: false }
        ]
    },
    'one': {
        q: "Qual foi o foco muito criticado da apresentação inicial do Xbox One?",
        options: [
            { text: "Apenas jogos Indie", correct: false },
            { text: "Realidade Virtual", correct: false },
            { text: "TV, Esportes e Entretenimento geral", correct: true }
        ]
    },
    'gamepass': {
        q: "Qual empresa gigante a Microsoft adquiriu em 2020 para fortalecer o Game Pass?",
        options: [
            { text: "Electronic Arts", correct: false },
            { text: "Bethesda (ZeniMax)", correct: true },
            { text: "Ubisoft", correct: false }
        ]
    },
    'series': {
        q: "Qual arquitetura patenteada resolveu os gargalos de loading de SSD no Series X|S?",
        options: [
            { text: "Velocity Architecture", correct: true },
            { text: "Blast Processing", correct: false },
            { text: "Quantum Drive", correct: false }
        ]
    }
};

// REPOSITÓRIO COMPLETO DE CONQUISTAS DO COFRE UI
const ACHIEVEMENTS_DB = [
    { id: "LINK_NEURAL", title: "Link Neural Estabelecido", desc: "Autenticou com sucesso seu perfil Spartan.", points: 10, icon: "🛡️" },
    { id: "EXPLORADOR_PROTO", title: "Origens Secretas", desc: "Analisou os arquivos do Protótipo DirectX.", points: 50, icon: "💾" },
    { id: "EXPLORADOR_CLASSIC", title: "Combatente de 2001", desc: "Descriptografou o nascimento do Xbox Original.", points: 100, icon: "💚" },
    { id: "EXPLORADOR_LIVE", title: "Sempre Online", desc: "Estudou a fundação da infraestrutura Xbox Live.", points: 100, icon: "🌐" },
    { id: "EXPLORADOR_360", title: "Sobrevivente das 3 Luzes", desc: "Acessou a história da era dourada e o anel vermelho.", points: 100, icon: "⭕" },
    { id: "EXPLORADOR_KINECT", title: "Movimento Livre", desc: "Analisou o hardware de sensores biométricos do Kinect.", points: 100, icon: "👁️" },
    { id: "EXPLORADOR_ONE", title: "A Grande Reinvenção", desc: "Descobriu os bastidores do gerenciamento de Phil Spencer.", points: 100, icon: "🎮" },
    { id: "EXPLORADOR_GAMEPASS", title: "Acesso Ilimitado", desc: "Entendeu o impacto econômico do ecossistema Game Pass.", points: 100, icon: "📚" },
    { id: "EXPLORADOR_SERIES", title: "Velocidade da Luz", desc: "Desbloqueou dados sobre a arquitetura do Series X|S.", points: 100, icon: "🚀" },
    { id: "MESTRE_TATICO", title: "Mente Brilhante", desc: "Acertou um desafio de quiz sem erros na primeira tentativa.", points: 50, icon: "🧠" },
    { id: "TRANSMISSOR", title: "Voz da Resistência", desc: "Publicou sua primeira mensagem criptografada no fórum.", points: 20, icon: "📡" },
    { id: "MIL_DE_MIL", title: "MIL DE MIL", desc: "Mestre Supremo Absoluto da Linha do Tempo Xbox.", points: 200, icon: "👑" }
];

// REPOSITÓRIO LÉXICO INTERNO DA ASSISTENTE CORTANA
const KEYWORDS_DB = [
    { keys: ['halo', 'chief', 'cortana', 'john'], res: "Halo é a espência vital deste sistema. Lançado em 2001, definiu os jogos de tiro modernos nos consoles. Master Chief (John-117) e eu (Cortana) fomos desenvolvidos para proteger a galáxia e indexar esta timeline!" },
    { keys: ['360', '3rl', 'anel', 'luzes', 'vermelho'], res: "O Xbox 360 foi revolucionário, mas enfrentou a crise do 'Red Ring of Death' (3RL) em 2005 devido a estresse térmico. Mesmo assim, consolidou franquias como Gears of War e Mass Effect." },
    { keys: ['kinect', 'movimento', 'natal', 'sensor'], res: "O Kinect (originalmente Project Natal) foi lançado em 2010. Utilizava matriz de microfones e infravermelho. Tornou-se o eletrônico de consumo mais vendido rapidamente na história da época." },
    { keys: ['pass', 'gamepass', 'assinatura', 'netflix'], res: "Introduzido em 2017, o Xbox Game Pass mudou completamente as regras de monetização da indústria, focando em um ecossistema multiplataforma baseado em recorrência." },
    { keys: ['nuvem', 'cloud', 'xcloud', 'streaming'], res: "O Xbox Cloud Gaming (xCloud) roda diretamente sobre servidores customizados formados por chips de hardware do Xbox Series X nos datacenters Azure, enviando streams de baixa latência." },
    { keys: ['bethesda', 'activision', 'blizzard', 'compra', 'estudios'], res: "A Microsoft redefiniu o mercado global por meio de aquisições de massivas holdings, destacando-se a ZeniMax Media (Bethesda) e a Activision Blizzard King por valores recordes." },
    { keys: ['conquista', 'gamerscore', 'g', 'score'], res: "As conquistas nasceram no Xbox 360 em 2005. O seu progresso atual está sendo computado em tempo real no menu superior do nosso sistema." },
    { keys: ['ajuda', 'comandos', 'oq fazer', 'clear'], res: "Você pode clicar nos cards da linha do tempo para investigá-los, responder os quizzes integrados, alterar configurações no painel ou postar sinal no hub da comunidade." }
];

// BANCO DE DADOS DE ANÚNCIOS DINÂMICOS
const ADS_DB = [
    { 
        text: "Assine o XBOX GAME PASS ULTIMATE hoje e jogue títulos no Day One!", 
        link: "https://www.xbox.com/pt-BR/xbox-game-pass", 
        img: "https://placehold.co/300x150/107c11/FFF?text=Game+Pass" 
    },
    { 
        text: "Entre no combate em HALO INFINITE - Multiplayer Gratuito disponível.", 
        link: "https://www.xbox.com/pt-BR/games/halo-infinite", 
        img: "https://placehold.co/300x150/0b580b/FFF?text=Halo+Infinite" 
    },
    { 
        text: "Melhore seus reflexos com o Controle Sem Fio Xbox Elite Série 2.", 
        link: "https://www.xbox.com/pt-BR/accessories", 
        img: "https://placehold.co/300x150/1e1e1e/FFF?text=Controle+Elite" 
    },
    { 
        text: "Gears of War: E-Day está chegando. Prepare o seu esquadrão COG.", 
        link: "https://www.xbox.com/pt-BR/games/gears-of-war-e-day", 
        img: "https://placehold.co/300x150/c0392b/FFF?text=Gears+of+War" 
    },
    { 
        text: "Xbox Cloud Gaming: Seu console em qualquer tela. Conecte-se já.", 
        link: "https://www.xbox.com/pt-BR/play", 
        img: "https://placehold.co/300x150/17e017/000?text=Cloud+Gaming" 
    }
];

/**
 * ============================================================================
 * 2. FLUXO DE INICIALIZAÇÃO DO ECOSSISTEMA
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    carregarDadosLocais();
    inicializarParticulas();
    renderizarQuizzes();
    inicializarForum();
    GerenciadorAnuncios.iniciar();
    configurarConfiguracoesUI();
    
    // Controlador de Tela de Boot Inicial
    setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) {
            bootScreen.style.opacity = '0';
            setTimeout(() => bootScreen.style.display = 'none', 1000);
        }
    }, 2500);

    // Sistema Avançado de Scroll Intersection para Ativação Visual
    const cards = document.querySelectorAll('.era-card');
    const observerOptions = { root: null, threshold: 0.25 };
    
    const eraObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    cards.forEach(card => eraObserver.observe(card));
});

/**
 * ============================================================================
 * 3. MOTORES VISUAIS - SISTEMA DE PARTÍCULAS NATIVO
 * ============================================================================
 */
function inicializarParticulas() {
    const canvasContainer = document.getElementById('particles-js');
    if (!canvasContainer) return;

    // Criação dinâmica do elemento canvas para ocupar a tela de login
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvasContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 45;

    function resizeCanvas() {
        canvas.width = canvasContainer.offsetWidth;
        canvas.height = canvasContainer.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
            this.color = 'rgba(23, 224, 23, ' + (Math.random() * 0.4 + 0.1) + ')';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenha linhas de conexão entre partículas próximas
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 90) {
                    ctx.strokeStyle = `rgba(16, 124, 17, ${0.15 - (distance/90) * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }

        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

/**
 * ============================================================================
 * 4. AUTENTICAÇÃO E GERENCIAMENTO DE SESSÃO
 * ============================================================================
 */
function fazerLogin(event) {
    event.preventDefault();
    const gtInput = document.getElementById('gamertag');
    if (!gtInput) return;

    const gt = gtInput.value.trim();
    if (!gt) return;

    const btn = document.getElementById('btn-login');
    const statusTxt = document.getElementById('login-status');
    
    if (btn) {
        btn.classList.add('loading');
        btn.disabled = true;
    }
    
    if (statusTxt) {
        statusTxt.innerText = "Conectando ao Xbox Network / Azure Core...";
        statusTxt.classList.add('visible');
    }

    setTimeout(() => {
        if (statusTxt) {
            statusTxt.innerText = `Perfil Spartan [${gt}] Autenticado.`;
            statusTxt.style.color = "var(--xbox-light-green)";
        }
        
        gameState.userGamertag = gt;
        gameState.loginTime = new Date().getTime();
        
        salvarDadosLocais();
        atualizarUI();
        
        setTimeout(() => {
            const overlay = document.getElementById('login-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.style.display = 'none', 600);
            }
            // Primeiro Achievement do jogo
            verificarEDesbloquearConquista("LINK_NEURAL");
        }, 1000);

    }, 1800);
}

/**
 * ============================================================================
 * 5. MÓDULO INTERATIVO DA TIMELINE E CONQUISTAS
 * ============================================================================
 */
function renderizarQuizzes() {
    for (let [eraId, data] of Object.entries(QUIZ_DB)) {
        const container = document.getElementById(`quiz-${eraId}`);
        if (container) {
            let optionsHTML = data.options.map((opt, index) => {
                let isAlreadySolved = gameState.solvedQuizzes.includes(eraId);
                let btnClass = isAlreadySolved ? "quiz-btn disabled-solved" : "quiz-btn";
                return `<button class="${btnClass}" ${isAlreadySolved ? 'disabled' : ''} onclick="checkAnswer(this, ${opt.correct}, '${eraId}', 50, event)">${opt.text}</button>`;
            }).join('');
            
            container.innerHTML = `
                <div class="quiz-wrapper-box">
                    <p class="quiz-question">🌐 <strong>Protocolo de Validação:</strong> ${data.q}</p>
                    <div class="quiz-options">${optionsHTML}</div>
                </div>
            `;
        }
    }
}

function exploreEra(eraId, points) {
    const card = document.getElementById(`era-${eraId}`);
    if (!card) return;

    if (!card.classList.contains('explored')) {
        card.classList.add('explored'); 
        if (!gameState.exploredEras.includes(eraId)) {
            gameState.exploredEras.push(eraId);
            
            // Adiciona pontuação ao Gamerscore
            gameState.gamerscore += points;
            
            // Mapeia ID da conquista de exploração correspondente
            const achievementId = `EXPLORADOR_${eraId.toUpperCase()}`;
            verificarEDesbloquearConquista(achievementId);
            
            salvarDadosLocais();
            atualizarUI();
        }
    }
}

function checkAnswer(button, isCorrect, eraId, points, event) {
    // Evita que o clique se propague e ative a exploração do card novamente
    if (event && event.stopPropagation) {
        event.stopPropagation();
    } else if (window.event) {
        window.event.cancelBubble = true;
    }

    if (gameState.solvedQuizzes.includes(eraId)) return;
    
    const container = button.closest('.quiz-options');
    const buttons = container.querySelectorAll('.quiz-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        button.classList.add('correct');
        button.innerHTML += ' 🗸';
        gameState.solvedQuizzes.push(eraId);
        
        gameState.gamerscore += points;
        
        // Verifica se merece o achievement Mestre Tático por acertar de primeira
        verificarEDesbloquearConquista("MESTRE_TATICO");
        
        salvarDadosLocais();
        atualizarUI();
    } else {
        button.classList.add('wrong');
        button.innerHTML += ' ✖';
        
        // Penalização visual temporária e liberação para nova tentativa
        setTimeout(() => {
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('wrong');
                btn.innerHTML = btn.innerHTML.replace(' ✖', '');
            });
        }, 1200);
    }
}

function verificarEDesbloquearConquista(id) {
    if (gameState.unlockedAchievements.includes(id)) return;
    
    const ach = ACHIEVEMENTS_DB.find(a => a.id === id);
    if (!ach) return;
    
    gameState.unlockedAchievements.push(id);
    if (ach.points > 0 && id !== "LINK_NEURAL") {
        gameState.gamerscore += ach.points;
    }
    
    triggerAchievementToast(ach.title, ach.desc, ach.points);
    salvarDadosLocais();
    atualizarUI();
}

/**
 * ============================================================================
 * 6. MOTOR DE NOTIFICAÇÃO (ACHIEVEMENT TOAST QUEUE)
 * ============================================================================
 */
let achievementQueue = [];
let isToastShowing = false;

function triggerAchievementToast(title, desc, points) {
    achievementQueue.push({ title, desc, points });
    if (!isToastShowing) processAchievementQueue();
}

function processAchievementQueue() {
    if (achievementQueue.length === 0) {
        isToastShowing = false;
        return;
    }
    
    isToastShowing = true;
    const { title, desc, points } = achievementQueue.shift();
    
    // Executa som clássico do Xbox se ativado
    if (CONFIG.sfxEnabled) {
        const sfx = document.getElementById('sfx-achievement');
        if (sfx) {
            sfx.currentTime = 0;
            sfx.play().catch(() => console.warn("Interação prévia do usuário necessária para áudio."));
        }
    }

    const toast = document.getElementById('achievement-toast');
    if (toast) {
        const titleEl = toast.querySelector('.achievement-text-1');
        const descEl = document.getElementById('achievement-name');
        const scoreEl = document.getElementById('achievement-score-val');
        
        if (titleEl) titleEl.innerText = title;
        if (descEl) descEl.innerText = desc;
        if (scoreEl) scoreEl.innerText = points > 0 ? `+${points}G` : 'Concluído';

        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(processAchievementQueue, 600);
        }, 4000);
    } else {
        isToastShowing = false;
    }
}

/**
 * ============================================================================
 * 7. CORE DO ASSISTENTE COGNITIVO CORTANA IA
 * ============================================================================
 */
function enviarMensagem() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    
    const msg = input.value.trim();
    if (!msg) return;
    
    renderizarMensagemUI(msg, 'user');
    input.value = "";
    
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.classList.add('active');
    
    // Simulação de Inteligência Sintética Local Criptografada
    setTimeout(() => {
        let resposta = "Dados insuficientes nos meus bancos principais. Tente perguntar sobre Halo, Kinect, Xbox 360, Game Pass ou Conquistas!";
        const query = msg.toLowerCase();
        
        for (let item of KEYWORDS_DB) {
            if (item.keys.some(k => query.includes(k))) {
                resposta = item.res;
                break;
            }
        }
        
        if (indicator) indicator.classList.remove('active');
        renderizarMensagemUI(resposta, 'bot');
        
        // Remove badge de notificação ao interagir
        const badge = document.getElementById('chat-badge');
        if (badge) badge.style.display = 'none';

    }, 1200);
}

function renderizarMensagemUI(msg, sender) {
    const chatBody = document.getElementById('chat-messages');
    if (!chatBody) return;
    
    const msgContainer = document.createElement('div');
    msgContainer.className = `msg-container ${sender} slide-in`;
    
    const bubble = document.createElement('div');
    bubble.className = `msg-bubble ${sender}-msg`;
    bubble.innerText = msg;
    
    msgContainer.appendChild(bubble);
    chatBody.appendChild(msgContainer);
    
    chatBody.scrollTop = chatBody.scrollHeight;
}

function toggleChat() {
    const chatBot = document.getElementById('xbox-chatbot');
    if (chatBot) chatBot.classList.toggle('open');
}

function verificarEnter(e) {
    if (e.key === 'Enter') enviarMensagem();
}

/**
 * ============================================================================
 * 8. GERENCIADOR DE MODAIS E INTERFACES DE DIÁLOGO
 * ============================================================================
 */
function abrirModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    if (id === 'modal-conquistas') {
        const grid = document.getElementById('achievements-grid');
        if (grid) {
            grid.innerHTML = ACHIEVEMENTS_DB.map(ach => {
                const conquistada = gameState.unlockedAchievements.includes(ach.id);
                return `
                    <div class="achievement-card ${conquistada ? 'unlocked' : 'locked'}">
                        <div class="ach-icon-box">${ach.icon}</div>
                        <div class="ach-info-box">
                            <h4>${ach.title}</h4>
                            <p>${ach.desc}</p>
                            <span class="ach-card-points">${ach.points} G</span>
                        </div>
                        <div class="ach-status-badge">${conquistada ? '✓' : '🔒'}</div>
                    </div>
                `;
            }).join('');
        }
    }
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

function configurarConfiguracoesUI() {
    const sfxBox = document.getElementById('toggle-sfx');
    const animBox = document.getElementById('toggle-animations');
    
    if (sfxBox) {
        sfxBox.checked = CONFIG.sfxEnabled;
        sfxBox.addEventListener('change', (e) => {
            CONFIG.sfxEnabled = e.target.checked;
        });
    }
    
    if (animBox) {
        animBox.checked = !CONFIG.animationsEnabled;
        animBox.addEventListener('change', (e) => {
            CONFIG.animationsEnabled = !e.target.checked;
            if (e.target.checked) {
                document.body.classList.add('no-animations');
            } else {
                document.body.classList.remove('no-animations');
            }
        });
    }
}

/**
 * ============================================================================
 * 9. CENTRAL DE TRANSMISSÕES (SISTEMA DE FÓRUM LOCAL)
 * ============================================================================
 */
function inicializarForum() {
    // Carrega mensagens pré-existentes se houver
    renderizarPostsForum();
}

function criarPublicacao(event) {
    event.preventDefault();
    const input = document.getElementById('forum-message-input');
    if (!input) return;

    const texto = input.value.trim();
    if (texto.length < 4) {
        alert("A transmissão falhou. O sinal precisa conter mais do que 4 caracteres.");
        return;
    }

    const novoPost = {
        id: "post_" + Date.now(),
        autor: gameState.userGamertag,
        conteudo: texto,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        likes: 0
    };

    gameState.postsComunidade.unshift(novoPost);
    input.value = "";
    
    verificarEDesbloquearConquista("TRANSMISSOR");
    salvarDadosLocais();
    renderizarPostsForum();
}

function inserirTag(tag) {
    const input = document.getElementById('forum-message-input');
    if (input) {
        input.value += ` ${tag} `;
        input.focus();
    }
}

function curtirPost(id) {
    const post = gameState.postsComunidade.find(p => p.id === id);
    if (post) {
        post.likes += 1;
        salvarDadosLocais();
        renderizarPostsForum();
    }
}

function renderizarPostsForum() {
    const wrapper = document.getElementById('forum-posts-wrapper');
    const countEl = document.getElementById('total-posts-count');
    
    if (countEl) countEl.innerText = gameState.postsComunidade.length;
    if (!wrapper) return;

    if (gameState.postsComunidade.length === 0) {
        wrapper.innerHTML = `<div class="forum-empty-state">Nenhum sinal detectado na rede. Seja o primeiro a transmitir!</div>`;
        return;
    }

    wrapper.innerHTML = gameState.postsComunidade.map(post => `
        <div class="forum-post-card slide-in">
            <div class="forum-post-meta">
                <div class="meta-left">
                    <span class="forum-user-avatar">🎮</span>
                    <strong class="forum-user-name">${post.autor}</strong>
                </div>
                <span class="forum-post-time">${post.timestamp}</span>
            </div>
            <div class="forum-post-content">
                ${processarTagsConteudo(post.conteudo)}
            </div>
            <div class="forum-post-actions">
                <button class="forum-like-btn" onclick="curtirPost('${post.id}')">💚 Reconhecer (${post.likes})</button>
            </div>
        </div>
    `).join('');
}

function processarTagsConteudo(texto) {
    // Sanitização básica contra injeção de HTML
    let safeText = texto.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Substituições visuais para as tags do fórum
    safeText = safeText.replace(/\[SPOILER\]/gi, `<span class="badge-forum spoiler">[CONTEÚDO CONFIDENCIAL]</span>`);
    safeText = safeText.replace(/\[LFG\]/gi, `<span class="badge-forum lfg">[PROCURANDO GRUPO]</span>`);
    safeText = safeText.replace(/\[HELP\]/gi, `<span class="badge-forum help">[SOLICITAÇÃO DE SUPORTE]</span>`);
    
    return safeText;
}

/**
 * ============================================================================
 * 10. MÓDULO AD-SYSTEM (PROPAGANDAS ROTATIVAS)
 * ============================================================================
 */
const GerenciadorAnuncios = {
    currentIndex: 0,
    timer: null,

    iniciar() {
        this.renderizarAnuncio();
        this.timer = setInterval(() => {
            this.proximo();
        }, CONFIG.adInterval);
    },

    renderizarAnuncio() {
        const container = document.getElementById('ad-system-container');
        if (!container) return;

        const ad = ADS_DB[this.currentIndex];
        container.innerHTML = `
            <div class="ad-banner-box">
                <span class="ad-tag-indicator">PATROCINADO</span>
                
                <!-- Imagem Clicável Adicionada -->
                <a href="${ad.link}" target="_blank" class="ad-image-link" title="Acessar site do Xbox">
                    <img src="${ad.img}" alt="Propaganda" class="ad-banner-img">
                </a>
                
                <!-- Caixa de texto alinhada -->
                <div class="ad-content-box">
                    <p class="ad-main-text">${ad.text}</p>
                    <a href="${ad.link}" target="_blank" class="ad-action-link" onclick="console.log('Ad Click registrado via Engine!')">Ver Detalhes ➔</a>
                </div>
            </div>
        `;
    },

    proximo() {
        this.currentIndex = (this.currentIndex + 1) % ADS_DB.length;
        this.renderizarAnuncio();
    }
};

/**
 * ============================================================================
 * 11. SINCRONIZAÇÃO E ATUALIZAÇÃO RECURSIVA DE UI
 * ============================================================================
 */
function atualizarUI() {
    const elGamertag = document.getElementById('display-gamertag');
    const elForumUser = document.getElementById('forum-current-user');
    const elScore = document.getElementById('gamerscore');
    const elErasCount = document.getElementById('eras-count');
    const elRank = document.getElementById('user-rank');
    const elProgress = document.getElementById('level-progress');

    if (elGamertag) elGamertag.innerText = gameState.userGamertag;
    if (elForumUser) elForumUser.innerText = gameState.userGamertag;
    if (elScore) elScore.innerText = gameState.gamerscore;
    if (elErasCount) elErasCount.innerText = gameState.exploredEras.length;

    // Calcula e atualiza o Rank atualizado com base no Gamerscore obtido
    let currentRank = RANKS_DB[0];
    for (let r of RANKS_DB) {
        if (gameState.gamerscore >= r.min) currentRank = r;
    }
    
    if (gameState.rank !== currentRank.name) {
        gameState.rank = currentRank.name;
    }

    if (elRank) {
        elRank.innerText = gameState.rank;
        elRank.className = `rank-badge ${currentRank.class}`;
    }

    // Gerenciador de cálculo de barra de progresso totalizador
    const totalDesafiosCalculaveis = Object.keys(QUIZ_DB).length + CONFIG.totalEras;
    const progressoAtual = gameState.exploredEras.length + gameState.solvedQuizzes.length;
    const porcentagemFinal = (progressoAtual / totalDesafiosCalculaveis) * 100;
    
    if (elProgress) elProgress.style.width = `${porcentagemFinal}%`;

    // Dispara a última grande conquista do ecossistema
    if (gameState.exploredEras.length === CONFIG.totalEras && gameState.solvedQuizzes.length === Object.keys(QUIZ_DB).length) {
        verificarEDesbloquearConquista("MIL_DE_MIL");
    }
}

function salvarDadosLocais() {
    localStorage.setItem('xboxTimelineUltimateSaveData', JSON.stringify(gameState));
}

function carregarDadosLocais() {
    const rawData = localStorage.getItem('xboxTimelineUltimateSaveData');
    if (rawData) {
        try {
            const parsed = JSON.parse(rawData);
            if (parsed && typeof parsed === 'object') {
                gameState = { ...gameState, ...parsed };
                
                // Reaplica os estados visuais nos cards explorados previamente
                gameState.exploredEras.forEach(id => {
                    const card = document.getElementById(`era-${id}`);
                    if (card) card.classList.add('explored');
                });
                
                // Desativa tela de login caso o perfil já esteja configurado
                if (gameState.userGamertag !== "Guest") {
                    const loginOverlay = document.getElementById('login-overlay');
                    if (loginOverlay) loginOverlay.style.display = 'none';
                }
                
                atualizarUI();
            }
        } catch (e) {
            console.error("Erro catastrófico na leitura de dados persistidos.", e);
        }
    }
}

function limparDados() {
    if (confirm("Alerta do Sistema Spartan: Deseja apagar permanentemente todo o seu progresso indexado no armazenamento local?")) {
        localStorage.removeItem('xboxTimelineUltimateSaveData');
        location.reload();
    }
}
