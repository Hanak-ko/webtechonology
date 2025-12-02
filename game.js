
// 🎯 ЕЛЕМЕНТИ (без змін)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');
const gameUI = document.getElementById('gameUI');
const gameOverScreen = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const uiElements = {
  score: document.getElementById('score'),
  lives: document.getElementById('lives'),
  timer: document.getElementById('timer'),
  finalScore: document.getElementById('finalScore')
};

// 🎮 ЗМІННІ
let gameState = { score: 0, timeLeft: 60, gameRunning: false, gameOver: false, won: false };
let player = { x: 100, y: 250, size: 60, speed: 5, lives: 3 };
let enemies = [];   // 🖱️ Миші
let bonuses = [];   // 🐟 Рибки
let dangers = [];   // 🌵 Кактуси

const keys = {};
let gameActive = false;

// 🖌️ МАЛЮВАННЯ
function drawEmoji(ctx, emoji, x, y, size) {
  ctx.font = `${size}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x + size/2, y + size/2);
}

// 🔄 ОСНОВНИЙ ЦИКЛ
function gameLoop() {
  if (!gameState.gameRunning || gameState.gameOver) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 🐱 КІТ
  drawEmoji(ctx, '🐱', player.x, player.y, player.size);
  
  // 🖱️ МИШІ
  enemies.forEach((enemy, i) => {
    enemy.x += (Math.random() - 0.5) * enemy.speed;
    enemy.y += (Math.random() - 0.5) * enemy.speed;
    enemy.x = Math.max(0, Math.min(canvas.width - enemy.size, enemy.x));
    enemy.y = Math.max(0, Math.min(canvas.height - enemy.size, enemy.y));
    drawEmoji(ctx, '🖱️', enemy.x, enemy.y, enemy.size);
    
    if (Math.hypot(enemy.x - player.x, enemy.y - player.y) < 40) {
      enemies.splice(i, 1);
      gameState.score += 10;
      playSound('catch');
      updateUI();
    }
  });
  if (Math.random() < 0.02 && enemies.length < 6) spawnEnemy();
  
  // 🐟 РИБКИ
  bonuses.forEach((bonus, i) => {
    bonus.x += (Math.random() - 0.5) * 1.2;
    bonus.y += (Math.random() - 0.5) * 1.2;
    bonus.x = Math.max(0, Math.min(canvas.width - bonus.size, bonus.x));
    bonus.y = Math.max(0, Math.min(canvas.height - bonus.size, bonus.y));
    drawEmoji(ctx, '🐟', bonus.x, bonus.y, bonus.size);
    
    if (Math.hypot(bonus.x - player.x, bonus.y - player.y) < 40) {
      bonuses.splice(i, 1);
      gameState.score += 100;
      player.speed += 0.3;
      playSound('bonus');
      updateUI();
    }
  });
  if (Math.random() < 0.015 && bonuses.length < 4) spawnBonus();
  
  // 🌵 КАКТУСИ - ПОВІЛЬНО ПОВЗУТЬ ДО КОТА!
  dangers.forEach((danger, i) => {
    // 🆕 Рух до кота (дуже повільно - 0.3)
    const dx = player.x - danger.x;
    const dy = player.y - danger.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0) {
      danger.x += (dx / dist) * 0.6;  // Повільно до кота!
      danger.y += (dy / dist) * 0.6;
    }
    danger.x = Math.max(0, Math.min(canvas.width - danger.size, danger.x));
    danger.y = Math.max(0, Math.min(canvas.height - danger.size, danger.y));
    drawEmoji(ctx, '🌵', danger.x, danger.y, danger.size);
    
    // 🆕 ЗІТКНЕННЯ (-1 ❤️)
    if (Math.hypot(danger.x - player.x, danger.y - player.y) < 45) {
      dangers.splice(i, 1);
      player.lives--;
      playSound('hurt');
      updateUI();
      if (player.lives <= 0) endGame(false);  // Поразка
    }
  });
  if (Math.random() < 0.008 && dangers.length < 3) spawnDanger();
  
  requestAnimationFrame(gameLoop);
}

// 👻 СПАВН 
function spawnEnemy() {
  enemies.push({ x: Math.random() * (canvas.width - 50), y: Math.random() * (canvas.height - 50), size: 45, speed: 1.8 });
}
function spawnBonus() {
  bonuses.push({ x: Math.random() * (canvas.width - 40), y: Math.random() * (canvas.height - 40), size: 40 });
}
function spawnDanger() {
  dangers.push({ x: Math.random() * (canvas.width - 50), y: Math.random() * (canvas.height - 50), size: 50 });
}

// ⏱️ ТАЙМЕР
let timerInterval;
function startTimer() {
  timerInterval = setInterval(() => {
    gameState.timeLeft--;
    updateUI();
    if (gameState.timeLeft <= 0) endGame(true);  // 🆕 ПЕРЕМОГА!
  }, 1000);
}

// 🕹️ РУХ КОТА 
function updatePlayer() {
  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup']) dy -= player.speed;
  if (keys['s'] || keys['arrowdown']) dy += player.speed;
  if (keys['a'] || keys['arrowleft']) dx -= player.speed;
  if (keys['d'] || keys['arrowright']) dx += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x + dx));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y + dy));
}

// 🛑 БЛОК СКРОЛУ
function handleKeyDown(e) {
  if (!gameActive) return;
  const blocked = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'];
  if (blocked.includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()] = true;
}
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

// 🎵 ЗВУКИ + ФАНФАРИ ДЛЯ ПЕРЕМОГИ
function playSound(type) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  let freq = type === 'catch' ? 800 : type === 'bonus' ? 1200 : type === 'win' ? 1500 : 400;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + (type === 'win' ? 1 : 0.2));
  osc.stop(audioCtx.currentTime + (type === 'win' ? 1 : 0.2));
}

// 📊 UI
function updateUI() {
  uiElements.score.textContent = gameState.score;
  uiElements.timer.textContent = gameState.timeLeft;
  uiElements.lives.innerHTML = '❤️'.repeat(player.lives);
}

// 🏁 КІНЕЦЬ ГРИ (🆕 ПЕРЕМОГА АБО ПОРАЗКА)
function endGame(isWin) {
  gameState.gameOver = true;
  gameState.gameRunning = false;
  clearInterval(timerInterval);
  gameActive = false;
  
  uiElements.finalScore.textContent = gameState.score;
  
  const title = gameOverScreen.querySelector('h1');
  const subtitle = gameOverScreen.querySelector('h2');
  
  if (isWin) {
    gameState.won = true;
    title.textContent = 'ВИ ПЕРЕМОГЛИ! 🏆✨';
    title.style.color = '#ffd700';  // Золотий
    subtitle.textContent = `Твій рекорд: ${gameState.score} балів! 🎉`;
    playSound('win');
    confettiStars();  // 🆕 Конфетті-зірочки!
  } else {
    title.textContent = 'GAME OVER 😿';
    title.style.color = '#ff1493';
    subtitle.textContent = `Твій рекорд: ${gameState.score} балів. Спробуй ще!`;
    playSound('gameover');
  }
  
  gameOverScreen.style.display = 'block';
}

// 🆕 КОНФЕТТІ ДЛЯ ПЕРЕМОГИ (зірочки падають)
function confettiStars() {
  let stars = [];
  for (let i = 0; i < 50; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: -20,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 20 + 10
    });
  }
  
  function animateStars() {
    stars.forEach((s, i) => {
      s.y += s.vy;
      drawEmoji(ctx, '⭐', s.x, s.y, s.size);
      if (s.y > canvas.height) stars.splice(i, 1);
    });
    if (stars.length > 0) requestAnimationFrame(animateStars);
  }
  animateStars();
}

// 🚀 СТАРТ
function startGame() {
  Object.assign(gameState, { score: 0, timeLeft: 60, gameRunning: true, gameOver: false, won: false });
  Object.assign(player, { x: 100, y: 250, speed: 5, lives: 3 });
  enemies = []; bonuses = []; dangers = [];
  
  startMenu.style.display = 'none';
  gameUI.style.display = 'block';
  gameOverScreen.style.display = 'none';
  gameActive = true;
  
  updateUI();
  startTimer();
  gameLoop();
  setInterval(updatePlayer, 16);
  
  setTimeout(spawnEnemy, 500);
  setTimeout(spawnEnemy, 1500);
  setTimeout(spawnBonus, 2500);
  setTimeout(spawnDanger, 3500);
}

startBtn.onclick = startGame;
restartBtn.onclick = startGame;
canvas.onclick = () => { if (gameState.gameOver) startGame(); };

window.addEventListener('resize', () => {
  canvas.width = Math.min(800, window.innerWidth - 40);
  canvas.height = Math.min(500, window.innerHeight - 200);
});