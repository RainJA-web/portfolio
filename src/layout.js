/**
 * c:\Users\ASUS\OneDrive\Desktop\Thuan\layout.js
 * Layout System & Global Logic
 */

const LAYOUT_CONFIG = {
    avatar: 'src/assets/img/AVT.jpg',
    name: 'Phan Minh Thuan',
    sub: 'Software Engineer',
    playlistSheet: 'https://docs.google.com/spreadsheets/d/19rqJdnmV1fH4QhrrNCrTOZEKBZuXoXbYLXGwIERwy-o/gviz/tq?tqx=out:csv&sheet=Playlisst'
};

const HEADER_TEMPLATE = `
<div class="glass-card p-4 mb-6 rounded-2xl flex flex-wrap justify-between items-center gap-4 relative">
    <div class="flex items-center gap-3 pl-2">
        <div class="w-10 h-10 rounded-full border-2 border-blue-500/30 overflow-hidden">
            <img src="${LAYOUT_CONFIG.avatar}" class="w-full h-full object-cover">
        </div>
        <span class="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">RainJA</span>
    </div>
    <div class="flex items-center gap-2 order-2 md:order-3">
        <div id="digital-clock" class="text-white/80 font-mono text-sm font-bold mr-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hidden sm:block">00:00:00</div>
        <button onclick="toggleSeason()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white/70 hover:text-white" title="Hiệu ứng mùa">
            <i class="fa-solid fa-wand-magic-sparkles" id="season-icon"></i>
        </button>
        <button onclick="toggleTheme()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white/70 hover:text-white" title="Chuyển giao diện">
            <i class="fa-solid fa-sun" id="theme-icon"></i>
        </button>
        <button onclick="toggleMobileMenu()" class="md:hidden w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white/70 hover:text-white" title="Menu">
            <i class="fa-solid fa-bars"></i>
        </button>
    </div>
    <div id="mobile-menu" class="hidden md:flex flex-col md:flex-row justify-center gap-2 items-center order-3 md:order-2 w-full md:w-auto transition-all">
        <a href="index.html" class="w-full md:w-auto px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white/70 hover:text-white text-sm font-medium" title="Trang chủ">
            Trang chủ
        </a>
        <a href="history.html" class="w-full md:w-auto px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white/70 hover:text-white text-sm font-medium" title="Lịch sử hoạt động">
            Lịch sử
        </a>
        <a href="activities.html" class="w-full md:w-auto px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white/70 hover:text-white text-sm font-medium" title="Hoạt động">
            Hoạt động
        </a>
        <a href="profile.html" class="w-full md:w-auto px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white/70 hover:text-white text-sm font-medium" title="Về tôi">
            Về tôi
        </a>
        <a href="contact.html" class="w-full md:w-auto px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-white/70 hover:text-white text-sm font-medium" title="Liên hệ">
            Liên hệ
        </a>
    </div>
</div>
`;

const HERO_TEMPLATE = `
<div class="glass-card p-6 md:p-10 animate-glow rounded-3xl relative overflow-hidden mb-12">
    <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
    
    <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="flex flex-col md:flex-row items-center text-center md:text-left gap-6 flex-1">
            <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500/30 shadow-[0_0_20px_rgba(56,189,248,0.3)] overflow-hidden bg-slate-800">
                    <img src="${LAYOUT_CONFIG.avatar}" alt="Avatar" class="w-full h-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=PMT&background=0D8ABC&color=fff'">
            </div>
            <div>
                <h1 class="text-3xl md:text-4xl font-extrabold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 uppercase">
                    ${LAYOUT_CONFIG.name}
                </h1>
                <p class="mt-2 text-blue-300/60 font-light tracking-widest">${LAYOUT_CONFIG.sub}</p>
            </div>
        </div>

        <div class="relative group">
            <div id="music-disc" onclick="toggleMusic()" class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-slate-900 border-4 border-slate-700 shadow-xl flex items-center justify-center relative overflow-hidden animate-spin-slow paused cursor-pointer transition-transform hover:scale-105">
                <img id="disc-cover" src="" class="absolute inset-0 w-full h-full object-cover hidden">
                <div class="absolute inset-0 rounded-full border-2 border-slate-800 opacity-50" style="margin: 4px"></div>
                <div class="absolute inset-0 rounded-full border-2 border-slate-800 opacity-50" style="margin: 10px"></div>
                <div class="absolute inset-0 rounded-full border-2 border-slate-800 opacity-50" style="margin: 16px"></div>
                <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full border-2 border-white/20 flex items-center justify-center z-10 shadow-inner">
                    <i class="fa-solid fa-music text-white/80 text-[10px]"></i>
                </div>
                <div class="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
            </div>
            <audio id="bg-music" loop></audio>
        </div>
    </div>
</div>
`;

