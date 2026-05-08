import React from 'react';
import { Minus, Plus, Zap } from 'lucide-react';

const CATEGORY_COLORS = {
  "Underweight": "#378ADD",
  "Normal":      "#d4f01e", // Matching brand color for normal
  "Overweight":  "#BA7517",
  "Obese":       "#E24B4A",
};

const NumberInput = ({ label, value, onChange, min, max, step = 1, unit = "" }) => {
  const increment = () => onChange(Math.min(max, value + step));
  const decrement = () => onChange(Math.max(min, value - step));

  return (
    <div className="mb-4">
      <div className="sidebar-label">{label} {unit && `(${unit})`}</div>
      <div className="input-container">
        <button onClick={decrement} className="input-btn border-r border-[#222]">
          <Minus size={14} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="input-field"
        />
        <button onClick={increment} className="input-btn border-l border-[#222]">
          <Plus size={14} />
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
    <aside className="w-[320px] h-screen overflow-y-auto bg-[#0d0d0d] border-r border-[#222] p-5 flex flex-col gap-6 shrink-0 custom-scrollbar">
      {/* Logo Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-[#d4f01e] rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-black rounded-sm transform rotate-45"></div>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">HealthAnalytics</h1>
        <div className="h-6 w-px bg-[#222] mx-1"></div>
        <span className="text-[10px] font-bold text-[#444] leading-tight">BMI HEALTH RISK<br/>CLASSIFIER</span>
      </div>

      {/* Body Metrics Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-[#d4f01e]"></div>
          <h2 className="sidebar-label mb-0">Body Metrics</h2>
        </div>

        <div className="mb-6">
          <div className="sidebar-label">Select Your BMI Standard</div>
          {standards.map(std => (
            <div
              key={std.id}
              onClick={() => setActiveStandard(std.id)}
              className={`standard-radio ${activeStandard === std.id ? 'active' : ''}`}
            >
              <input
                type="radio"
                checked={activeStandard === std.id}
                readOnly
              />
              <span className={`text-[12px] font-bold ${activeStandard === std.id ? 'text-white' : 'text-[#666]'}`}>
                {std.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="sidebar-label">Gender</div>
          <div className="flex gap-2">
            <button
              onClick={() => handleMetricChange('gender', 'Male')}
              className={`toggle-btn rounded-l-md ${metrics.gender === 'Male' ? 'active' : ''}`}
            >
              ♂ Male
            </button>
            <button
              onClick={() => handleMetricChange('gender', 'Female')}
              className={`toggle-btn rounded-r-md ${metrics.gender === 'Female' ? 'active' : ''}`}
            >
              ♀ Female
            </button>
          </div>
        </div>

        <NumberInput
          label="Age"
          value={metrics.age}
          onChange={(v) => handleMetricChange('age', v)}
          min={10} max={100}
        />
        <NumberInput
          label="Weight"
          unit="kg"
          value={metrics.weight}
          onChange={(v) => handleMetricChange('weight', v)}
          min={30} max={200} step={0.5}
        />
        <NumberInput
          label="Height"
          unit="cm"
          value={metrics.height}
          onChange={(v) => handleMetricChange('height', v)}
          min={100} max={220}
        />
        <NumberInput
          label="Hip"
          unit="cm"
          value={metrics.hip_cm}
          onChange={(v) => handleMetricChange('hip_cm', v)}
          min={60} max={160}
        />
      </section>

      {/* Live Results Section */}
      {results && (
        <section className="panel-card p-4 border-[#d4f01e22]">
          <div className="sidebar-label text-brand mb-3">Live Calculation Results</div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-[10px] text-[#666] font-bold uppercase mb-1">Your BMI</div>
              <div className="text-2xl font-bold text-white leading-none">{results.bmi}</div>
              <div className="text-[10px] font-bold mt-1" style={{ color: CATEGORY_COLORS[results.bmi_category] }}>
                {results.bmi_category.toUpperCase()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#666] font-bold uppercase mb-1">Your BAI</div>
              <div className="text-2xl font-bold text-[#a78bfa] leading-none">{results.bai}%</div>
              <div className="text-[10px] font-bold mt-1" style={{ color: CATEGORY_COLORS[results.bai_category] }}>
                {results.bai_category.toUpperCase()}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Comparison Table */}
      {results && (
        <section className="panel-card p-0 overflow-hidden">
          <div className="p-3 pb-0">
            <div className="text-[10px] text-[#666] font-bold uppercase">Your BMI {results.bmi} — Standard Comparison</div>
          </div>
          <table className="w-full mt-2 text-[9px]">
            <thead>
              <tr className="border-b border-[#222] text-[#444] uppercase font-bold">
                <th className="p-2 text-left">Standard</th>
                <th className="p-2 text-center">Overweight</th>
                <th className="p-2 text-center">Obese</th>
                <th className="p-2 text-right">Category</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b border-[#222] ${activeStandard.includes('Global') ? 'bg-[#d4f01e05]' : ''}`}>
                <td className="p-2 text-white font-bold">Global WHO</td>
                <td className="p-2 text-center text-[#666]">25.0+</td>
                <td className="p-2 text-center text-[#666]">30.0+</td>
                <td className="p-2 text-right font-bold" style={{ color: CATEGORY_COLORS[results.global_bmi_category] }}>
                  {results.global_bmi_category.toUpperCase()}
                </td>
              </tr>
              <tr className={`${activeStandard.includes('Asian') ? 'bg-[#d4f01e05]' : ''}`}>
                <td className="p-2 text-white font-bold">Asian Clinical</td>
                <td className="p-2 text-center text-[#666]">23.0+</td>
                <td className="p-2 text-center text-[#666]">27.5+</td>
                <td className="p-2 text-right font-bold" style={{ color: CATEGORY_COLORS[results.asian_bmi_category] }}>
                  {results.asian_bmi_category.toUpperCase()}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* Reference Table */}
      <section className="panel-card p-0 overflow-hidden mt-auto">
        <div className="p-3 pb-0">
          <div className="sidebar-label mb-2">Healthy Body Metric Targets</div>
        </div>
        <table className="w-full text-[9px] border-collapse">
          <thead>
            <tr className="bg-[#0d0d0d] text-[#444] font-bold border-y border-[#222] uppercase">
              <th className="p-1.5 text-left">Metric</th>
              <th className="p-1.5 text-center">BMI (WHO)</th>
              <th className="p-1.5 text-center">BAI (18-39)</th>
              <th className="p-1.5 text-center">BAI (40-59)</th>
              <th className="p-1.5 text-center">BAI (60+)</th>
            </tr>
          </thead>
          <tbody className="text-[#888]">
            <tr className="border-b border-[#222]">
              <td className="p-1.5 font-bold text-white">Male</td>
              <td className="p-1.5 text-center">18.5-24.9</td>
              <td className="p-1.5 text-center">8%-21%</td>
              <td className="p-1.5 text-center">11%-23%</td>
              <td className="p-1.5 text-center">13%-25%</td>
            </tr>
            <tr>
              <td className="p-1.5 font-bold text-white">Female</td>
              <td className="p-1.5 text-center">18.5-24.9</td>
              <td className="p-1.5 text-center">21%-33%</td>
              <td className="p-1.5 text-center">23%-35%</td>
              <td className="p-1.5 text-center">25%-38%</td>
            </tr>
          </tbody>
        </table>
      </section>

      <div className="flex items-center gap-2 text-[#444] text-[10px] font-bold uppercase tracking-wider pb-2">
        <Zap size={12} className="text-[#d4f01e]" />
        Auto-Analysis Live
      </div>
    </aside>
  );
};

export default Sidebar;
