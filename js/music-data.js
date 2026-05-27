// MUSIC 模块的曲目都放在这里。
// 以后换歌时：
// 1. 把 mp3 / wav / ogg 文件放进 music 文件夹
// 2. 修改对应曲目的 audioSrc，例如：audioSrc: 'music/my-song.mp3'
// 3. title / year / song / artist 是唱片上显示的文字
window.MUSIC_TRACKS = [
  {
    id: "qingtian",
    title: "华语",
    year: "2003",
    song: "晴天",
    artist: "周杰伦",
    audioSrc: "music/出现又离开 (Live) - 梁博.mp3",
    cover: "music/covers/chuxian.png",
    gradient: "from-sky-950 via-blue-900 to-black",
    label: "bg-sky-200"
  },
  {
    id: "chuxianyoulikai",
    title: "摇滚",
    year: "2014",
    song: "出现又离开",
    artist: "梁博",
    audioSrc: "music/出现又离开 (Live) - 梁博.mp3",
    cover: "music/covers/chuxian.png",
    gradient: "from-rose-950 via-pink-900 to-black",
    label: "bg-rose-300"
  },
  {
    id: "lingyigewo",
    title: "清新",
    year: "2016",
    song: "世界上的另一个我",
    artist: "阿肆/郭采洁",
    audioSrc: "music/出现又离开 (Live) - 梁博.mp3",
    cover: "music/covers/chuxian.png",
    gradient: "from-violet-950 via-purple-900 to-black",
    label: "bg-violet-200"
  },
  {
    id: "xiayigetianliang",
    title: "抒情",
    year: "2008",
    song: "下一个天亮",
    artist: "郭静",
    audioSrc: "music/出现又离开 (Live) - 梁博.mp3",
    cover: "music/covers/chuxian.png",
    gradient: "from-amber-950 via-orange-900 to-black",
    label: "bg-amber-200"
  }
];
