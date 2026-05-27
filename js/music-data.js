// MUSIC 模块的曲目都放在这里。
// 以后换歌时：
// 1. 把 mp3 / wav / ogg 文件放进 music 文件夹
// 2. 修改对应曲目的 audioSrc，例如：audioSrc: 'music/my-song.mp3'
// 3. title / year / song / artist 是唱片上显示的文字
// 如果想接 QQ 音乐：
// 1. 在 QQ 音乐里复制歌曲分享链接，优先使用包含 songid=数字 的链接
// 2. 在对应曲目里加 source: 'qq'
// 3. 填 qqMusicUrl 或 qqSongId，例如：
//    source: 'qq',
//    qqMusicUrl: 'https://i.y.qq.com/v8/playsong.html?songid=127570280&songtype=0'
// 注意：没有外链权限、VIP/地区受限的歌曲，QQ 音乐播放器可能无法播放。
window.QQ_MUSIC_PLAYLIST = {
  id: "9582770241",
  shareUrl: "https://c6.y.qq.com/base/fcgi-bin/u?__=Nekqee5n7DaV",
  title: "Debbyone",
  count: 4
};

