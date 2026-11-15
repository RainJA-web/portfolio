const canvas = document.getElementById("birdGame");
const ctx = canvas.getContext("2d");

// --- CẤU HÌNH ĐƯỜNG DẪN ---
const CONFIG_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTzhZ6w3B4MEASeQMbcE8L76vsLJuMhUOK4GwOWvoBivAqSIRgjN8lD1iujxCFjc7GLfuYxRBhiLpza/pub?output=csv&gid=0';
const SHEETDB_URL = 'https://sheetdb.io/api/v1/8yz7nbx9moque?sheet=Leaderboard';

// --- BIẾN TOÀN CỤC GAME ---
let config = { gravity: 0.25, jump: -4.5, pipeSpeed: 2 };
let bird = { x: 50, y: 150, w: 35, h: 35, velocity: 0 }; // Kích thước tên lửa
let pipes = [];
let score = 0;
let gameState = "START";
let playerName = "";
const gap = 150; // Khoảng cách giữa các tiểu hành tinh

// --- TẢI HÌNH ẢNH ---
const rocketImg = new Image();
rocketImg.src = './assets/rocket.png'; // Đảm bảo đường dẫn đúng
const asteroidImg = new Image();
asteroidImg.src = './assets/asteroid.png'; // Đảm bảo đường dẫn đúng

// Cờ để biết ảnh đã tải xong chưa
let assetsLoaded = false;
let imagesToLoad = 2; // Số lượng ảnh cần tải

function assetLoaded() {
    imagesToLoad--;
    if (imagesToLoad === 0) {
        assetsLoaded = true;
        // Bắt đầu gameLoop chỉ khi tất cả ảnh đã tải
        gameLoop(); 
    }
}
rocketImg.onload = assetLoaded;
asteroidImg.onload = assetLoaded;
rocketImg.onerror = () => { console.error("Lỗi tải rocket.png"); assetLoaded(); };
asteroidImg.onerror = () => { console.error("Lỗi tải asteroid.png"); assetLoaded(); };


// 1. TẢI CẤU HÌNH (Đọc hàng ngang)
async function loadConfig() {
    try {
        const response = await fetch(CONFIG_URL);
        const data = await response.text();
        const rows = data.split('\n');
        if (rows.length >= 2) {
            const values = rows[1].split(','); 
            config.gravity = parseFloat(values[0]) || 0.25;
            config.jump = parseFloat(values[1]) || -4.5;
            config.pipeSpeed = parseFloat(values[2]) || 2;
        }
    } catch (e) { console.warn("Using default config"); }
}

// 2. LƯU ĐIỂM VÀO SHEET LEADERBOARD
async function saveScore(name, finalScore) {
    try {
        await fetch(SHEETDB_URL, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [{ "Name": name, "Score": finalScore, "Date": new Date().toLocaleString('vi-VN') }]
            })
        });
    } catch (e) { console.error("Lỗi lưu điểm:", e); }
}

// 3. TẢI VÀ HIỂN THỊ LEADERBOARD
async function loadLeaderboard() {
    const listElement = document.getElementById("leaderboard-list");
    listElement.innerHTML = "<li>Đang đồng bộ...</li>";
    try {
        const response = await fetch(`${SHEETDB_URL}&limit=5&sort_by=Score&sort_order=desc`);
        const data = await response.json();
        if (data.length > 0) {
            listElement.innerHTML = data.map((item, index) => {
                const medal = index === 0 ? "🥇" : (index === 1 ? "🥈" : (index === 2 ? "🥉" : ""));
                return `<li>${medal} ${item.Name}: <b>${item.Score}đ</b></li>`;
            }).join('');
        } else {
            listElement.innerHTML = "<li>Chưa có dữ liệu</li>";
        }
    } catch (e) {
        console.error("Lỗi tải Leaderboard:", e);
        listElement.innerHTML = "<li>Lỗi kết nối dữ liệu</li>";
    }
}

// 4. LOGIC TẠO VẬT CẢN (TIỂU HÀNH TINH)
function spawnPipe() {
    const minHeight = 80; // Chiều cao tối thiểu của tiểu hành tinh
    const topHeight = Math.floor(Math.random() * (canvas.height - gap - minHeight * 2)) + minHeight;
    pipes.push({ x: canvas.width, top: topHeight, passed: false });
}

