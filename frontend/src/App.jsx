import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
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
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      <Sidebar
        metrics={metrics}
        setMetrics={setMetrics}
        results={userResults}
        activeStandard={activeStandard}
        setActiveStandard={setActiveStandard}
      />

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {populationData && (
          <Dashboard
            data={populationData}
            userResults={userResults}
            userMetrics={metrics}
          />
        )}
      </main>
    </div>
  );
}

export default App;
