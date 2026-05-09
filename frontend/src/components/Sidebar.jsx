import React from 'react';
import { Minus, Plus, Zap, LayoutGrid } from 'lucide-react';

const CATEGORY_COLORS = {
  "Underweight": "#378ADD",
  "Normal":      "#d4f01e",
  "Overweight":  "#BA7517",
  "Obese":       "#E24B4A",
};

const NumberInput = ({ label, value, onChange, min, max, step = 1, unit = "" }) => {
  const increment = () => onChange(Math.min(max, value + step));
  const decrement = () => onChange(Math.max(min, value - step));

  return (
    <div className="mb-6">
      <div className="sidebar-label font-bold text-[10px] text-[#888]">{label} {unit && `(${unit})`}</div>
      <div className="input-container h-10 mt-1">
        <button onClick={decrement} className="input-btn w-12 border-r border-[#222] text-brand">
          <Minus size={14} strokeWidth={3} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="input-field text-md font-black"
        />
        <button onClick={increment} className="input-btn w-12 border-l border-[#222] text-brand">
          <Plus size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ metrics, setMetrics, activeStandard, setActiveStandard, results }) => {
  const handleMetricChange = (name, value) => {
    setMetrics(prev => ({ ...prev, [name]: value }));
  };

  const standards = [
    { id: 'Global WHO Standard', label: 'Global WHO Standard' },
    { id: 'Asian Clinical Standard', label: 'Asian Clinical Standard' }
  ];

  return (
    <aside className="w-[380px] h-screen bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col shrink-0">
      {/* Branding Area */}
      <div className="p-6 pb-6 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#d4f01e] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,240,30,0.3)]">
            <LayoutGrid size={18} className="text-black" strokeWidth={3} />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-black text-white tracking-tight leading-none">HealthAnalytics</h1>
            <div className="h-6 w-[1px] bg-[#333]"></div>
            <div className="flex flex-col">
              <h2 className="text-[12px] font-black text-white tracking-tight leading-none">BMI Health</h2>
              <h2 className="text-[12px] font-black text-white tracking-tight leading-none mt-1">Classifier</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 custom-scrollbar min-h-0">
        <div className="flex flex-col gap-10">

          {/* Configuration Section */}
          <section>
            <div className="section-header">
              <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
              <h2 className="text-[11px] font-black text-white uppercase tracking-widest">BODY METRICS</h2>
            </div>

            <div className="mb-6">
              <div className="sidebar-label font-bold text-[10px] text-[#888] mb-2 uppercase tracking-wider">SELECT YOUR BMI STANDARD</div>
              <div className="flex flex-col gap-2">
                {standards.map(std => (
                  <button
                    key={std.id}
                    onClick={() => setActiveStandard(std.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                      activeStandard === std.id
                        ? 'border-[#333] bg-[#1a1a1a]/50 text-white'
                        : 'border-[#1a1a1a] bg-[#111] text-[#555]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${activeStandard === std.id ? 'border-[#378ADD]' : 'border-[#333]'}`}>
                        {activeStandard === std.id && <div className="w-2 h-2 rounded-full bg-[#378ADD]"></div>}
                      </div>
                      <span className="text-xs font-bold">{std.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="sidebar-label font-bold text-[10px] text-[#888] mb-2 uppercase tracking-wider">GENDER</div>
              <div className="flex gap-2">
                {['Male', 'Female'].map(g => (
                  <button
                    key={g}
                    onClick={() => handleMetricChange('gender', g)}
                    className={`flex-1 py-2.5 rounded-lg border text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                      metrics.gender === g
                        ? 'border-brand bg-brand/5 text-brand'
                        : 'border-[#1a1a1a] bg-[#111] text-[#555]'
                    }`}
                  >
                    {g === 'Male' ? '♂ MALE' : '♀ FEMALE'}
                  </button>
                ))}
              </div>
            </div>

            <NumberInput
              label="AGE"
              value={metrics.age}
              onChange={(v) => handleMetricChange('age', v)}
              min={10} max={100}
            />
            <NumberInput
              label="WEIGHT"
              unit="KG"
              value={metrics.weight}
              onChange={(v) => handleMetricChange('weight', v)}
              min={30} max={200} step={0.5}
            />
            <NumberInput
              label="HEIGHT"
              unit="CM"
              value={metrics.height}
              onChange={(v) => handleMetricChange('height', v)}
              min={100} max={220}
            />
            <NumberInput
              label="HIP"
              unit="CM"
              value={metrics.hip_cm}
              onChange={(v) => handleMetricChange('hip_cm', v)}
              min={60} max={160}
            />
          </section>

          {/* Live Analysis Section */}
          {results && (
            <section className="p-5 rounded-2xl bg-[#111] border border-[#1a1a1a]">
              <p className="text-[11px] font-black text-brand uppercase tracking-wider mb-6">LIVE CALCULATION RESULTS</p>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-2">YOUR BMI</p>
                  <p className="text-[34px] font-black text-white tracking-tight leading-none">{results.bmi}</p>
                  <p className="text-[11px] font-black mt-3 uppercase tracking-widest" style={{ color: CATEGORY_COLORS[results.bmi_category] || '#d4f01e' }}>
                    {results.bmi_category}
                  </p>
                </div>
                <div className="text-left pl-5 border-l border-[#222]">
                  <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-2">YOUR BAI</p>
                  <p className="text-[34px] font-black text-[#8098FF] tracking-tight leading-none">{results.bai}%</p>
                  <p className="text-[11px] font-black mt-3 uppercase tracking-widest" style={{ color: results.bai_category === 'Normal' ? '#8098FF' : (CATEGORY_COLORS[results.bai_category] || '#d4f01e') }}>
                    {results.bai_category}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Comparison Table */}
          {results && (
            <section className="p-5 rounded-2xl bg-[#111] border border-[#1a1a1a]">
              <p className="text-[11px] font-bold text-[#888] uppercase tracking-wider mb-5">
                YOUR BMI {results.bmi} — STANDARD COMPARISON
              </p>
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3">
                <div className="grid grid-cols-3 text-[9px] font-bold text-[#444] uppercase mb-3 px-1">
                  <div>STANDARD</div>
                  <div className="text-center">OVERWEIGHT/OBESE</div>
                  <div className="text-right">YOUR CATEGORY</div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Global WHO Standard', range: '25.0 - 30.0+', cat: results.global_bmi_category },
                    { name: 'Asian Clinical Standard', range: '23.0 - 27.5+', cat: results.asian_bmi_category }
                  ].map(s => (
                    <div key={s.name} className="grid grid-cols-3 items-center px-1 border-b border-zinc-800/30 pb-2 last:border-0 last:pb-0">
                      <div className="text-[10px] font-bold text-white opacity-80">{s.name}</div>
                      <div className="text-[9px] text-[#555] font-bold text-center italic">{s.range}</div>
                      <div
                        className="text-[10px] font-black text-right uppercase italic"
                        style={{ color: CATEGORY_COLORS[s.cat] || '#d4f01e' }}
                      >
                        {s.cat}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Reference Tables */}
          <section className="p-5 rounded-2xl bg-[#111] border border-[#1a1a1a] mb-8">
            <p className="text-[11px] font-black text-brand uppercase tracking-wider mb-5">HEALTHY BODY METRIC TARGETS</p>
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3">
              <div className="grid grid-cols-[1fr_0.8fr_1fr_0.8fr_0.8fr] gap-1 text-[7px] text-[#444] font-bold mb-3 px-1 uppercase">
                <div>METRIC</div>
                <div className="opacity-60 text-center">UNDERW.</div>
                <div className="text-brand text-center">NORMAL</div>
                <div className="opacity-60 text-center">OVERW.</div>
                <div className="opacity-60 text-right">OBESE</div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_0.8fr_1fr_0.8fr_0.8fr] gap-1 items-center px-1 border-b border-zinc-800/30 pb-2">
                  <div className="text-[9px] font-black text-white opacity-70 whitespace-nowrap">BMI WHO</div>
                  <div className="text-[8px] text-[#555] font-bold text-center">{"< 18.5"}</div>
                  <div className="text-[9px] text-brand font-black text-center">18.5-25.0</div>
                  <div className="text-[8px] text-[#555] font-bold text-center">25.0-30.0</div>
                  <div className="text-[8px] text-[#555] font-bold text-right">30.0+</div>
                </div>
                <div className="grid grid-cols-[1fr_0.8fr_1fr_0.8fr_0.8fr] gap-1 items-center px-1 border-b border-zinc-800/30 pb-2">
                  <div className="text-[9px] font-black text-white opacity-70 whitespace-nowrap">BAI 20-39</div>
                  <div className="text-[8px] text-[#555] font-bold text-center">{"< 8.0%"}</div>
                  <div className="text-[9px] text-[#8098FF] font-black text-center">8.0-21.0%</div>
                  <div className="text-[8px] text-[#555] font-bold text-center">21.0-26.0%</div>
                  <div className="text-[8px] text-[#555] font-bold text-right">26.0%+</div>
                </div>
                <div className="grid grid-cols-[1fr_0.8fr_1fr_0.8fr_0.8fr] gap-1 items-center px-1 border-b border-zinc-800/30 pb-2">
                  <div className="text-[9px] font-black text-white opacity-70 whitespace-nowrap">BAI 40-59</div>
                  <div className="text-[8px] text-[#555] font-bold text-center">{"< 11.0%"}</div>
                  <div className="text-[9px] text-[#8098FF] font-black text-center">11.0-23.0%</div>
                  <div className="text-[8px] text-[#555] font-bold text-center">23.0-29.0%</div>
                  <div className="text-[8px] text-[#555] font-bold text-right">29.0%+</div>
                </div>
                <div className="grid grid-cols-[1fr_0.8fr_1fr_0.8fr_0.8fr] gap-1 items-center px-1">
                  <div className="text-[9px] font-black text-white opacity-70 whitespace-nowrap">BAI 60-79</div>
                  <div className="text-[8px] text-[#555] font-bold text-center">{"< 13.0%"}</div>
                  <div className="text-[9px] text-[#8098FF] font-black text-center">13.0-25.0%</div>
                  <div className="text-[8px] text-[#555] font-bold text-center">25.0-31.0%</div>
                  <div className="text-[8px] text-[#555] font-bold text-right">31.0%+</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-[#0d0d0d] border-t border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap size={16} className="text-brand" fill="#d4f01e" />
          <span className="text-[12px] font-black text-white uppercase tracking-[0.15em]">Auto-Analysis Live</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
