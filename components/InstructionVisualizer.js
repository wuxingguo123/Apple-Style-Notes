const { useState, useEffect, useRef } = React;

const DATA_INIT = { 5: 70, 6: 100, 7: 66, 10: 77, 30: 40, 31: 0 };
const INST_MEM = {
  101: 'MOV R0,R1',
  102: 'LAD R1,6',
  103: 'ADD R1,R2',
  104: 'STO R2,(R3)',
  105: 'JMP 101',
  106: 'AND R1,R3'
};
const REG_INIT = { R0: 0, R1: 0, R2: 25, R3: 31 };
const PHASES = ['FETCH', 'DECODE', 'EXECUTE', 'WRITEBACK'];
const PHASE_TEXT = { FETCH: '取指', DECODE: '译码', EXECUTE: '执行', WRITEBACK: '写回' };

function InstructionVisualizer() {
  const [dataMemory, setDataMemory] = useState({ ...DATA_INIT });
  const [registers, setRegisters] = useState({ ...REG_INIT });
  const [pc, setPc] = useState(101);
  const [ir, setIr] = useState('...');
  const [ar, setAr] = useState('...');
  const [dr, setDr] = useState('...');
  const [alu, setAlu] = useState('...');
  const [phase, setPhase] = useState('FETCH');
  const [auto, setAuto] = useState(false);
  const [activeNodes, setActiveNodes] = useState(['PC', 'INST']);
  const [activePaths, setActivePaths] = useState([]);
  const [note, setNote] = useState('点击“单步流转”开始。PC 指向将要执行的第一条指令。');
  const timerRef = useRef(null);

  const parse = (text) => {
    if (!text || text === '...') return { op: 'NOP' };
    if (text === 'HALT') return { op: 'HALT' };
    const [op, rawArgs = ''] = text.split(' ');
    const [arg1, arg2] = rawArgs.split(',');
    return { op, arg1, arg2 };
  };

  const reset = () => {
    setDataMemory({ ...DATA_INIT });
    setRegisters({ ...REG_INIT });
    setPc(101);
    setIr('...');
    setAr('...');
    setDr('...');
    setAlu('...');
    setPhase('FETCH');
    setAuto(false);
    setActiveNodes(['PC', 'INST']);
    setActivePaths([]);
    setNote('模拟器已重置。点击“单步流转”开始运行。');
  };

  const step = () => {
    if (phase === 'FETCH') {
      const inst = INST_MEM[pc] || 'HALT';
      setIr(inst);
      setPc(pc + 1);
      setActiveNodes(['PC', 'INST', 'IR']);
      setActivePaths(['pc-inst', 'inst-ibus', 'ibus-ir']);
      setPhase('DECODE');
      setNote(`【取指】PC=${pc}，从指存 cache 取出 "${inst}"，经指令总线送入 IR；PC 自动 +1。`);
      return;
    }

    if (phase === 'DECODE') {
      const { op, arg1, arg2 } = parse(ir);
      const tips = {
        MOV: `准备把 ${arg2} 的值移动到 ${arg1}。`,
        LAD: `准备读取地址 ${arg2} 的数据并写入 ${arg1}。`,
        ADD: `准备计算 ${arg1} 与 ${arg2} 的和。`,
        AND: `准备计算 ${arg1} 与 ${arg2} 的逻辑与。`,
        STO: `准备将 ${arg1} 写入 ${arg2} 指向的内存。`,
        JMP: `准备跳转到地址 ${arg1}。`,
        HALT: '没有可执行指令，准备停止。'
      };
      setActiveNodes(['IR', 'DEC', 'CU']);
      setActivePaths(['ir-dec', 'dec-cu']);
      setPhase('EXECUTE');
      setNote(`【译码】译码器识别操作码 ${op}。${tips[op] || ''}`);
      return;
    }

    if (phase === 'EXECUTE') {
      const inst = parse(ir);
      if (inst.op === 'HALT') {
        setAuto(false);
        setActiveNodes(['IR']);
        setActivePaths([]);
        setNote('程序结束。');
        return;
      }

      if (inst.op === 'LAD') {
        const addr = Number(inst.arg2);
        const val = dataMemory[addr];
        setAr(addr);
        setDr(val);
        setActiveNodes(['AR', 'DATA', 'DR']);
        setActivePaths(['ar-data', 'data-dbus', 'dbus-dr']);
        setNote(`【执行】AR=${addr}，数存[${addr}]=${val} 经数据总线进入 DR。`);
      } else if (inst.op === 'ADD' || inst.op === 'AND') {
        const val1 = registers[inst.arg1];
        const val2 = registers[inst.arg2];
        const result = inst.op === 'ADD' ? val1 + val2 : val1 & val2;
        setAlu(result);
        setActiveNodes(['REG', 'ALU']);
        setActivePaths(['reg-alu-a', 'reg-alu-b']);
        setNote(`【执行】${inst.arg1}=${val1}，${inst.arg2}=${val2}，送入 ALU 后得到 ${result}。`);
      } else if (inst.op === 'MOV') {
        const val = registers[inst.arg2];
        setAlu(val);
        setActiveNodes(['REG', 'ALU']);
        setActivePaths(['reg-alu-b']);
        setNote(`【执行】读取 ${inst.arg2}=${val}，送到 ALU 输出端等待写回。`);
      } else if (inst.op === 'STO') {
        const addrReg = inst.arg2.replace(/[()]/g, '');
        const addr = registers[addrReg];
        const val = registers[inst.arg1];
        setAr(addr);
        setDr(val);
        setActiveNodes(['REG', 'AR', 'DR']);
        setActivePaths(['reg-dbus', 'dbus-ar', 'dbus-dr']);
        setNote(`【执行】地址来自 ${addrReg}=${addr}，数据来自 ${inst.arg1}=${val}，分别送入 AR 和 DR。`);
      } else if (inst.op === 'JMP') {
        setPc(Number(inst.arg1));
        setActiveNodes(['IR', 'PC']);
        setActivePaths(['ir-pc']);
        setPhase('FETCH');
        setNote(`【执行】无条件跳转，目标地址 ${inst.arg1} 送入 PC。`);
        return;
      }

      setPhase('WRITEBACK');
      return;
    }

    const inst = parse(ir);
    if (inst.op === 'LAD') {
      setRegisters(prev => ({ ...prev, [inst.arg1]: dr }));
      setActiveNodes(['DR', 'REG']);
      setActivePaths(['dr-dbus', 'dbus-reg']);
      setNote(`【写回】DR=${dr} 经数据总线写回寄存器 ${inst.arg1}。`);
    } else if (inst.op === 'ADD' || inst.op === 'MOV' || inst.op === 'AND') {
      setRegisters(prev => ({ ...prev, [inst.arg1]: alu }));
      setActiveNodes(['ALU', 'REG']);
      setActivePaths(['alu-dbus', 'dbus-reg']);
      setNote(`【写回】ALU=${alu} 经数据总线写回寄存器 ${inst.arg1}。`);
      setAlu('...');
    } else if (inst.op === 'STO') {
      setDataMemory(prev => ({ ...prev, [ar]: dr }));
      setActiveNodes(['DR', 'DATA', 'AR']);
      setActivePaths(['dr-dbus', 'dbus-data', 'ar-data']);
      setNote(`【写回】DR=${dr} 写入数存地址 ${ar}。`);
    }
    setPhase('FETCH');
  };

  useEffect(() => {
    if (auto) timerRef.current = setTimeout(step, 1400);
    return () => clearTimeout(timerRef.current);
  }, [auto, phase, pc, ir, ar, dr, alu, registers, dataMemory]);

  const nodeOn = (id) => activeNodes.includes(id);
  const pathOn = (id) => activePaths.includes(id);

  return (
    <div className="my-6 w-full overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100/90 p-2 text-slate-800 shadow-sm">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes iv-flow { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
        .iv-flow { animation: iv-flow .85s linear infinite; }
      ` }} />

      <div className="mb-4 flex min-w-[760px] flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-black text-white shadow-md">CPU</div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">CPU 核心拓扑全景图</h2>
            <p className="text-sm text-slate-500">哈佛架构 · 总线数据流可视化模拟器</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2">
          {PHASES.map(name => (
            <span key={name} className={`rounded-md px-3 py-1.5 text-xs font-bold ${phase === name ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-400'}`}>
              {PHASE_TEXT[name]}
            </span>
          ))}
          <button onClick={reset} className="rounded-md px-3 py-2 text-sm font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600">重置</button>
          <button onClick={step} disabled={auto} className="rounded-md bg-blue-500 px-4 py-2 text-sm font-bold text-white shadow-md disabled:bg-slate-300">单步流转</button>
          <button onClick={() => setAuto(!auto)} className={`rounded-md px-4 py-2 text-sm font-bold shadow-sm ${auto ? 'bg-red-500 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>
            {auto ? '暂停' : '自动'}
          </button>
        </div>
      </div>

      <div className="mb-4 min-w-[760px] rounded-r-xl border-l-4 border-blue-500 bg-blue-50/90 p-4 shadow-sm">
        <div className="mb-1 text-xs font-bold tracking-wider text-blue-600">实时状态解说</div>
        <p className="min-h-[1.5rem] text-base font-medium leading-relaxed text-slate-700">{note}</p>
      </div>

      <div className="relative h-[560px] w-[760px] rounded-2xl border border-slate-200 bg-white shadow-xl">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 560" preserveAspectRatio="none">
          <defs>
            <marker id="iv-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 Z" fill="#CBD5E1" />
            </marker>
            <marker id="iv-arrow-on" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 Z" fill="#3B82F6" />
            </marker>
          </defs>
          <Flow id="dbus" d="M60 56 H392" label="数据总线 DBUS" x="62" y="35" on={pathOn('dbus-reg') || pathOn('dbus-dr') || pathOn('dbus-ar') || pathOn('dbus-data') || pathOn('data-dbus') || pathOn('dr-dbus') || pathOn('alu-dbus') || pathOn('reg-dbus')} />
          <Flow id="ibus" d="M470 56 H715" label="指令总线 IBUS" x="550" y="35" on={pathOn('inst-ibus') || pathOn('ibus-ir')} />
          <Flow id="pc-inst" d="M610 132 V170" on={pathOn('pc-inst')} />
          <Flow id="inst-ibus" d="M610 170 V56" on={pathOn('inst-ibus')} />
          <Flow id="ibus-ir" d="M715 56 V395 H662" on={pathOn('ibus-ir')} />
          <Flow id="ir-dec" d="M530 421 H488" on={pathOn('ir-dec')} />
          <Flow id="dec-cu" d="M358 421 H318" on={pathOn('dec-cu')} />
          <Flow id="ir-pc" d="M640 395 V144" on={pathOn('ir-pc')} />
          <Flow id="reg-alu-a" d="M143 190 V140" on={pathOn('reg-alu-a')} />
          <Flow id="reg-alu-b" d="M185 190 V140" on={pathOn('reg-alu-b')} />
          <Flow id="reg-dbus" d="M95 224 H75 V56" on={pathOn('reg-dbus')} />
          <Flow id="dbus-reg" d="M60 56 V272 H78" on={pathOn('dbus-reg')} />
          <Flow id="alu-dbus" d="M178 98 V56" on={pathOn('alu-dbus')} />
          <Flow id="dbus-dr" d="M240 56 V208 H268" on={pathOn('dbus-dr')} />
          <Flow id="dr-dbus" d="M268 230 H225 V56" on={pathOn('dr-dbus')} />
          <Flow id="dbus-ar" d="M315 56 V300 H268" on={pathOn('dbus-ar')} />
          <Flow id="ar-data" d="M392 316 H412" on={pathOn('ar-data')} />
          <Flow id="data-dbus" d="M500 180 V56" on={pathOn('data-dbus')} />
          <Flow id="dbus-data" d="M392 56 H500 V180" on={pathOn('dbus-data')} />
        </svg>

        <Module id="ALU" title="ALU" value={alu} x={78} y={80} w={145} h={64} active={nodeOn('ALU')} />
        <RegisterBlock x={70} y={190} active={nodeOn('REG')} registers={registers} />
        <Module id="DR" title="DR 数据缓冲" value={dr} x={268} y={200} w={130} h={58} active={nodeOn('DR')} />
        <Module id="AR" title="AR 地址寄存器" value={ar} x={268} y={290} w={130} h={58} active={nodeOn('AR')} />
        <DataMemory x={412} y={152} data={dataMemory} ar={ar} active={nodeOn('DATA')} />
        <InstMemory x={540} y={152} pc={pc} phase={phase} active={nodeOn('INST')} />
        <Module id="PC" title="PC 程序计数器" value={pc} x={552} y={86} w={170} h={58} active={nodeOn('PC')} />
        <Module id="IR" title="IR 指令寄存器" value={ir} x={530} y={390} w={170} h={68} active={nodeOn('IR')} />
        <Module id="DEC" title="指令译码器" x={358} y={390} w={130} h={68} active={nodeOn('DEC')} />
        <Module id="CU" title="操作控制器" value="时序发生器" x={185} y={390} w={133} h={68} active={nodeOn('CU')} />
      </div>
    </div>
  );
}

function Flow({ id, d, on, label, x, y }) {
  return (
    <g>
      {label && <text x={x} y={y} fill="#64748B" fontSize="13" fontWeight="700">{label}</text>}
      <path d={d} stroke={on ? '#BFDBFE' : '#E2E8F0'} strokeWidth="5" fill="none" strokeLinejoin="round" />
      <path
        d={d}
        stroke={on ? '#3B82F6' : '#CBD5E1'}
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
        markerEnd={on ? 'url(#iv-arrow-on)' : 'url(#iv-arrow)'}
        className={on ? 'iv-flow' : ''}
        strokeDasharray={on ? '10 10' : ''}
      />
    </g>
  );
}

function Module({ title, value, x, y, w, h, active }) {
  return (
    <div
      className={`absolute flex flex-col items-center justify-center rounded-xl border-2 px-3 text-center transition-all duration-300 ${active ? 'z-10 scale-[1.03] border-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,.35)]' : 'border-slate-200 bg-white shadow-sm'}`}
      style={{ left: x, top: y, width: w, height: h }}
    >
      <div className="text-xs font-bold text-slate-600">{title}</div>
      {value !== undefined && <div className="mt-1 max-w-full truncate rounded-md bg-slate-100 px-2 py-0.5 font-mono text-sm font-bold text-blue-600">{value}</div>}
    </div>
  );
}

function RegisterBlock({ x, y, active, registers }) {
  return (
    <div className={`absolute overflow-hidden rounded-xl border-2 transition-all duration-300 ${active ? 'z-10 scale-[1.03] border-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,.35)]' : 'border-slate-200 bg-white shadow-sm'}`} style={{ left: x, top: y, width: 154, height: 156 }}>
      <div className="border-b bg-slate-100 py-1.5 text-center text-xs font-bold text-slate-600">通用寄存器</div>
      {Object.entries(registers).map(([key, val]) => (
        <div key={key} className="flex border-b border-slate-100 last:border-0">
          <div className="w-1/3 bg-slate-50 py-1.5 text-center text-xs font-bold text-blue-600">{key}</div>
          <div className="w-2/3 py-1.5 text-center font-mono text-xs">{val}</div>
        </div>
      ))}
    </div>
  );
}

function DataMemory({ x, y, data, ar, active }) {
  return (
    <div className={`absolute overflow-hidden rounded-xl border-2 transition-all duration-300 ${active ? 'z-10 scale-[1.03] border-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,.35)]' : 'border-slate-200 bg-white shadow-sm'}`} style={{ left: x, top: y, width: 118, height: 205 }}>
      <div className="border-b bg-blue-50 py-1.5 text-center text-xs font-bold text-blue-600">数存 cache</div>
      {Object.entries(data).map(([addr, val]) => (
        <div key={addr} className={`flex px-2 py-1 text-xs ${String(ar) === addr ? 'bg-yellow-100 text-yellow-800' : ''}`}>
          <span className="w-1/2 font-mono">{addr}</span>
          <span className="w-1/2 text-right font-mono">{val}</span>
        </div>
      ))}
    </div>
  );
}

function InstMemory({ x, y, pc, phase, active }) {
  return (
    <div className={`absolute overflow-hidden rounded-xl border-2 transition-all duration-300 ${active ? 'z-10 scale-[1.03] border-blue-500 bg-blue-50 shadow-[0_0_20px_rgba(59,130,246,.35)]' : 'border-slate-200 bg-white shadow-sm'}`} style={{ left: x, top: y, width: 202, height: 205 }}>
      <div className="border-b bg-blue-50 py-1.5 text-center text-xs font-bold text-blue-600">指存 cache</div>
      {Object.entries(INST_MEM).map(([addr, inst]) => (
        <div key={addr} className={`flex px-2 py-1.5 text-xs ${pc === Number(addr) && phase === 'FETCH' ? 'bg-blue-500 font-bold text-white' : 'text-slate-600'}`}>
          <span className="w-10 font-mono">{addr}</span>
          <span className="font-mono">{inst}</span>
        </div>
      ))}
    </div>
  );
}

window.InstructionVisualizer = InstructionVisualizer;
window.AddressingModes = window.AddressingModes || InstructionVisualizer;
