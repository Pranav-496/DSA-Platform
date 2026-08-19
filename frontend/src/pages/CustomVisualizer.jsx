import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, ChevronLeft, ChevronRight, Pause, FastForward, Eye, Code2, Braces, ArrowRight } from 'lucide-react';

const EXAMPLE_SNIPPETS = {
  'Bubble Sort': `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
bubbleSort([5, 3, 8, 4, 2]);`,
  'Binary Search': `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
binarySearch([1, 3, 5, 7, 9, 11], 7);`,
  'Fibonacci': `function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}
fibonacci(8);`,
  'Two Pointers': `function twoSum(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    let sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}
twoSum([1, 2, 3, 4, 6], 6);`,
  'Reverse Linked List': `function reverseList(arr) {
  let prev = null;
  let current = 0;
  let next = null;
  // Simulating linked list with array
  let nodes = arr.map((val, i) => ({ val, next: i + 1 < arr.length ? i + 1 : null }));
  while (current !== null) {
    next = nodes[current].next;
    nodes[current].next = prev;
    prev = current;
    current = next;
  }
  // Collect result
  let result = [];
  let node = prev;
  while (node !== null) {
    result.push(nodes[node].val);
    node = nodes[node].next;
  }
  return result;
}
reverseList([1, 2, 3, 4, 5]);`,
};

// Simple JavaScript interpreter that traces execution step by step
function traceExecution(code) {
  const steps = [];
  const variables = {};
  let output = null;
  let error = null;

  try {
    // Instrument the code to track variable assignments and flow
    const lines = code.split('\n');
    let lineNum = 0;

    // Use a sandboxed Function with Proxy-based tracking
    const trackedVars = {};
    const stepLog = [];

    // We'll use a simpler approach: execute the code and capture variable snapshots
    // by injecting tracking calls
    let instrumentedCode = '';
    const trackFn = (line, vars, info) => {
      stepLog.push({
        line,
        variables: JSON.parse(JSON.stringify(vars)),
        info: info || '',
        timestamp: stepLog.length,
      });
    };

    // Parse and instrument each line
    const functionBody = code;

    // Create tracking wrapper
    const wrappedCode = `
      const __steps = [];
      const __track = (line, label, snapshot) => {
        __steps.push({ line, label, variables: JSON.parse(JSON.stringify(snapshot)) });
      };

      // Wrap the user's code
      ${instrumentCode(code)}

      return __steps;
    `;

    const executor = new Function(wrappedCode);
    const result = executor();

    return { steps: result, error: null };
  } catch (e) {
    return { steps: [], error: e.message };
  }
}

