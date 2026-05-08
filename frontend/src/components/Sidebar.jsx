import React from 'react';

const Sidebar = ({ activeStandard, setActiveStandard }) => {
  const standards = [
    {
      id: 'Global WHO Standard',
      label: 'Global WHO Standard',
      help: 'Global WHO: Overweight ≥ 25, Obese ≥ 30.',
      details: (
        <div className="bg-[#1c1c2e] border border-[#2a2a3e] rounded-lg p-3 mt-1 text-[13px] text-[#ccc]">
          <b className="text-[#639922]">Global WHO Thresholds</b><br />
          Normal &nbsp;&nbsp;&nbsp;&nbsp;: 18.5 – 24.9<br />
          Overweight : 25.0 – 29.9<br />
          Obese &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ≥ 30.0<br /><br />
          <span className="text-[#666] text-[12px]">Applies to: White / Other populations</span>
        </div>
      )
    },
    {
      id: 'Asian Clinical Standard',
      label: 'Asian Clinical Standard',
      help: 'Asian Clinical (2026): Overweight ≥ 23, Obese ≥ 27.5.',
      details: (
        <div className="bg-[#1c1c2e] border border-[#3a3a5e] rounded-lg p-3 mt-1 text-[13px] text-[#ccc]">
          <b className="text-[#f4a261]">Asian Clinical Thresholds (2026)</b><br />
          Normal &nbsp;&nbsp;&nbsp;&nbsp;: 18.5 – 22.9<br />
          Overweight : 23.0 – 27.4<br />
          Obese &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ≥ 27.5<br /><br />
          <span className="text-[#666] text-[12px]">Applies to: Asian & Black populations</span>
        </div>
      )
    }
  ];

  return (
    <div className="w-64 min-h-screen bg-[#0e1117] border-r border-[#2a2a3e] p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">User Settings</h2>
        <div className="border-t border-[#2a2a3e] pt-4">
          <p className="font-bold mb-3">Select Your BMI Standard</p>
          <div className="flex flex-col gap-3">
            {standards.map((std) => (
              <label key={std.id} className="flex flex-col cursor-pointer group">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="standard"
                    checked={activeStandard === std.id}
                    onChange={() => setActiveStandard(std.id)}
                    className="accent-[#a78bfa]"
                  />
                  <span className={`text-sm ${activeStandard === std.id ? 'text-white font-medium' : 'text-[#888]'}`}>
                    {std.label}
                  </span>
                </div>
                {activeStandard === std.id && std.details}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#2a2a3e] pt-4">
        <div className="bg-[#1c1c2e] border border-[#2a2a3e] rounded-lg p-3 text-[13px] text-[#ccc]">
          <b className="text-[#a78bfa]">BAI Healthy Ranges</b><br />
          <b>Male:</b> Normal = 8 – 21% body fat<br />
          <b>Female:</b> Normal = 21 – 33% body fat<br /><br />
          <span className="text-[#666] text-[12px]">Source: Bergman et al. (2011)</span>
        </div>
      </div>

      <div className="mt-auto border-t border-[#2a2a3e] pt-4">
        <p className="text-[12px] text-[#666]">
          v5 · KDD Pipeline · BMI + BAI · WHO + 2026 Clinical Standards
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
