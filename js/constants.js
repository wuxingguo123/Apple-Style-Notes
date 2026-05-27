window.ROADMAP_DATA = [
    { id: 1, title: '数据结构与算法', progress: 100, status: 'completed', routeKey: 'book-ds', desc: '线性表、树、图的基础与经典算法实现。', iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', gradient: 'from-amber-400 to-orange-500' },
    { id: 2, title: '计算机组成原理', progress: 50, status: 'in-progress', routeKey: 'instruction', desc: '正在学习：第四章 指令系统与拓展操作码。', iconPath: 'M3 20h18L15 8l-4 6-3-4-5 10zM15 8l-2 3h4l-2-3z', gradient: 'from-rose-400 to-red-500' },
    { id: 3, title: '操作系统概念', progress: 0, status: 'pending', routeKey: 'operating-system', desc: '进程管理、并发控制与内存分配策略。', iconPath: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122', gradient: 'from-gray-300 to-gray-400' },
    { id: 4, title: '计算机网络', progress: 0, status: 'pending', routeKey: 'computer-network', desc: 'TCP/IP 协议栈与网络层路由算法原理。', iconPath: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', gradient: 'from-gray-300 to-gray-400' }
];

window.SOFTWARE_DATA = [
    { id: 1, name: 'Visual Studio Code', desc: '强大的代码编辑器，丰富的插件生态', tag: '开发必备', gradient: 'from-blue-400 to-blue-600', link: 'https://code.visualstudio.com/' },
    { id: 2, name: 'Obsidian', desc: '本地优先的 Markdown 知识库工具，支持双链', tag: '知识管理', gradient: 'from-purple-500 to-indigo-600', link: 'https://obsidian.md/' },
    { id: 3, name: 'Figma', desc: '现代化的协作式界面设计工具', tag: '设计利器', gradient: 'from-pink-500 to-orange-400', link: 'https://www.figma.com/' },
    { id: 4, name: 'Snipaste', desc: '简单但强大的截图与贴图工具，大幅提升效率', tag: '效率神器', gradient: 'from-green-400 to-emerald-600', link: 'https://www.snipaste.com/' },
    { id: 5, name: 'Docker', desc: '容器化平台，统一开发与部署环境', tag: '环境部署', gradient: 'from-cyan-500 to-blue-500', link: 'https://www.docker.com/' },
    { id: 6, name: 'Postman', desc: 'API 开发与测试的一站式平台', tag: '接口测试', gradient: 'from-orange-400 to-red-500', link: 'https://www.postman.com/' }
];

window.ARTICLE_ROUTES = {
    'instruction': {
        chapters: [
            { path: 'articles/instruction/ch5-CPU.md', chapterName: '第五章 CPU' },
            { path: 'articles/instruction/ch4-指令系统.md', chapterName: '第四章 指令系统' },
            { path: 'articles/instruction/ch5-存储器.md', chapterName: '第三章 存储器' },
        ],
        title: '计算机组成原理',
        subtitle: '通过有趣的可视化动画带大家见识指令的魅力',
    },
    'book-ds': {
        chapters: [
            { path: 'articles/book-ds/ch1-线性表.md', chapterName: '第一章 线性表' },
        ],
        title: '数据结构与算法',
        subtitle: '线性表、树、图的基础与经典算法实现',
    },
};

window.ALL_EMOJIS = [
    '🍀', '📖', '💻', '🔥', '😴', '🤔', '👻', '🥳',
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
    '😄', '🤩', '🤣', '😇', '🤫', '🤥', '🙄', '😤',
    '🏃‍♂️', '🏃‍♀️', '🚶‍♂️', '🚶‍♀️', '🚴', '🚵', '🏎️', '🏍️',
    '🥺', '😱', '😡', '🤯', '😴', '🤢', '🥵', '🥶',
    '🧐', '🤓', '😎', '🥳', '🤡', '👻', '👽', '🤖',
    '🚀', '🌟', '💡', '🎨', '🎯', '🎧', '🍵', '🌈',
    '💪', '🧠', '⚡', '✨', '🌊', '🌻', '🌙', '🎈',
    '🏃‍♂️', '🧘‍♀️', '🍔', '☕', '🎉', '🎵', '🐶', '🐱'
];
