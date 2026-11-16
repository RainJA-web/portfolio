import './layout.js'; // THÊM DÒNG NÀY ĐỂ RENDER HEADER & FOOTER

const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vST_-LBCQA1S0xPQRMgxaPCb0lDSJdEA9RRmoi88cajq-LHV-b9ErpKlNWUecgL95hcK_rdoIFs7DFh/pub?output=csv';
const grid = document.getElementById('system-grid');
const filterButtons = document.querySelectorAll('.category-btn');
let systemData = [];
let systemPage = 1;
const ITEMS_PER_PAGE = 6;
let currentSystemFilter = "Tất cả";

window.launchApp = function(name, type, category, url, id) {
    if (category === 'Games') {
        navigateTo(`game.html?id=${id}`);
        return;
    }
    if (category === 'Tools') {
        navigateTo(`tool.html?id=${id}`);
        return;
    }

    const runnerSection = document.getElementById('runner-section');
    const runnerTitle = document.getElementById('runner-title');
    const placeholder = document.getElementById('app-placeholder');
    const iframe = document.getElementById('app-frame');
    
    runnerSection.classList.remove('hidden');
    runnerTitle.innerHTML = `${type} :: <span class="text-white">${name}</span>`;
    
    placeholder.classList.remove('hidden');
    iframe.classList.add('hidden');
    iframe.src = '';

    placeholder.innerHTML = `
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <h2 class="text-2xl font-bold text-white mb-2">Launching ${name}...</h2>
        <p class="text-blue-400/60 font-mono text-sm">Initializing ${category} protocols</p>
    `;

    runnerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
        if (url && url !== '#' && url !== '') {
            iframe.src = url;
            iframe.onload = () => {
                placeholder.classList.add('hidden');
                iframe.classList.remove('hidden');
            };
        } else {
            placeholder.innerHTML = `
                <i class="fa-solid fa-circle-exclamation text-yellow-500 text-5xl mb-4"></i>
                <h2 class="text-2xl font-bold text-white mb-2">Source Unavailable</h2>
                <p class="text-blue-400/60 font-mono text-sm">Path: ${url || 'undefined'}</p>
            `;
        }
    }, 1000);
}

window.closeApp = function() {
    document.getElementById('runner-section').classList.add('hidden');
    
    const iframe = document.getElementById('app-frame');
    // Bắt buộc phải trỏ về about:blank để trình duyệt kill process bên trong iframe
    iframe.src = 'about:blank';
    
    // Tùy chọn nâng cao: Xóa bỏ iframe cũ và tạo iframe mới hoàn toàn để clean 100% RAM
    const parent = iframe.parentNode;
    iframe.remove();
    
    const newIframe = document.createElement('iframe');
    newIframe.id = 'app-frame';
    newIframe.className = 'w-full h-full border-0 hidden';
    parent.insertBefore(newIframe, document.getElementById('app-placeholder'));
}

