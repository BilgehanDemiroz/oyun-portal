/**
 * Taş Kağıt Makas Oyunu
 * Basit şans oyunu
 */

document.addEventListener('DOMContentLoaded', () => {
    // Oyun değişkenleri
    let userScore = 0;
    let computerScore = 0;
    const userScoreSpan = document.getElementById('userScore');
    const computerScoreSpan = document.getElementById('computerScore');
    const resultText = document.getElementById('resultText');
    const choices = document.querySelectorAll('.choice');
    
    // Ses efektleri
    function playSound(type) {
        if (localStorage.getItem('gamePortalSound') === 'disabled') return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'win':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
            case 'lose':
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                oscillator.type = 'triangle';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
            case 'draw':
                oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'click':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
        }
    }
    
    // Bilgisayar seçimi
    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomNumber = Math.floor(Math.random() * 3);
        return choices[randomNumber];
    }
    
    // Kazananı belirle
    function determineWinner(userChoice, computerChoice) {
        if (userChoice === computerChoice) {
            return 'draw';
        }
        
        if (
            (userChoice === 'rock' && computerChoice === 'scissors') ||
            (userChoice === 'paper' && computerChoice === 'rock') ||
            (userChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'win';
        }
        
        return 'lose';
    }
    
    // Sonucu göster
    function displayResult(result, userChoice, computerChoice) {
        const userChoiceTR = translateChoice(userChoice);
        const computerChoiceTR = translateChoice(computerChoice);
        
        switch(result) {
            case 'win':
                resultText.textContent = `${userChoiceTR} ${computerChoiceTR}'ı yener. Kazandın!`;
                resultText.style.color = '#10b981';
                userScore++;
                userScoreSpan.textContent = userScore;
                playSound('win');
                break;
            case 'lose':
                resultText.textContent = `${computerChoiceTR} ${userChoiceTR}'ı yener. Kaybettin!`;
                resultText.style.color = '#ef4444';
                computerScore++;
                computerScoreSpan.textContent = computerScore;
                playSound('lose');
                break;
            case 'draw':
                resultText.textContent = `İkiniz de ${userChoiceTR} seçtiniz. Berabere!`;
                resultText.style.color = '#f59e0b';
                playSound('draw');
                break;
        }
    }
    
    // İngilizce seçimleri Türkçe'ye çevir
    function translateChoice(choice) {
        switch(choice) {
            case 'rock': return 'Taş';
            case 'paper': return 'Kağıt';
            case 'scissors': return 'Makas';
            default: return choice;
        }
    }
    
    // Oyun mantığı
    function game(userChoice) {
        playSound('click');
        const computerChoice = getComputerChoice();
        const result = determineWinner(userChoice, computerChoice);
        displayResult(result, userChoice, computerChoice);
        
        // Seçimleri vurgula
        highlightChoice(userChoice, 'user');
        highlightChoice(computerChoice, 'computer');
    }
    
    // Seçimi vurgula
    function highlightChoice(choice, player) {
        choices.forEach(c => {
            if (c.id === choice) {
                c.classList.add('selected');
                setTimeout(() => c.classList.remove('selected'), 500);
            }
        });
    }
    
    // Olay dinleyicileri
    choices.forEach(choice => {
        choice.addEventListener('click', function() {
            game(this.id);
        });
        
        // Erişilebilirlik için klavye desteği
        choice.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                game(this.id);
            }
        });
        
        // Odaklanabilirlik
        choice.setAttribute('tabindex', '0');
    });
    
    // Stil ekleme
    const style = document.createElement('style');
    style.textContent = `
        .choice.selected {
            transform: scale(1.2);
            box-shadow: 0 0 20px rgba(79, 70, 229, 0.6);
        }
        
        .choice {
            position: relative;
            overflow: hidden;
        }
        
        .choice::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%);
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .choice:active::after {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});