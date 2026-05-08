import React from 'react';
import { ChevronDown, Info, Star, CheckCircle, AlertTriangle } from 'lucide-react';

const CATEGORY_COLORS = {
  "Underweight": "#378ADD",
  "Normal":      "#639922",
  "Overweight":  "#BA7517",
  "Obese":       "#E24B4A",
};

const Calculator = ({ metrics, setMetrics, results, activeStandard, populationPatterns }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetrics(prev => ({
      ...prev,
      [name]: name === 'gender' ? value : parseFloat(value)
    }));
  };

  if (!results) return <div className="text-white">Loading results...</div>;

  const bmiColor = CATEGORY_COLORS[results.bmi_category];
  const baiColor = CATEGORY_COLORS[results.bai_category];
  const standardShort = activeStandard === 'Global WHO Standard' ? 'Global WHO' : 'Asian 2026';
  const standardColor = activeStandard === 'Global WHO Standard' ? '#639922' : '#f4a261';

  // Benchmark logic
  let benchMsg = "";
  let benchSub = "";
  let benchColor = "#aaa";

  if (populationPatterns) {
    const avg = populationPatterns.overall_avg_bmi;
    const diff = results.bmi - avg;
    const diffPct = Math.abs((diff / avg) * 100).toFixed(1);

    if (diff < 0) {
      benchMsg = `You are ${diffPct}% healthier than the dataset average`;
      benchSub = `Your BMI (${results.bmi}) is ${Math.abs(diff).toFixed(1)} below the avg (${avg})`;
      benchColor = "#639922";
    } else if (diff === 0) {
      benchMsg = `Your BMI exactly matches the dataset average (${avg})`;
      benchSub = "You're right at the population mean";
      benchColor = "#aaa";
    } else {
      benchMsg = `Your BMI is ${diffPct}% above the dataset average`;
      benchSub = `Your BMI (${results.bmi}) is ${diff.toFixed(1)} above the avg (${avg})`;
      benchColor = "#BA7517";
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h3 className="text-xl font-bold text-white mb-4">Your BMI + BAI Calculator</h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <div className="flex gap-4">
              {['Male', 'Female'].map(g => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={metrics.gender === g}
                    onChange={handleChange}
                    className="accent-[#a78bfa]"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          {[
            { name: 'age', label: 'Age', min: 10, max: 100, step: 1 },
            { name: 'weight', label: 'Weight (kg)', min: 30, max: 200, step: 0.5 },
            { name: 'height', label: 'Height (cm)', min: 100, max: 220, step: 1 },
            { name: 'hip_cm', label: 'Hip Circumference (cm)', min: 60, max: 160, step: 1 },
          ].map(slider => (
            <div key={slider.name}>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">{slider.label}</label>
                <span className="text-sm text-white font-bold">{metrics[slider.name]}</span>
              </div>
              <input
                type="range"
                name={slider.name}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={metrics[slider.name]}
                onChange={handleChange}
                className="w-full h-2 bg-[#2a2a3e] rounded-lg appearance-none cursor-pointer accent-[#a78bfa]"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-[#2a2a3e] pt-4"></div>

      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card" style={{ borderColor: bmiColor }}>
          <p className="metric-label">BMI</p>
          <p className="metric-value" style={{ color: bmiColor }}>{results.bmi}</p>
          <p className="mt-1 text-sm text-[#ccc]">
            {results.advice.emoji} {results.bmi_category}
          </p>
          <p className="mt-1 text-[11px]" style={{ color: standardColor }}>{standardShort}</p>
        </div>
        <div className="metric-card" style={{ borderColor: baiColor }}>
          <p className="metric-label">BAI (Body Fat %)</p>
          <p className="metric-value" style={{ color: baiColor }}>{results.bai}%</p>
          <p className="mt-1 text-sm text-[#ccc]">
            {results.advice.emoji} {results.bai_category}
          </p>
          <p className="mt-1 text-[11px] text-[#a78bfa]">{metrics.gender} standard</p>
        </div>
      </div>

      {results.bmi_category === results.bai_category ? (
        <div className="agree-badge bg-[#6399221f] border border-[#639922] text-[#639922] flex items-center gap-2 justify-center">
          <CheckCircle size={16} />
          <span><b>BMI and BAI agree</b> — both classify you as <b>{results.bmi_category}</b>.</span>
        </div>
      ) : (
        <div className="agree-badge bg-[#ba75171f] border border-[#BA7517] text-[#BA7517] flex items-center gap-2 justify-center">
          <AlertTriangle size={16} />
          <span>⚠️ <b>BMI and BAI disagree.</b> BMI says <b>{results.bmi_category}</b>, BAI says <b>{results.bai_category}</b>.</span>
        </div>
      )}

      {/* Comparison Table */}
      <div className="mt-4">
        <p className="text-[12px] text-[#888] uppercase tracking-wider mb-2">
          Your BMI {results.bmi} — Standard Comparison
        </p>
        <div className="overflow-hidden rounded-xl border border-[#2a2a3e]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0d0d1f] text-[11px] uppercase text-[#666]">
                <th className="p-3 text-left">Standard</th>
                <th className="p-3 text-center">Overweight Cutoff</th>
                <th className="p-3 text-center">Obese Cutoff</th>
                <th className="p-3 text-center">Your Category</th>
              </tr>
            </thead>
            <tbody className="text-[13px]">
              <tr className={`${activeStandard === 'Global WHO Standard' ? 'bg-[#1a1a30] border-l-4 border-l-[#639922]' : 'bg-[#13131f]'} border-t border-[#2a2a3e]`}>
                <td className={`p-3 ${activeStandard === 'Global WHO Standard' ? 'text-white font-bold' : 'text-[#aaa]'}`}>
                  Global WHO {activeStandard === 'Global WHO Standard' && '(Active)'}
                </td>
                <td className="p-3 text-center text-[#ccc]">BMI ≥ 25.0</td>
                <td className="p-3 text-center text-[#ccc]">BMI ≥ 30.0</td>
                <td className="p-3 text-center">
                   <span className="px-2 py-1 rounded-md text-[12px] font-bold" style={{ backgroundColor: `${CATEGORY_COLORS[results.bmi_category]}22`, color: CATEGORY_COLORS[results.bmi_category], border: `1px solid ${CATEGORY_COLORS[results.bmi_category]}` }}>
                    {results.bmi_category}
                   </span>
                </td>
              </tr>
              <tr className={`${activeStandard === 'Asian Clinical Standard' ? 'bg-[#1a1a30] border-l-4 border-l-[#f4a261]' : 'bg-[#13131f]'} border-t border-[#2a2a3e]`}>
                <td className={`p-3 ${activeStandard === 'Asian Clinical Standard' ? 'text-white font-bold' : 'text-[#aaa]'}`}>
                  Asian Clinical {activeStandard === 'Asian Clinical Standard' && '(Active)'}
                </td>
                <td className="p-3 text-center text-[#ccc]">BMI ≥ 23.0</td>
                <td className="p-3 text-center text-[#ccc]">BMI ≥ 27.5</td>
                <td className="p-3 text-center">
                   <span className="px-2 py-1 rounded-md text-[12px] font-bold" style={{ backgroundColor: `${CATEGORY_COLORS[results.bmi_category]}22`, color: CATEGORY_COLORS[results.bmi_category], border: `1px solid ${CATEGORY_COLORS[results.bmi_category]}` }}>
                    {results.bmi_category}
                   </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Banner */}
      <div className={`risk-banner ${results.age_band === 'Senior' && results.bmi_category === 'Obese' ? 'bg-[#e24b4a26] border-2 border-[#E24B4A]' : 'bg-white/5 border border-[#2a2a3e]'}`}>
        <strong style={{ color: results.risk_data.color }}>Risk Probability: {results.risk_data.level}</strong><br />
        <span className="text-[#ccc] text-[13px]">
          Estimated complication risk for <b>{results.age_band}</b> / <b>{results.bmi_category}</b>:
          <b style={{ color: results.risk_data.color }}> {Math.round(results.risk_data.prob * 100)}%</b> (2026 benchmarks)
        </span>
      </div>

      {/* Benchmark Card */}
      <div className="benchmark-card" style={{ borderColor: benchColor }}>
        <p className="metric-label">Population Benchmark</p>
        <p className="text-[15px] text-[#eee] mt-2 mb-1" dangerouslySetInnerHTML={{ __html: benchMsg }}></p>
        <p className="text-[12px] text-[#888]">{benchSub}</p>
      </div>

      {/* Health Advice */}
      <div className="mt-4">
        <p className="italic text-[#ccc] mb-4">" {results.advice.summary} "</p>

        <div className="mb-4">
          <p className="section-title">Nutrition</p>
          <ul className="list-disc list-inside text-sm text-[#ccc] flex flex-col gap-1">
            {results.advice.nutrition.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>

        <div className="mb-4">
          <p className="section-title">Activity</p>
          <ul className="list-disc list-inside text-sm text-[#ccc] flex flex-col gap-1">
            {results.advice.activity.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>

        <div className="advice-card" style={{ borderLeftColor: bmiColor }}>
          <p className="section-title mb-1">Medical Note</p>
          <p className="text-sm text-[#ccc]">{results.advice.medical}</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
