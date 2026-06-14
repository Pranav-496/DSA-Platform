const express = require("express");
const router = express.Router();

// ============================================
// Real Code Execution Engine via Piston API
// ============================================

const PISTON_API = "https://emkc.org/api/v2/piston/execute";

const LANGUAGE_CONFIG = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "c++", version: "10.2.0" },
};

// Special test case wrappers for problems that need custom data structure building (like Linked Lists)
const SPECIAL_WRAPPERS = {
  javascript: {
    reverseList: (userCode, input) => {
      return `${userCode}
function buildList(arr) { if (!arr.length) return null; let head = { val: arr[0], next: null }; let current = head; for (let i = 1; i < arr.length; i++) { current.next = { val: arr[i], next: null }; current = current.next; } return head; }
function listToArray(head) { const result = []; while (head) { result.push(head.val); head = head.next; } return result; }
const head = buildList(${input});
const result = reverseList(head);
console.log(JSON.stringify(listToArray(result)));`;
    },
    mergeTwoLists: (userCode, input) => {
      const parts = input.split("], ");
      const l1 = parts[0] + "]";
      const l2 = parts[1];
      return `${userCode}
function buildList(arr) { if (!arr.length) return null; let head = { val: arr[0], next: null }; let current = head; for (let i = 1; i < arr.length; i++) { current.next = { val: arr[i], next: null }; current = current.next; } return head; }
function listToArray(head) { const result = []; while (head) { result.push(head.val); head = head.next; } return result; }
const l1 = buildList(${l1});
const l2 = buildList(${l2});
const result = mergeTwoLists(l1, l2);
console.log(JSON.stringify(listToArray(result)));`;
    }
  },
  python: {
    reverseList: (userCode, input) => {
      return `import json\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\ndef build_list(arr):\n    if not arr: return None\n    head = ListNode(arr[0])\n    curr = head\n    for v in arr[1:]:\n        curr.next = ListNode(v)\n        curr = curr.next\n    return head\ndef list_to_array(head):\n    result = []\n    while head:\n        result.append(head.val)\n        head = head.next\n    return result\n${userCode}\nhead = build_list(${input})\nresult = reverse_list(head)\nprint(json.dumps(list_to_array(result)))`;
    },
    mergeTwoLists: (userCode, input) => {
      const parts = input.split("], ");
      const l1 = parts[0] + "]";
      const l2 = parts[1];
      return `import json\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\ndef build_list(arr):\n    if not arr: return None\n    head = ListNode(arr[0])\n    curr = head\n    for v in arr[1:]:\n        curr.next = ListNode(v)\n        curr = curr.next\n    return head\ndef list_to_array(head):\n    result = []\n    while head:\n        result.append(head.val)\n        head = head.next\n    return result\n${userCode}\nl1 = build_list(${l1})\nl2 = build_list(${l2})\nresult = merge_two_lists(l1, l2)\nprint(json.dumps(list_to_array(result)))`;
    }
  }
};

/**
 * POST /code/run — Run code against a single test case (quick feedback)
 */
router.post("/run", async (req, res) => {
  try {
    const { code, language, problemId, testCase, funcName } = req.body;
    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required" });
    }

    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
      return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    // If there's a test case and funcName, wrap the code
    let execCode = code;

    if (testCase && funcName) {
      const lang = language === "cpp" ? null : language;
      const wrappers = SPECIAL_WRAPPERS[lang];
      if (wrappers && wrappers[funcName]) {
        execCode = wrappers[funcName](code, testCase.input);
      } else if (lang === "javascript") {
        // Generic wrapper for array/string args (fixes formatting issues)
        let formattedArgs = testCase.input;
        if (!formattedArgs.startsWith("[") && formattedArgs.includes("], ")) {
          formattedArgs = formattedArgs.split("], ").map((s, i) => i === 0 ? s + "]" : s).join(", ");
        }
        execCode = `${code}\nconst result = ${funcName}(${formattedArgs});\nconsole.log(JSON.stringify(result));`;
      } else if (lang === "python") {
        let formattedArgs = testCase.input;
        if (!formattedArgs.startsWith("[") && formattedArgs.includes("], ")) {
          formattedArgs = formattedArgs.split("], ").map((s, i) => i === 0 ? s + "]" : s).join(", ");
        }
        const pyFunc = funcName.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase());
        execCode = `import json\n${code}\nresult = ${pyFunc}(${formattedArgs})\nprint(json.dumps(result))`;
      }
    }

    const startTime = Date.now();
    const pistonRes = await fetch(PISTON_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [{ content: execCode }],
      }),
    });
    const elapsed = Date.now() - startTime;
    const pistonData = await pistonRes.json();

    if (!pistonData.run) {
      return res.json({
        status: "error",
        output: pistonData.message || "Execution failed",
        runtime: 0,
      });
    }

    const stdout = (pistonData.run.stdout || "").trim();
    const stderr = (pistonData.run.stderr || "").trim();

    if (pistonData.run.code !== 0) {
      return res.json({
        status: "error",
        output: stderr || stdout,
        runtime: elapsed,
        error: "Runtime/compilation error",
      });
    }

    // Compare output if we have expected
    let passed = false;
    if (testCase && testCase.expected) {
      passed = normalizeOutput(stdout) === normalizeOutput(testCase.expected);
    }

    res.json({
      status: passed ? "passed" : "wrong_answer",
      output: stdout,
      expected: testCase?.expected || null,
      passed,
      runtime: elapsed,
    });
  } catch (error) {
    console.error("Code run error:", error);
    res.status(500).json({ error: "Code execution failed" });
  }
});

