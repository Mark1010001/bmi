import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';

const API_BASE = 'http://localhost:8000/api';

function App() {
  const [activeStandard, setActiveStandard] = useState('Global WHO Standard');
  const [populationData, setPopulationData] = useState(null);
  const [userResults, setUserResults] = useState(null);
  const [metrics, setMetrics] = useState({
    gender: 'Male',
    age: 25,
    weight: 70,
    height: 170,
    hip_cm: 95
  });

  const fetchPopulationData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/data`);
      setPopulationData(response.data);
    } catch (error) {
      console.error('Error fetching population data:', error);
    }
  };

  const calculateMetrics = async (currentMetrics, currentStandard) => {
    try {
      const response = await axios.post(`${API_BASE}/calculate`, {
        ...currentMetrics,
        active_standard: currentStandard
      });
      setUserResults(response.data);
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  useEffect(() => {
    fetchPopulationData();
  }, []);

  useEffect(() => {
    calculateMetrics(metrics, activeStandard);
  }, [metrics, activeStandard]);

  return (
    <div className="flex min-h-screen bg-[#0e1117] text-[#ccc] font-sans">
      <Sidebar activeStandard={activeStandard} setActiveStandard={setActiveStandard} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🏥 BMI Health Risk Classifier</h1>
            <p className="text-[#888]">
              KDD-powered health dashboard · v5 · BMI + BAI dual-metric ·
              WHO standards · Ethnic-specific thresholds · Interactive charts
            </p>
            <div className="border-b border-[#2a2a3e] mt-4"></div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <Calculator
                metrics={metrics}
                setMetrics={setMetrics}
                results={userResults}
                activeStandard={activeStandard}
                populationPatterns={populationData?.patterns}
              />
            </div>

            <div className="lg:col-span-3">
              {populationData && (
                <Dashboard
                  data={populationData}
                  userResults={userResults}
                  userMetrics={metrics}
                />
              )}
            </div>
          </div>

          <footer className="mt-12 pt-8 border-t border-[#2a2a3e]">
            <p className="text-[12px] text-[#888] mb-4">
              KDD Pipeline: Step 1 Collection &gt; Step 2 Cleaning &gt; Step 3 Transformation &gt;
              Step 4 Mining &gt; Step 5 Visualization  |
              WHO BMI Standards · Asian Clinical 2026 · Bergman BAI Formula
            </p>
            <div className="bg-[#12122a] border border-[#2a2a3e] rounded-xl p-4 text-[13px] text-[#999] leading-relaxed">
              <b className="text-[#a29bfe]">Clinical Disclaimer</b><br />
              BMI thresholds for Asian populations (Overweight ≥ 23.0, Obese ≥ 27.5) are based on
              <b>2025-2026 cardiometabolic risk studies</b> and WHO Expert Consultation guidelines.
              BAI (Body Adiposity Index) formula and gender-specific healthy ranges are based on
              <b>Bergman et al. (2011), Obesity Journal</b>. Both metrics are screening tools only
              and do not constitute medical advice. Always consult a qualified healthcare professional.
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
