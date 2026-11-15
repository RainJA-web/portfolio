// --- CẤU HÌNH ---
// Thay URL này bằng link CSV Google Sheet của bạn
const CONFIG_URL = 'https://docs.google.com/spreadsheets/d/19rqJdnmV1fH4QhrrNCrTOZEKBZuXoXbYLXGwIERwy-o/gviz/tq?tqx=out:csv&gid=1668264962'; 

// --- BIẾN TOÀN CỤC ---
let levelsData = [];
let currentLevelIndex = 0;
let tiles = []; // Mảng chứa object tile
let tray = [];  // Mảng chứa tile trong khay
const TRAY_CAPACITY = 7;

// --- KHỞI TẠO ---
async function initGame() {
    await loadConfig();
    if (levelsData.length > 0) {
        startLevel(0);
    } else {
        alert("Không tải được dữ liệu màn chơi!");
    }
}

// 1. TẢI CẤU HÌNH TỪ SHEET
async function loadConfig() {
    try {
        const response = await fetch(CONFIG_URL);
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Bỏ header
        
        levelsData = rows.map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length < 3) return null;
            return {
                level: parseInt(cols[0]),
                icons: cols[1].split('-').map(i => i.trim()), // Dùng dấu ; để ngăn cách icon trong CSV nếu cần, hoặc sửa logic split
                // Lưu ý: Nếu trong CSV bạn dùng dấu phẩy để ngăn cách icon, hãy cẩn thận vì CSV cũng dùng dấu phẩy.
                // Tốt nhất cột Icons trong Sheet nên để dạng: "🐶-🐱-🐭" rồi split('-')
                tileCount: parseInt(cols[2])
            };
        }).filter(item => item);
        
        // Fallback nếu parse lỗi hoặc chưa có data chuẩn
        if (levelsData.length === 0) {
            levelsData = [
                { level: 1, icons: ['🐶','🦴','🐾'], tileCount: 3 },
                { level: 2, icons: ['🍎','🍌','🍇','🍉'], tileCount: 6 }
            ];
        }
    } catch (e) {
        console.error("Lỗi tải config:", e);
        // Dữ liệu giả lập để test
        levelsData = [
            { level: 1, icons: ['🐶','🦴','🐾'], tileCount: 4 }
        ];
    }
}

// 2. BẮT ĐẦU LEVEL
function startLevel(index) {
    currentLevelIndex = index;
    const levelConfig = levelsData[index];
    if (!levelConfig) {
        alert("Đã hết màn chơi! Quay lại màn 1.");
        startLevel(0);
        return;
    }

    document.getElementById('level-display').innerText = levelConfig.level;
    document.getElementById('end-screen').classList.add('hidden');
    
    // Reset trạng thái
    tray = [];
    tiles = [];
    renderTray();
    
    // Tạo danh sách thẻ bài (Mỗi loại nhân 3)
    let deck = [];
    for (let i = 0; i < levelConfig.tileCount; i++) {
        // Chọn ngẫu nhiên icon từ danh sách
        const icon = levelConfig.icons[i % levelConfig.icons.length];
        deck.push(icon, icon, icon);
    }
    
    // Xáo trộn
    deck.sort(() => Math.random() - 0.5);

    // Tạo DOM và vị trí ngẫu nhiên
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    const boardW = board.clientWidth - 50; // Trừ kích thước tile
    const boardH = board.clientHeight - 60;

    deck.forEach((icon, id) => {
        const tile = {
            id: id,
            icon: icon,
            // Random vị trí nhưng gom vào giữa một chút
            x: Math.random() * boardW,
            y: Math.random() * boardH,
            zIndex: id, // Tạm thời z-index theo thứ tự sinh ra
            el: null
        };
        
        const el = document.createElement('div');
        el.className = 'tile';
        el.innerText = icon;
        el.style.left = tile.x + 'px';
        el.style.top = tile.y + 'px';
        el.style.zIndex = tile.zIndex;
        
        el.onclick = () => onTileClick(tile);
        
        tile.el = el;
        tiles.push(tile);
        board.appendChild(el);
    });

    updateClickableState();
}

// 3. KIỂM TRA THẺ CÓ BỊ ĐÈ KHÔNG
function updateClickableState() {
    tiles.forEach(tile => {
        let isCovered = false;
        // Kiểm tra va chạm với các tile có zIndex cao hơn
        for (let other of tiles) {
            if (other === tile) continue;
            if (other.zIndex > tile.zIndex) {
                // Kiểm tra va chạm hình chữ nhật (AABB)
                // Kích thước tile là 50x55
                const overlap = !(tile.x + 50 <= other.x || 
                                  tile.x >= other.x + 50 || 
                                  tile.y + 55 <= other.y || 
                                  tile.y >= other.y + 55);
                if (overlap) {
                    isCovered = true;
                    break;
                }
            }
        }
        
        if (isCovered) {
            tile.el.classList.add('disabled');
        } else {
            tile.el.classList.remove('disabled');
        }
    });
}

// 4. XỬ LÝ CLICK
function onTileClick(tile) {
    // Nếu bị đè hoặc khay đầy thì không làm gì
    if (tile.el.classList.contains('disabled') || tray.length >= TRAY_CAPACITY) return;

    // Xóa khỏi danh sách trên bàn
    tiles = tiles.filter(t => t !== tile);
    tile.el.remove(); // Xóa DOM cũ trên bàn
    
    // Thêm vào khay
    tray.push(tile);
    
    // Cập nhật lại trạng thái các thẻ còn lại trên bàn
    updateClickableState();
    
    // Render lại khay và check match
    checkMatchAndRenderTray();
}

// 5. LOGIC KHAY VÀ MATCH 3
function checkMatchAndRenderTray() {
    // Sắp xếp khay để các icon giống nhau nằm cạnh nhau
    tray.sort((a, b) => a.icon.localeCompare(b.icon));

    // Tìm bộ 3
    let matchFound = false;
    // Duyệt ngược để xóa an toàn
    for (let i = 0; i < tray.length - 2; i++) {
        if (tray[i].icon === tray[i+1].icon && tray[i].icon === tray[i+2].icon) {
            // Xóa 3 phần tử này
            tray.splice(i, 3);
            matchFound = true;
            break; // Chỉ xóa 1 bộ mỗi lần check cho mượt
        }
    }

    renderTray();

    // Kiểm tra thắng/thua
    if (tiles.length === 0 && tray.length === 0) {
        setTimeout(() => showEndScreen(true), 300);
    } else if (tray.length >= TRAY_CAPACITY) {
        setTimeout(() => showEndScreen(false), 300);
    }
}

function renderTray() {
    const trayEl = document.getElementById('tray');
    trayEl.innerHTML = '';
    tray.forEach(tile => {
        const el = document.createElement('div');
        el.className = 'tile';
        el.innerText = tile.icon;
        trayEl.appendChild(el);
    });
}

// 6. KẾT THÚC GAME
function showEndScreen(isWin) {
    const screen = document.getElementById('end-screen');
    const msg = document.getElementById('end-message');
    const btn = document.getElementById('next-btn');
    
    screen.classList.remove('hidden');
    if (isWin) {
        msg.innerText = "Tuyệt vời! Qua màn!";
        btn.innerText = "Màn tiếp theo";
        btn.onclick = () => startLevel(currentLevelIndex + 1);
    } else {
        msg.innerText = "Khay đầy rồi! Thua cuộc.";
        btn.innerText = "Chơi lại";
        btn.onclick = () => startLevel(currentLevelIndex);
    }
}

function restartLevel() {
    startLevel(currentLevelIndex);
}

initGame();