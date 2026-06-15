const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'InterviewPrep.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add activeTab state
content = content.replace(
  'const [hasStarted, setHasStarted] = useState(false);',
  'const [hasStarted, setHasStarted] = useState(false);\n  const [activeTab, setActiveTab] = useState("code");'
);

// 2. Change header time block
const headerTimeBlock = `<span className="text-sm font-black uppercase tracking-wider bg-background px-3 py-1.5 border-2 border-text shadow-[2px_2px_0px_#111]">
            Time: {(thinkingTime / 1000).toFixed(0)}s
          </span>`;
const newHeaderTimeBlock = `{hasStarted ? (
            <span className="text-sm font-black uppercase tracking-wider bg-background px-3 py-1.5 border-2 border-text shadow-[2px_2px_0px_#111]">
              Time: {(thinkingTime / 1000).toFixed(0)}s
            </span>
          ) : (
            <button
              onClick={() => setHasStarted(true)}
              className="bg-primary px-4 py-1.5 border-2 border-text font-black uppercase tracking-wider shadow-[2px_2px_0px_#111] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111] transition-all"
            >
              START INTERVIEW
            </button>
          )}`;
content = content.replace(headerTimeBlock, newHeaderTimeBlock);

// 3. Remove start overlay
const overlayRegex = /\{!hasStarted && \([\s\S]*?<\/div>\s*\)\}/;
content = content.replace(overlayRegex, '');

// 4. Update handleRunCode to set active tab
content = content.replace(
  'const handleRunCode = async () => {\n    setIsRunning(true);',
  'const handleRunCode = async () => {\n    if (!hasStarted) return;\n    setActiveTab("output");\n    setIsRunning(true);'
);

// 5. Update handleAnalyze to set active tab
content = content.replace(
  'const handleAnalyze = async () => {\n    setIsAnalyzing(true);',
  'const handleAnalyze = async () => {\n    if (!hasStarted) return;\n    setActiveTab("output");\n    setIsAnalyzing(true);'
);

// 6. Merge Center Panel
const centerPanelStart = `{/* Center Panel: Editor + Console Stack */}
        <div className="flex flex-col gap-4 lg:col-span-2 min-h-0 h-full">
          <div className="brutal-card bg-surface flex flex-col flex-1 relative overflow-hidden group min-h-0">
            <div className="flex justify-between items-center p-3 bg-background border-b-4 border-text">
              <span className="text-sm font-black font-geist uppercase flex items-center gap-2">
                <Code size={18} /> IDE
              </span>
              <div className="flex gap-3">
                <button
                  className="brutal-btn-secondary px-3 py-1.5 text-sm flex items-center gap-1"
                  onClick={handleRunCode}
                  disabled={isRunning || isAnalyzing}
                >
                  <Play size={16} /> {isRunning ? "Running..." : "Run"}
                </button>
                <button
                  className="brutal-btn bg-success px-4 py-1.5 text-sm flex items-center gap-2"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  <Send size={16} /> Submit & Analyze
                </button>
              </div>
            </div>

            <div
              className="flex-1 w-full bg-white min-h-0"
              onPaste={(e) => {
                e.preventDefault();
                alert("Pasting strictly restricted in Interview Mode.");
              }}
              onCopy={(e) => {
                e.preventDefault();
                alert("Copying strictly restricted in Interview Mode.");
              }}
            >
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                theme="vs-light"
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "Geist, Fira Code, monospace",
                  padding: { top: 16 },
                }}
              />
            </div>
          </div>

          {/* Dedicated Output Terminal */}
          <div className="brutal-card bg-surface flex flex-col h-[250px] flex-shrink-0 relative overflow-hidden">
             <div className="bg-background border-b-4 border-text px-4 py-2 font-black uppercase text-sm flex items-center gap-2">
                <Terminal size={16} /> Output Console
             </div>
             <div className="flex-1 overflow-y-auto p-4 bg-text text-surface font-mono text-sm">`;

const centerPanelReplacement = `{/* Center Panel: Editor + Console Stack */}
        <div className="brutal-card bg-surface flex flex-col gap-0 lg:col-span-2 min-h-0 h-full overflow-hidden">
          {/* Tabs */}
          <div className="flex bg-background border-b-4 border-text flex-shrink-0">
            <button
              onClick={() => setActiveTab("code")}
              className={\`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-black font-geist uppercase border-r-4 border-text transition-colors \${
                activeTab === "code" ? "bg-primary text-text" : "bg-surface text-text hover:bg-[#e2e8f0]"
              }\`}
            >
              <Code size={18} /> Code
            </button>
            <button
              onClick={() => setActiveTab("output")}
              className={\`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-black font-geist uppercase transition-colors \${
                activeTab === "output" ? "bg-primary text-text" : "bg-surface text-text hover:bg-[#e2e8f0]"
              }\`}
            >
              <Terminal size={18} /> Output Console
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-surface border-b-4 border-text flex-shrink-0">
            <div className="flex gap-3 ml-auto">
              <button
                className="brutal-btn-secondary px-3 py-1.5 text-sm flex items-center gap-1"
                onClick={handleRunCode}
                disabled={isRunning || isAnalyzing || !hasStarted}
              >
                <Play size={16} /> {isRunning ? "Running..." : "Run"}
              </button>
              <button
                className="brutal-btn bg-success px-4 py-1.5 text-sm flex items-center gap-2"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !hasStarted}
              >
                <Send size={16} /> Submit & Analyze
              </button>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden bg-white flex flex-col min-h-0">
            <div 
              className={\`flex-1 w-full min-h-0 \${activeTab === "code" ? "block" : "hidden"}\`}
              onPaste={(e) => {
                e.preventDefault();
                alert("Pasting strictly restricted in Interview Mode.");
              }}
              onCopy={(e) => {
                e.preventDefault();
                alert("Copying strictly restricted in Interview Mode.");
              }}
            >
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                theme="vs-light"
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "Geist, Fira Code, monospace",
                  padding: { top: 16 },
                }}
              />
            </div>
            
            <div className={\`flex-1 overflow-y-auto p-4 bg-text text-surface font-mono text-sm \${activeTab === "output" ? "block" : "hidden"}\`}>`;

content = content.replace(centerPanelStart, centerPanelReplacement);

// Remove the extra closing divs of the old layout
const centerPanelEnd = `                     {result.followUpQuestion && (
                      <div className="bg-primary text-surface border-4 border-text p-4 rounded text-sm font-medium shadow-brutal-sm">
                        <strong className="block mb-2 font-black uppercase tracking-wider">💬 Follow-Up Question:</strong>
                        {result.followUpQuestion}
                      </div>
                    )}
                  </div>
                )}
             </div>
          </div>
        </div>`;
        
const centerPanelEndReplacement = `                     {result.followUpQuestion && (
                      <div className="bg-primary text-surface border-4 border-text p-4 rounded text-sm font-medium shadow-brutal-sm">
                        <strong className="block mb-2 font-black uppercase tracking-wider">💬 Follow-Up Question:</strong>
                        {result.followUpQuestion}
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>`;

content = content.replace(centerPanelEnd, centerPanelEndReplacement);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("InterviewPrep.jsx updated successfully");
