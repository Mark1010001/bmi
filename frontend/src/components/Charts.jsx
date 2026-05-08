import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, ReferenceLine, ReferenceArea, LabelList
} from 'recharts';

const CATEGORY_COLORS = {
  "Underweight": "#378ADD",
  "Normal":      "#639922",
  "Overweight":  "#BA7517",
  "Obese":       "#E24B4A",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1c2e] border border-[#333] p-3 rounded-lg text-xs shadow-xl">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Charts = ({ activeTab, patterns, chartData, userResults, userMetrics }) => {
  if (!chartData || !patterns) return <div>Loading charts...</div>;

  const renderBMIHistogram = () => {
    // Create bins for BMI
    const bins = Array.from({ length: 18 }, (_, i) => 12 + i * 2);
    const binnedData = bins.map(bin => {
      const count = chartData.filter(d => d.BMI >= bin && d.BMI < bin + 2).length;
      const center = bin + 1;
      let cat = "Normal";
      if (center < 18.5) cat = "Underweight";
      else if (center < 25) cat = "Normal";
      else if (center < 30) cat = "Overweight";
      else cat = "Obese";

      return {
        range: `${bin}-${bin+2}`,
        count,
        category: cat,
        fill: CATEGORY_COLORS[cat]
      };
    });

    return (
      <div className="h-[340px] w-full">
        <p className="text-center text-sm font-medium mb-4">BMI Distribution — 50 Users</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={binnedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} label={{ value: 'BMI', position: 'insideBottom', offset: -5, fill: '#888', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} label={{ value: 'Users', angle: -90, position: 'insideLeft', fill: '#888', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Users" radius={[4, 4, 0, 0]}>
              {binnedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.85} />
              ))}
            </Bar>
            <ReferenceLine x="18.5-20" stroke="#666" strokeDasharray="3 3" label={{ position: 'top', value: '18.5', fill: '#888', fontSize: 9 }} />
            <ReferenceLine x="24-26" stroke="#666" strokeDasharray="3 3" label={{ position: 'top', value: '25', fill: '#888', fontSize: 9 }} />
            <ReferenceLine x="30-32" stroke="#666" strokeDasharray="3 3" label={{ position: 'top', value: '30', fill: '#888', fontSize: 9 }} />
            {userResults && (
              <ReferenceLine x={`${Math.floor(userResults.bmi/2)*2}-${Math.floor(userResults.bmi/2)*2+2}`} stroke="white" strokeWidth={2} label={{ position: 'top', value: `Your BMI: ${userResults.bmi}`, fill: 'white', fontSize: 11 }} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderBAIHistogram = () => {
    const bins = Array.from({ length: 19 }, (_, i) => 5 + i * 3);
    const binnedData = bins.map(bin => {
      const count = chartData.filter(d => d.BAI >= bin && d.BAI < bin + 3).length;
      const center = bin + 1.5;
      let cat = "Normal";
      if (center < 8) cat = "Underweight";
      else if (center < 21) cat = "Normal";
      else if (center < 26) cat = "Overweight";
      else cat = "Obese";

      return {
        range: `${bin}-${bin+3}`,
        count,
        category: cat,
        fill: CATEGORY_COLORS[cat]
      };
    });

    const normalRanges = {
        'Male': [8, 21],
        'Female': [21, 33]
    };
    const [normLow, normHigh] = normalRanges[userMetrics.gender] || [8, 21];

    return (
      <div className="h-[340px] w-full">
        <p className="text-center text-sm font-medium mb-4">BAI Distribution — 50 Users (Body Fat %)</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={binnedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} label={{ value: 'BAI (Body Fat %)', position: 'insideBottom', offset: -5, fill: '#888', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} label={{ value: 'Users', angle: -90, position: 'insideLeft', fill: '#888', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Users" radius={[4, 4, 0, 0]}>
              {binnedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.82} />
              ))}
            </Bar>
            {userResults && (
              <ReferenceLine x={`${Math.floor(userResults.bai/3)*3}-${Math.floor(userResults.bai/3)*3+3}`} stroke="white" strokeWidth={2} label={{ position: 'top', value: `Your BAI: ${userResults.bai}%`, fill: 'white', fontSize: 11 }} />
            )}
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-[10px] text-[#639922] mt-2">Normal BAI range for {userMetrics.gender}: {normLow}% – {normHigh}% body fat</p>
      </div>
    );
  };

  const renderAvgBMIByAge = () => {
    const data = Object.entries(patterns.avg_bmi_by_age).map(([age, bmi]) => ({
      age,
      bmi,
      fill: bmi < 18.5 ? CATEGORY_COLORS.Underweight : (bmi < 25 ? CATEGORY_COLORS.Normal : (bmi < 30 ? CATEGORY_COLORS.Overweight : CATEGORY_COLORS.Obese))
    }));

    return (
      <div className="h-[340px] w-full">
        <p className="text-center text-sm font-medium mb-4">Average BMI by Age Group</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} domain={[0, 'dataMax + 5']} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="bmi" name="Avg BMI" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.85} />
              ))}
              <LabelList dataKey="bmi" position="top" fill="white" fontSize={12} />
            </Bar>
            <ReferenceArea y1={18.5} y2={25} fill="#639922" fillOpacity={0.07} label={{ value: 'Normal range', position: 'insideTopLeft', fill: '#639922', fontSize: 10 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderAgeVSBMI = () => {
    const data = chartData.map(d => ({
      age: d.Age,
      bmi: d.BMI,
      category: d.Risk_Category,
      fill: CATEGORY_COLORS[d.Risk_Category] || '#fff'
    }));

    return (
      <div className="h-[340px] w-full">
        <p className="text-center text-sm font-medium mb-4">Age vs BMI — Scatter Plot</p>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis type="number" dataKey="age" name="Age" unit="" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} domain={[18, 70]} />
            <YAxis type="number" dataKey="bmi" name="BMI" unit="" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Scatter name="Users" data={data}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="#0e1117" strokeWidth={0.5} />
              ))}
            </Scatter>
            {userResults && (
              <Scatter
                name="You"
                data={[{ age: userMetrics.age, bmi: userResults.bmi }]}
                fill="white"
                shape="star"
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderRiskDisparity = () => {
    const raceColors = {
      "White/Other": "#7ec8e3",
      "Asian":       "#f4a261",
      "Black":       "#a29bfe",
    };

    const data = patterns.disparity_by_race.map(d => ({
        race: d.Race,
        count: d.Reclassified_Count,
        fill: raceColors[d.Race] || "#aaa"
    }));

    return (
      <div className="h-[340px] w-full">
        <p className="text-center text-sm font-medium mb-4">Risk Disparity: Normal → High Risk Under Ethnic Thresholds</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis dataKey="race" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} domain={[0, 'dataMax + 3']} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Reclassified Users" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.88} />
              ))}
              <LabelList dataKey="count" position="top" fill="white" fontSize={13} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  switch (activeTab) {
    case 'BMI Distribution': return renderBMIHistogram();
    case 'BAI Distribution': return renderBAIHistogram();
    case 'Avg BMI by Age': return renderAvgBMIByAge();
    case 'Age vs BMI + Trend': return renderAgeVSBMI();
    case 'Risk Disparity': return renderRiskDisparity();
    default: return null;
  }
};

export default Charts;
