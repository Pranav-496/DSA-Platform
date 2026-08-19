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
  const [hasStarted, setHasStarted] = useState(() => JSON.parse(sessionStorage.getItem('interview_hasStarted')) || false);
  const [activeTab, setActiveTab] = useState("code");
  const [clipboardWarning, setClipboardWarning] = useState('');
  
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);
  const [assignedQuestions, setAssignedQuestions] = useState(() => JSON.parse(sessionStorage.getItem('interview_assignedQuestions')) || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => Number(sessionStorage.getItem('interview_currentQuestionIndex')) || 0);
  const [isDisqualified, setIsDisqualified] = useState(() => JSON.parse(sessionStorage.getItem('interview_isDisqualified')) || false);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const saved = sessionStorage.getItem('interview_timeRemaining');
    return saved !== null ? Number(saved) : 60 * 45;
  });
  
  // Replace these above ones to also load from session
  const [integrityScore, setIntegrityScore] = useState(() => {
    const saved = sessionStorage.getItem('interview_integrityScore');
    return saved !== null ? Number(saved) : 100;
  });
  const [tabSwitchCount, setTabSwitchCount] = useState(() => Number(sessionStorage.getItem('interview_tabSwitchCount')) || 0);
  const [violationLog, setViolationLog] = useState(() => JSON.parse(sessionStorage.getItem('interview_violationLog')) || []);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('interview_hasStarted', JSON.stringify(hasStarted));
    sessionStorage.setItem('interview_isDisqualified', JSON.stringify(isDisqualified));
    sessionStorage.setItem('interview_timeRemaining', timeRemaining);
    sessionStorage.setItem('interview_tabSwitchCount', tabSwitchCount);
    sessionStorage.setItem('interview_assignedQuestions', JSON.stringify(assignedQuestions));
    sessionStorage.setItem('interview_currentQuestionIndex', currentQuestionIndex);
    sessionStorage.setItem('interview_integrityScore', integrityScore);
    sessionStorage.setItem('interview_violationLog', JSON.stringify(violationLog));
  }, [hasStarted, isDisqualified, timeRemaining, tabSwitchCount, assignedQuestions, currentQuestionIndex, integrityScore, violationLog]);

  // Strict Disqualification on 0 Integrity
  useEffect(() => {
    if (hasStarted && !isDisqualified && integrityScore <= 0) {
      setIsDisqualified(true);
      setViolationLog(prev => [...prev, "Integrity Score reached 0%"]);
    }
  }, [integrityScore, hasStarted, isDisqualified]);

  const startInterview = () => {
    const EASY_Q = ["Binary Search", "Bubble Sort", "DFS", "Hash Map", "Two Pointers"];
    const MED_Q = ["Merge Sort", "Quick Sort", "BFS"];
    const HARD_Q = ["Merge Sort", "Quick Sort"]; // Mock hard

    const selected = [
      EASY_Q[Math.floor(Math.random() * EASY_Q.length)],
      MED_Q[Math.floor(Math.random() * MED_Q.length)],
      HARD_Q[Math.floor(Math.random() * HARD_Q.length)]
    ];

    setAssignedQuestions(selected);
    setTopic(selected[0]);
    setHasStarted(true);
    setProctorActive(true); // Auto-start proctoring

    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen request failed", e);
    }
  };

  // Timer logic
  const [thinkingTime, setThinkingTime] = useState(0);
  const [isThinking, setIsThinking] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (hasStarted && !isDisqualified && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
        if (isThinking) {
          setThinkingTime(prev => prev + 1000);
        }
      }, 1000);
    } else if (timeRemaining === 0 && hasStarted && !isDisqualified) {
      setIsDisqualified(true);
      setViolationLog(prev => [...prev, "Time Out"]);
    }
    return () => clearInterval(timerRef.current);
  }, [hasStarted, isDisqualified, timeRemaining, isThinking]);

  // Security monitoring
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C" || e.key === "i" || e.key === "j" || e.key === "c")) || 
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    if (!hasStarted) return () => document.removeEventListener("keydown", handleKeyDown);

    const handleViolation = (isStrict, reason) => {
      if (isDisqualified) return;
      if (isStrict) {
        setIsDisqualified(true);
        setViolationLog(logs => [...logs, reason]);
      } else {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setIsDisqualified(true);
            setViolationLog(logs => [...logs, "Maximum Strikes Reached (3)"]);
          } else {
            setTabSwitchWarning(true);
            setViolationLog(logs => [...logs, reason]);
          }
          return newCount;
        });
      }
    };

    const handleVisibility = () => {
      if (document.hidden) handleViolation(false, "Tab Switching Detected");
    };

    const handleBlur = () => {
      handleViolation(false, "Window Focus Lost (Split Screen)");
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && hasStarted) {
        handleViolation(true, "Exited Fullscreen Mode");
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "You are in an active interview session. Are you sure you want to leave?";
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasStarted, isDisqualified]);

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
    <div className="h-full flex flex-col gap-4 text-text p-4 relative overflow-hidden select-none">
      {/* Disqualification Modal */}
      {isDisqualified && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <div className="bg-surface border border-danger rounded-xl p-8 max-w-lg text-center shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            <AlertTriangle size={80} className="mx-auto text-danger mb-6" />
            <h2 className="text-3xl font-geist font-bold text-danger mb-4 uppercase">
              INTERVIEW TERMINATED
            </h2>
            <p className="font-bold mb-2 text-lg">
              Your interview has been terminated due to a strict violation (e.g. Tab Switching, Copy-Pasting) or Time out.
            </p>
            <p className="text-text-muted mb-6">No further actions are permitted.</p>
            <button
              onClick={() => {
                Object.keys(sessionStorage).forEach(k => {
                  if (k.startsWith('interview_')) sessionStorage.removeItem(k);
                });
                window.location.href = '/';
              }}
              className="btn bg-surface-alt border border-border px-6 py-2 rounded-lg font-bold hover:text-primary transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Pre-Interview Instructions */}
      {!hasStarted && !isDisqualified && (
        <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-geist font-bold border-b border-border pb-4 mb-4 flex items-center gap-2">
              <ShieldAlert className="text-primary" /> Interview Instructions
            </h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <p>Welcome to the AlgoNova AI Interview Simulation. Please read the rules carefully before proceeding:</p>
              
              <ul className="list-disc pl-5 space-y-2 text-text-muted">
                <li><strong>Proctoring is strict:</strong> Your webcam and microphone will be monitored. Ensure your face is clearly visible.</li>
                <li><strong>No Tab Switching or Split Screen:</strong> Leaving the window or using split screen increments a strike. 3 strikes = disqualification.</li>
                <li><strong>Fullscreen Required:</strong> Exiting fullscreen mode will result in immediate disqualification.</li>
                <li><strong>No Copy/Paste:</strong> Copying code from external sources is strictly prohibited.</li>
                <li><strong>Format:</strong> You will be assigned 3 random questions (Easy, Medium, Hard).</li>
                <li><strong>Time Limit:</strong> You have 45 minutes to complete all questions.</li>
              </ul>
            </div>
            
            <div className="bg-surface-alt border border-border p-4 rounded-lg mb-6 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="acceptRules" 
                className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                checked={instructionsAccepted}
                onChange={(e) => setInstructionsAccepted(e.target.checked)}
              />
              <label htmlFor="acceptRules" className="text-sm font-medium cursor-pointer">
                I have read and understand the instructions. I agree to be monitored and understand that violations will result in disqualification.
              </label>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  Object.keys(sessionStorage).forEach(k => {
                    if (k.startsWith('interview_')) sessionStorage.removeItem(k);
                  });
                  window.location.href = '/';
                }}
                className="btn bg-surface-alt border border-border px-4 py-2 rounded-lg text-sm font-semibold hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={startInterview}
                disabled={!instructionsAccepted}
                className="btn bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clipboard Warning Toast */}
      {clipboardWarning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 bg-danger text-surface border border-border shadow-card font-bold text-sm animate-fade-in">
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
            <h2 className="text-4xl font-geist font-bold text-danger mb-4 uppercase">
              TAB SWITCH DETECTED
            </h2>
            <p className="font-bold mb-2 text-lg">
              Switching tabs during an interview is a{" "}
              <strong className="bg-danger text-surface px-2 border border-border uppercase">serious violation</strong>.
            </p>
            <p className="font-medium mb-6">
              This has been logged. Total tab switches:{" "}
              <span className="text-danger font-bold text-xl">{tabSwitchCount} / 3</span>
            </p>
            <div className="bg-background border border-border rounded p-4 mb-6 shadow-soft">
              <p className="font-bold text-lg uppercase tracking-wider">
                Integrity Impact:{" "}
                <span className="text-danger">-5 points per switch</span>
              </p>
              <p className="text-sm font-semibold text-text-muted mt-2 uppercase">
                3 Strikes = Automatic Disqualification
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
      <div className="flex flex-wrap justify-between items-center gap-3 bg-surface p-2.5 border border-border shadow-soft rounded-lg">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-geist font-bold uppercase tracking-tight">
            Interview Sim
          </h2>
          <div className="flex items-center gap-2">
             {hasStarted && (
               <select
                 value={currentQuestionIndex}
                 onChange={(e) => {
                   const idx = Number(e.target.value);
                   setCurrentQuestionIndex(idx);
                   setTopic(assignedQuestions[idx]);
                   setResult(null);
                   setRunResult(null);
                   setCode("// Write your solution here\n");
                 }}
                 className="bg-background border border-border px-2.5 py-1 text-xs font-bold uppercase shadow-soft cursor-pointer"
               >
                 {assignedQuestions.map((q, idx) => (
                   <option key={idx} value={idx}>Q{idx + 1}: {q}</option>
                 ))}
               </select>
             )}
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-background border border-border px-2.5 py-1 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary shadow-soft cursor-pointer"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className={`flex items-center gap-1.5 px-2 py-1 border border-border rounded font-bold text-xs uppercase shadow-soft ${getBgColor(integrityScore)}`}>
            <Shield size={14} />
            <span>{integrityScore}% Integrity</span>
          </div>
          {tabSwitchCount > 0 && (
            <span className="text-[10px] font-bold text-danger uppercase tracking-wider bg-surface px-2 py-1 border-2 border-danger flex items-center gap-1 shadow-[2px_2px_0px_#ef4444]">
              <AlertTriangle size={12} /> {tabSwitchCount} switch{tabSwitchCount !== 1 ? "es" : ""}
            </span>
          )}
          {hasStarted && (
            <span className="text-xs font-bold uppercase tracking-wider bg-background px-2.5 py-1.5 border border-border shadow-soft">
              Time Left: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? "0" : ""}{timeRemaining % 60}
            </span>
          )}
        </div>
      </div>

      {/* Main Grid — Problem | Editor | Voice+Proctor */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1.2fr] gap-3 min-h-0">
        {/* Left Panel: Problem Statement */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col overflow-y-auto h-full">
          <h3 className="text-base font-bold font-geist border-b border-border pb-2 mb-3">
            {QUESTIONS[topic].title}
          </h3>
          <p className="text-sm text-text-muted mb-4 leading-relaxed">
            {QUESTIONS[topic].description}
          </p>
          <div className="bg-surface-alt border border-border p-3 rounded-lg mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">Example</p>
            <p className="font-mono text-xs mb-1">
              <strong className="text-primary">Input:</strong> {QUESTIONS[topic].exampleInput}
            </p>
            <p className="font-mono text-xs">
              <strong className="text-primary">Output:</strong> {QUESTIONS[topic].exampleOutput}
            </p>
          </div>
          <div className="bg-surface-alt border border-border p-3 rounded-lg">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">Constraints</p>
            <ul className="text-xs text-text-muted list-disc pl-4 space-y-0.5">
              {QUESTIONS[topic].constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Panel: Editor + Console */}
        <div className="bg-surface border border-border rounded-xl flex flex-col gap-0 min-h-0 h-full overflow-hidden">
          {/* Tabs */}
          <div className="flex bg-surface-alt border-b border-border flex-shrink-0">
            <button
              onClick={() => setActiveTab("code")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "code" ? "border-primary text-primary bg-surface" : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              <Code size={15} /> Code
            </button>
            <button
              onClick={() => setActiveTab("output")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === "output" ? "border-primary text-primary bg-surface" : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              <Terminal size={15} /> Output
            </button>
          </div>

          <div className="flex justify-end items-center p-2 bg-surface border-b border-border flex-shrink-0">
            <div className="flex gap-2">
              <button
                className="btn bg-surface-alt border border-border text-text text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:border-primary hover:text-primary transition-colors"
                onClick={handleRunCode}
                disabled={isRunning || isAnalyzing || !hasStarted}
              >
                <Play size={13} /> {isRunning ? "Running..." : "Run"}
              </button>
              <button
                className="btn bg-success text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:brightness-110 transition-all shadow-soft"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !hasStarted}
              >
                <Send size={13} /> Submit & Analyze
              </button>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
            <div 
              className={`flex-1 w-full min-h-0 ${activeTab === "code" ? "block" : "hidden"}`}
              onPaste={(e) => {
                e.preventDefault();
                setViolationLog(prev => [...prev, "Copy-Pasting Detected"]);
                setIsDisqualified(true);
              }}
              onCopy={(e) => {
                e.preventDefault();
                setViolationLog(prev => [...prev, "Copying Detected"]);
                setIsDisqualified(true);
              }}
            >
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                theme="vs-dark"
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "Fira Code, monospace",
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                  roundedSelection: true,
                }}
              />
            </div>
            
            <div className={`flex-1 overflow-y-auto p-4 bg-[#1e1e2e] text-[#cdd6f4] font-mono text-sm ${activeTab === "output" ? "block" : "hidden"}`}>
                {!runResult && !result && (
                  <div className="opacity-40 flex items-center justify-center h-full text-sm">
                     Awaiting execution... Click Run or Submit.
                  </div>
                )}
                
                {runResult && !result && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-2 pb-2 border-b border-white/10">
                      <span className={`px-2 py-0.5 font-semibold uppercase rounded text-xs ${runResult.status === 'passed' ? 'bg-success text-white' : runResult.status === 'error' ? 'bg-danger text-white' : 'bg-warning text-white'}`}>
                         {runResult.status === 'passed' ? 'ACCEPTED' : runResult.status === 'error' ? 'ERROR' : 'WRONG ANSWER'}
                      </span>
                      {runResult.runtime > 0 && <span className="opacity-60 text-xs">{runResult.runtime}ms</span>}
                    </div>
                    {runResult.expected && (
                       <div className="mb-2 text-xs">
                          <strong>Expected:</strong> {runResult.expected}
                       </div>
                    )}
                    <pre className="whitespace-pre-wrap text-xs">{runResult.output || "Program finished with no output."}</pre>
                  </div>
                )}

                {result && (
                  <div className="animate-fade-in text-text bg-surface p-4 rounded-xl -m-4 min-h-full">
                    <div className="flex flex-wrap justify-between items-center mb-4 pb-2 border-b border-border">
                      <h3 className="font-geist font-bold text-base">Evaluation Report</h3>
                      <div className="flex flex-wrap gap-2">
                        <div className={`px-2.5 py-1 rounded-lg font-semibold text-xs text-white ${getBgColor(result.adjustedFinalScore)}`}>
                          Adjusted: {result.adjustedFinalScore}
                        </div>
                        <div className={`px-2.5 py-1 rounded-lg font-semibold text-xs text-white ${getBgColor(result.finalScore)}`}>
                          Raw: {result.finalScore}
                        </div>
                      </div>
                    </div>

                    {result.executionResults && (
                       <div className="mb-3 border border-border rounded-lg bg-surface-alt p-3">
                          <strong className="text-xs font-semibold uppercase tracking-wider block mb-1.5 text-text-muted">Test Execution:</strong>
                          <div className="flex items-center gap-2">
                             <span className={`px-2 py-0.5 font-semibold uppercase rounded text-xs text-white ${result.executionResults.status === 'accepted' ? 'bg-success' : 'bg-danger'}`}>
                                {result.executionResults.status === 'accepted' ? 'ALL TESTS PASSED' : 'TESTS FAILED'}
                             </span>
                             <span className="font-semibold text-sm">{result.executionResults.passed}/{result.executionResults.total} Passed</span>
                          </div>
                       </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
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
                          className={`p-2 rounded-lg text-center text-white text-xs ${getBgColor(val)}`}
                        >
                          <Icon size={14} className="mx-auto mb-1" />
                          <p className="text-[10px] font-medium uppercase mb-0.5">{label}</p>
                          <p className="font-bold text-base">{val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-surface-alt border border-border p-3 rounded-lg text-sm mb-2">
                      <strong className="text-primary font-semibold text-xs uppercase tracking-wider block mb-1.5 border-b border-border pb-1">
                        AI Verdict:
                      </strong>
                      <p className="text-text-muted text-xs leading-relaxed">{result.feedback}</p>
                    </div>

                    {result.followUpQuestion && (
                      <div className="bg-primary text-white border border-border p-3 rounded-lg text-xs">
                        <strong className="block mb-1 font-semibold">💬 Follow-Up:</strong>
                        {result.followUpQuestion}
                      </div>
                    )}
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Panel: Voice + Proctoring */}
        <div className="flex flex-col gap-3 min-h-0 overflow-hidden h-full">
          <div className="flex-shrink-0">
            <VoicePanel
              transcript={transcript}
              setTranscript={setTranscript}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
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
