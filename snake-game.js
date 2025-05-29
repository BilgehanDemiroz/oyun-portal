/**
 * Yılan Oyunu
 * Klasik yılan oyunu
 */

document.addEventListener('DOMContentLoaded', () => {
    // Canvas ve context
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    
    // Oyun değişkenleri
    const gridSize = 20;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;
    
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameSpeed = 150;
    let gameLoop;
    let gameRunning = false;
    let touchStartX = 0;
    let touchStartY = 0;
    
    // DOM elementleri
    const scoreDisplay = document.getElementById('snakeScore');
    const highScoreDisplay = document.getElementById('snakeHighScore');
    const startBtn = document.getElementById('startSnakeGame');
    
    // Yüksek skoru göster
    highScoreDisplay.textContent = highScore;
    
    // Oyunu başlat
    startBtn.addEventListener('click', () => {
        if (gameRunning) {
            pauseGame();
            startBtn.textContent = 'Devam Et';
        } else {
            startGame();
            startBtn.textContent = 'Duraklat';
        }
    });
    
    // Oyunu başlat
    function startGame() {
        if (gameRunning) return;
        
        // Oyun değişkenlerini sıfırla
        snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        
        createFood();
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreDisplay.textContent = '0';
        gameRunning = true;
        
        // Oyun döngüsünü başlat
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(gameStep, gameSpeed);
        
        playSound('start');
    }
    
    // Oyunu duraklat
    function pauseGame() {
        if (!gameRunning) return;
        
        clearInterval(gameLoop);
        gameRunning = false;
        
        // Duraklama mesajı
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('DURAKLATILDI', canvas.width / 2, canvas.height / 2);
    }
    
    // Oyun adımı
    function gameStep() {
        // Yılanı hareket ettir
        moveSnake();
        
        // Çarpışma kontrolü
        if (checkCollision()) {
            gameOver();
            return;
        }
        
        // Yem kontrolü
        if (snake[0].x === food.x && snake[0].y === food.y) {
            // Yemi ye
            score += 10;
            scoreDisplay.textContent = score;
            
            // Yeni yem oluştur
            createFood();
            
            // Yılanı büyüt (kuyruk silinmeyecek)
            playSound('eat');
        } else {
            // Kuyruğu sil
            snake.pop();
        }
        
        // Oyun alanını çiz
        drawGame();
    }
    
    // Yılanı hareket ettir
    function moveSnake() {
        // Yönü güncelle
        direction = nextDirection;
        
        // Yeni baş pozisyonu
        const head = {x: snake[0].x, y: snake[0].y};
        
        // Yöne göre hareket et
        switch(direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Sınırları kontrol et (duvarlardan geçiş)
        if (head.x < 0) head.x = gridWidth - 1;
        if (head.x >= gridWidth) head.x = 0;
        if (head.y < 0) head.y = gridHeight - 1;
        if (head.y >= gridHeight) head.y = 0;
        
        // Yeni başı ekle
        snake.unshift(head);
    }
    
    // Çarpışma kontrolü
    function checkCollision() {
        const head = snake[0];
        
        // Kendi kuyruğuna çarpma kontrolü
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    // Yem oluştur
    function createFood() {
        // Rastgele pozisyon
        food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        
        // Yılanın üzerinde olup olmadığını kontrol et
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) {
                createFood(); // Tekrar dene
                return;
            }
        }
    }
    
    // Oyun alanını çiz
    function drawGame() {
        // Arka planı temizle
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Yılanı çiz
        snake.forEach((segment, index) => {
            // Baş için farklı renk
            if (index === 0) {
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
            } else {
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary');
            }
            
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
            
            // Yılan gözleri (baş için)
            if (index === 0) {
                ctx.fillStyle = '#ffffff';
                
                // Yöne göre gözleri çiz
                switch(direction) {
                    case 'up':
                        ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 3, 3, 3);
                        ctx.fillRect(segment.x * gridSize + 13, segment.y * gridSize + 3, 3, 3);
                        break;
                    case 'down':
                        ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 14, 3, 3);
                        ctx.fillRect(segment.x * gridSize + 13, segment.y * gridSize + 14, 3, 3);
                        break;
                    case 'left':
                        ctx.fillRect(segment.x * gridSize + 3, segment.y * gridSize + 4, 3, 3);
                        ctx.fillRect(segment.x * gridSize + 3, segment.y * gridSize + 13, 3, 3);
                        break;
                    case 'right':
                        ctx.fillRect(segment.x * gridSize + 14, segment.y * gridSize + 4, 3, 3);
                        ctx.fillRect(segment.x * gridSize + 14, segment.y * gridSize + 13, 3, 3);
                        break;
                }
            }
        });
        
        // Yemi çiz
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent');
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2 - 1,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Yem sapı
        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(food.x * gridSize + gridSize / 2 - 1, food.y * gridSize, 2, 4);
    }
    
    // Oyun bitti
    function gameOver() {
        clearInterval(gameLoop);
        gameRunning = false;
        
        // Yüksek skoru güncelle
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            highScoreDisplay.textContent = highScore;
        }
        
        // Oyun bitti mesajı
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('OYUN BİTTİ', canvas.width / 2, canvas.height / 2 - 30);
        ctx.font = '20px Arial';
        ctx.fillText(`Puan: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Tekrar oynamak için "Başlat" düğmesine tıklayın', canvas.width / 2, canvas.height / 2 + 50);
        
        startBtn.textContent = 'Tekrar Oyna';
        
        playSound('gameover');
    }
    
    // Klavye kontrolü
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                e.preventDefault();
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                e.preventDefault();
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                e.preventDefault();
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                e.preventDefault();
                break;
            case ' ':
                if (gameRunning) {
                    pauseGame();
                    startBtn.textContent = 'Devam Et';
                } else {
                    startGame();
                    startBtn.textContent = 'Duraklat';
                }
                e.preventDefault();
                break;
        }
    });
    
    // Dokunmatik kontroller
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        if (!gameRunning) return;
        
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        
        // Yatay hareket daha büyükse
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && direction !== 'left') {
                nextDirection = 'right';
            } else if (dx < 0 && direction !== 'right') {
                nextDirection = 'left';
            }
        } 
        // Dikey hareket daha büyükse
        else {
            if (dy > 0 && direction !== 'up') {
                nextDirection = 'down';
            } else if (dy < 0 && direction !== 'down') {
                nextDirection = 'up';
            }
        }
        
        touchStartX = touchEndX;
        touchStartY = touchEndY;
        
        e.preventDefault();
    }, { passive: false });
    
    // Ses efektleri
    function playSound(type) {
        if (localStorage.getItem('gamePortalSound') === 'disabled') return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'start':
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                
                setTimeout(() => {
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);
                    
                    osc2.frequency.setValueAtTime(660, audioContext.currentTime);
                    osc2.type = 'sine';
                    gain2.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    osc2.start(audioContext.currentTime);
                    osc2.stop(audioContext.currentTime + 0.3);
                }, 300);
                break;
            case 'eat':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'gameover':
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.type = 'sawtooth';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
                
                setTimeout(() => {
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);
                    
                    osc2.frequency.setValueAtTime(150, audioContext.currentTime);
                    osc2.type = 'sawtooth';
                    gain2.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);
                    osc2.start(audioContext.currentTime);
                    osc2.stop(audioContext.currentTime + 0.7);
                }, 300);
                break;
        }
    }
    
    // İlk çizim
    drawGame();
});