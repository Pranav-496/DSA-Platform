import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import VoicePanel from "../components/VoicePanel";
import ProctoringPanel from "../components/ProctoringPanel";
import API_BASE from "../config/api";
import {
  Play,
  Send,
  CheckCircle,
  Code,
  MessageSquare,
  Zap,
  Activity,
  ShieldAlert,
  Cpu,
  Award,
  Shield,
  AlertTriangle,
  Terminal,
} from "lucide-react";

const QUESTIONS = {
  "Binary Search": {
    title: "Binary Search",
    funcName: "search",
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.",
    exampleInput: "nums = [-1,0,3,5,9,12], target = 9",
    exampleOutput: "4",
    constraints: ["1 <= nums.length <= 10^4", "All the integers in `nums` are unique."],
    starterCode: {
      javascript: "function search(nums, target) {\n  // Write your solution here\n  return -1;\n}",
      python: "def search(nums, target):\n    # Write your solution here\n    return -1",
      java: "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution here\n        return -1;\n    }\n}",
      cpp: "int search(vector<int>& nums, int target) {\n    // Write your solution here\n    return -1;\n}"
    },
    testCases: [
      { input: "[-1,0,3,5,9,12], 9", expected: "4" },
      { input: "[-1,0,3,5,9,12], 2", expected: "-1" }
    ]
  },
  "Bubble Sort": {
    title: "Bubble Sort",
    funcName: "bubbleSort",
    description: "Write a function that takes an array of integers and returns a sorted array using the Bubble Sort algorithm.",
    exampleInput: "nums = [5, 2, 9, 1, 5, 6]",
    exampleOutput: "[1, 2, 5, 5, 6, 9]",
    constraints: ["1 <= nums.length <= 10^4"],
    starterCode: {
      javascript: "function bubbleSort(nums) {\n  // Write your solution here\n  return nums;\n}",
      python: "def bubble_sort(nums):\n    # Write your solution here\n    return nums",
      java: "class Solution {\n    public int[] bubbleSort(int[] nums) {\n        // Write your solution here\n        return nums;\n    }\n}",
      cpp: "vector<int> bubbleSort(vector<int>& nums) {\n    // Write your solution here\n    return nums;\n}"
    },
    testCases: [
      { input: "[5,2,9,1,5,6]", expected: "[1,2,5,5,6,9]" },
      { input: "[3,1,2]", expected: "[1,2,3]" }
    ]
  },
  "Merge Sort": {
    title: "Merge Sort",
    funcName: "mergeSort",
    description: "Implement the Merge Sort algorithm to sort an array of integers in ascending order. You must solve it in O(n log n) time.",
    exampleInput: "nums = [12, 11, 13, 5, 6, 7]",
    exampleOutput: "[5, 6, 7, 11, 12, 13]",
    constraints: ["1 <= nums.length <= 5*10^4"],
    starterCode: {
      javascript: "function mergeSort(nums) {\n  // Write your solution here\n  return nums;\n}",
      python: "def merge_sort(nums):\n    # Write your solution here\n    return nums",
      java: "class Solution {\n    public int[] mergeSort(int[] nums) {\n        // Write your solution here\n        return nums;\n    }\n}",
      cpp: "vector<int> mergeSort(vector<int>& nums) {\n    // Write your solution here\n    return nums;\n}"
    },
    testCases: [
      { input: "[12,11,13,5,6,7]", expected: "[5,6,7,11,12,13]" },
      { input: "[5,1,4,2,8]", expected: "[1,2,4,5,8]" }
    ]
  },
  "Quick Sort": {
    title: "Quick Sort",
    funcName: "quickSort",
    description: "Implement the Quick Sort algorithm. Pick an element as a pivot and partition the given array around the picked pivot.",
    exampleInput: "nums = [10, 7, 8, 9, 1, 5]",
    exampleOutput: "[1, 5, 7, 8, 9, 10]",
    constraints: ["1 <= nums.length <= 5*10^4"],
    starterCode: {
      javascript: "function quickSort(nums) {\n  // Write your solution here\n  return nums;\n}",
      python: "def quick_sort(nums):\n    # Write your solution here\n    return nums",
      java: "class Solution {\n    public int[] quickSort(int[] nums) {\n        // Write your solution here\n        return nums;\n    }\n}",
      cpp: "vector<int> quickSort(vector<int>& nums) {\n    // Write your solution here\n    return nums;\n}"
    },
    testCases: [
      { input: "[10,7,8,9,1,5]", expected: "[1,5,7,8,9,10]" },
      { input: "[3,6,2,8,1]", expected: "[1,2,3,6,8]" }
    ]
  },
  BFS: {
    title: "Number of Islands (BFS)",
    funcName: "numIslands",
    description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands using BFS.",
    exampleInput: "grid = [['1','1','0'],['1','1','0'],['0','0','1']]",
    exampleOutput: "2",
    constraints: ["m == grid.length", "n == grid[i].length", "grid[i][j] is '0' or '1'"],
    starterCode: {
      javascript: "function numIslands(grid) {\n  // Write your BFS solution here\n  return 0;\n}",
      python: "def num_islands(grid):\n    # Write your BFS solution here\n    return 0",
      java: "class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your BFS solution here\n        return 0;\n    }\n}",
      cpp: "int numIslands(vector<vector<char>>& grid) {\n    // Write your BFS solution here\n    return 0;\n}"
    },
    testCases: [
      { input: "[['1','1','0'],['1','1','0'],['0','0','1']]", expected: "2" },
      { input: "[['1','0'],['0','1']]", expected: "2" }
    ]
  },
  DFS: {
    title: "Max Depth of Binary Tree (DFS)",
    funcName: "maxDepth",
    description: "Given an array representation of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    exampleInput: "[3,9,20,null,null,15,7]",
    exampleOutput: "3",
    constraints: ["The number of nodes in the tree is in the range [0, 10^4]"],
    starterCode: {
      javascript: "function maxDepth(root) {\n  // Write your DFS solution here\n  // root is an array representation: [3,9,20,null,null,15,7]\n  if (!root || root.length === 0) return 0;\n  return 0;\n}",
      python: "def max_depth(root):\n    # Write your DFS solution here\n    # root is an array representation: [3,9,20,None,None,15,7]\n    if not root: return 0\n    return 0",
      java: "class Solution {\n    public int maxDepth(int[] root) {\n        // Write your DFS solution here\n        return 0;\n    }\n}",
      cpp: "int maxDepth(vector<int>& root) {\n    // Write your DFS solution here\n    return 0;\n}"
    },
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expected: "3" },
      { input: "[1,null,2]", expected: "2" }
    ]
  },
  "Hash Map": {
    title: "Two Sum (Hash Map)",
    funcName: "twoSum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You must solve it using a Hash Map.",
    exampleInput: "nums = [2,7,11,15], target = 9",
    exampleOutput: "[0, 1]",
    constraints: ["2 <= nums.length <= 10^4", "Only one valid answer exists."],
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  // Write your solution using a Hash Map\n  return [];\n}",
      python: "def two_sum(nums, target):\n    # Write your solution using a Hash Map\n    return []",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution using a Hash Map\n        return new int[]{};\n    }\n}",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution using a Hash Map\n    return {};\n}"
    },
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" }
    ]
  },
  "Two Pointers": {
    title: "Valid Palindrome",
    funcName: "isPalindrome",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    exampleInput: 's = "A man, a plan, a canal: Panama"',
    exampleOutput: "true",
    constraints: ["1 <= s.length <= 2 * 10^5"],
    starterCode: {
      javascript: "function isPalindrome(s) {\n  // Write your Two Pointers solution here\n  return false;\n}",
      python: "def is_palindrome(s):\n    # Write your Two Pointers solution here\n    return False",
      java: "class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your Two Pointers solution here\n        return false;\n    }\n}",
      cpp: "bool isPalindrome(string s) {\n    // Write your Two Pointers solution here\n    return false;\n}"
    },
    testCases: [
      { input: "'A man, a plan, a canal: Panama'", expected: "true" },
      { input: "'race a car'", expected: "false" }
    ]
  }
};

