import React from 'react';
import { Minus, Plus, Zap, LayoutGrid, LogOut, Monitor } from 'lucide-react';

const CATEGORY_COLORS = {
  "Underweight": "#378ADD",
  "Normal":      "#D9FF00",
  "Overweight":  "#BA7517",
  "Obese":       "#E24B4A",
};

const NumberInput = ({ label, value, onChange, min, max, step = 1, unit = "", decimals = 0 }) => {
  const increment = () => onChange(Math.min(max, value + step));
  const decrement = () => onChange(Math.max(min, value - step));

  return (
    <div className="mb-6 px-1">
      <div className="sidebar-label font-bold text-[10px] text-[#888] uppercase tracking-[0.15em] mb-2">
        {label} {unit && `(${unit})`}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          className="w-10 h-10 flex items-center justify-center bg-[#0a0a0a] text-[#D9FF00] rounded-md border border-[#1a1a1a] hover:bg-[#111] active:scale-95 transition-all"
        >
          <div className="w-3 h-[2px] bg-[#D9FF00] rounded-full"></div>
        </button>
        <div className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md h-10 flex items-center justify-center">
          <input
            type="number"
            value={decimals > 0 ? value.toFixed(decimals) : value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full bg-transparent text-center text-white text-[15px] font-black outline-none"
          />
        </div>
        <button
          onClick={increment}
          className="w-10 h-10 flex items-center justify-center bg-[#0a0a0a] text-[#D9FF00] rounded-md border border-[#1a1a1a] hover:bg-[#111] active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ metrics, setMetrics, activeStandard, setActiveStandard, results, onLogout }) => {
  const handleMetricChange = (name, value) => {
    setMetrics(prev => ({ ...prev, [name]: value }));
  };

  const standards = [
    { id: 'Global WHO Standard', label: 'Global WHO Standard' },
    { id: 'Asian Clinical Standard', label: 'Asian Clinical Standard' }
  ];

  return (
    <aside className="w-[380px] h-screen bg-[#111111] border-r border-[#1a1a1a] flex flex-col shrink-0 text-[#888]">
      {/* Branding Area */}
      <div className="p-6 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D9FF00] rounded-full flex items-center justify-center">
             <div className="flex flex-wrap w-5 h-5 gap-0.5 items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black"></div>
                <div className="w-2 h-2 rounded-full bg-black"></div>
                <div className="w-2 h-2 rounded-full bg-black"></div>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-[22px] font-black text-white tracking-tight">HealthAnalytics</h1>
            <div className="h-6 w-[1px] bg-[#333]"></div>
            <div className="text-white text-[14px] font-bold">BMI Health</div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="flex flex-col gap-6">

          <div className="flex items-center gap-2 mb-2">
            <Monitor size={14} className="text-[#D9FF00]" />
            <h2 className="text-[11px] font-black text-[#D9FF00] uppercase tracking-widest">BODY METRICS</h2>
          </div>

          <section>
            <div className="mb-6 px-1">
              <div className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-3">SELECT YOUR BMI STANDARD</div>
              <div className="flex flex-col gap-2">
                {standards.map(std => (
                  <button
                    key={std.id}
                    onClick={() => setActiveStandard(std.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      activeStandard === std.id
                        ? 'border-[#333] bg-[#1a1a1a] text-white shadow-lg'
                        : 'border-[#1a1a1a] bg-[#0a0a0a] text-[#555]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${activeStandard === std.id ? 'border-[#378ADD] bg-white' : 'border-[#444]'}`}>
                      {activeStandard === std.id && <div className="w-2 h-2 rounded-full bg-[#378ADD]"></div>}
                    </div>
                    <span className="text-[12px] font-bold">{std.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 px-1">
              <div className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-3">GENDER</div>
              <div className="flex gap-2">
                {['Male', 'Female'].map(g => (
                  <button
                    key={g}
                    onClick={() => handleMetricChange('gender', g)}
                    className={`flex-1 py-3 rounded-xl border text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                      metrics.gender === g
                        ? 'border-[#D9FF00] bg-[#D9FF00]/5 text-[#D9FF00]'
                        : 'border-[#1a1a1a] bg-[#0a0a0a] text-[#555]'
                    }`}
                  >
                    {g === 'Male' ? '♂ MALE' : '♀ FEMALE'}
                  </button>
                ))}
              </div>
            </div>

            <NumberInput label="AGE" value={metrics.age} onChange={(v) => handleMetricChange('age', v)} min={10} max={100} />
            <NumberInput label="WEIGHT" unit="KG" value={metrics.weight} onChange={(v) => handleMetricChange('weight', v)} min={30} max={200} step={0.1} decimals={2} />
            <NumberInput label="HEIGHT" unit="CM" value={metrics.height} onChange={(v) => handleMetricChange('height', v)} min={100} max={220} />
            <NumberInput label="HIP" unit="CM" value={metrics.hip_cm} onChange={(v) => handleMetricChange('hip_cm', v)} min={60} max={160} />
          </section>

          {results && (
            <section className="p-6 rounded-2xl border border-[#D9FF00] bg-[#0a0a0a]">
              <p className="text-[10px] font-black text-[#D9FF00] uppercase tracking-widest mb-6">LIVE CALCULATION RESULTS</p>

              <div className="flex justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[9px] font-bold text-[#666] uppercase mb-2">YOUR BMI</p>
                  <p className="text-[32px] font-black text-white leading-none mb-2">{results.bmi}</p>
                  <p className="text-[10px] font-black uppercase" style={{ color: CATEGORY_COLORS[results.bmi_category] }}>{results.bmi_category}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-bold text-[#666] uppercase mb-2">YOUR BAI</p>
                  <p className="text-[32px] font-black text-[#8098FF] leading-none mb-2">{results.bai}%</p>
                  <p className="text-[10px] font-black uppercase" style={{ color: results.bai_category === 'Normal' ? '#8098FF' : CATEGORY_COLORS[results.bai_category] }}>
                    {results.bai_category === 'Normal' ? 'HEALTHY' : results.bai_category}
                  </p>
                </div>
              </div>
            </section>
          )}

          {results && (
            <section className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]">
              <p className="text-[11px] font-black text-white uppercase mb-4">
                YOUR BMI {results.bmi} — STANDARD COMPARISON
              </p>
              <div className="space-y-4">
                <div className="flex text-[9px] font-bold text-[#444] uppercase">
                  <div className="w-[30%] text-left">STANDARD</div>
                  <div className="w-[20%] text-center">OVERWEIGHT</div>
                  <div className="w-[20%] text-center">OBESE</div>
                  <div className="w-[30%] text-right">YOUR CATEGORY</div>
                </div>

                {[
                  { name: 'Global WHO', over: '25.0+', obese: '30.0+', cat: results.global_bmi_category },
                  { name: 'Asian Clinical', over: '23.0+', obese: '27.5+', cat: results.asian_bmi_category }
                ].map(s => (
                  <div key={s.name} className="flex items-center text-[10px] py-1">
                    <div className="w-[30%] font-bold text-white">{s.name}</div>
                    <div className="w-[20%] text-center text-[#666]">{s.over}</div>
                    <div className="w-[20%] text-center text-[#666]">{s.obese}</div>
                    <div
                      className="w-[30%] font-black text-right uppercase italic"
                      style={{ color: CATEGORY_COLORS[s.cat] || '#D9FF00' }}
                    >
                      {s.cat}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap size={16} className="text-[#D9FF00]" fill="#D9FF00" />
          <span className="text-[12px] font-black text-white uppercase tracking-widest">Auto-Analysis Live</span>
        </div>
        <button onClick={onLogout} className="text-[#444] hover:text-[#E24B4A] transition-colors">
          <LogOut size={18} strokeWidth={3} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