// 5. CẬP NHẬT TRẠNG THÁI GAME
function update() {
    if (gameState !== "PLAYING" || !assetsLoaded) return;

    bird.velocity += config.gravity;
    bird.y += bird.velocity;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        spawnPipe();
    }

    // Thiết lập bán kính va chạm (Hãy chỉnh số này nhỏ lại nếu muốn game dễ hơn)
    const birdRadius = 10;      // Bán kính tên lửa
    const asteroidRadius = 22;  // Bán kính tiểu hành tinh

    // Tâm của tên lửa
    const bCX = bird.x + bird.w / 2;
    const bCY = bird.y + bird.h / 2;

    for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        p.x -= config.pipeSpeed;

        const aCX = p.x + 25; // Tâm X tiểu hành tinh (cột rộng 50 nên tâm là 25)

        // 1. Khoảng cách tới tiểu hành tinh TRÊN
        const aTopCY = p.top - asteroidRadius;
        const distTop = Math.hypot(bCX - aCX, bCY - aTopCY);

        // 2. Khoảng cách tới tiểu hành tinh DƯỚI
        const aBotCY = p.top + gap + asteroidRadius;
        const distBot = Math.hypot(bCX - aCX, bCY - aBotCY);

        // Kiểm tra va chạm
        if (distTop < (birdRadius + asteroidRadius) || distBot < (birdRadius + asteroidRadius)) {
            gameOver();
            return;
        }

        // Tính điểm
        if (!p.passed && p.x + 50 < bird.x) {
            score++;
            p.passed = true;
            document.getElementById("score").innerText = score;
        }

        if (p.x + 50 < 0) pipes.splice(i, 1);
    }

    // Chạm biên màn hình
    if (bird.y + bird.h > canvas.height || bird.y < 0) gameOver();
}

// 6. VẼ CÁC VẬT THỂ LÊN CANVAS
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!assetsLoaded) return;

    // 1. Vẽ Tên lửa (Rocket)
    ctx.save();
    // Tạo hiệu ứng lửa đuôi nhẹ bằng cách vẽ bóng phía sau
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#f59e0b"; // Màu cam lửa
    ctx.drawImage(rocketImg, bird.x, bird.y, bird.w, bird.h);
    ctx.restore();

    // 2. Vẽ Tiểu hành tinh (Asteroid)
    pipes.forEach(p => {
        const asteroidSize = 65; // Kích thước tiểu hành tinh
        const offsetX = (50 - asteroidSize) / 2; // Căn giữa cột

        // Tiểu hành tinh TRÊN
        ctx.drawImage(
            asteroidImg, 
            p.x + offsetX, 
            p.top - asteroidSize, 
            asteroidSize, 
            asteroidSize
        );

        // Tiểu hành tinh DƯỚI
        ctx.drawImage(
            asteroidImg, 
            p.x + offsetX, 
            p.top + gap, 
            asteroidSize, 
            asteroidSize
        );
        
        // ĐÃ XÓA PHẦN ctx.fillRect (Các hình chữ nhật dài đã biến mất)
    });
}

// 7. VÒNG LẶP CHÍNH CỦA GAME
function gameLoop() {
    update();
    draw();
    if (gameState === "PLAYING" || gameState === "START") {
        requestAnimationFrame(gameLoop);
    }
}

// 8. KẾT THÚC GAME
async function gameOver() {
    gameState = "END";
    document.getElementById("game-ui").classList.add("hidden");
    const endScreen = document.getElementById("end-screen");
    endScreen.classList.remove("hidden");
    document.getElementById("final-score").innerText = `Điểm của bạn: ${score}`;
    await saveScore(playerName || "Guest", score);
    loadLeaderboard();
}

// 9. ĐIỀU KHIỂN & KHỞI CHẠY
document.getElementById("start-btn").onclick = () => {
    playerName = document.getElementById("player-name").value.trim();
    if (!playerName) return alert("Nhập tên phi hành gia!");
    
    // Reset game state
    bird.y = 150; bird.velocity = 0; pipes = []; score = 0;
    
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-ui").classList.remove("hidden");
    gameState = "PLAYING";
    document.getElementById("score").innerText = "0"; // Reset hiển thị điểm
};

const handleJump = (e) => {
    if (gameState === "PLAYING") {
        bird.velocity = config.jump;
        if (e && e.code === "Space") e.preventDefault();
    }
};

window.onkeydown = handleJump;
canvas.onmousedown = handleJump;
canvas.ontouchstart = handleJump; // Thêm hỗ trợ cảm ứng

// Load cấu hình và bắt đầu game loop (nếu ảnh đã tải)
loadConfig();
// gameLoop() được gọi sau khi tất cả ảnh tải xong