function renderCards(filter) {
    if (filter) currentSystemFilter = filter;
    grid.innerHTML = "";
    const pagination = document.getElementById('system-pagination');
    pagination.innerHTML = "";
    
    const searchTerm = document.getElementById('system-search') ? document.getElementById('system-search').value.toLowerCase() : '';

    const filtered = systemData.filter(item => {
        if (item.title === 'Playlist') return false;
        const itemCat = item.category ? item.category.toLowerCase() : "";
        const filterCat = currentSystemFilter.toLowerCase();
        const matchCat = currentSystemFilter === "Tất cả" || itemCat === filterCat;
        const matchSearch = item.title.toLowerCase().includes(searchTerm) || item.desc.toLowerCase().includes(searchTerm) || item.tag.toLowerCase().includes(searchTerm);
        return matchCat && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    if (systemPage > totalPages) systemPage = 1;
    
    const start = (systemPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedItems = filtered.slice(start, end);

    if (paginatedItems.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-20 text-center text-slate-500 italic">Không tìm thấy dữ liệu trong mục này.</div>`;
        return;
    }

    paginatedItems.forEach(item => {
        const color = item.color || 'blue';
        const colorMap = {
            'emerald': 'text-emerald-400 bg-emerald-900/20 group-hover:bg-emerald-500',
            'pink': 'text-pink-400 bg-pink-900/20 group-hover:bg-pink-500',
            'orange': 'text-orange-400 bg-orange-900/20 group-hover:bg-orange-500',
            'blue': 'text-blue-400 bg-blue-900/20 group-hover:bg-blue-500'
        };
        const styles = colorMap[color] || colorMap['blue'];

        grid.innerHTML += `
            <div onclick="launchApp('${item.title}', '${item.type}', '${item.category}', '${item.url}', '${item.id}')" 
                 class="glass-card rounded-2xl p-5 group cursor-pointer animate-fade-in flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all duration-300">
                <div class="relative h-44 ${styles.split(' ').slice(1,2).join(' ')} rounded-xl mb-5 flex items-center justify-center overflow-hidden transition-colors duration-300">
                    <img src="${item.icon}" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                </div>
                <h3 class="font-bold mb-2 text-lg text-white group-hover:text-blue-400 transition-colors duration-300">${item.title}</h3>
                <p class="text-sm text-slate-400 mb-6 flex-grow line-clamp-2">${item.desc}</p>
                <div class="flex justify-between items-center border-t border-white/5 pt-4 mt-auto">
                    <span class="text-[10px] ${styles.split(' ')[0]} font-bold uppercase tracking-wider">${item.tag}</span>
                    <button class="text-xs bg-white/5 group-hover:text-white ${styles.split(' ').pop()} px-4 py-2 rounded-lg transition-all font-semibold shadow-none group-hover:shadow-lg">Truy cập</button>
                </div>
            </div>
        `;
    });

    // Render Pagination
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === systemPage ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10';
            pagination.innerHTML += `<button onclick="changeSystemPage(${i})" class="w-8 h-8 rounded-lg ${activeClass} transition-all font-bold text-sm">${i}</button>`;
        }
    }
}

window.changeSystemPage = function(page) {
    systemPage = page;
    renderCards(currentSystemFilter);
}

async function loadSystemData() {
    try {
        const response = await fetch(sheetURL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        const categoryColors = {
            'Tools': 'emerald',
            'Tài liệu': 'pink',
            'Games': 'orange',
            'Mã nguồn': 'blue'
        };
        
        systemData = rows.map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
            if(cols.length < 2) return null;
            return {
                id: cols[0],
                title: cols[1],
                desc: cols[2],
                category: cols[3],
                tag: cols[4],
                icon: cols[5],
                url: cols[6],
                type: cols[7],
                color: categoryColors[cols[3]] || 'blue'
            };
        }).filter(i => i);
        
        const playlist = systemData.find(i => i.title === 'Playlist');
        if (playlist && playlist.url) {
            const audio = document.getElementById('bg-music');
            if(audio) audio.src = playlist.url;
        }

        renderCards();
    } catch (e) {
        console.error("Lỗi tải dữ liệu:", e);
        systemData = [
            { title: "Web Calculator", desc: "Công cụ tính toán trực tuyến đơn giản và hiệu quả.", category: "Tools", tag: "#TOOLS", icon: "https://via.placeholder.com/300x200?text=Calculator", type: "TOOL", url: "", color: "emerald" },
            { title: "Portfolio Demo", desc: "Bản thử nghiệm giao diện hồ sơ năng lực cá nhân.", category: "Mã nguồn", tag: "#WEB", icon: "https://via.placeholder.com/300x200?text=Portfolio", type: "SOURCE", url: "", color: "blue" }
        ];
        renderCards();
    }
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        systemPage = 1;
        renderCards(btn.getAttribute('data-category'));
    });
});

// --- Projects Logic ---
const PROJECTS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/17k2mv3MwXv7XHbYGDt52RSeJHME0jQ5y2i-FJM2tAq0/gviz/tq?tqx=out:csv&gid=850403129';
let allProjects = [];
let currentProjectList = [];
let currentProjectFilter = 'all';
let projectPage = 1;

async function fetchProjects() {
    try {
        const response = await fetch(PROJECTS_SHEET_URL);
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        
        allProjects = rows.map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length < 2) return null;
            return {
                title: cols[0],
                desc: cols[1],
                tech: cols[2] ? cols[2].split(',').map(t => t.trim()) : [],
                status: cols[3],
                demo: cols[4],
                github: cols[5],
                image: cols[6] || 'https://via.placeholder.com/400x200',
            };
        }).filter(p => p);

        currentProjectList = allProjects;
        renderProjects();
    } catch (error) {
        console.error("Lỗi tải dự án:", error);
        const grid = document.getElementById('projects-grid');
        if(grid) grid.innerHTML = '<div class="col-span-full text-center text-red-400">Không thể tải dữ liệu dự án.</div>';
    }
}

