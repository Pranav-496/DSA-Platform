const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Profile.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// The new component code
const newComponent = `
// Custom Heatmap that separates months visually
export function MonthSeparatedHeatmap({ heatmapObj }) {
  const [selectedYear, setSelectedYear] = useState("Current");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Parse available years from heatmapObj
  const availableYears = ["Current"];
  if (heatmapObj) {
    const yearsSet = new Set(Object.keys(heatmapObj).map(d => d.split('-')[0]));
    const sortedYears = Array.from(yearsSet).sort().reverse();
    availableYears.push(...sortedYears);
  }

  const monthsData = [];
  const today = new Date();
  
  // Determine which months to render
  const targetMonths = [];
  if (selectedYear === "Current") {
    for (let i = 11; i >= 0; i--) {
      targetMonths.push(new Date(today.getFullYear(), today.getMonth() - i, 1));
    }
  } else {
    const yearInt = parseInt(selectedYear, 10);
    for (let i = 0; i < 12; i++) {
      targetMonths.push(new Date(yearInt, i, 1));
    }
  }
  
  for (const targetMonth of targetMonths) {
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    const monthName = targetMonth.toLocaleString('default', { month: 'short' });
    
    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Day of the week of the 1st (0 = Sun, 6 = Sat)
    const firstDayOfWeek = targetMonth.getDay();
    
    const days = [];
    
    // Empty padding for the first column
    for (let p = 0; p < firstDayOfWeek; p++) {
      days.push(null);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = \`\${year}-\${mm}-\${dd}\`;
      
      const count = (heatmapObj && heatmapObj[dateStr]) ? heatmapObj[dateStr] : 0;
      
      let level = 0;
      if (count >= 10) level = 4;
      else if (count >= 5) level = 3;
      else if (count >= 2) level = 2;
      else if (count >= 1) level = 1;

      // Ensure we don't display days in the future
      const currentIterDate = new Date(year, month, d);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      if (currentIterDate > todayEnd) {
         continue; 
      }
      
      days.push({ 
        date: dateStr, 
        count, 
        level, 
        monthName, 
        displayDate: currentIterDate.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' }) 
      });
    }
    
    monthsData.push({ monthName, days });
  }

  const getColor = (level) => {
    switch (level) {
      case 4: return "bg-[#047857]";
      case 3: return "bg-[#10b981]";
      case 2: return "bg-[#34d399]";
      case 1: return "bg-[#a7f3d0]";
      default: return "bg-surface-light border border-[#333]";
    }
  };

  // Calculate total submissions based on selected filter
  let totalSubmissions = 0;
  if (heatmapObj) {
    if (selectedYear === "Current") {
      // Count for the last 365 days
      const oneYearAgo = new Date();
      oneYearAgo.setDate(today.getDate() - 365);
      Object.entries(heatmapObj).forEach(([dateStr, val]) => {
        const d = new Date(dateStr);
        if (d >= oneYearAgo && d <= today) {
          totalSubmissions += val;
        }
      });
    } else {
      // Count for the specific year
      Object.entries(heatmapObj).forEach(([dateStr, val]) => {
        if (dateStr.startsWith(selectedYear)) {
          totalSubmissions += val;
        }
      });
    }
  }

  return (
    <div className="w-full flex flex-col items-start gap-4 relative">
      <div className="flex items-center justify-between w-full relative z-10">
        <p className="text-sm font-medium text-text-muted">
          {totalSubmissions} submissions in {selectedYear === "Current" ? "the past one year" : selectedYear}
        </p>

        {/* Dropdown Container */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface-light border border-[#333] hover:border-primary rounded-md text-sm transition-colors"
          >
            {selectedYear}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl overflow-hidden z-50">
              <div className="py-1">
                {availableYears.map(y => (
                  <button
                    key={y}
                    onClick={() => { setSelectedYear(y); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-surface-light flex items-center justify-between transition-colors"
                  >
                    {y}
                    {selectedYear === y && (
                      <svg className="text-primary w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
        {monthsData.map((m, mIdx) => (
          <div key={mIdx} className="flex flex-col gap-2 shrink-0">
            <div className="grid grid-rows-7 grid-flow-col gap-[4px]">
              {m.days.map((day, dIdx) => {
                if (!day) return <div key={dIdx} className="w-[14px] h-[14px] bg-transparent"></div>;
                
                return (
                  <div
                    key={dIdx}
                    title={\`\${day.count} submissions on \${day.displayDate}\`}
                    className={\`w-[14px] h-[14px] rounded-sm \${getColor(day.level)} hover:ring-2 hover:ring-text hover:scale-110 transition-all cursor-pointer shadow-brutal-sm\`}
                  ></div>
                );
              })}
            </div>
            <div className="text-xs text-text-muted text-center mt-1 select-none">
              {m.monthName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

// Extract the existing component string boundaries
const startMarker = "// Custom Heatmap that separates months visually";
const startIndex = content.indexOf(startMarker);

if (startIndex !== -1) {
  content = content.substring(0, startIndex) + newComponent;
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Updated MonthSeparatedHeatmap successfully.");
} else {
  console.error("Could not find start marker.");
}
