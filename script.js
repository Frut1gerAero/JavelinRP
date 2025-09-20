// Проверка на Великобританию
function checkUK() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data.country === 'GB') {
                document.getElementById('uk-warning').style.display = 'flex';
                document.body.classList.add('uk-detected');
            }
        })
        .catch(error => console.error('Error detecting country:', error));
}

// Содержимое вкладок
let currentTab = "main";
const tabContent = {
    main: {
        text: `<span class='highlight'>ОСНОВНАЯ ИНФОРМАЦИЯ</span>\n\n` +
              `Добро пожаловать на официальный сайт проекта Javelin RP.\n\n` +
              `<span class='highlight'>Текущий статус:</span> проект находится в активной разработке.\n\n` +
              `Вы можете поддержать развитие проекта через систему <span class='highlight'>донатов</span>.\n\n` +
              `<span class='highlight'>Наш дискорд:</span> присоединяйтесь к нашему сообществу для получения актуальной информации.`
    },
    rules: {
        text: `<span class='highlight'>ПРАВИЛА СЕРВЕРА</span>\n\n` +
              `1. Уважайте других игроков и администрацию\n` +
              `2. Запрещено использование читов и эксплоитов\n` +
              `3. Ролевая игра должна быть качественной\n` +
              `4. Запрещено распространение личной информации\n` +
              `5. Следуйте указаниям администрации\n\n` +
              `<span class='highlight'>Полный список правил доступен на нашем Discord-сервере.</span>`
    },
    updates: {
        text: `<span class='highlight'>ПОСЛЕДНИЕ ОБНОВЛЕНИЯ</span>\n\n` +
              `<span class='highlight'>Версия 1.2.5 (15.03.2023):</span>\n` +
              `- Добавлена новая система бизнесов\n` +
              `- Исправлены ошибки с транспортными средствами\n` +
              `- Оптимизирована производительность сервера\n\n` +
              `<span class='highlight'>Версия 1.2.4 (01.03.2023):</span>\n` +
              `- Добавлены новые квесты\n` +
              `- Обновлена карта добавлены новые локации\n` +
              `- Улучшена система полиции`
    }
};

// Инициализация контента
function initContent() {
    const wikiContent = document.getElementById("wikiContent");
    wikiContent.innerHTML = tabContent[currentTab].text;
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.querySelector(`.tab[data-tab="${currentTab}"]`).classList.add("active");
    
    // Запускаем анимацию счетчиков
    animateCounter('playerCount', 0, 87, 2000);
    animateCounter('daysRunning', 0, 127, 2500);
    animateCounter('eventsCount', 0, 42, 1500);
    
    // Показываем случайное уведомление через 5 секунд
    setTimeout(showRandomNotification, 5000);
}

// Анимация счетчика
function animateCounter(elementId, start, end, duration) {
    let startTimestamp = null;
    const element = document.getElementById(elementId);
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Показать случайное уведомление
function showRandomNotification() {
    const notifications = [
        "Присоединяйтесь к нашему Discord-сообществу!",
        "Новое обновление уже на сервере!",
        "Скоро запуск ивента - следите за новостями!",
        "Поддержите проект - оформите донат!",
        "На сервере сейчас играют " + Math.floor(Math.random() * 100) + " человек!"
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    showNotification(randomNotification);
}

// Показать уведомление
function showNotification(message) {
    const notification = document.getElementById('notification');
    const content = document.querySelector('.notification-content');
    
    content.textContent = message;
    notification.style.display = 'block';
    
    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

// Закрыть уведомление
function closeNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
}

// Переключение вкладок
function showTab(tabName) {
    if (currentTab === tabName) return;
    currentTab = tabName;
    const wikiContent = document.getElementById("wikiContent");
    
    // Анимация исчезновения
    wikiContent.style.opacity = '0';
    wikiContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        wikiContent.innerHTML = tabContent[tabName].text;
        // Анимация появления
        wikiContent.style.opacity = '1';
        wikiContent.style.transform = 'translateY(0)';
        
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
        const activeTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
        if (activeTab) activeTab.classList.add("active");
    }, 300);
}

// Логика модального окна игры
function openGameModal() {
    const modal = document.getElementById("gameModal");
    modal.classList.add("show");
    startPongGame();
    document.body.style.overflow = 'hidden';
}

function closeGameModal() {
    const modal = document.getElementById("gameModal");
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
    stopPongGame();
    document.body.style.overflow = '';
}