window.filterProjects = function(filter) {
    if (filter) currentProjectFilter = filter;
    projectPage = 1;
    
    const searchTerm = document.getElementById('project-search') ? document.getElementById('project-search').value.toLowerCase() : '';

    currentProjectList = allProjects.filter(p => {
        const matchFilter = currentProjectFilter === 'all' || p.tech.some(t => t.toLowerCase().includes(currentProjectFilter.toLowerCase()));
        const matchSearch = p.title.toLowerCase().includes(searchTerm) || p.desc.toLowerCase().includes(searchTerm);
        return matchFilter && matchSearch;
    });

    const buttons = document.querySelectorAll('#project-filters button');
    buttons.forEach(btn => {
        const btnFilter = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        if(btnFilter === currentProjectFilter) {
            btn.classList.remove('bg-white/5', 'text-slate-400');
            btn.classList.add('bg-blue-500/20', 'text-blue-400');
        } else {
            btn.classList.add('bg-white/5', 'text-slate-400');
            btn.classList.remove('bg-blue-500/20', 'text-blue-400');
        }
    });

    renderProjects();
}

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    const pagination = document.getElementById('projects-pagination');
    if(!grid) return;
    grid.innerHTML = '';
    pagination.innerHTML = '';

    const totalPages = Math.ceil(currentProjectList.length / ITEMS_PER_PAGE);
    const start = (projectPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedProjects = currentProjectList.slice(start, end);

    if (paginatedProjects.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-slate-500 italic">Không tìm thấy dự án nào.</div>';
        return;
    }

    paginatedProjects.forEach(p => {
        let statusColor = 'bg-slate-500';
        if (p.status === 'Completed') statusColor = 'bg-emerald-500';
        if (p.status === 'In Progress') statusColor = 'bg-yellow-500';
        if (p.status === 'Open Source') statusColor = 'bg-blue-500';

        const techTags = p.tech.map(t => `<span class="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-300 border border-white/5">${t}</span>`).join('');

        const html = `
            <div class="glass-card rounded-xl overflow-hidden group hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-300 flex flex-col h-full">
                <div class="relative h-32 overflow-hidden">
                    <img src="${p.image}" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute top-3 right-3">
                        <span class="text-[10px] font-bold text-white px-2 py-1 rounded-full ${statusColor} shadow-lg">${p.status}</span>
                    </div>
                </div>
                <div class="p-4 flex flex-col flex-grow">
                    <h3 class="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">${p.title}</h3>
                    <p class="text-xs text-slate-400 mb-3 line-clamp-2 flex-grow">${p.desc}</p>
                    <div class="flex flex-wrap gap-1.5 mb-3">
                        ${techTags}
                    </div>
                    <div class="flex gap-2 mt-auto pt-3 border-t border-white/5">
                        ${p.demo ? `<a href="${p.demo}" target="_blank" class="flex-1 text-center py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-xs font-bold"><i class="fa-solid fa-globe mr-1"></i>Demo</a>` : ''}
                        ${p.github ? `<a href="${p.github}" target="_blank" class="flex-1 text-center py-1.5 rounded-lg bg-white/5 text-white hover:bg-white/20 transition-all text-xs font-bold"><i class="fa-brands fa-github mr-1"></i>Code</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += html;
    });

    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === projectPage ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10';
            pagination.innerHTML += `<button onclick="changeProjectPage(${i})" class="w-8 h-8 rounded-lg ${activeClass} transition-all font-bold text-sm">${i}</button>`;
        }
    }
}

window.changeProjectPage = function(page) {
    projectPage = page;
    renderProjects();
}

// Initialize
loadSystemData();
fetchProjects();

const models = ['/modelcao.glb', '/modelmeo.glb', '/modelfrieza.glb', '/mdelnezuko.glb'];
let currentModelIndex = 0;

window.switchModel = function(direction) {
    currentModelIndex += direction;
    if (currentModelIndex < 0) currentModelIndex = models.length - 1;
    if (currentModelIndex >= models.length) currentModelIndex = 0;
    
    const viewer = document.getElementById('avatar-viewer');
    if(viewer) viewer.src = models[currentModelIndex];
}