const FOOTER_TEMPLATE = `
<footer class="mt-24 pb-12 pt-8 border-t border-white/10 text-center">
    <div class="flex justify-center gap-8 mb-6">
        <a href="#" class="text-slate-400 hover:text-blue-400 transition-all hover:scale-110"><i class="fa-brands fa-github text-2xl"></i></a>
        <a href="#" class="text-slate-400 hover:text-blue-400 transition-all hover:scale-110"><i class="fa-brands fa-facebook text-2xl"></i></a>
        <a href="#" class="text-slate-400 hover:text-blue-400 transition-all hover:scale-110"><i class="fa-solid fa-envelope text-2xl"></i></a>
    </div>
    <p class="text-slate-500 text-sm font-medium">© 2024 ${LAYOUT_CONFIG.name}. All rights reserved.</p>
</footer>
`;

const MUSIC_MODAL_TEMPLATE = `
<div id="music-modal" class="fixed inset-0 z-[100] hidden flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300">
    <div class="glass-card w-full max-w-md p-6 rounded-3xl relative m-4 flex flex-col max-h-[80vh] shadow-2xl border border-white/10">
        <button onclick="stopMusic()" class="absolute top-4 left-4 text-white/50 hover:text-red-400 transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20" title="Dừng nhạc">
            <i class="fa-solid fa-stop"></i>
        </button>
        <button onclick="closeMusicPlayer()" class="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20">
            <i class="fa-solid fa-xmark"></i>
        </button>
        
        <div class="text-center mb-6">
            <div class="w-32 h-32 mx-auto mb-4 relative group">
                <img id="modal-cover" src="https://via.placeholder.com/150" class="w-full h-full rounded-full object-cover border-4 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-spin-slow paused transition-transform duration-700">
                <div class="absolute inset-0 rounded-full border-2 border-white/10"></div>
            </div>
            <h3 id="modal-title" class="text-xl font-bold text-white truncate px-8">Music Player</h3>
            <p id="modal-artist" class="text-emerald-400 text-sm font-medium tracking-wide">Select a song</p>
        </div>

        <div class="h-24 overflow-y-auto mb-6 p-4 bg-slate-950/50 rounded-xl text-center text-sm text-slate-400 italic border border-white/5 custom-scrollbar leading-relaxed" id="modal-lyric">
            Lời bài hát sẽ hiển thị tại đây...
        </div>

        <div class="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar" id="modal-playlist">
            <!-- Playlist items -->
        </div>

        <div class="hidden">
            <iframe id="youtube-player" allow="autoplay"></iframe>
        </div>
    </div>
</div>
<div id="season-effect"></div>
`;

const BACK_TO_TOP_TEMPLATE = `
<button id="back-to-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" 
    class="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-blue-500/80 hover:bg-blue-400 text-white shadow-lg backdrop-blur-sm transition-all duration-300 opacity-0 invisible translate-y-10 flex items-center justify-center group border border-white/10">
    <i class="fa-solid fa-arrow-up text-xl group-hover:-translate-y-1 transition-transform"></i>
</button>
`;