function instrumentCode(code) {
  const lines = code.split('\n');
  let instrumented = [];
  let varTracker = new Set();
  let depth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;

    // Skip empty lines and comments
    if (!line || line.startsWith('//') || line.startsWith('/*')) {
      instrumented.push(lines[i]);
      continue;
    }

    // Track variable declarations
    const varMatch = line.match(/(?:let|var|const)\s+(\w+)/);
    if (varMatch) varTracker.add(varMatch[1]);

    // Track assignments
    const assignMatch = line.match(/^(\w+)\s*=/);
    if (assignMatch) varTracker.add(assignMatch[1]);

    // Track for loop variables
    const forMatch = line.match(/for\s*\(\s*(?:let|var|const)\s+(\w+)/);
    if (forMatch) varTracker.add(forMatch[1]);

    instrumented.push(lines[i]);

    // After assignments, loops, conditionals — inject tracking
    if (
      line.match(/(?:let|var|const)\s+\w+/) ||
      line.match(/^\w+\s*=/) ||
      line.match(/^\w+\[.*\]\s*=/) ||
      line.match(/^if\s*\(/) ||
      line.match(/^while\s*\(/) ||
      line.match(/^for\s*\(/) ||
      line.match(/^return\s/)
    ) {
      const varsSnapshot = [...varTracker].map(v => `"${v}": typeof ${v} !== 'undefined' ? ${v} : undefined`).join(', ');
      const label = line.length > 60 ? line.substring(0, 60) + '...' : line;
      instrumented.push(`  try { __track(${lineNum}, ${JSON.stringify(label)}, {${varsSnapshot}}); } catch(e) {}`);
    }
  }

  return instrumented.join('\n');
}

export default function CustomVisualizer() {
  const [code, setCode] = useState(EXAMPLE_SNIPPETS['Bubble Sort']);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [error, setError] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState('Bubble Sort');
  const playRef = React.useRef(null);

  const runTrace = useCallback(() => {
    setError(null);
    setIsPlaying(false);
    setCurrentStep(0);
    if (playRef.current) clearInterval(playRef.current);

    const result = traceExecution(code);
    if (result.error) {
      setError(result.error);
      setSteps([]);
    } else {
      setSteps(result.steps);
      setCurrentStep(0);
    }
  }, [code]);

  const playAnimation = useCallback(() => {
    if (steps.length === 0) return;
    setIsPlaying(true);
    let step = currentStep;

    playRef.current = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(playRef.current);
        setIsPlaying(false);
        return;
      }
      setCurrentStep(step);
    }, speed);
  }, [steps, currentStep, speed]);

  const pauseAnimation = () => {
    setIsPlaying(false);
    if (playRef.current) clearInterval(playRef.current);
  };

  const resetAnimation = () => {
    pauseAnimation();
    setCurrentStep(0);
  };

  const codeLines = code.split('\n');
  const currentStepData = steps[currentStep];
  const activeLine = currentStepData?.line || -1;

  return (
    <div className="h-full flex flex-col gap-3 p-4 text-text">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-geist font-bold tracking-tight">Code Visualizer</h2>
          <p className="text-xs text-text-muted">Paste any JavaScript code and watch it execute step-by-step</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedSnippet}
            onChange={(e) => {
              setSelectedSnippet(e.target.value);
              setCode(EXAMPLE_SNIPPETS[e.target.value]);
              setSteps([]);
              setCurrentStep(0);
              setError(null);
            }}
            className="bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {Object.keys(EXAMPLE_SNIPPETS).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <button
            onClick={runTrace}
            className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:brightness-110 transition-all shadow-soft"
          >
            <Eye size={14} /> Visualize
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-3 min-h-0">
        {/* Left: Code Editor */}
        <div className="bg-surface border border-border rounded-xl flex flex-col overflow-hidden min-h-0">
          <div className="px-3 py-2 border-b border-border flex items-center gap-2 flex-shrink-0">
            <Code2 size={14} className="text-primary" />
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Your Code</span>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language="javascript"
              value={code}
              theme="vs-dark"
              onChange={(v) => setCode(v || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'Fira Code, monospace',
                padding: { top: 8 },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                glyphMargin: true,
              }}
            />
          </div>
        </div>

        {/* Right: Visualization */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* Execution Trace */}
          <div className="flex-1 bg-surface border border-border rounded-xl flex flex-col overflow-hidden min-h-0">
            <div className="px-3 py-2 border-b border-border flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Braces size={14} className="text-primary" />
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Execution Trace</span>
              </div>
              {steps.length > 0 && (
                <span className="text-[10px] font-medium text-text-muted bg-surface-alt px-2 py-0.5 rounded">
                  Step {currentStep + 1} / {steps.length}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 min-h-0">
              {error && (
                <div className="bg-danger text-white p-3 rounded-lg text-xs font-medium mb-3">
                  ⚠ Error: {error}
                </div>
              )}

              {steps.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center h-full text-text-muted text-sm gap-2">
                  <Eye size={32} className="opacity-30" />
                  <p>Click <strong>Visualize</strong> to trace your code</p>
                </div>
              )}

              {steps.length > 0 && (
                <div className="space-y-1">
                  {/* Code with line highlighting */}
                  <div className="bg-[#1e1e2e] rounded-lg p-3 font-mono text-xs overflow-x-auto mb-3">
                    {codeLines.map((line, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2 px-2 py-0.5 rounded transition-colors ${
                          activeLine === idx + 1
                            ? 'bg-primary/20 border-l-2 border-primary'
                            : 'border-l-2 border-transparent'
                        }`}
                      >
                        <span className="text-[#6c7086] w-6 text-right flex-shrink-0 select-none">{idx + 1}</span>
                        <span className={activeLine === idx + 1 ? 'text-[#cdd6f4] font-semibold' : 'text-[#8c8fa6]'}>
                          {line || '\u00A0'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Current step info */}
                  {currentStepData && (
                    <div className="bg-surface-alt border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight size={12} className="text-primary" />
                        <span className="text-xs font-semibold text-primary">Line {currentStepData.line}</span>
                        <span className="text-xs text-text-muted font-mono">{currentStepData.label}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Variable Watch */}
          {steps.length > 0 && currentStepData && (
            <div className="bg-surface border border-border rounded-xl overflow-hidden flex-shrink-0">
              <div className="px-3 py-2 border-b border-border">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Variables</span>
              </div>
              <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[180px] overflow-y-auto">
                {Object.entries(currentStepData.variables || {}).map(([key, val]) => {
                  if (val === undefined) return null;
                  const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                  const isArray = Array.isArray(val);

                  return (
                    <div key={key} className="bg-surface-alt border border-border rounded-lg p-2">
                      <p className="text-[10px] font-semibold text-primary uppercase mb-0.5">{key}</p>
                      {isArray ? (
                        <div className="flex gap-0.5 flex-wrap">
                          {val.map((item, i) => (
                            <span key={i} className="bg-primary text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                              {typeof item === 'object' ? JSON.stringify(item) : item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs font-mono font-semibold truncate" title={displayVal}>
                          {displayVal}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      {steps.length > 0 && (
        <div className="flex items-center justify-center gap-3 bg-surface-alt border border-border rounded-xl p-3">
          <button
            onClick={resetAnimation}
            className="p-2 rounded-lg hover:bg-surface border border-border transition-colors"
            title="Reset"
          >
            <RotateCcw size={16} className="text-text-muted" />
          </button>
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className="p-2 rounded-lg hover:bg-surface border border-border transition-colors"
            disabled={currentStep === 0}
          >
            <ChevronLeft size={16} className="text-text-muted" />
          </button>

          {isPlaying ? (
            <button
              onClick={pauseAnimation}
              className="flex items-center gap-1.5 bg-warning text-white px-4 py-2 rounded-lg text-xs font-semibold hover:brightness-110 transition-all"
            >
              <Pause size={14} /> Pause
            </button>
          ) : (
            <button
              onClick={playAnimation}
              className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold hover:brightness-110 transition-all shadow-soft"
            >
              <Play size={14} /> Play
            </button>
          )}

          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            className="p-2 rounded-lg hover:bg-surface border border-border transition-colors"
            disabled={currentStep >= steps.length - 1}
          >
            <ChevronRight size={16} className="text-text-muted" />
          </button>

          {/* Speed */}
          <div className="flex items-center gap-2 ml-4 border-l border-border pl-4">
            <FastForward size={14} className="text-text-muted" />
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-20 accent-primary h-1.5 cursor-pointer"
            />
            <span className="text-[10px] text-text-muted font-medium w-10">{speed}ms</span>
          </div>

          {/* Progress bar */}
          <div className="flex-1 ml-4 bg-background rounded-full h-1.5 max-w-[200px]">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
