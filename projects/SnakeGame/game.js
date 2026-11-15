// --- CẤU HÌNH ---
// Thay URL này bằng link CSV Google Sheet của bạn (Cấu trúc: Level, Speed, TargetScore)
// Tạm thời dùng link cũ nhưng bạn nên tạo sheet mới để chỉnh tốc độ
const CONFIG_URL = 'https://docs.google.com/spreadsheets/d/19rqJdnmV1fH4QhrrNCrTOZEKBZuXoXbYLXGwIERwy-o/gviz/tq?tqx=out:csv&gid=1008235593'; 

// --- BIẾN TOÀN CỤC ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20; // Kích thước mỗi ô
const tileCount = canvas.width / gridSize;

let levelsData = [];
let currentLevel = 1;
let gameSpeed = 150;
let score = 0;
let gameInterval;
let isPaused = false;
let isGameOver = false;
let changingDirection = false; // Cờ chặn nhấn phím quá nhanh

// Rắn và Mồi
let snake = [];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;

// --- KHỞI TẠO ---
async function init() {
    await loadConfig();
    loadHistory();
    document.addEventListener('keydown', keyDownEvent);
}

// 1. TẢI CONFIG TỪ SHEET
async function loadConfig() {
    try {
        const response = await fetch(CONFIG_URL);
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        
        levelsData = rows.map(row => {
            // Xử lý CSV parser đơn giản
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length < 2) return null;
            return {
                level: parseInt(cols[0]) || 1,
                speed: parseInt(cols[1]) || 150, // Cột 2 là tốc độ
                target: parseInt(cols[2]) || 999 // Cột 3 là điểm mục tiêu (nếu có)
            };
        }).filter(i => i);

        if (levelsData.length === 0) throw new Error("No data");
    } catch (e) {
        console.log("Dùng cấu hình mặc định");
        levelsData = [
            { level: 1, speed: 150, target: 50 },
            { level: 2, speed: 120, target: 100 },
            { level: 3, speed: 90, target: 200 }
        ];
    }
}

// 2. LOGIC GAME
function startGame() {
    window.focus(); // Đảm bảo cửa sổ game nhận sự kiện phím ngay khi bấm chơi
    document.getElementById('overlay').classList.add('hidden');
    resetGame();
    applyLevelConfig();
    // Đã xóa dòng setInterval thừa ở đây vì applyLevelConfig đã gọi rồi
}

function resetGame() {
    currentLevel = 1;
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]; // Rắn dài 3 đốt
    score = 0;
    dx = 1; dy = 0; // Mặc định đi sang phải
    isGameOver = false;
    isPaused = false;
    changingDirection = false;
    updateScore();
    placeFood();
}

function applyLevelConfig() {
    // Tìm config cho level hiện tại (giả lập logic tăng level)
    const config = levelsData.find(l => l.level === currentLevel) || levelsData[0];
    gameSpeed = config.speed;
    document.getElementById('level-display').innerText = currentLevel;
    
    // Reset interval nếu tốc độ thay đổi
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function gameLoop() {
    if (isPaused || isGameOver) return;
    changingDirection = false; // Cho phép nhận phím mới sau khi rắn đã di chuyển

    // Di chuyển
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Kiểm tra va chạm tường
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Kiểm tra cắn vào thân
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head); // Thêm đầu mới

    // Ăn mồi
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        placeFood();
        // Logic tăng level dựa trên config
        const currentConfig = levelsData.find(l => l.level === currentLevel);
        if (currentConfig && score >= currentConfig.target) {
            const nextLevelExists = levelsData.some(l => l.level === currentLevel + 1);
            if (nextLevelExists) {
                currentLevel++;
                applyLevelConfig();
            }
        }
    } else {
        snake.pop(); // Xóa đuôi nếu không ăn
    }

    draw();
}

function draw() {
    // Xóa màn hình
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ rắn
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e'; // Đầu màu sáng hơn
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Vẽ mồi
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc((food.x * gridSize) + gridSize/2, (food.y * gridSize) + gridSize/2, gridSize/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // Đảm bảo mồi không xuất hiện trên thân rắn
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) placeFood();
    });
}

function keyDownEvent(e) {
    // Ngăn cuộn trang khi chơi
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)) {
        e.preventDefault();
    }

    // Hỗ trợ Arrow Keys và WASD
    const isLeft = e.code === 'ArrowLeft' || e.code === 'KeyA';
    const isUp = e.code === 'ArrowUp' || e.code === 'KeyW';
    const isRight = e.code === 'ArrowRight' || e.code === 'KeyD';
    const isDown = e.code === 'ArrowDown' || e.code === 'KeyS';

    if (changingDirection) return; // Nếu đã đổi hướng trong lượt này rồi thì bỏ qua

    if (isLeft && dx !== 1) { dx = -1; dy = 0; changingDirection = true; }
    if (isUp && dy !== 1) { dx = 0; dy = -1; changingDirection = true; }
    if (isRight && dx !== -1) { dx = 1; dy = 0; changingDirection = true; }
    if (isDown && dy !== -1) { dx = 0; dy = 1; changingDirection = true; }
}

// Hỗ trợ nút bấm ảo
function changeDirection(dir) {
    if (changingDirection) return;
    if (dir === 'left' && dx !== 1) { dx = -1; dy = 0; changingDirection = true; }
    if (dir === 'up' && dy !== 1) { dx = 0; dy = -1; changingDirection = true; }
    if (dir === 'right' && dx !== -1) { dx = 1; dy = 0; changingDirection = true; }
    if (dir === 'down' && dy !== -1) { dx = 0; dy = 1; changingDirection = true; }
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    saveHistory(score);
    
    document.getElementById('overlay').classList.remove('hidden');
    document.getElementById('overlay-title').innerText = "GAME OVER";
    document.getElementById('overlay-msg').innerText = `Điểm số: ${score}`;
    document.querySelector('.btn-start').innerText = "CHƠI LẠI";
}

function updateScore() {
    document.getElementById('score-display').innerText = score;
}

function togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('btn-pause');
    btn.innerHTML = isPaused ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-pause"></i>';
}

function restartGame() {
    clearInterval(gameInterval);
    startGame();
}

// 3. LỊCH SỬ NGƯỜI CHƠI (LocalStorage)
function saveHistory(score) {
    let history = JSON.parse(localStorage.getItem('snake_history')) || [];
    const date = new Date().toLocaleTimeString();
    history.unshift({ score: score, date: date });
    if (history.length > 5) history.pop(); // Giữ 5 kết quả gần nhất
    localStorage.setItem('snake_history', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const list = document.getElementById('history-list');
    let history = JSON.parse(localStorage.getItem('snake_history')) || [];
    list.innerHTML = history.map(h => `<li><span>${h.date}</span> <b>${h.score}</b></li>`).join('');
}

function clearHistory() {
    localStorage.removeItem('snake_history');
    loadHistory();
}

init();