/**
 * POST /code/submit — Run code against ALL test cases for a problem
 * Returns detailed verdict per test case
 */
router.post("/submit", async (req, res) => {
  try {
    const { code, language, problemId, testCases, funcName } = req.body;
    if (!code || !language || !testCases) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
      return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    const lang = language === "cpp" ? null : language;
    const wrappers = SPECIAL_WRAPPERS[lang];

    const results = [];
    let totalPassed = 0;
    let totalRuntime = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      let execCode = code;

      if (funcName && wrappers && wrappers[funcName]) {
        execCode = wrappers[funcName](code, tc.input);
      } else if (lang === "javascript" && funcName) {
        let formattedArgs = tc.input;
        if (!formattedArgs.startsWith("[") && formattedArgs.includes("], ")) {
          formattedArgs = formattedArgs.split("], ").map((s, i) => i === 0 ? s + "]" : s).join(", ");
        }
        execCode = `${code}\nconst result = ${funcName}(${formattedArgs});\nconsole.log(JSON.stringify(result));`;
      } else if (lang === "python" && funcName) {
        let formattedArgs = tc.input;
        if (!formattedArgs.startsWith("[") && formattedArgs.includes("], ")) {
          formattedArgs = formattedArgs.split("], ").map((s, i) => i === 0 ? s + "]" : s).join(", ");
        }
        const pyFunc = funcName.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase());
        execCode = `import json\n${code}\nresult = ${pyFunc}(${formattedArgs})\nprint(json.dumps(result))`;
      }

      try {
        const startTime = Date.now();
        const pistonRes = await fetch(PISTON_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: langConfig.language,
            version: langConfig.version,
            files: [{ content: execCode }],
          }),
        });
        const elapsed = Date.now() - startTime;
        totalRuntime += elapsed;
        const pistonData = await pistonRes.json();

        if (!pistonData.run || pistonData.run.code !== 0) {
          const errorMsg = pistonData.run
            ? (pistonData.run.stderr || pistonData.run.stdout || "Runtime error")
            : (pistonData.message || "Execution failed");
          results.push({
            testCase: i + 1,
            input: tc.input,
            expected: tc.expected,
            actual: null,
            passed: false,
            runtime: elapsed,
            error: errorMsg.trim(),
          });
          continue;
        }

        const stdout = (pistonData.run.stdout || "").trim();
        const passed = normalizeOutput(stdout) === normalizeOutput(tc.expected);
        if (passed) totalPassed++;

        results.push({
          testCase: i + 1,
          input: tc.input,
          expected: tc.expected,
          actual: stdout,
          passed,
          runtime: elapsed,
          error: null,
        });
      } catch (err) {
        results.push({
          testCase: i + 1,
          input: tc.input,
          expected: tc.expected,
          actual: null,
          passed: false,
          runtime: 0,
          error: "Execution timeout or network error",
        });
      }
    }

    const allPassed = totalPassed === testCases.length;

    res.json({
      status: allPassed ? "accepted" : "wrong_answer",
      passed: totalPassed,
      total: testCases.length,
      passPercentage: Math.round((totalPassed / testCases.length) * 100),
      totalRuntime,
      avgRuntime: Math.round(totalRuntime / testCases.length),
      results,
      failed_cases: results.filter((r) => !r.passed),
    });
  } catch (error) {
    console.error("Code submit error:", error);
    res.status(500).json({ error: "Code submission failed" });
  }
});

/**
 * Normalize output for comparison — handles whitespace, quotes, brackets
 */
function normalizeOutput(str) {
  if (!str) return "";
  return str
    .replace(/\s+/g, "")
    .replace(/'/g, '"')
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/None/g, "null")
    .toLowerCase();
}

module.exports = router;