// --- GLOBAL VARIABLES ---
let playlistSongs = [];
let currentSongIndex = -1;
const seasons = ['default', 'spring', 'summer', 'autumn', 'winter'];
let seasonInterval;

// --- INITIALIZATION ---
function initLayout() {
    // Inject HTML
    const headerEl = document.getElementById('app-header');
    const footerEl = document.getElementById('app-footer');
    
    if (headerEl) {
        headerEl.innerHTML = HEADER_TEMPLATE;
        headerEl.classList.add('sticky', 'top-4', 'z-50');
        headerEl.insertAdjacentHTML('afterend', HERO_TEMPLATE);
    }
    if (footerEl) footerEl.innerHTML = FOOTER_TEMPLATE;
    
    document.body.insertAdjacentHTML('beforeend', MUSIC_MODAL_TEMPLATE);
    document.body.insertAdjacentHTML('beforeend', BACK_TO_TOP_TEMPLATE);

    // Init Logic
    if (localStorage.getItem('theme') === 'light') toggleTheme(true);
    if (localStorage.getItem('season')) setSeason(localStorage.getItem('season'));
    setupRouter();
    updateActiveNavLink();

    setInterval(updateClock, 1000);
    updateClock();

    window.addEventListener('scroll', () => {
        const btn = document.getElementById('back-to-top');
        if (btn) {
            if (window.scrollY > 300) {
                btn.classList.remove('opacity-0', 'invisible', 'translate-y-10');
            } else {
                btn.classList.add('opacity-0', 'invisible', 'translate-y-10');
            }
        }
    });
}

// --- CLOCK LOGIC ---
function updateClock() {
    const clockEl = document.getElementById('digital-clock');
    if (clockEl) {
        clockEl.innerText = new Date().toLocaleTimeString('vi-VN');
    }
}

// --- THEME LOGIC ---
function toggleTheme(forceInit = false) {
    if (!forceInit) document.body.classList.toggle('light-mode');
    else document.body.classList.add('light-mode');

    const isLight = document.body.classList.contains('light-mode');
    const icon = document.getElementById('theme-icon');
    
    if (icon) {
        if (isLight) {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
    } else {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
    }
}

// --- SEASON LOGIC ---
function toggleSeason() {
    let current = localStorage.getItem('season') || 'default';
    let idx = seasons.indexOf(current);
    let next = seasons[(idx + 1) % seasons.length];
    setSeason(next);
}

function setSeason(season) {
    document.body.classList.remove('season-spring', 'season-summer', 'season-autumn', 'season-winter');
    if (season !== 'default') document.body.classList.add(`season-${season}`);
    
    localStorage.setItem('season', season);
    updateSeasonIcon(season);
    startSeasonEffect(season);
    updateClockStyle(season);
    updateActiveNavLink();
}

function updateSeasonIcon(season) {
    const icon = document.getElementById('season-icon');
    if (!icon) return;
    const icons = {
        'default': 'fa-wand-magic-sparkles',
        'spring': 'fa-seedling',
        'summer': 'fa-umbrella-beach',
        'autumn': 'fa-leaf',
        'winter': 'fa-snowflake'
    };
    icon.className = `fa-solid ${icons[season]}`;
}

function startSeasonEffect(season) {
    const container = document.getElementById('season-effect');
    if (!container) return;
    container.innerHTML = '';
    if (seasonInterval) clearInterval(seasonInterval);
    
    if (season === 'default') return;

    const particles = {
        'spring': ['🌸', '🌺', '💮'],
        'summer': ['🫧', '✨', '☀️'],
        'autumn': ['🍂', '🍁', '🌾'],
        'winter': ['❄️', '🌨️', '☃️']
    };

    seasonInterval = setInterval(() => {
        const p = document.createElement('div');
        p.innerText = particles[season][Math.floor(Math.random() * particles[season].length)];
        p.className = 'particle text-xl md:text-2xl absolute';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 5 + 5) + 's';
        p.style.opacity = Math.random();
        container.appendChild(p);
        
        setTimeout(() => p.remove(), 10000);
    }, 500);
}

