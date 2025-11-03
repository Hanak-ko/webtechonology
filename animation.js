// ============================================
// 🐱 ANIMATION.JS - РАНДОМНИЙ РУХ + КРАСИВІ ЛАПКИ!
// ============================================

const container = document.getElementById('paradeContainer');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

let cats = [];
let particles = [];
let frameCount = 0;  // 🆕 Лічильник для рідких лапок

const catEmojis = ['🐱', '🐈', '🐈‍⬛', '😺', '😸'];

// СТВОРЕННЯ КОТІВ
function createCats() {
  cats = [];
  for (let i = 0; i < 5; i++) {
    cats.push({
      x: Math.random() * (canvas.width - 80),
      y: Math.random() * (canvas.height - 80),
      size: 60,
      emoji: catEmojis[i],
      vx: (Math.random() - 0.5) * 2,  // 🆕 Випадкова швидкість
      vy: (Math.random() - 0.5) * 2,
      changeDirTimer: 0  // 🆕 Таймер зміни напрямку
    });
  }
}
createCats();

// МАЛЮВАННЯ ЕМОДЗІ
function drawEmoji(emoji, x, y, size) {
  ctx.font = `${size}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, x + size/2, y + size/2);
}

// 🆕 ПОКРАЩЕНІ СЛІДИ ЛАПОК (окремі + кут)
function createPaw(x, y) {
  const paw = document.createElement('div');
  paw.textContent = '🐾';
  paw.style.position = 'absolute';
  paw.style.left = `${x + Math.random() * 20 - 10}px`;  // Розкид
  paw.style.top = `${y + Math.random() * 20 - 10}px`;
  paw.style.fontSize = '30px';
  paw.style.opacity = '0.8';
  paw.style.pointerEvents = 'none';
  paw.style.transform = `rotate(${Math.random() * 360}deg)`;  // Випадковий кут!
  paw.style.animation = 'fadeOut 2s forwards';
  container.appendChild(paw);
  setTimeout(() => paw.remove(), 2000);
}

// КОНФЕТТІ
function confettiBurst() {
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: canvas.width / 2, y: canvas.height / 2,
      vx: Math.random() * 12 - 6, vy: Math.random() * -15 - 5,
      size: Math.random() * 15 + 10,
      emoji: ['⭐', '✨', '💖', '🐱'][Math.floor(Math.random()*4)]
    });
  }
  playSound('meow');
}

// ЗВУКИ
function playSound(type) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.frequency.setValueAtTime(type === 'meow' ? 800 : 200, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  osc.stop(audioCtx.currentTime + 0.5);
}

// 🆕 РАНДОМНИЙ РУХ (змінюють напрямок)
function updateCatPosition(cat) {
  cat.changeDirTimer--;
  if (cat.changeDirTimer <= 0) {
    cat.vx = (Math.random() - 0.5) * 2;  // Нова швидкість
    cat.vy = (Math.random() - 0.5) * 2;
    cat.changeDirTimer = 60 + Math.random() * 60;  // 1-2 сек
  }
  cat.x += cat.vx;
  cat.y += cat.vy;
  
  // Відскок від стін
  if (cat.x < 0 || cat.x > canvas.width - 80) cat.vx *= -1;
  if (cat.y < 0 || cat.y > canvas.height - 80) cat.vy *= -1;
  
  cat.x = Math.max(0, Math.min(canvas.width - 80, cat.x));
  cat.y = Math.max(0, Math.min(canvas.height - 80, cat.y));
}

// АНІМАЦІЯ
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frameCount++;
  
  // ПАРТИКЛИ
  particles = particles.filter(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.4;
    drawEmoji(p.emoji, p.x, p.y, p.size);
    return p.y < canvas.height;
  });
  
  // КОТИ БРОДЯТЬ
  cats.forEach(cat => {
    updateCatPosition(cat);
    drawEmoji(cat.emoji, cat.x, cat.y, cat.size);
    
    // 🆕 ЛАПКИ РІДКО + ОКРЕМО
    if (frameCount % 20 === 0) {  // Кожні 20 кадрів
      createPaw(cat.x + 40, cat.y + 60);
    }
  });
  
  requestAnimationFrame(animate);
}
animate();

// КЛІК
container.addEventListener('click', confettiBurst);

// ХАОС-КНОПКА
document.getElementById('chaosBtn').onclick = () => {
  cats.forEach(cat => {
    cat.vx *= 3; cat.vy *= 3;  // Прискорення
    setTimeout(() => {
      cat.vx = (Math.random() - 0.5) * 2;
      cat.vy = (Math.random() - 0.5) * 2;
    }, 3000);
  });
};

// РЕСАЙЗ
window.addEventListener('resize', () => {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  createCats();
});