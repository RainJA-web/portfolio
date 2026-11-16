// File: src/components/Cards.js

export function createSystemCard(item) {
    const colorMap = {
        'emerald': 'text-emerald-400 bg-emerald-900/20 group-hover:bg-emerald-500',
        'pink': 'text-pink-400 bg-pink-900/20 group-hover:bg-pink-500',
        'orange': 'text-orange-400 bg-orange-900/20 group-hover:bg-orange-500',
        'blue': 'text-blue-400 bg-blue-900/20 group-hover:bg-blue-500'
    };
    const styles = colorMap[item.color] || colorMap['blue'];
    const bgClass = styles.split(' ').slice(1,2).join(' ');
    const textClass = styles.split(' ')[0];
    const hoverBgClass = styles.split(' ').pop();

    return `
        <div onclick="launchApp('${item.title}', '${item.type}', '${item.category}', '${item.url}', '${item.id}')" 
             class="glass-card rounded-2xl p-5 group cursor-pointer animate-fade-in flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all duration-300">
            <div class="relative h-44 ${bgClass} rounded-xl mb-5 flex items-center justify-center overflow-hidden transition-colors duration-300">
                <img src="${item.icon}" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            </div>
            <h3 class="font-bold mb-2 text-lg text-white group-hover:text-blue-400 transition-colors duration-300">${item.title}</h3>
            <p class="text-sm text-slate-400 mb-6 flex-grow line-clamp-2">${item.desc}</p>
            <div class="flex justify-between items-center border-t border-white/5 pt-4 mt-auto">
                <span class="text-[10px] ${textClass} font-bold uppercase tracking-wider">${item.tag}</span>
                <button class="text-xs bg-white/5 group-hover:text-white ${hoverBgClass} px-4 py-2 rounded-lg transition-all font-semibold shadow-none group-hover:shadow-lg">Truy cập</button>
            </div>
        </div>
    `;
}

export function createProjectCard(p) {
    let statusColor = 'bg-slate-500';
    if (p.status === 'Completed') statusColor = 'bg-emerald-500';
    if (p.status === 'In Progress') statusColor = 'bg-yellow-500';
    if (p.status === 'Open Source') statusColor = 'bg-blue-500';

    const techTags = p.tech.map(t => `<span class="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-300 border border-white/5">${t}</span>`).join('');

    return `
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
                <div class="flex flex-wrap gap-1.5 mb-3">${techTags}</div>
                <div class="flex gap-2 mt-auto pt-3 border-t border-white/5">
                    ${p.demo ? `<a href="${p.demo}" target="_blank" class="flex-1 text-center py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-xs font-bold"><i class="fa-solid fa-globe mr-1"></i>Demo</a>` : ''}
                    ${p.github ? `<a href="${p.github}" target="_blank" class="flex-1 text-center py-1.5 rounded-lg bg-white/5 text-white hover:bg-white/20 transition-all text-xs font-bold"><i class="fa-brands fa-github mr-1"></i>Code</a>` : ''}
                </div>
            </div>
        </div>
    `;
}