function updateClockStyle(season) {
    const clock = document.getElementById('digital-clock');
    if (!clock) return;

    const baseClasses = "font-mono text-sm font-bold mr-1 px-3 py-1.5 rounded-lg hidden sm:block border transition-all duration-300";
    const themeClasses = {
        'default': 'text-white/80 bg-white/5 border-white/10',
        'spring': 'text-pink-400 bg-pink-500/10 border-pink-500/30 shadow-[0_0_10px_rgba(244,114,182,0.2)]',
        'summer': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]',
        'autumn': 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]',
        'winter': 'text-blue-300 bg-blue-500/10 border-blue-500/30 shadow-[0_0_10px_rgba(147,197,253,0.2)]'
    };

    clock.className = `${baseClasses} ${themeClasses[season] || themeClasses['default']}`;
}

// --- MUSIC PLAYER LOGIC ---
function toggleMusic() {
    const modal = document.getElementById('music-modal');
    modal.classList.remove('hidden');
    if (playlistSongs.length === 0) {
        fetchPlaylist();
    }
}

function closeMusicPlayer() {
    document.getElementById('music-modal').classList.add('hidden');
}

function stopMusic() {
    const iframe = document.getElementById('youtube-player');
    if(iframe) iframe.src = '';
    
    const disc = document.getElementById('music-disc');
    const modalCover = document.getElementById('modal-cover');
    const discCover = document.getElementById('disc-cover');

    if(disc) disc.classList.add('paused');
    if(modalCover) modalCover.classList.add('paused');
    if(discCover) discCover.classList.add('hidden');
    
    currentSongIndex = -1;
    renderPlaylistItems();
}

async function fetchPlaylist() {
    try {
        const response = await fetch(LAYOUT_CONFIG.playlistSheet);
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        
        playlistSongs = rows.map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length < 2) return null;
            return {
                title: cols[0] || "No Title",
                artist: cols[1] || "Unknown",
                cover: cols[2] || "https://via.placeholder.com/150",
                id: extractID(cols[3] || ""),
                lyric: cols[5] || "Lời bài hát đang cập nhật..."
            };
        }).filter(s => s && s.title !== "No Title");

        renderPlaylistItems();
    } catch (error) {
        console.error("Playlist Error:", error);
        const title = document.getElementById('modal-title');
        if(title) title.innerText = "Lỗi tải dữ liệu";
    }
}

function extractID(input) {
    if (input.includes('embed/')) return input.split('embed/')[1].split('?')[0];
    if (input.includes('v=')) return input.split('v=')[1].split('&')[0];
    return input;
}

function renderPlaylistItems() {
    const container = document.getElementById('modal-playlist');
    if (!container) return;
    container.innerHTML = '';
    playlistSongs.forEach((song, index) => {
        const div = document.createElement('div');
        div.className = `flex items-center p-3 rounded-xl cursor-pointer transition-all hover:bg-white/10 ${index === currentSongIndex ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-800/40'}`;
        div.onclick = () => playPlaylistSong(index);
        div.innerHTML = `
            <img src="${song.cover}" class="w-10 h-10 rounded-lg object-cover mr-3">
            <div class="overflow-hidden flex-1">
                <h4 class="text-sm font-bold text-white truncate">${song.title}</h4>
                <p class="text-xs text-slate-400 truncate">${song.artist}</p>
            </div>
            ${index === currentSongIndex ? '<i class="fa-solid fa-volume-high text-emerald-400 ml-2 text-xs"></i>' : ''}
        `;
        container.appendChild(div);
    });
}

