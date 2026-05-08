import React from 'react';
import { Minus, Plus, Zap, Activity } from 'lucide-react';

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
      <div className="sidebar-label">{label} {unit && `(${unit})`}</div>
      <div className="input-container h-12">
        <button onClick={decrement} className="input-btn w-14 border-r border-[#222]">
          <Minus size={16} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="input-field text-lg"
        />
        <button onClick={increment} className="input-btn w-14 border-l border-[#222]">
          <Plus size={16} />
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
    <aside className="w-[380px] h-screen bg-[#080808] border-r border-[#1a1a1a] flex flex-col shrink-0">
      {/* Branding Area */}
      <div className="p-8 pb-6 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-[#d4f01e] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,240,30,0.3)]">
            <Activity size={24} className="text-black" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter leading-none">HealthAnalytics</h1>
            <p className="text-[10px] font-extrabold text-[#444] tracking-[0.2em] uppercase mt-1">Classification Engine</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="flex flex-col gap-10">

          {/* Configuration Section */}
          <section>
            <div className="section-header">
              <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
              <h2 className="text-[11px] font-black text-white uppercase tracking-widest">BODY METRICS</h2>
            </div>

            <div className="mb-8">
              <div className="sidebar-label">SELECT YOUR BMI STANDARD</div>
              <div className="flex flex-col gap-2">
                {standards.map(std => (
                  <button
                    key={std.id}
                    onClick={() => setActiveStandard(std.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                      activeStandard === std.id
                        ? 'border-brand bg-brand/5 text-white shadow-[0_0_10px_rgba(212,240,30,0.1)]'
                        : 'border-[#1a1a1a] bg-[#0d0d0d] text-[#555] hover:border-[#333]'
                    }`}
                  >
                    <span className="text-xs font-bold">{std.label}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${activeStandard === std.id ? 'border-brand' : 'border-[#333]'}`}>
                      {activeStandard === std.id && <div className="w-2 h-2 rounded-full bg-brand"></div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="sidebar-label">GENDER</div>
              <div className="flex gap-2">
                {['Male', 'Female'].map(g => (
                  <button
                    key={g}
                    onClick={() => handleMetricChange('gender', g)}
                    className={`flex-1 p-3 rounded-lg border text-xs font-bold uppercase transition-all ${
                      metrics.gender === g
                        ? 'border-brand bg-brand/5 text-brand'
                        : 'border-[#1a1a1a] bg-[#0d0d0d] text-[#555]'
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
            <section className="p-4 rounded-xl bg-[#111] border border-[#1a1a1a]">
              <p className="sidebar-label mb-4">LIVE CALCULATION RESULTS</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[9px] font-black text-[#555] uppercase tracking-wider mb-1">YOUR BMI</p>
                  <p className="text-4xl font-black text-white tracking-tighter leading-none">{results.bmi}</p>
                  <p className="text-[10px] font-black mt-2 uppercase tracking-widest" style={{ color: CATEGORY_COLORS[results.bmi_category] }}>
                    {results.bmi_category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-[#555] uppercase tracking-wider mb-1">YOUR BAI</p>
                  <p className="text-4xl font-black text-purple-400 tracking-tighter leading-none">{results.bai}%</p>
                  <p className="text-[10px] font-black mt-2 uppercase tracking-widest" style={{ color: CATEGORY_COLORS[results.bai_category] }}>
                    {results.bai_category}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Comparison Table */}
          {results && (
            <section className="p-4 rounded-xl bg-[#111] border border-[#1a1a1a]">
              <p className="text-[9px] font-black text-[#555] uppercase tracking-widest mb-4">
                Your BMI {results.bmi} — Standard Comparison
              </p>
              <div className="overflow-hidden">
                <table className="w-full text-[9px] border-collapse">
                  <thead>
                    <tr className="text-[#333] font-black uppercase border-b border-[#222]">
                      <th className="pb-2 text-left">Standard</th>
                      <th className="pb-2 text-center">Overweight</th>
                      <th className="pb-2 text-center">Obese</th>
                      <th className="pb-2 text-right">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {[
                      { name: 'Global WHO', over: '25.0+', obese: '30.0+', cat: results.global_bmi_category },
                      { name: 'Asian Clinical', over: '23.0+', obese: '27.5+', cat: results.asian_bmi_category }
                    ].map(s => (
                      <tr key={s.name}>
                        <td className="py-3 font-bold text-white">{s.name}</td>
                        <td className="py-3 text-center text-[#444]">{s.over}</td>
                        <td className="py-3 text-center text-[#444]">{s.obese}</td>
                        <td className="py-3 text-right font-black uppercase" style={{ color: CATEGORY_COLORS[s.cat] }}>{s.cat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Reference Tables */}
          <section className="p-4 rounded-xl bg-[#111] border border-[#1a1a1a] mb-8">
            <p className="sidebar-label mb-4">HEALTHY BODY METRIC TARGETS</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px] border-collapse">
                <thead>
                  <tr className="text-[#333] font-black uppercase border-b border-[#222]">
                    <th className="pb-2 text-left">Metric</th>
                    <th className="pb-2 text-center whitespace-nowrap px-1">BMI (WHO)</th>
                    <th className="pb-2 text-center whitespace-nowrap px-1">BAI (18-39)</th>
                    <th className="pb-2 text-center whitespace-nowrap px-1">BAI (40-59)</th>
                    <th className="pb-2 text-right whitespace-nowrap px-1">BAI (60+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  <tr className="text-[#888]">
                    <td className="py-3 font-bold text-white">Male</td>
                    <td className="py-3 text-center whitespace-nowrap px-1">18.5-24.9</td>
                    <td className="py-3 text-center whitespace-nowrap px-1">8%-21%</td>
                    <td className="py-3 text-center whitespace-nowrap px-1">11%-23%</td>
                    <td className="py-3 text-right whitespace-nowrap px-1">13%-25%</td>
                  </tr>
                  <tr className="text-[#888]">
                    <td className="py-3 font-bold text-white">Female</td>
                    <td className="py-3 text-center whitespace-nowrap px-1">18.5-24.9</td>
                    <td className="py-3 text-center whitespace-nowrap px-1">21%-33%</td>
                    <td className="py-3 text-center whitespace-nowrap px-1">23%-35%</td>
                    <td className="py-3 text-right whitespace-nowrap px-1">25%-38%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-[#0a0a0a] border-t border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-brand" />
          <span className="text-[9px] font-black text-[#444] uppercase tracking-widest">Auto-Mining Active</span>
        </div>
        <span className="text-[9px] font-black text-[#222] uppercase">v5.2.0-core</span>
      </div>
    </aside>
  );
};

export default Sidebar;
