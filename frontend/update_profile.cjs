const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Profile.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace ActivityCalendar import if exists
content = content.replace("import { ActivityCalendar } from 'react-activity-calendar';", "");

// Create the custom component
const customHeatmapCode = `
// Custom Heatmap that separates months visually
function MonthSeparatedHeatmap({ heatmapObj }) {
  const monthsData = [];
  const today = new Date();
  
  // We want the last 12 months, including current month
  for (let i = 11; i >= 0; i--) {
    const targetMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
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
      // Create date string strictly using local components to avoid UTC shift
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
      // set hours to end of day to not clip today
      today.setHours(23, 59, 59, 999);
      if (currentIterDate > today) {
         // skip future days
         continue; 
      }
      
      days.push({ date: dateStr, count, level, monthName, displayDate: currentIterDate.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' }) });
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

  // Calculate total submissions
  let totalSubmissions = 0;
  if (heatmapObj) {
      Object.values(heatmapObj).forEach(val => { totalSubmissions += val; });
  }

  return (
    <div className="w-full flex flex-col items-start gap-4">
      <div className="flex gap-2 mb-2 w-full">
        <p className="text-sm font-medium text-text-muted">{totalSubmissions} submissions in the past one year</p>
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
                    className={\`w-[14px] h-[14px] rounded-sm \${getColor(day.level)} hover:ring-2 hover:ring-text hover:scale-110 transition-all cursor-pointer\`}
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

// Replace ActivityCalendar block
const targetBlockRegex = /<ActivityCalendar[\s\S]*?\/>/;
if (targetBlockRegex.test(content)) {
    content = content.replace(targetBlockRegex, '<MonthSeparatedHeatmap heatmapObj={profileData?.progress?.activityHeatmap} />');
}

// Inject customHeatmapCode before getRealtimeActivity or at the bottom
if (!content.includes('MonthSeparatedHeatmap')) {
    content = content + '\n\n' + customHeatmapCode;
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Script updated successfully');