function playPlaylistSong(index) {
    currentSongIndex = index;
    const song = playlistSongs[index];
    
    document.getElementById('modal-title').innerText = song.title;
    document.getElementById('modal-artist').innerText = song.artist;
    
    const modalCover = document.getElementById('modal-cover');
    modalCover.src = song.cover;
    modalCover.classList.remove('paused');
    
    const lyric = document.getElementById('modal-lyric');
    lyric.innerText = song.lyric;
    lyric.scrollTop = 0;
    
    const iframe = document.getElementById('youtube-player');
    iframe.src = `https://www.youtube.com/embed/${song.id}?autoplay=1`;
    
    // Sync main disc
    const mainDisc = document.getElementById('music-disc');
    if(mainDisc) mainDisc.classList.remove('paused');
    
    const discCover = document.getElementById('disc-cover');
    if(discCover) {
        discCover.src = song.cover;
        discCover.classList.remove('hidden');
    }
    
    // Stop background audio if any
    const bgAudio = document.getElementById('bg-music');
    if(bgAudio) bgAudio.pause();

    renderPlaylistItems();
}

// --- SPA ROUTER LOGIC ---
function setupRouter() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin) && !link.getAttribute('target')) {
            e.preventDefault();
            const url = link.href;
            
            // Close mobile menu if open
            const menu = document.getElementById('mobile-menu');
            if (menu && !menu.classList.contains('hidden') && window.innerWidth < 768) {
                 toggleMobileMenu();
            }
            
            navigateTo(url);
        }
    });

    window.addEventListener('popstate', () => {
        loadPage(window.location.href, false);
    });
}

async function navigateTo(url) {
    history.pushState(null, null, url);
    await loadPage(url);
}

async function loadPage(url, pushState = true) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Update Title
        document.title = doc.title;

        // Replace Content
        const newContent = doc.getElementById('page-content');
        const currentContent = document.getElementById('page-content');
        if (newContent && currentContent) {
            currentContent.innerHTML = newContent.innerHTML;
            
            // Re-execute scripts in the new content
            const scripts = doc.querySelectorAll('script');
            scripts.forEach(oldScript => {
                if (oldScript.src && (oldScript.src.includes('layout.js') || oldScript.src.includes('tailwindcss') || oldScript.src.includes('font-awesome'))) return;
                
                const newScript = document.createElement('script');
                if (oldScript.src) newScript.src = oldScript.src;
                else newScript.textContent = oldScript.textContent;
                document.body.appendChild(newScript);
            });
        }
        updateActiveNavLink();
    } catch (error) {
        console.error("Navigation Error:", error);
    }
}

// Auto init when DOM is ready
document.addEventListener('DOMContentLoaded', initLayout);

function updateActiveNavLink() {
    const currentUrl = window.location.href.split(/[?#]/)[0].replace(/\/$/, "").replace("/index.html", "");
    const links = document.querySelectorAll('#app-header a');
    const season = localStorage.getItem('season') || 'default';

    const styles = {
        'default': ['bg-blue-500/20', 'text-blue-400', 'border-blue-500/30', 'shadow-[0_0_10px_rgba(59,130,246,0.2)]'],
        'spring': ['bg-pink-500/20', 'text-pink-400', 'border-pink-500/30', 'shadow-[0_0_10px_rgba(244,114,182,0.2)]'],
        'summer': ['bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/30', 'shadow-[0_0_10px_rgba(34,211,238,0.2)]'],
        'autumn': ['bg-amber-500/20', 'text-amber-400', 'border-amber-500/30', 'shadow-[0_0_10px_rgba(251,191,36,0.2)]'],
        'winter': ['bg-blue-500/20', 'text-blue-300', 'border-blue-500/30', 'shadow-[0_0_10px_rgba(147,197,253,0.2)]']
    };

    const activeClass = styles[season] || styles['default'];
    
    links.forEach(link => {
        const linkUrl = link.href.split(/[?#]/)[0].replace(/\/$/, "").replace("/index.html", "");
        
        // Base classes
        link.className = "px-3 py-1.5 rounded-lg flex items-center justify-center transition-all text-sm font-medium";
        
        if (linkUrl === currentUrl) {
            link.classList.add(...activeClass, 'border');
        } else {
            link.classList.add('bg-white/10', 'text-white/70', 'hover:bg-white/20', 'hover:text-white');
        }
    });
}