export default function InterviewPrep() {
  const [topic, setTopic] = useState("Binary Search");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your solution here\n");
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [result, setResult] = useState(null);
  const [proctorActive, setProctorActive] = useState(true);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [violationLog, setViolationLog] = useState([]);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [clipboardWarning, setClipboardWarning] = useState('');

  // Timer logic
  const [thinkingTime, setThinkingTime] = useState(0);
  const [isThinking, setIsThinking] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (isThinking && hasStarted) {
        setThinkingTime((prev) => prev + 1000);
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isThinking, hasStarted]);

  // Tab switch blocking
  useEffect(() => {
    if (!hasStarted) return;

    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
        setTabSwitchWarning(true);
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "You are in an active interview session. Are you sure you want to leave?";
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasStarted]);

  const handleEditorChange = (value) => {
    setCode(value);
    if (isThinking) setIsThinking(false);
  };

  const currentProblem = QUESTIONS[topic];

  useEffect(() => {
    const q = QUESTIONS[topic];
    if (q && q.starterCode && q.starterCode[language]) {
      setCode(q.starterCode[language]);
    } else {
      setCode("// Write your solution here\n");
    }
    setResult(null);
    setRunResult(null);
    setTranscript("");
    setThinkingTime(0);
    setIsThinking(true);
  }, [topic, language]);


  const handleRunCode = async () => {
    if (!hasStarted) return;
    setActiveTab("output");
    setIsRunning(true);
    setRunResult(null);
    setResult(null);
    try {
      // Create a mock test case from the example so they can run it
      const tc = currentProblem.testCases ? currentProblem.testCases[0] : { input: currentProblem.exampleInput, expected: currentProblem.exampleOutput };
      const funcName = currentProblem.funcName || currentProblem.title.replace(/\s/g, "");

      const resp = await fetch(`${API_BASE}/api/code/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: language === "cpp" ? "cpp" : language,
          testCase: tc,
          funcName
        }),
      });
      const data = await resp.json();
      setRunResult(data);
    } catch (err) {
      console.error(err);
      setRunResult({ status: "error", output: "Network or Server Error" });
    } finally {
      setIsRunning(false);
    }
  };

  const handleAnalyze = async () => {
    if (!hasStarted) return;
    setActiveTab("output");
    setIsAnalyzing(true);
    setIsThinking(false);
    try {
      const funcName = currentProblem.funcName || currentProblem.title.replace(/\s/g, "");
      
      // Run both AI analysis and actual code execution in parallel
      const [aiResp, codeResp] = await Promise.all([
        fetch(`${API_BASE}/api/interview/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, topic, code, thinkingTime, language }),
        }),
        fetch(`${API_BASE}/api/code/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            language: language === "cpp" ? "cpp" : language,
            testCases: currentProblem.testCases || [{ input: currentProblem.exampleInput, expected: currentProblem.exampleOutput }],
            funcName
          }),
        }).catch(() => null)
      ]);

      const data = await aiResp.json();
      const codeData = codeResp ? await codeResp.json() : null;

      const adjustedData = {
        ...data,
        executionResults: codeData,
        integrityScore,
        tabSwitches: tabSwitchCount,
        violationCount: violationLog.length,
        adjustedFinalScore: Math.max(0, Math.round(data.finalScore * (integrityScore / 100))),
      };
      setResult(adjustedData);
      setRunResult(null);

      const history = JSON.parse(localStorage.getItem("interview_history") || "[]");
      history.push({
        topic,
        finalScore: adjustedData.adjustedFinalScore,
        rawScore: data.finalScore,
        integrityScore,
        tabSwitches: tabSwitchCount,
        violations: violationLog.length,
        thinkingTime,
        date: new Date().toISOString(),
      });
      localStorage.setItem("interview_history", JSON.stringify(history));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViolation = (violation) => {
    setViolationLog((prev) => [...prev, violation]);
  };

  const getColor = (score) => {
    if (score < 40) return "text-danger";
    if (score < 70) return "text-warning";
    return "text-success";
  };
  const getBgColor = (score) => {
    if (score < 40) return "bg-danger text-surface";
    if (score < 70) return "bg-warning text-text";
    return "bg-success text-surface";
  };

  return (
    <div className="h-full flex flex-col gap-4 text-text p-4 relative overflow-hidden">
      {/* Clipboard Warning Toast */}
      {clipboardWarning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-danger text-surface border-4 border-text shadow-brutal font-bold text-sm animate-fade-in">
          ⚠ {clipboardWarning}
        </div>
      )}
      {/* Tab Switch Warning Overlay */}
      {tabSwitchWarning && (
        <div
          className="fixed inset-0 z-50 bg-text/90 flex items-center justify-center p-4"
          onClick={() => setTabSwitchWarning(false)}
        >
          <div
            className="brutal-card bg-surface border-8 border-danger p-8 max-w-lg text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <AlertTriangle size={80} className="mx-auto text-danger mb-6" />
            <h2 className="text-4xl font-geist font-black text-danger mb-4 uppercase">
              TAB SWITCH DETECTED
            </h2>
            <p className="font-bold mb-2 text-lg">
              Switching tabs during an interview is a{" "}
              <strong className="bg-danger text-surface px-2 border-2 border-text uppercase">serious violation</strong>.
            </p>
            <p className="font-medium mb-6">
              This has been logged. Total tab switches:{" "}
              <span className="text-danger font-black text-xl">{tabSwitchCount}</span>
            </p>
            <div className="bg-background border-4 border-text rounded p-4 mb-6 shadow-brutal-sm">
              <p className="font-black text-lg uppercase tracking-wider">
                Integrity Impact:{" "}
                <span className="text-danger">-5 points per switch</span>
              </p>
            </div>
            <button
              onClick={() => setTabSwitchWarning(false)}
              className="brutal-btn w-full bg-danger text-surface uppercase"
            >
              RETURN TO INTERVIEW
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-surface p-2.5 border-2 border-text shadow-[2px_2px_0px_#111] rounded-lg">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-geist font-black uppercase tracking-tight">
            Interview Sim
          </h2>
          <select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setResult(null);
              setCode("// Write your solution here\n");
              setThinkingTime(0);
              setIsThinking(true);
            }}
            className="bg-background border-2 border-text px-2.5 py-1 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#111] cursor-pointer"
          >
            {Object.keys(QUESTIONS).map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-background border-2 border-text px-2.5 py-1 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_#111] cursor-pointer"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className={`flex items-center gap-1.5 px-2 py-1 border-2 border-text rounded font-black text-xs uppercase shadow-[2px_2px_0px_#111] ${getBgColor(integrityScore)}`}>
            <Shield size={14} />
            <span>{integrityScore}% Integrity</span>
          </div>
          {tabSwitchCount > 0 && (
            <span className="text-[10px] font-black text-danger uppercase tracking-wider bg-surface px-2 py-1 border-2 border-danger flex items-center gap-1 shadow-[2px_2px_0px_#ef4444]">
              <AlertTriangle size={12} /> {tabSwitchCount} switch{tabSwitchCount !== 1 ? "es" : ""}
            </span>
          )}
          {hasStarted ? (
            <span className="text-xs font-black uppercase tracking-wider bg-background px-2.5 py-1.5 border-2 border-text shadow-[2px_2px_0px_#111]">
              Time: {(thinkingTime / 1000).toFixed(0)}s
            </span>
          ) : (
            <button
              onClick={() => setHasStarted(true)}
              className="bg-primary px-3 py-1.5 border-2 border-text text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#111] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#111] transition-all"
            >
              START INTERVIEW
            </button>
          )}
        </div>
      </div>

      {/* Main Grid — 4 columns: Problem | Editor | Voice | Proctor */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        {/* Left Panel: Problem Statement */}
        <div className="brutal-card bg-surface p-6 flex flex-col overflow-y-auto h-full">
          <h3 className="text-xl font-black font-geist uppercase border-b-4 border-text pb-2 mb-4">
            {QUESTIONS[topic].title}
          </h3>
          <p className="font-medium text-sm mb-6 leading-relaxed">
            {QUESTIONS[topic].description}
          </p>
          <div className="bg-background border-4 border-text p-4 rounded mb-4 shadow-brutal-sm">
            <p className="text-xs font-black uppercase tracking-wider mb-2">Example</p>
            <p className="font-mono text-sm mb-1">
              <strong className="bg-primary px-1">Input:</strong> {QUESTIONS[topic].exampleInput}
            </p>
            <p className="font-mono text-sm">
              <strong className="bg-primary px-1">Output:</strong> {QUESTIONS[topic].exampleOutput}
            </p>
          </div>
          <div className="bg-background border-4 border-text p-4 rounded shadow-brutal-sm">
            <p className="text-xs font-black uppercase tracking-wider mb-2">Constraints</p>
            <ul className="text-sm font-medium list-disc pl-5">
              {QUESTIONS[topic].constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Panel: Editor + Console Stack */}
        <div className="brutal-card bg-surface flex flex-col gap-0 lg:col-span-2 min-h-0 h-full overflow-hidden">
          {/* Tabs */}
          <div className="flex bg-background border-b-4 border-text flex-shrink-0">
            <button
              onClick={() => setActiveTab("code")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-black font-geist uppercase border-r-4 border-text transition-colors ${
                activeTab === "code" ? "bg-primary text-text" : "bg-surface text-text hover:bg-[#e2e8f0]"
              }`}
            >
              <Code size={18} /> Code
            </button>
            <button
              onClick={() => setActiveTab("output")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-black font-geist uppercase transition-colors ${
                activeTab === "output" ? "bg-primary text-text" : "bg-surface text-text hover:bg-[#e2e8f0]"
              }`}
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
              className={`flex-1 w-full min-h-0 ${activeTab === "code" ? "block" : "hidden"}`}
              onPaste={(e) => {
                e.preventDefault();
                setClipboardWarning("Pasting restricted in Interview Mode.");
                setTimeout(() => setClipboardWarning(''), 2500);
              }}
              onCopy={(e) => {
                e.preventDefault();
                setClipboardWarning("Copying restricted in Interview Mode.");
                setTimeout(() => setClipboardWarning(''), 2500);
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
            
            <div className={`flex-1 overflow-y-auto p-4 bg-text text-surface font-mono text-sm ${activeTab === "output" ? "block" : "hidden"}`}>
                {!runResult && !result && (
                  <div className="opacity-50 flex items-center justify-center h-full">
                     Awaiting execution... Click Run or Submit to see output.
                  </div>
                )}
                
                {/* Console Output for Run */}
                {runResult && !result && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-2 pb-2 border-b-2 border-surface/30">
                      <span className={`px-2 py-0.5 font-bold uppercase rounded ${runResult.status === 'passed' ? 'bg-success text-surface' : runResult.status === 'error' ? 'bg-danger text-surface' : 'bg-warning text-text'}`}>
                         {runResult.status === 'passed' ? 'ACCEPTED' : runResult.status === 'error' ? 'ERROR' : 'WRONG ANSWER'}
                      </span>
                      {runResult.runtime > 0 && <span className="opacity-70">{runResult.runtime}ms</span>}
                    </div>
                    {runResult.expected && (
                       <div className="mb-2">
                          <strong>Expected:</strong> {runResult.expected}
                       </div>
                    )}
                    <pre className="whitespace-pre-wrap">{runResult.output || "Program finished with no output."}</pre>
                  </div>
                )}

                {/* Evaluation Results */}
                {result && (
                  <div className="animate-fade-in text-text bg-surface p-4 rounded -m-4 min-h-full">
                    <div className="flex flex-wrap justify-between items-center mb-4 pb-2 border-b-4 border-text">
                      <h3 className="font-geist font-black text-xl uppercase">Evaluation Report</h3>
                      <div className="flex flex-wrap gap-2">
                        <div className={`px-3 py-1 border-2 border-text rounded font-black uppercase text-sm shadow-[2px_2px_0px_#111] ${getBgColor(result.adjustedFinalScore)}`}>
                          Adjusted: {result.adjustedFinalScore}
                        </div>
                        <div className={`px-3 py-1 border-2 border-text rounded font-black uppercase text-sm shadow-[2px_2px_0px_#111] ${getBgColor(result.finalScore)}`}>
                          Raw: {result.finalScore}
                        </div>
                      </div>
                    </div>

                    {/* Show actual execution tests if available */}
                    {result.executionResults && (
                       <div className="mb-4 border-4 border-text rounded shadow-brutal-sm bg-background p-3">
                          <strong className="text-sm font-black uppercase tracking-wider block mb-2">Test Execution:</strong>
                          <div className="flex items-center gap-2">
                             <span className={`px-2 py-0.5 font-bold uppercase rounded text-sm ${result.executionResults.status === 'accepted' ? 'bg-success text-surface border-2 border-text' : 'bg-danger text-surface border-2 border-text'}`}>
                                {result.executionResults.status === 'accepted' ? 'ALL TESTS PASSED' : 'TESTS FAILED'}
                             </span>
                             <span className="font-bold">{result.executionResults.passed}/{result.executionResults.total} Passed</span>
                          </div>
                       </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {[
                        { label: "Code", val: result.codeScore, icon: Code },
                        { label: "Logic", val: result.logicScore, icon: Activity },
                        { label: "Comm.", val: result.communicationScore, icon: MessageSquare },
                        { label: "Speed", val: result.speedScore, icon: Zap },
                        { label: "Edge", val: result.edgeScore, icon: ShieldAlert },
                        { label: "Pattern", val: result.patternScore, icon: Cpu },
                        { label: "Confidence", val: result.confidenceScore, icon: Award },
                        { label: "DSA", val: result.dsaScore, icon: Activity },
                      ].map(({ label, val, icon: Icon }, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded border-2 border-text text-center shadow-[2px_2px_0px_#111] ${getBgColor(val)}`}
                        >
                          <Icon size={16} className="mx-auto mb-1" />
                          <p className="text-[10px] font-black uppercase tracking-wider mb-1">
                            {label}
                          </p>
                          <p className="font-black text-lg">
                            {val}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-background border-4 border-text p-4 rounded text-sm font-medium mb-3 shadow-brutal-sm">
                      <strong className="text-primary font-black uppercase tracking-wider block mb-2 border-b-2 border-text pb-1">
                        AI VERDICT:
                      </strong>
                      {result.feedback}
                    </div>

                    {result.followUpQuestion && (
                      <div className="bg-primary text-surface border-4 border-text p-4 rounded text-sm font-medium shadow-brutal-sm">
                        <strong className="block mb-2 font-black uppercase tracking-wider">💬 Follow-Up Question:</strong>
                        {result.followUpQuestion}
                      </div>
                    )}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Panel: Voice + Proctoring stacked */}
        <div className="flex flex-col gap-4 min-h-0 overflow-hidden h-full">
          <div className="flex-shrink-0 min-h-[220px]">
            <VoicePanel
              transcript={transcript}
              setTranscript={setTranscript}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden brutal-card bg-surface">
            <ProctoringPanel
              isActive={hasStarted && proctorActive}
              onViolation={handleViolation}
              onScoreUpdate={setIntegrityScore}
            />
          </div>
        </div>
      </div>

      
    </div>
  );
}
