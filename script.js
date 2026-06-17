// Estado do Jogo (Controlador de Pontuação)
let gameState = {
    gamerscore: 0,
    exploredEras: new Set(),
    solvedQuizzes: new Set()
};

// Adicionar uma imagem de fundo do Xbox
document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80')"; 
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundAttachment = "fixed";


// Ativa os cards à medida que o utilizador faz scroll na página
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.era-card');
    if (cards.length > 0) {
        cards[0].classList.add('active'); // Ativa o primeiro card imediatamente
    }
    
    window.addEventListener('scroll', () => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Se o card aparecer a 75% da altura da tela, ele ativa o brilho verde
            if(rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
                card.classList.add('active');
            }
        });
    });
});

// Função executada ao clicar/explorar um card de Era
function exploreEra(eraId, points) {
    const card = document.getElementById(`era-${eraId}`);
    
    if (!gameState.exploredEras.has(eraId)) {
        gameState.exploredEras.add(eraId);
        card.classList.add('explored');
        
        // Atualiza o Gamerscore e a interface
        updateGamerscore(points);
        document.getElementById('eras-count').innerText = gameState.exploredEras.size;
        
        // Dispara a conquista estilizada do Xbox
        triggerAchievement(`Desbravou a Era ${eraId.toUpperCase()}`);
        
        // Verifica se o jogador completou tudo no site
        checkFinalAchievement();
    }
}

// Validação das respostas do Mini-Quiz
function checkAnswer(button, isCorrect, eraId, points) {
    // Impede que o jogador clique múltiplas vezes na mesma pergunta se já acertou
    if (gameState.solvedQuizzes.has(eraId)) return;

    const optionsContainer = button.parentElement;
    const buttons = optionsContainer.querySelectorAll('.quiz-btn');

    // Desativa temporariamente todos os botões daquela pergunta
    buttons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        button.classList.add('correct');
        gameState.solvedQuizzes.add(eraId);
        updateGamerscore(points);
        triggerAchievement(`Gênio do Xbox ${eraId.toUpperCase()} (+${points}G)`);
        checkFinalAchievement();
    } else {
        button.classList.add('wrong');
        // Dá uma nova oportunidade: reativa os botões após 1.5 segundos
        setTimeout(() => {
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('wrong');
            });
        }, 1500);
    }
}

// Atualizador matemático dos pontos (Gamerscore)
function updateGamerscore(amount) {
    gameState.gamerscore += amount;
    document.getElementById('gamerscore').innerText = gameState.gamerscore;
}

// Mostra a notificação clássica do Xbox na tela
function triggerAchievement(text) {
    const toast = document.getElementById('achievement-toast');
    document.getElementById('achievement-name').innerText = text;
    
    toast.classList.add('show');
    
    // Oculta o pop-up após 4 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Conquista Secreta Final (Ao completar 100% das tarefas)
function checkFinalAchievement() {
    if (gameState.exploredEras.size === 4 && gameState.solvedQuizzes.size === 4) {
        setTimeout(() => {
            triggerAchievement("MIL DE MIL! Mestre Supremo do Xbox (1000G) 🌟");
            updateGamerscore(400); // Bónus final de pontuação
        }, 4500);
    }
}

// Configuração do Disqus (Fórum da Comunidade)
var disqus_config = function () {
    this.page.url = window.location.href; 
    this.page.identifier = 'xbox-timeline-page'; 
};

(function() {
    var d = document, s = d.createElement('script');
    // IMPORTANTE: Lembra-te de substituir 'SEU-SHORTNAME-AQUI' pelo shortname do teu painel do Disqus
    s.src = 'https://SEU-SHORTNAME-AQUI.disqus.com/embed.js'; 
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();