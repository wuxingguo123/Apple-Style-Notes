const { useState, useEffect, useMemo } = React;

// ==========================================
// 🧩 子组件：顶部导航栏
// ==========================================
function TopBar({ activePage, toggleSidebar, setActivePage }) {
    const pagePathMap = {
        'start': 'books.local/start-page',
        'roadmap': 'books.local/learning-roadmap',
        'music': 'books.local/music',
        'changelog': 'books.local/changelog',
        'software': 'books.local/software-recommend',
        'instruction': 'books.local/read/计算机组成原理',
        'book-ds': 'books.local/read/数据结构'
    };
    const isReading = !['start', 'roadmap', 'music', 'changelog', 'software'].includes(activePage);
    return (
        <header className="h-14 flex items-center px-4 border-b border-gray-200/50 shrink-0 relative z-20 bg-white/40 backdrop-blur-md">
            <div className="flex space-x-2 w-1/3 items-center">
                <span className="traffic-light close-btn"></span>
                <span className="traffic-light minimize-btn"></span>
                <span className="traffic-light maximize-btn"></span>

                <button onClick={toggleSidebar} className="hidden md:flex ml-5 items-center justify-center text-gray-500 hover:text-gray-900 bg-white/50 hover:bg-white/90 border border-gray-200/50 hover:border-gray-300 p-1.5 rounded-[6px] shadow-sm transition-all focus:outline-none">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2"></rect><path d="M9 4v16" strokeWidth="2" strokeLinecap="round"></path></svg>
                </button>
                {isReading && (
                    <button
                        onClick={() => setActivePage('roadmap')}
                        className="hidden md:flex space-x-2 text-blue-500 ml-4 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded-md transition-all items-center text-sm font-medium animate-[popIn_0.3s_ease-out]"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        <span>返回学习路线</span>
                    </button>
                )}
            </div>

            <div className="w-1/3 flex justify-center items-center">
                <div className="safari-address-bar flex items-center w-full max-w-md px-3 py-1.5 rounded-md text-sm text-center text-gray-600">
                    <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <input type="text" value={pagePathMap[activePage]} className="bg-transparent border-none outline-none w-full text-center font-medium focus:text-left focus:pl-2 transition-all" readOnly />
                </div>
            </div>

            <div className="w-1/3 flex justify-end text-gray-500 space-x-4">
                <svg className="w-5 h-5 cursor-pointer hover:text-black transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            </div>
        </header>
    );
}

