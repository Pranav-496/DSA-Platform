const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'routes', 'code.js');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Import optionalAuth
if (!content.includes('optionalAuth')) {
    content = content.replace(
        'const vm = require("vm");',
        'const vm = require("vm");\nconst { optionalAuth } = require("../middleware/authMiddleware");\nconst User = require("../models/User");'
    );
}

// 2. Add optionalAuth to /run
content = content.replace(
    'router.post("/run", async (req, res) => {',
    'router.post("/run", optionalAuth, async (req, res) => {'
);

// 3. Add optionalAuth to /submit
content = content.replace(
    'router.post("/submit", async (req, res) => {',
    'router.post("/submit", optionalAuth, async (req, res) => {'
);

// 4. Create function to increment heatmap
const heatmapLogic = `
async function recordHeatmapActivity(req) {
  if (!req.user || req.user.isMock) return;
  try {
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user._id);
    if (user) {
      const currentCount = user.progress.activityHeatmap.get(today) || 0;
      user.progress.activityHeatmap.set(today, currentCount + 1);
      await user.save();
    }
  } catch (error) {
    console.error("Failed to update activity heatmap", error);
  }
}
`;

if (!content.includes('recordHeatmapActivity')) {
    content = content + '\n' + heatmapLogic;
}

// 5. Call recordHeatmapActivity inside /run
content = content.replace(
    'res.json({',
    'await recordHeatmapActivity(req);\n    res.json({'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Updated code.js successfully");
