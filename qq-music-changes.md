# QQ 音乐接入改动说明

更新时间：2026-05-27

## 这次改了什么

这次把音乐页从“固定本地 mp3 播放”升级成了“连接 QQ 音乐歌单，随机抽 4 首歌做成唱片，并优先自动播放”。

你的 QQ 音乐歌单分享链接：

```text
https://c6.y.qq.com/base/fcgi-bin/u?__=Nekqee5n7DaV
```

解析出的歌单 ID：

```text
9582770241
```

歌单标题：

```text
新建歌单2
```

## 新增文件

### `server.js`

新增了一个本地 Node 服务，负责两件事：

- 正常托管这个静态网页
- 提供 QQ 音乐接口代理，用来读取歌单和获取可播放音频直链

新增接口：

```text
/api/qq-playlist-random?id=9582770241&count=4
```

这个接口会从你的 QQ 音乐歌单里随机抽歌，并优先筛出能拿到直链的歌曲。

### `js/qq-playlist-cache.js`

新增了一个静态歌单缓存文件，里面保存了当前歌单的 236 首歌。

这个文件是给 GitHub Pages 用的。因为 GitHub Pages 不能运行 `server.js`，所以网页会在接口不可用时直接从这个缓存里随机抽 4 首歌。

### `scripts/generate-qq-playlist-cache.js`

新增了一个生成缓存的脚本。如果你的 QQ 音乐歌单后续更新了，可以在本地运行：

```bash
npm run cache:qq
```

重新生成 `js/qq-playlist-cache.js` 后再上传 GitHub。

### `package.json`

新增了两个命令：

```bash
npm start
npm run cache:qq
```

`npm start` 用于本地启动自动播放版本，`npm run cache:qq` 用于刷新 GitHub Pages 的静态歌单缓存。

## 修改文件

### `js/music-data.js`

新增了歌单配置：

```js
window.QQ_MUSIC_PLAYLIST = {
  id: "9582770241",
  shareUrl: "https://c6.y.qq.com/base/fcgi-bin/u?__=Nekqee5n7DaV",
  title: "新建歌单2",
  count: 4
};
```

`window.MUSIC_TRACKS` 仍然保留，作为备用曲目。如果本地服务没有启动，或者 QQ 歌单接口失败，页面会退回使用备用歌曲。

### `Music.jsx`

音乐页现在支持：

- 页面加载后自动从 QQ 音乐歌单随机抽 4 首
- 如果本地 API 不可用，会从 `js/qq-playlist-cache.js` 静态缓存随机抽 4 首
- 右侧 4 张唱片显示随机歌曲
- 点击 `Random 4` 可以重新随机抽 4 首
- 拖唱片到唱机上会直接播放
- 优先使用 QQ 音乐直链配合浏览器原生 `<audio>` 播放
- 如果某首歌拿不到直链，会退回 QQ 音乐外链播放器

## 为什么之前没有自动播放

之前使用的是 QQ 音乐 iframe 外链播放器。跨站 iframe 的自动播放经常会被浏览器拦截，即使你已经拖动了唱片，也不一定会被 QQ 音乐播放器识别为用户播放动作。

现在改成优先拿 QQ 音乐音频直链，然后用网页自己的 `<audio>` 播放。这样拖唱片时调用的是浏览器原生 `audio.play()`，自动播放成功率更高。

## 怎么启动

以后要使用 QQ 歌单随机播放和自动播放版本，请在项目根目录运行：

```bash
npm start
```

然后访问：

```text
http://localhost:3002
```

不要用旧的：

```bash
python -m http.server
```

因为旧方式只能打开静态网页，不能提供 QQ 歌单接口。

## 上传到 GitHub Pages 的效果

上传到 GitHub Pages 后：

- 页面可以打开
- 可以从 `js/qq-playlist-cache.js` 里随机抽 4 首
- 点击 `Random 4` 仍然可以重新随机
- 播放会走 QQ 音乐外链播放器
- 一般需要手动点播放器的播放键
- 不能实时同步 QQ 歌单，除非重新运行 `npm run cache:qq` 并提交新缓存

## 当前效果

进入网页后：

1. 音乐页会请求你的 QQ 音乐歌单
2. 从歌单里随机抽 4 首歌
3. 生成右侧 4 张唱片
4. 拖一张唱片到唱机上
5. 如果这首歌拿到了直链，会自动播放
6. 如果没有拿到直链，会显示 QQ 音乐播放器作为兜底

## 需要注意

- QQ 音乐部分 VIP、版权、地区受限歌曲可能拿不到直链
- 拿不到直链时，自动播放仍可能被 QQ 音乐外链播放器拦截
- 如果你换歌单，只需要改 `js/music-data.js` 里的 `window.QQ_MUSIC_PLAYLIST.id`
- 如果端口 `3002` 被占用，可以用环境变量换端口：

```bash
set PORT=3003
node server.js
```
