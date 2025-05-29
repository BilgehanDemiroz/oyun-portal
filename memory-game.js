/**
 * Hafıza Oyunu
 * Eşleşen kartları bulma oyunu
 */

document.addEventListener('DOMContentLoaded', () => {
    // Oyun değişkenleri
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let isProcessing = false;
    let gameStarted = false;
    let gameTimer;
    let seconds = 0;
    
    // DOM elementleri
    const gameBoard = document.querySelector('.memory-game-board');
    const moveCount = document.getElementById('moveCount');
    const pairCount = document.getElementById('pairCount');
    const timeElapsed = document.getElementById('timeElapsed');
    const restartBtn = document.getElementById('restartMemoryGame');
    
    // Emoji kartları
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    
    // Oyunu başlat
    initGame();
    
    // Oyunu başlatma fonksiyonu
    function initGame() {
        // Oyun değişkenlerini sıfırla
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        isProcessing = false;
        gameStarted = false;
        seconds = 0;
        
        if (gameTimer) {
            clearInterval(gameTimer);
            gameTimer = null;
        }
        
        // UI'yi güncelle
        moveCount.textContent = '0';
        pairCount.textContent = '0/8';
        timeElapsed.textContent = '00:00';
        
        // Kartları oluştur
        createCards();
    }
    
    // Kartları oluştur
    function createCards() {
        // Oyun alanını temizle
        gameBoard.innerHTML = '';
        
        // Emoji çiftlerini oluştur
        const cardValues = [...emojis, ...emojis];
        
        // Kartları karıştır
        shuffleArray(cardValues);
        
        // Kartları oluştur ve oyun alanına ekle
        cardValues.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.value = emoji;
            card.dataset.index = index;
            card.setAttribute('tabindex', '0'); // Erişilebilirlik için
            
            const front = document.createElement('div');
            front.className = 'memory-card-front';
            front.textContent = '?';
            
            const back = document.createElement('div');
            back.className = 'memory-card-back';
            back.textContent = emoji;
            
            card.appendChild(front);
            card.appendChild(back);
            
            card.addEventListener('click', flipCard);
            card.addEventListener('keydown', handleKeyDown);
            
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }
    
    // Diziyi karıştır
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Kart çevirme
    function flipCard() {
        if (isProcessing || this.classList.contains('flipped') || this.classList.contains('matched')) {
            return;
        }
        
        // Oyun başladı mı?
        if (!gameStarted) {
            startGame();
        }
        
        // Kartı çevir
        this.classList.add('flipped');
        playSound('flip');
        
        // Çevrilen kartları takip et
        flippedCards.push(this);
        
        // İki kart çevrildiyse kontrol et
        if (flippedCards.length === 2) {
            moves++;
            moveCount.textContent = moves;
            isProcessing = true;
            
            // Eşleşme kontrolü
            checkForMatch();
        }
    }
    
    // Klavye kontrolü
    function handleKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            flipCard.call(this);
        }
    }
    
    // Eşleşme kontrolü
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.value === card2.dataset.value) {
            // Eşleşme
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                matchedPairs++;
                pairCount.textContent = `${matchedPairs}/8`;
                
                playSound('match');
                
                // Oyun bitti mi?
                if (matchedPairs === 8) {
                    endGame();
                }
                
                flippedCards = [];
                isProcessing = false;
            }, 500);
        } else {
            // Eşleşme yok
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                
                playSound('nomatch');
                
                flippedCards = [];
                isProcessing = false;
            }, 1000);
        }
    }
    
    // Oyunu başlat
    function startGame() {
        gameStarted = true;
        
        // Zamanlayıcıyı başlat
        gameTimer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timeElapsed.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    // Oyunu bitir
    function endGame() {
        clearInterval(gameTimer);
        
        setTimeout(() => {
            // Tebrik mesajı
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            playSound('win');
            
            alert(`Tebrikler! Tüm eşleşmeleri buldun!\n\nHamleler: ${moves}\nSüre: ${timeString}`);
        }, 500);
    }
    
    // Oyunu yeniden başlat
    restartBtn.addEventListener('click', () => {
        playSound('click');
        initGame();
    });
    
    // Ses efektleri
    function playSound(type) {
        if (localStorage.getItem('gamePortalSound') === 'disabled') return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'flip':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'match':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'nomatch':
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                oscillator.type = 'triangle';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'win':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
                
                setTimeout(() => {
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);
                    
                    osc2.frequency.setValueAtTime(800, audioContext.currentTime);
                    osc2.type = 'sine';
                    gain2.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    osc2.start(audioContext.currentTime);
                    osc2.stop(audioContext.currentTime + 0.5);
                }, 200);
                
                setTimeout(() => {
                    const osc3 = audioContext.createOscillator();
                    const gain3 = audioContext.createGain();
                    osc3.connect(gain3);
                    gain3.connect(audioContext.destination);
                    
                    osc3.frequency.setValueAtTime(1000, audioContext.currentTime);
                    osc3.type = 'sine';
                    gain3.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
                    osc3.start(audioContext.currentTime);
                    osc3.stop(audioContext.currentTime + 0.8);
                }, 400);
                break;
            case 'click':
                oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
        }
    }
});
