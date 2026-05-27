function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isNeedleOnDisc(angle) {
  return angle >= 24;
}

function snapNeedleAngle(angle) {
  return isNeedleOnDisc(angle) ? 42 : -18;
}

function runTinyTests() {
  console.assert(clamp(80, -28, 48) === 48, "clamp upper bound");
  console.assert(clamp(-80, -28, 48) === -28, "clamp lower bound");
  console.assert(isNeedleOnDisc(42) === true, "needle on record should play");
  console.assert(isNeedleOnDisc(-18) === false, "needle in air should pause");
  console.assert(snapNeedleAngle(30) === 42, "needle snaps onto record");
  console.assert(snapNeedleAngle(-10) === -18, "needle snaps back to rest");
}

if (typeof window !== "undefined") {
  runTinyTests();
}

const musicTracks = Array.isArray(window.MUSIC_TRACKS) ? window.MUSIC_TRACKS : [];

function VinylRecord({ playing, vinyl }) {
  return (
    <div
      className={`music-record absolute left-[54px] top-[88px] h-[430px] w-[430px] rounded-full bg-gradient-to-br ${vinyl.gradient} shadow-[0_28px_65px_rgba(0,0,0,0.42)] ring-[12px] ring-zinc-800 ${playing ? "music-record-playing" : ""}`}
    >
      {/* 外沿高光边 */}
      <div className="absolute -inset-[2px] rounded-full border-[1.5px] border-white/15" />
      {/* 沟槽纹理 — 多层细密环模拟真实黑胶 */}
      <div className="absolute inset-3 rounded-full border-[0.5px] border-white/[0.06]" />
      <div className="absolute inset-5 rounded-full border-[0.5px] border-white/[0.08]" />
      <div className="absolute inset-7 rounded-full border-[0.5px] border-white/[0.05]" />
      <div className="absolute inset-9 rounded-full border-[0.5px] border-white/[0.07]" />
      <div className="absolute inset-11 rounded-full border-[0.5px] border-white/[0.06]" />
      <div className="absolute inset-14 rounded-full border-[0.5px] border-white/[0.08]" />
      <div className="absolute inset-16 rounded-full border-[0.5px] border-white/[0.05]" />
      <div className="absolute inset-[72px] rounded-full border-[0.5px] border-white/[0.07]" />
      <div className="absolute inset-20 rounded-full border-[0.5px] border-white/[0.06]" />
      <div className="absolute inset-[88px] rounded-full border-[0.5px] border-white/[0.08]" />
      <div className="absolute inset-[96px] rounded-full border-[0.5px] border-white/[0.05]" />
      <div className="absolute inset-[104px] rounded-full border-[0.5px] border-white/[0.07]" />
      <div className="absolute inset-28 rounded-full border-[0.5px] border-white/[0.06]" />
      <div className="absolute inset-[120px] rounded-full border-[0.5px] border-white/[0.08]" />
      {/* 光盘面反光 — 锥形渐变模拟彩虹色散 */}
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,rgba(255,255,255,0.06)_8%,transparent_16%,rgba(255,255,255,0.04)_24%,transparent_32%,rgba(255,255,255,0.08)_45%,transparent_55%,rgba(255,255,255,0.05)_65%,transparent_75%,rgba(255,255,255,0.07)_88%,transparent_100%)]" />
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_135deg,transparent,rgba(255,255,255,0.18),transparent_25%,transparent_50%,rgba(255,255,255,0.08),transparent_75%)]" />
      {/* 内圈色彩晕染 */}
      <div className="absolute inset-20 rounded-full bg-[radial-gradient(circle_at_24%_30%,rgba(59,130,246,0.28),transparent_30%),radial-gradient(circle_at_76%_70%,rgba(250,204,21,0.18),transparent_32%)]" />

      {/* 中心标签 — 专辑封面或文字标签 */}
      <div className={`absolute left-1/2 top-1/2 flex h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full ${vinyl.cover ? '' : vinyl.label} text-center text-slate-950 shadow-[inset_0_2px_8px_rgba(0,0,0,0.12),inset_0_-1px_3px_rgba(255,255,255,0.6)] ring-1 ring-black/10 overflow-hidden`}>
        {vinyl.cover ? (
          <React.Fragment>
            <img src={vinyl.cover} alt={vinyl.song} className="absolute inset-0 h-full w-full object-cover" />
            {/* 封面上的高光 */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.3),transparent_50%)]" />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* 标签内纹理 */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.5),transparent_50%)]" />
            <div className="absolute inset-[3px] rounded-full border-[0.5px] border-black/[0.06]" />
            <div className="absolute inset-3 rounded-full border-[0.5px] border-black/[0.04]" />
            {/* 厂牌名 */}
            <p className="relative text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-700/80">{vinyl.title}</p>
            {/* 年份 — 主视觉 */}
            <p className="relative mt-0.5 text-[22px] font-black leading-none tracking-tight">{vinyl.year}</p>
            {/* 分隔线 */}
            <div className="relative my-1 h-[0.5px] w-12 bg-slate-950/20" />
            {/* 曲名 */}
            <p className="relative text-[9px] font-bold tracking-wider text-slate-800/70">{vinyl.song}</p>
          </React.Fragment>
        )}
      </div>

      {/* 唱片轴孔 — 多层金属质感 */}
      <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-zinc-400 via-zinc-600 to-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.4)] ring-[3px] ring-white/50">
        <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 ring-1 ring-white/20" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 shadow-inner" />
      </div>
    </div>
  );
}