// Логика игры PONG
let animationFrameId;
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Игровые параметры
const paddleWidth = 100;
const paddleHeight = 12;
const paddleY = canvas.height - 30;
let paddleX = (canvas.width - paddleWidth) / 2;
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = -5;
let score = 0;
let autoPlay = false;
const cheatCodeTarget = "909322";
let cheatCode = "";
let ballPulse = false;
let ballFlash = false;
let paddleFlash = false;
let gameStarted = false;

// Обработка ввода чит-кода
document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
        cheatCode += e.key;
        if (cheatCode.length > cheatCodeTarget.length) {
            cheatCode = cheatCode.slice(-cheatCodeTarget.length);
        }
        if (cheatCode === cheatCodeTarget) {
            autoPlay = !autoPlay;
            cheatCode = "";
            showNotification(autoPlay ? "Автоигра активирована!" : "Автоигра деактивирована!");
        }
    }
});

// Обработка движения мыши
function mouseMoveHandler(e) {
    if (!autoPlay) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        paddleX = mouseX - paddleWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX > canvas.width - paddleWidth) paddleX = canvas.width - paddleWidth;
    }
}

// Обработка касания на мобильных устройствах
function touchMoveHandler(e) {
    if (!autoPlay) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        paddleX = touchX - paddleWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX > canvas.width - paddleWidth) paddleX = canvas.width - paddleWidth;
    }
}

function drawPaddle() {
    ctx.save();
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ffffff";
    if (paddleFlash) {
        ctx.shadowColor = "rgba(76, 175, 80, 0.8)";
        ctx.shadowBlur = 20;
    } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
    }
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function drawBall() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    if (ballFlash) {
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.shadowBlur = 20;
    }
    if (ballPulse) {
        ctx.globalAlpha = 0.8;
    }
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Столкновение с боковыми стенами
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
        ballFlash = true;
        setTimeout(() => ballFlash = false, 200);
    }

    // Столкновение с верхней стеной
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
        ballFlash = true;
        setTimeout(() => ballFlash = false, 200);
    }

    // Столкновение с платформой
    if (
        ballY + ballRadius > paddleY &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth
    ) {
        ballSpeedY = -ballSpeedY;
        score++;
        document.getElementById("score").textContent = `Счет: ${score}`;
        document.getElementById("score").classList.add("animate");
        setTimeout(() => document.getElementById("score").classList.remove("animate"), 200);
        ballFlash = true;
        paddleFlash = true;
        setTimeout(() => {
            ballFlash = false;
            paddleFlash = false;
        }, 200);
    }

    // Мяч упал ниже платформы
    if (ballY + ballRadius > canvas.height) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = 5;
        ballSpeedY = -5;
        paddleX = (canvas.width - paddleWidth) / 2;
        score = 0;
        document.getElementById("score").textContent = `Счет: ${score}`;
        document.getElementById("score").classList.add("animate");
        setTimeout(() => document.getElementById("score").classList.remove("animate"), 200);
    }

    // Автоигра: платформа следует за мячом
    if (autoPlay) {
        paddleX = ballX - paddleWidth / 2;
        if (paddleX < 0) paddleX = 0;
        if (paddleX > canvas.width - paddleWidth) paddleX = canvas.width - paddleWidth;
    }

    // Пульсация мяча
    ballPulse = !ballPulse;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    moveBall();
    animationFrameId = requestAnimationFrame(draw);
}

function startPongGame() {
    if (!animationFrameId) {
        score = 0;
        document.getElementById("score").textContent = `Счет: ${score}`;
        canvas.addEventListener("mousemove", mouseMoveHandler);
        canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });
        draw();
    }
}

function stopPongGame() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameId = null;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        paddleX = (canvas.width - paddleWidth) / 2;
        score = 0;
        document.getElementById("score").textContent = `Счет: ${score}`;
        autoPlay = false;
        cheatCode = "";
        ballPulse = false;
        ballFlash = false;
        paddleFlash = false;
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        canvas.removeEventListener("touchmove", touchMoveHandler);
    }
}

// Закрытие модального окна при клике вне контента
window.onclick = function(event) {
    if (event.target === document.getElementById("gameModal")) {
        closeGameModal();
    }
};

// Инициализация при загрузке страницы
window.onload = function() {
    checkUK();
    initContent();
    
    // Добавляем эффект параллакса для частиц фона
    document.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.particle');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        particles.forEach((particle, index) => {
            const speed = 0.01 + (index * 0.01);
            const xOffset = (mouseX - 0.5) * speed * 100;
            const yOffset = (mouseY - 0.5) * speed * 100;
            
            particle.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
};