// ==========================================
// 🧩 子组件：侧边栏菜单
// ==========================================
function Sidebar({ isSidebarOpen, activePage, setActivePage, dynamicToc }) {
    const [activeTocId, setActiveTocId] = useState('');
    const isReading = !['start', 'roadmap', 'music', 'changelog', 'software'].includes(activePage);
    const tocItems = dynamicToc || [];
    const [bookmarksData, setBookmarksData] = useState([]);

    useEffect(() => {
        fetch(`articles/bookmarks.md?t=${new Date().getTime()}`)
            .then(r => r.text())
            .then(text => {
                const regex = /- \[([^\]]+)\]\(([^)]+)\)/g;
                let match;
                const b = [];
                const colors = ['bg-red-100 text-red-500', 'bg-blue-100 text-blue-500', 'bg-pink-100 text-pink-500', 'bg-green-100 text-green-500', 'bg-purple-100 text-purple-500', 'bg-yellow-100 text-yellow-600'];
                let id = 1;
                while ((match = regex.exec(text)) !== null) {
                    b.push({
                        id: id,
                        title: match[1],
                        url: match[2],
                        icon: match[1].charAt(0).toUpperCase(),
                        colorClass: colors[(id - 1) % colors.length]
                    });
                    id++;
                }
                setBookmarksData(b);
            })
            .catch(() => { });
    }, []);

    const [openChapters, setOpenChapters] = useState({ 0: true, 1: true, 2: true, 3: true });
    const toggleChapter = (idx) => setOpenChapters(prev => ({ ...prev, [idx]: !prev[idx] }));

    const scrollToSection = (id) => {
        setActiveTocId(id);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        if (!isReading || tocItems.length === 0) return;
        const allSectionIds = tocItems.flatMap(chap => chap.sections ? chap.sections.map(s => s.id) : [chap.id]);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActiveTocId(entry.target.id);
            });
        }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });

        const timer = setTimeout(() => {
            allSectionIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) observer.observe(el);
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [activePage, isReading, tocItems]);

    const getLinkClass = (pageId) => {
        const baseClass = "w-full flex items-center px-3 py-2 rounded-lg text-sm transition focus:outline-none ";
        return activePage === pageId
            ? baseClass + "bg-blue-500/10 font-semibold text-blue-600 shadow-sm border border-blue-500/10"
            : baseClass + "hover:bg-gray-200/40 text-gray-600";
    };

    const bookInfo = isReading ? ROADMAP_DATA.find(b => b.routeKey === activePage) : null;

    return (
        <aside className={`glass-sidebar w-56 flex-shrink-0 hidden md:flex flex-col p-5 overflow-y-auto no-scrollbar ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
            {isReading ? (
                <>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-9 h-9 bg-gradient-to-br ${bookInfo?.gradient || 'from-blue-400 to-indigo-500'} rounded-lg flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden`}>
                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-white/30 blur-[4px] rounded-full"></div>
                            <svg className="w-4.5 h-4.5 text-white z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={bookInfo?.iconPath || ''}></path></svg>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-[13px] font-bold text-gray-800 leading-tight truncate">{bookInfo?.title || activePage}</h3>
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{bookInfo?.status === 'completed' ? '已完成' : '学习中'}</p>
                        </div>
                    </div>
                    <div className="h-px bg-gray-200/60 mb-3"></div>
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">目录</div>
                    <nav className="flex-1 space-y-1">
                        {tocItems.map((chap, cIdx) => (
                            <div key={cIdx}>
                                <button onClick={() => toggleChapter(cIdx)} className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[12px] font-bold text-gray-700 hover:bg-gray-200/40 transition focus:outline-none">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                        {chap.chapter}
                                    </span>
                                    <svg className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${openChapters[cIdx] ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                                {openChapters[cIdx] && (
                                    <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-gray-200/60 pl-2">
                                        {chap.sections.map(sec => (
                                            <button key={sec.id} onClick={() => scrollToSection(sec.id)} className={`w-full text-left px-2.5 py-1.5 rounded-md text-[12px] transition focus:outline-none ${activeTocId === sec.id ? 'bg-blue-500/10 font-semibold text-blue-600 border-l-2 border-blue-500 -ml-[2px] pl-[12px]' : 'text-gray-500 hover:bg-gray-200/40 hover:text-gray-700'}`}>
                                                {sec.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                    {bookInfo && (
                        <div className="mt-auto pt-4 border-t border-gray-200/60">
                            <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
                                <span>学习进度</span>
                                <span className="font-mono font-bold">{bookInfo.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200/60 rounded-full h-1.5 overflow-hidden">
                                <div className={`h-1.5 rounded-full transition-all duration-700 ${bookInfo.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${bookInfo.progress}%` }}></div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-2">个人管理</div>
                    <nav className="space-y-1 mb-8">
                        <button onClick={() => setActivePage('start')} className={getLinkClass('start')}>
                            <svg className="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"></path></svg>
                            <span>起始页</span>
                        </button>
                        <button onClick={() => setActivePage('roadmap')} className={getLinkClass('roadmap')}>
                            <svg className="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            <span>学习路线</span>
                        </button>
                        <button onClick={() => setActivePage('music')} className={getLinkClass('music')}>
                            <svg className="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span>MUSIC</span>
                        </button>
                        <button onClick={() => setActivePage('changelog')} className={getLinkClass('changelog')}>
                            <svg className="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>更新日志</span>
                        </button>
                        <button onClick={() => setActivePage('software')} className={getLinkClass('software')}>
                            <svg className="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v2l-6 6 6 6v2H4v-2l6-6-6-6V4z"></path></svg>
                            <span>软件推荐</span>
                        </button>
                    </nav>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-2">外部书签</div>
                    <nav className="space-y-1">
                        {bookmarksData.map(mark => (
                            <a key={mark.id} href={mark.url} target="_blank" className="flex items-center px-3 py-2 hover:bg-gray-200/40 rounded-lg text-sm text-gray-600 transition">
                                <span className={`w-5 h-5 mr-3 rounded flex items-center justify-center text-[11px] font-bold ${mark.colorClass}`}>{mark.icon}</span>
                                {mark.title}
                            </a>
                        ))}
                    </nav>
                </>
            )}
        </aside>
    );
}

// ==========================================
// 🧩 页面组件
// ==========================================
function StartPage({ setActivePage }) {
    return (
        <div key="start" className="max-w-4xl mx-auto w-full page-enter">
            <div className="mb-16">
                <h1 className="text-[22px] font-semibold mb-6 flex items-center text-gray-800">
                    <svg className="w-7 h-7 mr-3 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>
                    Xingguo笔记推荐
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ROADMAP_DATA.slice(0, 4).map(book => (
                        <div key={book.id} onClick={() => book.routeKey && setActivePage(book.routeKey)} className="apple-card rounded-[20px] p-4 cursor-pointer flex flex-col items-center text-center group">
                            <div className={`w-28 h-28 bg-gradient-to-br ${book.gradient} rounded-[14px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] mb-3 flex items-center justify-center group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all relative overflow-hidden border border-white/30`}>
                                <div className="absolute -top-4 -left-6 w-20 h-20 bg-white/40 blur-[16px] rounded-full"></div>
                                <div className="absolute bottom-1 right-1 w-14 h-14 bg-white/20 blur-lg rounded-full"></div>
                                <svg className="w-10 h-10 text-white drop-shadow-md z-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={book.iconPath}></path></svg>
                            </div>
                            <h3 className="font-medium text-[14px] mb-1.5 text-gray-900 leading-tight">{book.title}</h3>
                            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed px-1">{book.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-[22px] font-semibold mb-6 flex items-center text-gray-800">
                    <svg className="w-7 h-7 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                    阅读活动打卡
                </h2>
                <ReadingActivity />
            </div>
        </div>
    );
}

function RoadmapPage({ setActivePage }) {
    const totalProgress = Math.round(ROADMAP_DATA.reduce((acc, curr) => acc + curr.progress, 0) / ROADMAP_DATA.length);
    return (
        <div key="roadmap" className="max-w-4xl mx-auto w-full page-enter">
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gray-200/60 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <svg className="w-8 h-8 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        学习路线图
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">计算机科学核心四大件 (408) 攻克进度</p>
                </div>
                <div className="flex flex-col items-end min-w-[200px]">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">总进度 {totalProgress}%</span>
                    <div className="w-full bg-gray-200/60 rounded-full h-2.5 overflow-hidden shadow-inner border border-gray-200">
                        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${totalProgress}%` }}></div>
                    </div>
                </div>
            </header>
            <div className="relative border-l-[3px] border-gray-200/80 ml-4 md:ml-6 py-4">
                {ROADMAP_DATA.map((book) => {
                    const isCompleted = book.status === 'completed';
                    const isInProgress = book.status === 'in-progress';
                    const isPending = book.status === 'pending';
                    return (
                        <div key={book.id} className="mb-12 ml-10 relative group">
                            <div className={`absolute -left-[51px] top-4 w-7 h-7 rounded-full border-[3px] border-white flex items-center justify-center z-10 transition-all duration-300 shadow-sm
                                ${isCompleted ? 'bg-green-500' : ''}
                                ${isInProgress ? 'bg-blue-500 animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.6)]' : ''}
                                ${isPending ? 'bg-gray-300' : ''}
                            `}>
                                {isCompleted && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                {isInProgress && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <div className={`apple-card rounded-[20px] p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all duration-400 border 
                                ${isPending ? 'bg-gray-50/40 opacity-70 grayscale-[30%]' : 'bg-white/70 backdrop-blur-md shadow-sm group-hover:-translate-y-1 group-hover:shadow-md'}
                            `}>
                                <div className={`w-20 h-20 bg-gradient-to-br ${book.gradient} rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden`}>
                                    <div className="absolute -top-3 -left-3 w-12 h-12 bg-white/30 blur-[10px] rounded-full"></div>
                                    <svg className="w-8 h-8 text-white z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={book.iconPath}></path></svg>
                                </div>
                                <div className="flex-1 w-full flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">{book.title}</h3>
                                        {isInProgress && <span className="bg-blue-100 text-blue-600 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">当前目标</span>}
                                        {isCompleted && <span className="bg-green-100 text-green-600 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">已掌握</span>}
                                    </div>
                                    <p className="text-[13px] text-gray-500 mb-4 line-clamp-2 leading-relaxed">{book.desc}</p>
                                    <div className="mt-auto flex items-center gap-4">
                                        <div className="flex-1 bg-gray-200/60 rounded-full h-1.5 overflow-hidden border border-gray-200">
                                            <div className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${book.progress}%` }}></div>
                                        </div>
                                        <span className={`text-[11px] font-bold font-mono ${isCompleted ? 'text-green-500' : (isInProgress ? 'text-blue-500' : 'text-gray-400')}`}>{book.progress}%</span>
                                    </div>
                                    {book.status !== 'pending' && (
                                        <button onClick={() => setActivePage(book.routeKey)} className="mt-4 px-4 py-1.5 text-sm text-blue-600 border border-blue-500 rounded-full hover:bg-blue-600 hover:text-white font-bold flex items-center gap-1 transition-all duration-300 w-fit shadow-sm hover:shadow">
                                            {isCompleted ? '复习回顾' : '继续阅读'} →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="ml-10 relative mt-6">
                    <div className="absolute -left-[51px] top-1 w-7 h-7 rounded-full bg-gray-100 border-[3px] border-gray-300 flex items-center justify-center z-10 text-gray-400 text-lg">🎯</div>
                    <h3 className="text-[15px] font-bold text-gray-500 ml-2 mt-1.5">终极目标：大雪深埋</h3>
                </div>
            </div>
        </div>
    );
}

function MusicPage() {
    const MusicComponent = window.Music;
    return (
        <div key="music" className="max-w-4xl mx-auto w-full page-enter">
            {MusicComponent ? <MusicComponent /> : (
                <div className="apple-card rounded-[24px] p-8 text-sm text-gray-500">MUSIC 模块加载中...</div>
            )}
        </div>
    );
}

function ChangelogPage() {
    const [changelogData, setChangelogData] = useState([]);
    useEffect(() => {
        fetch(`articles/changelog.md?t=${new Date().getTime()}`)
            .then(r => r.text())
            .then(text => {
                const logs = [];
                let currentLog = null;
                const lines = text.split('\n');
                let idCounter = 1;
                lines.forEach(line => {
                    if (line.startsWith('## ')) {
                        if (currentLog) logs.push(currentLog);
                        currentLog = { id: idCounter++, date: line.substring(3).trim(), isLatest: logs.length === 0, items: [] };
                    } else if (line.startsWith('- ') && currentLog) {
                        let content = line.substring(2).trim();
                        let type = '';
                        if (content.startsWith('**') && content.includes('**', 2)) {
                            const endIdx = content.indexOf('**', 2);
                            type = content.substring(2, endIdx);
                            content = content.substring(endIdx + 2).trim();
                        }
                        currentLog.items.push({ type, content });
                    }
                });
                if (currentLog) logs.push(currentLog);
                setChangelogData(logs);
            }).catch(() => { });
    }, []);
    return (
        <div key="changelog" className="max-w-4xl mx-auto w-full page-enter">
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gray-200/60 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
                        <svg className="w-8 h-8 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        更新日志
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">记录每一次知识的沉淀与网站的蜕变</p>
                </div>
            </header>
            <div className="relative border-l-2 border-gray-200/60 ml-3 md:ml-4 py-2">
                {changelogData.map((log) => (
                    <div key={log.id} className="mb-10 ml-8 relative group">
                        <span className={`absolute -left-[41px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 z-10 transition-all duration-300 ${log.isLatest ? 'bg-white border-blue-500 group-hover:scale-150' : 'bg-gray-200 border-gray-300'}`}></span>
                        <h3 className={`flex items-center mb-2 text-lg font-semibold tracking-tight ${log.isLatest ? 'text-gray-900' : 'text-gray-700'}`}>
                            {log.date}
                            {log.isLatest && <span className="bg-blue-100 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-md ml-3">最新</span>}
                        </h3>
                        <div className={`apple-card rounded-[18px] p-5 mt-3 ${log.isLatest ? 'bg-white/60 backdrop-blur-md shadow-sm' : 'bg-gray-50/50'}`}>
                            <ul className={`space-y-3 text-[13px] leading-relaxed ${log.isLatest ? 'text-gray-600' : 'text-gray-500'}`}>
                                {log.items.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        {log.isLatest && <span className="text-green-500 mr-2">●</span>}
                                        <p>{item.type && <strong>{item.type}：</strong>}{item.content}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ArticleLayout({ tag = "每日笔记", title, subtitle, children }) {
    return (
        <div className="w-full max-w-4xl mx-auto animate-[popIn_0.4s_ease-out]">
            <div className="text-center mb-8 mt-4">
                <span className="inline-block bg-blue-500/10 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-500/15 tracking-wide mb-3">{tag}</span>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-gray-400 text-[13px] mt-2">{subtitle}</p>}
            </div>
            <div className="bg-white/40 rounded-2xl p-8 md:p-12 shadow-sm border border-white/60 backdrop-blur-sm">
                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">{children}</div>
            </div>
        </div>
    );
}

const getComponent = (name) => window[name];
let markedReady = null;
function ensureMarked() {
    if (window.marked) return Promise.resolve();
    if (markedReady) return markedReady;
    markedReady = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        s.onload = resolve;
        s.onerror = () => reject(new Error('marked 库加载失败'));
        document.head.appendChild(s);
    });
    return markedReady;
}

// ==========================================
// 🧩 懒加载章节组件：滚动进视口才 fetch
// ==========================================
function LazyChapter({ chapter, chIdx, onSectionsReady }) {
    const ref = React.useRef(null);
    const [state, setState] = useState('idle'); // idle | loading | done | error
    const [parts, setParts] = useState([]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            setState('loading');
            Promise.all([
                ensureMarked(),
                fetch(`${chapter.path}?t=${Date.now()}`).then(r => {
                    if (!r.ok) throw new Error(`HTTP ${r.status}`);
                    return r.text();
                })
            ]).then(([_, md]) => {
                const headings = [];
                md.replace(/^## (.+)$/gm, (__, title) => {
                    const id = `sec-${chIdx}-${headings.length}`;
                    headings.push({ id, title: title.trim() });
                });
                onSectionsReady(chIdx, headings);

                const segments = md.split(/(<!--\s*component:\w+\s*-->)/);
                const newParts = [];
                let localH2 = 0;
                segments.forEach(seg => {
                    const match = seg.match(/<!--\s*component:(\w+)\s*-->/);
                    if (match) { newParts.push({ type: 'component', name: match[1] }); return; }
                    let html = marked.parse(seg);
                    // 自动转换 Markdown 中的图片相对路径，保证本地预览和网页渲染同时兼容
                    html = html.replace(/src="(?:\.\.\/)+Photo\//g, 'src="Photo/');
                    html = html.replace(/<h2[^>]*>/g, () => `<h2 id="sec-${chIdx}-${localH2++}"`);
                    newParts.push({ type: 'html', content: html });
                });
                setParts(newParts);
                setState('done');
            }).catch(err => {
                setState('error');
                console.error('章节加载失败', chapter.path, err);
            });
        }, { rootMargin: '200px 0px' });
        observer.observe(el);
        return () => observer.disconnect();
    }, []); // 每章只运行一次

    return (
        <div ref={ref} data-chapter={chIdx}>
            <div className="flex items-center gap-3 my-8 pb-3 border-b border-gray-200/60">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-white text-xs font-bold">{chIdx + 1}</span>
                </div>
                <h2 className="text-base font-bold text-gray-600 tracking-tight">{chapter.chapterName}</h2>
            </div>
            {state === 'idle' && (
                <div className="h-24 flex items-center justify-center text-gray-300 text-sm">向下滚动加载…</div>
            )}
            {state === 'loading' && (
                <div className="space-y-3 animate-pulse py-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200/70 rounded" style={{ width: `${60 + (i % 4) * 10}%` }} />
                    ))}
                </div>
            )}
            {state === 'error' && (
                <div className="text-red-400 text-sm py-4">⚠️ 加载失败：{chapter.path}</div>
            )}
            {state === 'done' && parts.map((part, i) => {
                if (part.type === 'component') {
                    const Comp = getComponent(part.name);
                    return Comp ? <Comp key={i} /> : <div key={i} className="text-yellow-600 text-sm">⚠️ 组件 {part.name} 尚未加载</div>;
                }
                return <div key={i} className="md-content" dangerouslySetInnerHTML={{ __html: part.content }} />;
            })}
        </div>
    );
}

function MarkdownPage({ routeKey, onTocReady }) {
    const config = ARTICLE_ROUTES[routeKey];
    const chapters = config ? (config.chapters || [{ path: config.path, chapterName: config.chapterName }]) : [];

    // 用 ref 而非 state 收集各章 headings，避免触发多余重渲染
    const sectionsRef = React.useRef({});

    const handleSectionsReady = React.useCallback((chIdx, headings) => {
        sectionsRef.current[chIdx] = headings;
        if (onTocReady) {
            const toc = chapters.map((ch, i) => ({
                chapter: ch.chapterName,
                sections: sectionsRef.current[i] || []
            }));
            onTocReady(toc);
        }
    }, [chapters, onTocReady]);

    if (!config) return <div className="text-center p-8 text-red-500">未找到该文章的路由配置</div>;

    return (
        <ArticleLayout title={config.title} subtitle={config.subtitle}>
            {chapters.map((ch, chIdx) => (
                <LazyChapter
                    key={`${routeKey}-${chIdx}`}
                    chapter={ch}
                    chIdx={chIdx}
                    onSectionsReady={handleSectionsReady}
                />
            ))}
        </ArticleLayout>
    );
}

function SoftwarePage() {
    return (
        <div key="software" className="max-w-4xl mx-auto w-full page-enter">
            <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gray-200/60 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">软件推荐</h1>
                    <p className="text-sm text-gray-500 mt-2">精选优质开发与生产力工具。</p>
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SOFTWARE_DATA.map((sw, idx) => (
                    <a key={sw.id} href={sw.link} target="_blank" className="group bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${sw.gradient} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sw.gradient} p-[1px] shadow-sm`}>
                                <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                                    <span className={`bg-gradient-to-br ${sw.gradient} bg-clip-text text-transparent font-bold text-xl`}>{sw.name.charAt(0)}</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100/80 px-2 py-1 rounded-md">{sw.tag}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">{sw.name}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed flex-1 relative z-10">{sw.desc}</p>
                        <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 relative z-10">
                            <span>获取软件</span>
                            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

function ReadingActivity() {
    const [emojiPage, setEmojiPage] = useState(0);
    const changeEmojis = () => setEmojiPage((prev) => (prev + 1) % Math.ceil(ALL_EMOJIS.length / 8));
    const currentEmojis = ALL_EMOJIS.slice(emojiPage * 8, (emojiPage + 1) * 8);
    const [currentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const todayDate = currentDate.getDate();
    const [logs, setLogs] = useState({});
    const [myNotes, setMyNotes] = useState([]);
    const [viewMode, setViewMode] = useState('quote');
    const [customText, setCustomText] = useState('');
    const [toastMsg, setToastMsg] = useState('');
    const [activeEmoji, setActiveEmoji] = useState('🍀');
    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        (async () => {
            const [savedLogs, savedNotes] = await Promise.all([idbKeyval.get('myReadingLogs'), idbKeyval.get('myReadingNotes')]);
            if (savedLogs) setLogs(savedLogs);
            if (savedNotes) setMyNotes(savedNotes);
            setDbReady(true);
        })();
    }, []);

    useEffect(() => { if (dbReady) idbKeyval.set('myReadingLogs', logs); }, [logs, dbReady]);
    useEffect(() => { if (dbReady) idbKeyval.set('myReadingNotes', myNotes); }, [myNotes, dbReady]);

    const saveNote = () => {
        if (!customText.trim()) return setToastMsg('没写内容！');
        const thisMonthPrefix = `${year}/${month + 1}/`;
        const thisMonthLogPrefix = `${year}-${month + 1}-`;
        const hasOldData = myNotes.some(note => !note.date.startsWith(thisMonthPrefix));
        let finalNotes = [...myNotes];
        let finalLogs = { ...logs };
        if (hasOldData && window.confirm("📅 检测到旧记录，是否清理缓存？")) {
            finalNotes = myNotes.filter(note => note.date.startsWith(thisMonthPrefix));
            finalLogs = Object.keys(logs).filter(key => key.startsWith(thisMonthLogPrefix)).reduce((obj, key) => { obj[key] = logs[key]; return obj; }, {});
        }
        const newNote = { id: Date.now(), text: customText, emoji: activeEmoji, date: `${year}/${month + 1}/${todayDate}` };
        setMyNotes([newNote, ...finalNotes]);
        setLogs({ ...finalLogs, [`${year}-${month + 1}-${todayDate}`]: activeEmoji });
        setCustomText(''); setViewMode('history'); setToastMsg('收录成功！');
        setTimeout(() => setToastMsg(''), 2000);
    };

    const exportAllToWord = async () => {
        if (myNotes.length === 0) return;
        const notesHtml = myNotes.map(note => `
            <div style="margin-bottom:24px;padding:20px 24px;border-left:4px solid #60a5fa;background:#f8fafc;border-radius:12px;">
                <div style="font-size:32px;margin-bottom:8px;">${note.emoji || '📝'}</div>
                <p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 12px 0;">${note.text.replace(/\n/g, '<br>')}</p>
                <p style="font-size:12px;color:#9ca3af;text-align:right;margin:0;">— 记录于 ${note.date}</p>
            </div>`).join('');
        const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>阅读灵感汇总</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f2f5;margin:0;padding:40px 20px;}
.container{max-width:680px;margin:0 auto;background:#fff;border-radius:20px;padding:40px;box-shadow:0 4px 24px rgba(0,0,0,0.08);}
h1{color:#3b82f6;font-size:24px;margin:0 0 32px 0;padding-bottom:16px;border-bottom:2px solid #e5e7eb;}</style></head>
<body><div class="container"><h1>📚 阅读灵感汇总</h1>${notesHtml}</div></body></html>`;
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        try {
            const handle = await window.showSaveFilePicker({ suggestedName: `阅读日记_${year}.html`, types: [{ accept: { 'text/html': ['.html'] } }] });
            const writable = await handle.createWritable(); await writable.write(blob); await writable.close();
            setToastMsg('✅ 保存成功！');
        } catch (e) { setToastMsg('已取消或导出失败'); }
        setTimeout(() => setToastMsg(''), 2000);
    };

    const [displayQuote, setDisplayQuote] = useState("读书的意义大概就是用生活所感去读书。");
    useEffect(() => {
        if (viewMode === 'quote' && myNotes.length > 0 && Math.random() < 0.05) {
            const luckyNote = myNotes[Math.floor(Math.random() * myNotes.length)];
            setDisplayQuote(`【回响 · ${luckyNote.date}】${luckyNote.text}`);
        }
    }, [viewMode, myNotes]);

    return (
        <div className="apple-card rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden bg-white/70">
            <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${toastMsg ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <span className="bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">{toastMsg}</span>
            </div>
            <div className="w-full md:w-56 flex flex-col">
                <div className="flex justify-between items-baseline mb-4">
                    <div className="text-4xl font-bold">{Object.keys(logs).length} <span className="text-sm text-gray-400">天</span></div>
                    <button onClick={changeEmojis} className="text-xs text-gray-400 hover:text-blue-500">🔄</button>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mb-6">
                    {currentEmojis.map(em => (<button key={em} onClick={() => setActiveEmoji(em)} className={`aspect-square rounded-lg text-xl ${activeEmoji === em ? 'bg-white shadow border border-gray-100 scale-110 z-10' : 'hover:bg-gray-200/50 grayscale opacity-60'}`}>{em}</button>))}
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                {viewMode === 'quote' && (
                    <div className="h-full flex flex-col items-center justify-center bg-blue-50/50 rounded-xl p-6 relative group text-center">
                        <p className="text-gray-600 font-medium italic">"{displayQuote}"</p>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-2 transition-all">
                            <button onClick={() => setViewMode('write')} className="text-blue-500 text-sm hover:font-bold">写灵感</button>
                            <button onClick={() => setViewMode('history')} className="text-blue-500 text-sm hover:font-bold">历史</button>
                        </div>
                    </div>
                )}
                {viewMode === 'write' && (
                    <div className="h-full flex flex-col animate-[popIn_0.3s_ease-out]">
                        <textarea autoFocus value={customText} onChange={e => setCustomText(e.target.value)} className="flex-1 w-full bg-white/60 rounded-xl p-3 text-sm outline-none border border-blue-100" placeholder="写下你的思考..."></textarea>
                        <div className="flex justify-end gap-2 mt-2">
                            <button onClick={() => setViewMode('quote')} className="text-xs text-gray-400">取消</button>
                            <button onClick={saveNote} className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-full">保存</button>
                        </div>
                    </div>
                )}
                {viewMode === 'history' && (
                    <div className="h-full flex flex-col animate-[popIn_0.3s_ease-out]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-blue-500">我的笔记 ({myNotes.length})</span>
                            <button onClick={() => setViewMode('quote')} className="text-gray-400 text-xs">关闭</button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 h-[150px]">
                            {myNotes.map(n => <div key={n.id} className="text-xs bg-white/80 p-2 rounded border border-gray-100">{n.emoji} {n.text}</div>)}
                        </div>
                        <button onClick={exportAllToWord} className="mt-2 text-xs bg-blue-50 text-blue-600 py-1.5 rounded-full border border-blue-200">一键导出 Word</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ==========================================
// 🚀 核心大管家：App 路由中心
// ==========================================
function App() {
    const [activePage, setActivePage] = useState('start');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [dynamicToc, setDynamicToc] = useState(null);

    useEffect(() => { setDynamicToc(null); }, [activePage]);

    const renderContent = () => {
        if (ARTICLE_ROUTES[activePage]) return <MarkdownPage routeKey={activePage} onTocReady={setDynamicToc} />;
        const PageMap = { start: StartPage, roadmap: RoadmapPage, music: MusicPage, changelog: ChangelogPage, software: SoftwarePage };
        const ActiveComponent = PageMap[activePage] || StartPage;
        return <ActiveComponent setActivePage={setActivePage} />;
    };

    return (
        <div className="glass-window flex flex-col overflow-hidden relative rounded-[14px]" style={{ width: '1180px', height: '720px', maxWidth: '96vw', maxHeight: '96vh' }}>
            <TopBar activePage={activePage} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} setActivePage={setActivePage} />
            <div className="flex flex-1 overflow-hidden h-full relative">
                <Sidebar isSidebarOpen={isSidebarOpen} activePage={activePage} setActivePage={setActivePage} dynamicToc={dynamicToc} />
                <main className="flex-1 overflow-y-auto no-scrollbar w-full p-6 md:p-10 relative">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
