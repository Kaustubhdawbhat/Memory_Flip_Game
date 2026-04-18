let currentLevel = 1;
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;

const levelConfig = {
    1: { cards: 8, cols: 4, msg: "Good! 👍" },
    2: { cards: 12, cols: 4, msg: "Best! ⭐" },
    3: { cards: 16, cols: 4, msg: "Excellent! 🏆 – You Win!" }
};

const icons = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🍉'];

function startLevel(level) {
    currentLevel = level;
    matchedPairs = 0;
    flippedCards = [];
    canFlip = true;
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('message-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    document.getElementById('level-title').innerText = `Level ${level}`;
    document.getElementById('match-count').innerText = "0";
    setupGrid();
}

function setupGrid() {
    const grid = document.getElementById('card-grid');
    const config = levelConfig[currentLevel];
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;

    let cardIcons = icons.slice(0, config.cards / 2);
    let gameSet = [...cardIcons, ...cardIcons];
    
    gameSet.sort(() => Math.random() - 0.5);

    gameSet.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-back">?</div>
            <div class="card-front">${icon}</div>
        `;
        card.dataset.icon = icon;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (!canFlip || this.classList.contains('flipped') || flippedCards.length >= 2) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    canFlip = false;
    let [card1, card2] = flippedCards;

    if (card1.dataset.icon === card2.dataset.icon) {
        matchedPairs++;
        document.getElementById('match-count').innerText = matchedPairs;
        flippedCards = [];
        canFlip = true;
        
        if (matchedPairs === levelConfig[currentLevel].cards / 2) {
            setTimeout(showLevelComplete, 800);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function showLevelComplete() {
    const config = levelConfig[currentLevel];
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('message-screen').classList.remove('hidden');
    
    const msgLabel = document.getElementById('msg-text');
    const btn = document.getElementById('action-btn');
    
    msgLabel.innerText = config.msg;

    if (currentLevel < 3) {
        btn.innerText = "Next Level";
        btn.onclick = () => startLevel(currentLevel + 1);
    } else {
        btn.innerText = "Play Again";
        btn.onclick = () => startLevel(1);
    }
}