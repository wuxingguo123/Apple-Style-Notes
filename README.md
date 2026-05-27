# 📚 Xinguo 知识库

一个 Apple 风格的个人学习知识库，用于管理计算机科学笔记、阅读日记与学习进度。

---

## ✨ 网页特点

| 特性 | 说明 |
|------|------|
| 🎨 Apple 风设计 | 毛玻璃效果、柔和渐变、macOS 风格窗口与交通灯按钮 |
| 📖 Markdown 阅读器 | 自动渲染 `.md` 文件，支持可视化交互组件嵌入 |
| 🗂️ 多章节目录 | 侧边栏自动生成目录，滚动时高亮当前章节，支持跨文件多章节 |
| 📅 阅读打卡日记 | 记录每天的学习心得，支持 Emoji 标记情绪，数据持久化到 IndexedDB |
| 📤 一键导出 | 将所有日记导出为带样式的 HTML 文件，可直接用 Word 打开 |
| 🔖 外部书签 | 从 `articles/bookmarks.md` 读取书签，展示在侧边栏 |
| 📋 更新日志 | 从 `articles/changelog.md` 读取更新记录，自动渲染时间轴 |
| 🧩 可插拔组件 | 在 Markdown 中用注释语法嵌入任意 React 交互组件 |

---

## 🚀 如何启动

> 项目为纯静态文件，**必须通过 HTTP 服务器访问**，不能直接双击 `index.html`（fetch 会跨域报错）。

```bash
# 在项目根目录执行（需要 Node.js）
npx serve . -p 3000
```

然后浏览器访问 → `http://localhost:3000`

---

## 📁 项目结构

```
Apple风/
├── index.html               # 入口页面
├── Photo/
│   └── CPU                  # CPU文件夹
│       └── ...              # 图片文件/drawio源文件...
├── js/
│   ├── constants.js         # ⭐ 核心配置文件（路由、数据）
│   └── app.js               # React 主应用逻辑
├── css/
│   └── style.css            # 全局样式
├── components/
│   └── SimulatorButton.js   # 可嵌入 Markdown 的交互组件
└── articles/
    ├── bookmarks.md         # 外部书签列表
    ├── changelog.md         # 更新日志
    ├── instruction/         # 计算机组成原理笔记
    │   ├── ch4-指令系统.md
    │   └── ch5-CPU.md
    └── book-ds/             # 数据结构笔记
        └── ch1-线性表.md
```

---

## ✏️ 如何添加内容

### 1. 添加新章节到已有书籍

在 `articles/<书籍目录>/` 下新建 `.md` 文件，然后在 `js/constants.js` 的对应路由里追加：

```js
'book-ds': {
    chapters: [
        { path: 'articles/book-ds/ch1-线性表.md', chapterName: '第一章 线性表' },
        { path: 'articles/book-ds/ch2-树.md', chapterName: '第二章 树' },  // ← 新增
    ],
    ...
},
```

---

### 2. 添加全新书籍

**第一步**：在 `articles/` 下新建目录和 md 文件

**第二步**：在 `js/constants.js` 的 `ARTICLE_ROUTES` 对象里新增一条路由：

```js
'operating-system': {
    chapters: [
        { path: 'articles/os/ch1-进程管理.md', chapterName: '第一章 进程管理' },
    ],
    title: '操作系统概念',
    subtitle: '进程、内存、文件系统核心原理',
},
```

**第三步**：在 `ROADMAP_DATA` 里找到对应的书，确认 `routeKey` 与路由 key 一致，并把 `status` 改为 `'in-progress'`：

```js
{ id: 3, title: '操作系统概念', progress: 30, status: 'in-progress', routeKey: 'operating-system', ... }
```

---

### 3. 在 Markdown 中嵌入交互组件

在 md 文件任意位置插入注释：

```markdown
## 某个需要可视化的章节

这里是文字说明...

<!-- component:SimulatorButton -->

继续写文字...
```

组件需在 `components/` 目录下定义，并在 `index.html` 中通过 `<script>` 引入。

---

### 4. 更新书签

编辑 `articles/bookmarks.md`，每行一条，格式如下：

```markdown
- [网站名称](https://example.com)
```

---

### 5. 更新日志

编辑 `articles/changelog.md`，格式如下：

```markdown
## 2026-05-03

- **新增** 数据结构书籍路由
- **修复** 多章节目录 ID 冲突问题
```

---

### 6. 管理软件推荐(我让AI填的，后面会整点好的...)

编辑 `js/constants.js` 的 `SOFTWARE_DATA` 数组，每条字段：

```js
{ id: 7, name: '软件名', desc: '一句话介绍', tag: '分类标签', gradient: 'from-xxx to-xxx', link: 'https://...' }
```


