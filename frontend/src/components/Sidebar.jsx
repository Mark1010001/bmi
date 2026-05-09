import React from 'react';
import { Minus, Plus, Zap, LayoutGrid, LogOut } from 'lucide-react';

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
    <div className="mb-6">
      <div className="sidebar-label font-bold text-[10px] text-[#555] uppercase tracking-[0.15em] mb-2">{label} {unit && `(${unit})`}</div>
      <div className="flex items-center gap-1">
        <button onClick={decrement} className="w-10 h-10 flex items-center justify-center bg-[#111] text-[#D9FF00] rounded-md border border-[#1a1a1a] hover:bg-[#1a1a1a] active:scale-95 transition-transform">
          <Minus size={14} strokeWidth={4} />
        </button>
        <div className="flex-1 bg-[#111] border border-[#1a1a1a] rounded-md h-10 flex items-center justify-center">
          <input
            type="number"
            value={decimals > 0 ? value.toFixed(decimals) : value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full bg-transparent text-center text-white text-[15px] font-black outline-none"
          />
        </div>
        <button onClick={increment} className="w-10 h-10 flex items-center justify-center bg-[#111] text-[#D9FF00] rounded-md border border-[#1a1a1a] hover:bg-[#1a1a1a] active:scale-95 transition-transform">
          <Plus size={14} strokeWidth={4} />
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
    <aside className="w-[380px] h-screen bg-[#121212] border-r border-[#1a1a1a] flex flex-col shrink-0">
      {/* Branding Area */}
      <div className="p-6 pb-6 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#D9FF00] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(217,255,0,0.3)]">
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
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D9FF00] shadow-[0_0_8px_rgba(217,255,0,0.6)]"></div>
              <h2 className="text-[11px] font-black text-white uppercase tracking-[0.25em]">BODY CONFIGURATION</h2>
            </div>

            <div className="mb-10">
              <div className="sidebar-label font-bold text-[10px] text-[#555] uppercase tracking-[0.15em] mb-3">SELECT GENDER</div>
              <div className="flex gap-2">
                {['Male', 'Female'].map(g => (
                  <button
                    key={g}
                    onClick={() => handleMetricChange('gender', g)}
                    className={`flex-1 py-3.5 rounded-lg border text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                      metrics.gender === g
                        ? 'border-[#D9FF00] bg-[#D9FF00]/5 text-[#D9FF00] shadow-[0_0_15px_rgba(217,255,0,0.1)]'
                        : 'border-[#1a1a1a] bg-[#111] text-[#444]'
                    }`}
                  >
                    {g === 'Male' ? '♂ MALE' : '♀ FEMALE'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <div className="sidebar-label font-bold text-[10px] text-[#555] uppercase tracking-[0.15em] mb-3">ACTIVE BMI STANDARD</div>
              <div className="flex flex-col gap-2">
                {standards.map(std => (
                  <button
                    key={std.id}
                    onClick={() => setActiveStandard(std.id)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-lg border transition-all ${
                      activeStandard === std.id
                        ? 'border-[#333] bg-[#1a1a1a] text-white shadow-lg'
                        : 'border-[#1a1a1a] bg-[#111] text-[#555]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${activeStandard === std.id ? 'border-[#378ADD]' : 'border-[#333]'}`}>
                        {activeStandard === std.id && <div className="w-2 h-2 rounded-full bg-[#378ADD]"></div>}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-tight">{std.label}</span>
                    </div>
                    {activeStandard === std.id && <Zap size={12} className="text-[#378ADD]" fill="#378ADD" />}
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
              decimals={2}
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
            <section className="p-7 rounded-2xl bg-[#0a0a0a] border border-[#151515] shadow-[0_15px_50px_rgba(0,0,0,0.7)]">
              <p className="text-[11px] font-black text-[#D9FF00] uppercase tracking-[0.25em] mb-10 text-center opacity-90">LIVE CALCULATION RESULTS</p>

              <div className="flex items-center justify-between">
                <div className="flex-1 text-center">
                  <p className="text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] mb-3">YOUR BMI</p>
                  <p className="text-[52px] font-black text-white tracking-tighter leading-none mb-1">{results.bmi}</p>
                  <div className="mt-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: CATEGORY_COLORS[results.bmi_category] || '#D9FF00' }}>
                      {results.bmi_category}
                    </p>
                  </div>
                </div>
                <div className="w-[1px] h-24 bg-[#1a1a1a] mx-2"></div>
                <div className="flex-1 text-center">
                  <p className="text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] mb-3">YOUR BAI</p>
                  <p className="text-[52px] font-black text-[#8098FF] tracking-tighter leading-none mb-1">{results.bai}%</p>
                  <div className="mt-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: results.bai_category === 'Normal' ? '#8098FF' : (CATEGORY_COLORS[results.bai_category] || '#D9FF00') }}>
                      {results.bai_category === 'Normal' ? 'HEALTHY' : results.bai_category}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Comparison Table */}
          {results && (
            <section className="p-4 rounded-2xl bg-[#1a1a1a] border border-[#222]">
              <p className="text-[13px] font-black text-[#f0f0f0] uppercase tracking-wider mb-5 px-1">
                YOUR BMI {results.bmi} — STANDARD COMPARISON
              </p>
              <div className="bg-[#0a0a0a] border border-zinc-800/50 rounded-xl p-3 shadow-inner">
                <div className="flex text-[9px] font-bold text-[#555] uppercase tracking-tighter mb-4 px-2">
                  <div className="w-[30%]">STANDARD</div>
                  <div className="w-[20%] text-center">OVERWEIGHT</div>
                  <div className="w-[18%] text-center">OBESE</div>
                  <div className="w-[32%] text-right">YOUR CATEGORY</div>
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Global WHO', over: '25.0+', obese: '30.0+', cat: results.global_bmi_category, id: 'Global WHO Standard' },
                    { name: 'Asian Clinical', over: '23.0+', obese: '27.5+', cat: results.asian_bmi_category, id: 'Asian Clinical Standard' }
                  ].map(s => (
                    <div
                      key={s.name}
                      className={`flex items-center px-2 py-3.5 rounded-lg transition-all duration-300 ${
                        activeStandard === s.id ? 'bg-[#D9FF00]/10 ring-1 ring-[#D9FF00]/20' : ''
                      }`}
                    >
                      <div className={`w-[30%] text-[11px] font-black ${activeStandard === s.id ? 'text-[#D9FF00]' : 'text-white'}`}>
                        {s.name}
                      </div>
                      <div className="w-[20%] text-[10px] text-[#888] font-bold text-center">{s.over}</div>
                      <div className="w-[18%] text-[10px] text-[#888] font-bold text-center">{s.obese}</div>
                      <div
                        className="w-[32%] text-[12px] font-black text-right uppercase italic tracking-tight"
                        style={{ color: CATEGORY_COLORS[s.cat] || '#D9FF00' }}
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
          <section className="p-4 rounded-2xl bg-[#1a1a1a] border border-[#222] mb-8">
            <p className="text-[13px] font-black text-[#D9FF00] uppercase tracking-wider mb-5 px-1">HEALTHY BODY METRIC TARGETS</p>
            <div className="bg-[#0a0a0a] border border-zinc-800/50 rounded-xl p-4 shadow-inner overflow-hidden">
              <div className="flex text-[9px] text-[#555] font-black uppercase tracking-tighter border-b border-zinc-800/50 pb-3 mb-4">
                <div className="w-[20%]">METRIC</div>
                <div className="w-[18%] text-center">BMI (WHO)</div>
                <div className="w-[20%] text-center">BAI (18-39)</div>
                <div className="w-[20%] text-center">BAI (40-59)</div>
                <div className="w-[22%] text-right">BAI (60+)</div>
              </div>
              <div className="space-y-5">
                <div className="flex items-center text-white">
                  <div className="w-[20%] text-[11px] font-black">Male</div>
                  <div className="w-[18%] text-[10px] font-bold text-center opacity-90">18.5-24.9</div>
                  <div className="w-[20%] text-[10px] font-bold text-center opacity-90">8%-21%</div>
                  <div className="w-[20%] text-[10px] font-bold text-center opacity-90">11%-23%</div>
                  <div className="w-[22%] text-[10px] font-bold text-right opacity-90">13%-25%</div>
                </div>
                <div className="flex items-center text-white border-t border-zinc-800/30 pt-4">
                  <div className="w-[20%] text-[11px] font-black">Female</div>
                  <div className="w-[18%] text-[10px] font-bold text-center opacity-90">18.5-24.9</div>
                  <div className="w-[20%] text-[10px] font-bold text-center opacity-90">21%-33%</div>
                  <div className="w-[20%] text-[10px] font-bold text-center opacity-90">23%-35%</div>
                  <div className="w-[22%] text-[10px] font-bold text-right opacity-90">25%-38%</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-[#121212] border-t border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap size={16} className="text-[#D9FF00]" fill="#D9FF00" />
          <span className="text-[12px] font-black text-white uppercase tracking-[0.15em]">Auto-Analysis Live</span>
        </div>
        <button
          onClick={onLogout}
          className="p-2.5 rounded-lg border border-[#222] bg-[#111] text-[#666] hover:text-[#E24B4A] hover:border-[#E24B4A]/30 transition-all active:scale-95"
          title="Sign Out"
        >
          <LogOut size={16} strokeWidth={2.5} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
