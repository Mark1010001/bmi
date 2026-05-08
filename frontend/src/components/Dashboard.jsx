import React, { useState } from 'react';
import Charts from './Charts';

const Dashboard = ({ data, userResults, userMetrics }) => {
  const [activeTab, setActiveTab] = useState('BMI Distribution');
  const { patterns, sample, chart_data } = data;

  const CATEGORY_COLORS = {
    "Underweight": "#378ADD",
    "Normal":      "#639922",
    "Overweight":  "#BA7517",
    "Obese":       "#E24B4A",
  };

  const tabs = [
    "BMI Distribution",
    "BAI Distribution",
    "Avg BMI by Age",
    "Age vs BMI + Trend",
    "Risk Disparity",
  ];

  const categories = ["Underweight", "Normal", "Overweight", "Obese"];

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-xl font-bold text-white mb-4">Population Patterns Dashboard</h3>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Users', value: patterns.total_users },
          { label: 'Avg BMI', value: patterns.overall_avg_bmi },
          { label: 'Avg BAI', value: `${patterns.overall_avg_bai}%`, color: '#a78bfa' },
          { label: 'Std Dev', value: patterns.bmi_std },
          { label: 'BMI=BAI Agree', value: `${Math.round(patterns.agreement_count / patterns.total_users * 100)}%`, color: '#639922' },
        ].map((kpi, i) => (
          <div key={i} className="metric-card">
            <p className="metric-label">{kpi.label}</p>
            <p className="metric-value" style={{ color: kpi.color || 'white', fontSize: i === 4 ? '20px' : '26px' }}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div>
        <p className="section-title">Risk category breakdown (BMI standard)</p>
        <div className="grid grid-cols-4 gap-4">
          {categories.map(cat => {
            const count = patterns.category_counts[cat] || 0;
            const pct = Math.round((count / patterns.total_users) * 100);
            return (
              <div key={cat} className="text-center">
                <div className="h-1.5 w-full bg-[#1c1c2e] rounded-full mb-2 overflow-hidden">
                   <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat] }}
                   />
                </div>
                <p className="text-[11px] text-[#888]">{cat}</p>
                <p className="text-lg font-bold" style={{ color: CATEGORY_COLORS[cat] }}>{count}</p>
                <p className="text-[11px] text-[#666]">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disparity Insight */}
      <div className="disparity-banner">
        <b className="text-[#a29bfe]">Risk Disparity Insight:</b>
        &nbsp;<b className="text-white">{patterns.disparity_count} out of {patterns.total_users} users</b>
        &nbsp;are classified as <b>'Normal'</b> under WHO standard but
        &nbsp;<b>'High Risk'</b> under ethnic-adjusted thresholds.
        &nbsp;|&nbsp;
        <b className="text-[#639922]">{patterns.agreement_count} users</b>
        &nbsp;get the same category from both BMI and BAI.
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-[#2a2a3e] mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                activeTab === tab ? 'text-white border-[#a78bfa]' : 'text-[#888] border-transparent hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          <Charts
            activeTab={activeTab}
            patterns={patterns}
            chartData={chart_data}
            userResults={userResults}
            userMetrics={userMetrics}
          />
        </div>
      </div>

      {/* Sample Data */}
      <details className="mt-4 group">
        <summary className="text-sm font-medium text-[#888] cursor-pointer hover:text-white transition-colors">
          View Sample Dataset (first 15 rows)
        </summary>
        <div className="mt-4 overflow-x-auto rounded-xl border border-[#2a2a3e]">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#0d0d1f] text-[#666] uppercase">
                {["Age", "Gender", "Race", "Height_m", "Weight_kg", "Hip_cm", "BMI", "BAI", "Risk_Category", "BAI_Category"].map(h => (
                  <th key={h} className="p-3 text-left border-b border-[#2a2a3e]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sample.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 border-b border-[#2a2a3e]">
                  {["Age", "Gender", "Race", "Height_m", "Weight_kg", "Hip_cm", "BMI", "BAI", "Risk_Category", "BAI_Category"].map(col => (
                    <td key={col} className="p-3">{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
};

export default Dashboard;