function SideVinyl({ vinyl, delay, active, onSelect }) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (event) => {
    event.dataTransfer.setData("vinyl-id", vinyl.id);
    event.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <button
      type="button"
      draggable
      onClick={() => onSelect(vinyl)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`music-side-vinyl relative h-28 w-28 rounded-full shadow-2xl shadow-slate-700/25 ring-4 ${active ? "ring-yellow-300" : "ring-white/65"} ${isDragging ? "music-vinyl-dragging" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${vinyl.gradient}`} />
      <div className="absolute inset-2 rounded-full border border-white/15" />
      <div className="absolute inset-5 rounded-full border border-white/10" />
      <div className="absolute inset-8 rounded-full border border-white/10" />
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,transparent,rgba(255,255,255,0.22),transparent,transparent,rgba(255,255,255,0.10),transparent)]" />
      <div className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full ${vinyl.cover ? '' : vinyl.label} text-center text-slate-950 shadow-inner overflow-hidden`}>
        {vinyl.cover ? (
          <img src={vinyl.cover} alt={vinyl.song} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <React.Fragment>
            <p className="text-[9px] font-black leading-none">{vinyl.title}</p>
            <p className="mt-1 text-xs font-black">{vinyl.year}</p>
          </React.Fragment>
        )}
      </div>
      <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950" />
      {active && (
        <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-lime-400 shadow-[0_0_18px_rgba(132,204,22,0.9)] ring-2 ring-white" />
      )}
    </button>
  );
}

function SideVinylRack({ vinyls, currentVinyl, onSelect }) {
  return (
    <aside className="flex h-[620px] w-[160px] shrink-0 flex-col items-center justify-center gap-6 rounded-[2rem] bg-white/35 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.16)] ring-1 ring-white/70 backdrop-blur-md">
      <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-slate-500">
        Vinyl<br />Option
      </p>
      {vinyls.map((vinyl, index) => (
        <SideVinyl
          key={vinyl.id}
          vinyl={vinyl}
          delay={index * 0.08}
          active={currentVinyl.id === vinyl.id}
          onSelect={onSelect}
        />
      ))}
    </aside>
  );
}

function ToneArm({ angle, isDragging, onPointerDown, onPointerMove, onPointerUp }) {
  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        transform: `rotate(${angle}deg) scale(${isDragging ? 1.03 : 1})`,
        filter: isDragging
          ? "drop-shadow(0 28px 22px rgba(0,0,0,0.5))"
          : "drop-shadow(0 14px 18px rgba(0,0,0,0.32))"
      }}
      className="absolute right-[162px] top-[148px] z-30 h-0 w-0 origin-center cursor-grab touch-none transition-[transform,filter] duration-300 ease-out active:cursor-grabbing"
    >
      {/* 透明触控区域 */}
      <div className="absolute -left-[150px] -top-[48px] h-[360px] w-[230px] bg-transparent" />

      {/* ── 底座 ── */}
      {/* 最外环 */}
      <div className="absolute -left-[66px] -top-[66px] h-[132px] w-[132px] rounded-full bg-gradient-to-b from-zinc-800 via-zinc-950 to-zinc-900 shadow-[inset_0_4px_16px_rgba(255,255,255,0.06),0_18px_40px_rgba(0,0,0,0.4)] ring-[6px] ring-zinc-700/60" />
      {/* 刻度环纹 */}
      <div className="absolute -left-[52px] -top-[52px] h-[104px] w-[104px] rounded-full border-[1px] border-zinc-600/40" />
      <div className="absolute -left-[48px] -top-[48px] h-[96px] w-[96px] rounded-full border-[0.5px] border-zinc-500/20" />
      {/* 中环 — 拉丝金属 */}
      <div className="absolute -left-[38px] -top-[38px] h-[76px] w-[76px] rounded-full bg-gradient-to-br from-zinc-400 via-zinc-800 to-black shadow-[inset_0_1px_6px_rgba(255,255,255,0.12)] ring-[2px] ring-zinc-500/50" />
      {/* 内环 — 高光金属球 */}
      <div className="absolute -left-[22px] -top-[22px] h-[44px] w-[44px] rounded-full bg-gradient-to-br from-zinc-100 via-zinc-400 to-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.25)] ring-[2px] ring-zinc-300/40">
        <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-white/80 via-zinc-300 to-zinc-600" />
      </div>
      {/* 中心轴芯 */}
      <div className="absolute -left-[10px] -top-[10px] h-5 w-5 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-400 shadow-inner ring-1 ring-zinc-500/50">
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-300 shadow-inner" />
      </div>

      {/* ── 配重块（底座上方） ── */}
      <div className="absolute -left-[18px] -top-[100px] h-[44px] w-[36px] rounded-[14px] bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-800 shadow-[0_6px_14px_rgba(0,0,0,0.3)] ring-[2px] ring-zinc-600/60">
        <div className="absolute inset-[4px] rounded-[10px] bg-gradient-to-b from-zinc-400 via-zinc-600 to-zinc-700 ring-1 ring-white/15" />
        {/* 配重上的旋钮 */}
        <div className="absolute left-1/2 top-[6px] h-3 w-3 -translate-x-1/2 rounded-full bg-zinc-200 shadow-inner ring-1 ring-zinc-500/40" />
        <div className="absolute left-1/2 bottom-[6px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-zinc-700 shadow-inner ring-1 ring-zinc-400/30" />
      </div>

      {/* ── 唱臂 SVG ── */}
      <svg
        className="absolute -left-[150px] -top-[38px] h-[330px] w-[230px] overflow-visible"
        viewBox="0 0 230 330"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {/* 主金属渐变 — 多段模拟抛光不锈钢 */}
          <linearGradient id="tonearm-metal" x1="126" y1="82" x2="57" y2="270" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fafafa" />
            <stop offset="0.2" stopColor="#e5e7eb" />
            <stop offset="0.4" stopColor="#f3f4f6" />
            <stop offset="0.55" stopColor="#d1d5db" />
            <stop offset="0.75" stopColor="#f9fafb" />
            <stop offset="1" stopColor="#a1a1aa" />
          </linearGradient>
          {/* 边缘暗线 */}
          <linearGradient id="tonearm-edge" x1="130" y1="82" x2="60" y2="270" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#71717a" />
            <stop offset="0.5" stopColor="#3f3f46" />
            <stop offset="1" stopColor="#27272a" />
          </linearGradient>
          {/* 高光线 */}
          <linearGradient id="tonearm-highlight" x1="128" y1="90" x2="64" y2="276" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.3)" />
          </linearGradient>
        </defs>
        {/* 阴影层 */}
        <path d="M132 84 C140 160 103 238 62 286" stroke="rgba(0,0,0,0.22)" strokeWidth="19" strokeLinecap="round" transform="translate(5 6)" />
        {/* 外壳暗边 */}
        <path d="M132 84 C140 160 103 238 62 286" stroke="url(#tonearm-edge)" strokeWidth="16" strokeLinecap="round" />
        {/* 主金属管身 */}
        <path d="M132 84 C140 160 103 238 62 286" stroke="url(#tonearm-metal)" strokeWidth="11" strokeLinecap="round" />
        {/* 高光条 */}
        <path d="M129 90 C135 156 102 230 65 274" stroke="url(#tonearm-highlight)" strokeWidth="2.5" strokeLinecap="round" />
        {/* 管身暗侧 */}
        <path d="M135 88 C143 162 106 240 66 284" stroke="rgba(0,0,0,0.08)" strokeWidth="2" strokeLinecap="round" />

        {/* 关节接头 — 底座端 */}
        <circle cx="132" cy="84" r="14" fill="url(#tonearm-metal)" stroke="rgba(39,39,42,0.5)" strokeWidth="2.5" />
        <circle cx="132" cy="84" r="9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="130" cy="82" r="3" fill="rgba(255,255,255,0.35)" />

        {/* 关节接头 — 唱头端 */}
        <circle cx="62" cy="286" r="9" fill="url(#tonearm-metal)" stroke="rgba(39,39,42,0.5)" strokeWidth="2" />
        <circle cx="62" cy="286" r="5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <circle cx="60" cy="284" r="2" fill="rgba(255,255,255,0.3)" />
      </svg>

      {/* ── 唱头 (Headshell + Cartridge) ── */}
      <div className="absolute -left-[128px] top-[235px] h-[90px] w-[56px] origin-[50%_16%] rotate-[50deg] rounded-[1rem] bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 shadow-[0_16px_28px_rgba(0,0,0,0.5)] ring-[1.5px] ring-zinc-700/50">
        {/* 面板内层 */}
        <div className="absolute inset-[3px] rounded-[0.8rem] bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 ring-1 ring-white/30" />
        {/* 顶部高光 */}
        <div className="absolute inset-x-[6px] top-[3px] h-[18px] rounded-t-[0.6rem] bg-gradient-to-b from-white/50 to-transparent" />

        {/* 唱头顶部固定螺丝 */}
        <div className="absolute left-[12px] top-[8px] h-[5px] w-[5px] rounded-full bg-zinc-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] ring-1 ring-zinc-500/50" />
        <div className="absolute right-[12px] top-[8px] h-[5px] w-[5px] rounded-full bg-zinc-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] ring-1 ring-zinc-500/50" />

        {/* 唱头主体 — 中间方块 */}
        <div className="absolute left-1/2 top-[20px] h-[38px] w-[30px] -translate-x-1/2 rounded-[6px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 shadow-[inset_0_1px_3px_rgba(255,255,255,0.08)] ring-1 ring-zinc-600/60">
          {/* 品牌标识区域 */}
          <div className="absolute inset-x-[4px] top-[5px] h-[10px] rounded-sm bg-gradient-to-r from-zinc-600 to-zinc-700" />
          {/* 底部线圈区 */}
          <div className="absolute inset-x-[3px] bottom-[4px] h-[12px] rounded-b-[3px] bg-zinc-900 ring-1 ring-zinc-700/40">
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-500" />
          </div>
        </div>

        {/* 底部螺丝 */}
        <div className="absolute left-[10px] bottom-[8px] h-[4px] w-[4px] rounded-full bg-zinc-800 ring-1 ring-zinc-500/50" />
        <div className="absolute right-[10px] bottom-[8px] h-[4px] w-[4px] rounded-full bg-zinc-800 ring-1 ring-zinc-500/50" />

        {/* ── 针尖组件 ── */}
        <div className="absolute -bottom-[14px] left-1/2 -translate-x-1/2">
          {/* 针杆座 */}
          <div className="h-[6px] w-[16px] rounded-b-md bg-gradient-to-b from-zinc-600 to-zinc-800 ring-1 ring-zinc-900/40" />
          {/* 针杆 */}
          <div className="mx-auto h-[10px] w-[1.5px] bg-gradient-to-b from-zinc-400 to-zinc-200" />
          {/* 针尖 — 钻石 */}
          <div className="mx-auto h-[3px] w-[3px] rotate-45 bg-gradient-to-br from-white via-sky-100 to-sky-300 shadow-[0_0_4px_rgba(56,189,248,0.6)]" />
        </div>
      </div>
    </div>
  );
}

function Music() {
  if (musicTracks.length === 0) {
    return (
      <section className="apple-card rounded-[24px] p-8 text-sm text-gray-500">
        没有找到曲目配置，请检查 js/music-data.js。
      </section>
    );
  }

  const [draggingArm, setDraggingArm] = React.useState(false);
  const [armAngle, setArmAngle] = React.useState(-18);
  const [currentVinyl, setCurrentVinyl] = React.useState(musicTracks[0]);
  const [audioStatus, setAudioStatus] = React.useState("把唱针放到唱片上，或点击右侧唱片开始播放。");
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const [needsUserGesture, setNeedsUserGesture] = React.useState(false);
  const audioRef = React.useRef(null);

  const needleOnDisc = isNeedleOnDisc(armAngle);
  const playing = needleOnDisc && isAudioPlaying;

  React.useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) audio.pause();
    };
  }, []);

  const prepareAudio = React.useCallback((track) => {
    const audio = audioRef.current;
    if (!audio || !track) return null;

    const nextSrc = new URL(track.audioSrc, window.location.href).href;
    if (audio.src !== nextSrc) {
      audio.src = track.audioSrc;
      audio.load();
    }
    audio.volume = 0.75;
    return audio;
  }, []);

  const pauseTrack = React.useCallback((message) => {
    const audio = audioRef.current;
    if (audio) audio.pause();
    setIsAudioPlaying(false);
    setAudioStatus(message || "已暂停。");
  }, []);

  const playTrack = React.useCallback((track, restart = false) => {
    const audio = prepareAudio(track);
    if (!audio || !track) return;
    if (restart) audio.currentTime = 0;

    const trackLabel = `${track.song} - ${track.artist || "Unknown"}`;
    const markPlaying = () => {
      setIsAudioPlaying(true);
      setNeedsUserGesture(false);
      setAudioStatus(`正在播放：${trackLabel}`);
    };
    const markBlocked = () => {
      audio.pause();
      setIsAudioPlaying(false);
      setNeedsUserGesture(true);
      setAudioStatus("浏览器需要一次明确点击才能播放声音，请点击 Play 或右侧唱片解锁。");
    };

    setAudioStatus(`正在准备播放：${trackLabel}`);

    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(markPlaying).catch(markBlocked);
      } else {
        markPlaying();
      }
    } catch (error) {
      markBlocked();
    }
  }, [prepareAudio]);

  const selectVinyl = (vinyl) => {
    if (currentVinyl.id === vinyl.id) return;
    const wasPlaying = playing;
    if (wasPlaying) {
      pauseTrack("正在切换唱片…");
      setArmAngle(-18);
    }
    setCurrentVinyl(vinyl);
    setAudioStatus(`已选择：${vinyl.song} - ${vinyl.artist || "Unknown"}，拖拽到唱片机上播放。`);
  };

  const dropVinylOnDeck = (vinyl) => {
    if (playing) {
      pauseTrack("正在换碟…");
      setArmAngle(-18);
    }
    setCurrentVinyl(vinyl);
    prepareAudio(vinyl);
    setAudioStatus(`已放入：${vinyl.song} - ${vinyl.artist || "Unknown"}，拨动唱针开始播放。`);
  };

  const togglePlayback = () => {
    if (playing) {
      setArmAngle(-18);
      pauseTrack("已暂停。");
    } else {
      setArmAngle(42);
      playTrack(currentVinyl);
    }
  };

  const moveTonearm = (clientX, clientY) => {
    const deck = document.getElementById("needle-only-deck");
    if (!deck) return;

    const rect = deck.getBoundingClientRect();
    const scale = rect.width / 800;
    const pivotX = rect.right - 162 * scale;
    const pivotY = rect.top + 148 * scale;
    const dx = clientX - pivotX;
    const dy = clientY - pivotY;
    const rawAngle = Math.atan2(-dx, dy) * (180 / Math.PI);
    setArmAngle(clamp(rawAngle, -28, 48));
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDraggingArm(true);
    moveTonearm(event.clientX, event.clientY);
  };

  const handlePointerMove = (event) => {
    if (!draggingArm) return;
    moveTonearm(event.clientX, event.clientY);
  };

  const handlePointerUp = (event) => {
    if (!draggingArm) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setDraggingArm(false);

    const snappedAngle = snapNeedleAngle(armAngle);
    setArmAngle(snappedAngle);
    if (isNeedleOnDisc(snappedAngle)) {
      playTrack(currentVinyl);
    } else {
      pauseTrack("唱针已离开唱片，音乐暂停。");
    }
  };

  const handleDeckDrop = (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("vinyl-id");
    const vinyl = musicTracks.find((item) => item.id === id);
    if (vinyl) dropVinylOnDeck(vinyl);
  };

  return (
    <section className="mb-12 w-full overflow-hidden rounded-[28px] border border-white/70 bg-[radial-gradient(circle_at_50%_0%,#ffffff_0%,#f5efe7_45%,#dfc3a2_100%)] p-4 shadow-sm md:p-6">
      <audio
        ref={audioRef}
        preload="auto"
        loop
        playsInline
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
      />

      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">Music</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Debbyone</h2>
        </div>
        <div className="flex items-center gap-3">
          <p className="max-w-[260px] text-right text-xs font-semibold leading-relaxed text-slate-500">拖动唱针播放，点击或拖拽右侧唱片切换曲目。</p>
          <button
            type="button"
            onClick={togglePlayback}
            className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            {playing ? "Pause" : needsUserGesture ? "Unlock" : "Play"}
          </button>
        </div>
      </div>

      <div className="relative flex h-[520px] items-start justify-center overflow-hidden">
        <div className="music-stage flex origin-top items-center justify-center gap-8">
          <section
            id="needle-only-deck"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDeckDrop}
            className="relative h-[620px] w-[800px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-zinc-200 via-slate-300 to-zinc-500 shadow-[0_38px_90px_rgba(15,23,42,0.28)] ring-1 ring-white/80"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),transparent_36%,rgba(0,0,0,0.14)),repeating-linear-gradient(90deg,rgba(255,255,255,0.12)_0px,rgba(255,255,255,0.12)_1px,transparent_2px,transparent_8px)]" />
            <div className="absolute -bottom-6 left-10 right-10 h-10 rounded-b-3xl bg-slate-600 shadow-xl" />

            <VinylRecord playing={playing} vinyl={currentVinyl} />

            <div className="absolute right-[100px] top-[86px] h-[124px] w-[124px] rounded-full bg-zinc-950/85 shadow-[inset_0_8px_24px_rgba(255,255,255,0.08),0_16px_35px_rgba(0,0,0,0.35)] ring-[5px] ring-zinc-700/70">
              <div className="absolute left-1/2 top-1/2 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-zinc-500 via-zinc-900 to-black shadow-inner ring-2 ring-zinc-500/60" />
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-500 to-zinc-950 shadow-lg ring-2 ring-zinc-300/50" />
              <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200 shadow-inner" />
            </div>

            <ToneArm
              angle={armAngle}
              isDragging={draggingArm}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          </section>

          <SideVinylRack vinyls={musicTracks} currentVinyl={currentVinyl} onSelect={selectVinyl} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-white/45 px-4 py-3 text-xs font-semibold text-slate-600 ring-1 ring-white/60">
        <span>音频文件：{currentVinyl.audioSrc}</span>
        <span className={playing ? "text-green-600" : "text-slate-500"}>{audioStatus}</span>
      </div>
    </section>
  );
}

window.Music = Music;
