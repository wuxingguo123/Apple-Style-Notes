const { useState } = React;

function SimulatorButton() {
    const [mode, setMode] = useState('1');
    const [ac, setAc] = useState(0);
    const [regs, setRegs] = useState({ R1: 10, R2: 20, R3: 30, R4: 40 });
    const [selectedOp, setSelectedOp] = useState('ADD');
    const [addr1, setAddr1] = useState('R1');
    const [addr2, setAddr2] = useState('R2');
    const [addr3, setAddr3] = useState('R3');
    const [isPlaying, setIsPlaying] = useState(false);
    const [step, setStep] = useState(0);
    const [logMessage, setLogMessage] = useState('请选择指令架构模式，组装指令并执行。');

    const handleModeChange = (newMode) => {
        if (isPlaying) return;
        setMode(newMode);
        setStep(0);
        if (newMode === '1') setLogMessage('已切换至一地址指令：AC ← (AC) OP (A)');
        if (newMode === '2') setLogMessage('已切换至二地址指令：A1 ← (A1) OP (A2)');
        if (newMode === '3') setLogMessage('已切换至三地址指令：A3 ← (A1) OP (A2)');
    };

    const executeInstruction = () => {
        if (isPlaying) return;
        setIsPlaying(true);
        let val1, val2, dest, destName, val1Name, val2Name;
        if (mode === '1') {
            val1 = regs[addr1]; val1Name = addr1;
            val2 = ac; val2Name = 'AC';
            dest = 'AC'; destName = 'AC';
        } else if (mode === '2') {
            val1 = regs[addr1]; val1Name = addr1;
            val2 = regs[addr2]; val2Name = addr2;
            dest = addr1; destName = addr1;
        } else {
            val1 = regs[addr1]; val1Name = addr1;
            val2 = regs[addr2]; val2Name = addr2;
            dest = addr3; destName = addr3;
        }
        let result = selectedOp === 'ADD' ? val1 + val2 : val1 - val2;
        let operatorStr = selectedOp === 'ADD' ? '+' : '-';

        setStep(1); setLogMessage(`【步骤 1】 提取操作数：${val1}`);
        setTimeout(() => {
            setStep(2); setLogMessage(`【步骤 2】 提取操作数：${val2}`);
            setTimeout(() => {
                setStep(3); setLogMessage(`【步骤 3】 ALU 计算：${val1} ${operatorStr} ${val2} = ${result}`);
                setTimeout(() => {
                    setStep(4);
                    if (dest === 'AC') setAc(result);
                    else setRegs(prev => ({ ...prev, [dest]: result }));
                    setLogMessage(`【步骤 4】 写回目的地。执行完毕！`);
                    setTimeout(() => { setStep(0); setIsPlaying(false); }, 2500);
                }, 2000);
            }, 2000);
        }, 2000);
    };

    const resetSimulator = () => { setAc(0); setRegs({ R1: 10, R2: 20, R3: 30, R4: 40 }); setStep(0); setIsPlaying(false); setLogMessage('重置完毕。'); };
    const getGlow = (isActive, colorClass) => isActive ? `ring-4 ${colorClass} scale-105 transition-all z-10 relative` : "transition-all";

    return (
        <div className="bg-gray-900 text-gray-100 p-4 md:p-8 rounded-2xl mt-8 mb-12 shadow-2xl">
            <header className="mb-6 text-center border-b border-gray-700 pb-4">
                <h1 className="text-xl font-bold text-blue-400 mb-2">⚙️ 指令架构模拟器</h1>
            </header>
            <div className="flex justify-center mb-6 gap-2 md:gap-4">
                {[
                    { id: '1', name: '一地址' }, { id: '2', name: '二地址' }, { id: '3', name: '三地址' }
                ].map(m => (
                    <button key={m.id} onClick={() => handleModeChange(m.id)} disabled={isPlaying} className={`px-4 py-2 rounded-lg font-bold text-sm ${mode === m.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                        {m.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 左侧控制台 */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex gap-2 mb-4">
                        {['ADD', 'SUB'].map(op => (
                            <button key={op} onClick={() => setSelectedOp(op)} disabled={isPlaying} className={`flex-1 py-1 rounded text-sm ${selectedOp === op ? 'bg-indigo-600' : 'bg-gray-700'}`}>{op}</button>
                        ))}
                    </div>
                    <div className="flex justify-between items-center bg-gray-900 p-3 rounded font-mono text-green-400 font-bold mb-4">
                        <span>{selectedOp} {addr1}{mode !== '1' && `, ${addr2}`}{mode === '3' && `, ${addr3}`}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={executeInstruction} disabled={isPlaying} className="flex-1 bg-green-600 py-2 rounded text-white font-bold">{isPlaying ? '运行中...' : '▶ 执行'}</button>
                        <button onClick={resetSimulator} disabled={isPlaying} className="bg-red-800 px-4 rounded text-white font-bold">🔄</button>
                    </div>
                </div>

                {/* 右侧可视化核心 */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex flex-col justify-center items-center">
                    <p className="text-yellow-400 text-sm mb-4 h-5">{logMessage}</p>
                    <div className="flex gap-8 w-full justify-center">
                        <div className={`p-4 rounded-xl border-2 flex flex-col items-center ${mode === '1' ? 'bg-blue-900/80 border-blue-500' : 'bg-gray-800 border-gray-700 opacity-40'} ${mode === '1' && step === 2 ? 'ring-2 ring-blue-400' : ''}`}>
                            <span className="text-xs text-blue-200 mb-1">AC 累加器</span>
                            <span className="text-2xl font-mono">{ac}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {Object.entries(regs).slice(0, 2).map(([k, v]) => (
                                <div key={k} className={`px-4 py-2 bg-gray-700 rounded flex gap-4 ${step === 1 && addr1 === k ? 'bg-purple-900 border border-purple-500' : ''}`}>
                                    <span className="text-gray-400">{k}</span>
                                    <span className="text-white font-mono">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 暴露到全局，供 test.html 里的 COMPONENT_MAP 使用
window.SimulatorButton = SimulatorButton;
