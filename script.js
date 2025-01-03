// script.js
const player = document.getElementById('player');
const playerName = document.getElementById('player-name');
const gameContainer = document.getElementById('game-container');
const scoreValue = document.getElementById('score-value');
const restartBtn = document.getElementById('restart-btn');

let playerSpeed = 5;
let isJumping = false;
let jumpHeight = 0;
let gravity = 0.5;
let score = 0;
let obstacles = [];
let gameOver = false;
let startTime = Date.now(); // وقت بداية اللعبة
let obstacleSpeed = 5; // سرعة العوائق
let obstacleAcceleration = 0.02; // تسارع متوسط

// الاستماع لللمس على الشاشة
document.addEventListener('touchstart', function(e) {
    if (gameOver) return; // إذا كانت اللعبة قد انتهت، لا نسمح بأي حركة جديدة
    jump();
});

// الاستماع للضغط على زر المسافة (Space)
document.addEventListener('keydown', function(e) {
    if (gameOver) return; // إذا كانت اللعبة قد انتهت، لا نسمح بأي حركة جديدة
    if (e.key === ' ') { // زر المسافة
        jump();
    }
    // إضافة حركة اليمين واليسار هنا إذا لزم الأمر
});

// القفز
function jump() {
    if (!isJumping) {
        isJumping = true;
        let jumpInterval = setInterval(function() {
            if (jumpHeight < 100) { // الارتفاع الأقصى للقفز
                jumpHeight += 10;
                player.style.bottom = 50 + jumpHeight + 'px';
            } else {
                clearInterval(jumpInterval);
                let fallInterval = setInterval(function() {
                    if (jumpHeight > 0) {
                        jumpHeight -= 10;
                        player.style.bottom = 50 + jumpHeight + 'px';
                    } else {
                        clearInterval(fallInterval);
                        isJumping = false;
                    }
                }, 20);
            }
        }, 20);
    }
}
function createObstacle() {
    let obstacleDiv = document.createElement('div');
    obstacleDiv.style.position = 'absolute';
    obstacleDiv.style.bottom = '50px';
    obstacleDiv.style.left = `${gameContainer.offsetWidth}px`;
    obstacleDiv.style.width = '50px'; // حجم العائق
    obstacleDiv.style.height = '50px';
    obstacleDiv.style.backgroundImage = 'url("https://png.pngtree.com/png-clipart/20231001/original/pngtree-cartoon-fire-effect-blaze-fire-free-png-png-image_13221873.png")'; // صورة العائق
    obstacleDiv.style.backgroundSize = 'cover'; // تغطية العائق بالصورة
    gameContainer.appendChild(obstacleDiv);

    let moveObstacle = setInterval(function() {
        let leftPosition = parseInt(obstacleDiv.style.left);
        
        if (leftPosition <= 0) {
            clearInterval(moveObstacle);
            gameContainer.removeChild(obstacleDiv);
        } else {
            obstacleDiv.style.left = leftPosition - obstacleSpeed + 'px';
        }

        // زيادة سرعة العوائق تدريجيًا (تسارع متوسط)
        obstacleSpeed += obstacleAcceleration;

        if (checkCollision(player, obstacleDiv)) {
            resetGame();
        }
    }, 20);
}

// توليد العوائق العشوائية
setInterval(createObstacle, 2000); // إنشاء عائق جديد كل 2 ثانية

function updateScore() {
    let leftPosition = parseInt(player.style.left) || 0;
    score = Math.floor(leftPosition / 10); // النتيجة بناءً على المسافة الأفقية
    scoreValue.textContent = score;
}

function checkCollision(player, obstacle) {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    
    return !(playerRect.right < obstacleRect.left ||
             playerRect.left > obstacleRect.right ||
             playerRect.bottom < obstacleRect.top ||
             playerRect.top > obstacleRect.bottom);
}

function resetGame() {
    player.style.left = '50px';
    player.style.bottom = '50px';
    score = 0;
    scoreValue.textContent = score;
    gameOver = false;
    
    // إعادة العوائق المفقودة
    let allObstacles = gameContainer.getElementsByTagName('div');
    for (let i = allObstacles.length - 1; i >= 0; i--) {
        gameContainer.removeChild(allObstacles[i]);
    }
    
    // إعادة تعيين وقت اللعبة
    startTime = Date.now();
    obstacleSpeed = 5; // إعادة تعيين سرعة العوائق
}

// بدء العد التنازلي للوقت
setInterval(function() {
    if (!gameOver) {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);  // الوقت الذي مر
        scoreValue.textContent = `النتيجة: ${elapsedTime}`;  // عرض الوقت كمرحلة
    }
}, 1000);
