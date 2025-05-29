/**
 * Eğlence Dünyası - Ana JavaScript Dosyası
 * Oyun portalı için genel işlevsellik
 */

document.addEventListener('DOMContentLoaded', () => {
    // Tema değiştirme
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Kaydedilmiş temayı yükle
    const savedTheme = localStorage.getItem('gamePortalTheme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️ Tema';
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? '☀️ Tema' : '🌙 Tema';
        localStorage.setItem('gamePortalTheme', isDark ? 'dark' : 'light');
    });
    
    // Ses kontrolü
    const soundToggle = document.getElementById('soundToggle');
    let soundEnabled = localStorage.getItem('gamePortalSound') !== 'disabled';
    
    updateSoundButton();
    
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('gamePortalSound', soundEnabled ? 'enabled' : 'disabled');
        updateSoundButton();
    });
    
    function updateSoundButton() {
        soundToggle.textContent = soundEnabled ? '🔊 Ses' : '🔇 Ses';
    }
    
    // Sayfa navigasyonu
    const homeBtn = document.getElementById('homeBtn');
    const gameCards = document.querySelectorAll('.game-card');
    const backBtns = document.querySelectorAll('.back-btn');
    
    homeBtn.addEventListener('click', () => {
        showPage('homePage');
        homeBtn.classList.add('active');
    });
    
    gameCards.forEach(card => {
        const gameId = card.dataset.game;
        const playBtn = card.querySelector('.play-btn');
        
        playBtn.addEventListener('click', () => {
            showPage(`${gameId}Page`);
            homeBtn.classList.remove('active');
        });
    });
    
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showPage('homePage');
            homeBtn.classList.add('active');
        });
    });
    
    function showPage(pageId) {
        // Tüm sayfaları gizle
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // İstenen sayfayı göster
        document.getElementById(pageId).classList.add('active');
    }
    
    // Pencere boyutlandırma
    function handleResize() {
        const iframe = document.getElementById('cosmicDefenderFrame');
        if (iframe) {
            const width = Math.min(800, iframe.parentElement.clientWidth - 40);
            const height = width * 0.75;
            iframe.style.height = `${height}px`;
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
});