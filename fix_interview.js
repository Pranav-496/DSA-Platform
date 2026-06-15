const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'InterviewPrep.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const newQuestions = `const QUESTIONS = {
  "Binary Search": {
    title: "Binary Search",
    funcName: "search",
    description: "Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.",
    exampleInput: "nums = [-1,0,3,5,9,12], target = 9",
    exampleOutput: "4",
    constraints: ["1 <= nums.length <= 10^4", "All the integers in \`nums\` are unique."],
    starterCode: {
      javascript: "function search(nums, target) {\\n  // Write your solution here\\n  return -1;\\n}",
      python: "def search(nums, target):\\n    # Write your solution here\\n    return -1",
      java: "class Solution {\\n    public int search(int[] nums, int target) {\\n        // Write your solution here\\n        return -1;\\n    }\\n}",
      cpp: "int search(vector<int>& nums, int target) {\\n    // Write your solution here\\n    return -1;\\n}"
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
      javascript: "function bubbleSort(nums) {\\n  // Write your solution here\\n  return nums;\\n}",
      python: "def bubble_sort(nums):\\n    # Write your solution here\\n    return nums",
      java: "class Solution {\\n    public int[] bubbleSort(int[] nums) {\\n        // Write your solution here\\n        return nums;\\n    }\\n}",
      cpp: "vector<int> bubbleSort(vector<int>& nums) {\\n    // Write your solution here\\n    return nums;\\n}"
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
      javascript: "function mergeSort(nums) {\\n  // Write your solution here\\n  return nums;\\n}",
      python: "def merge_sort(nums):\\n    # Write your solution here\\n    return nums",
      java: "class Solution {\\n    public int[] mergeSort(int[] nums) {\\n        // Write your solution here\\n        return nums;\\n    }\\n}",
      cpp: "vector<int> mergeSort(vector<int>& nums) {\\n    // Write your solution here\\n    return nums;\\n}"
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
      javascript: "function quickSort(nums) {\\n  // Write your solution here\\n  return nums;\\n}",
      python: "def quick_sort(nums):\\n    # Write your solution here\\n    return nums",
      java: "class Solution {\\n    public int[] quickSort(int[] nums) {\\n        // Write your solution here\\n        return nums;\\n    }\\n}",
      cpp: "vector<int> quickSort(vector<int>& nums) {\\n    // Write your solution here\\n    return nums;\\n}"
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
      javascript: "function numIslands(grid) {\\n  // Write your BFS solution here\\n  return 0;\\n}",
      python: "def num_islands(grid):\\n    # Write your BFS solution here\\n    return 0",
      java: "class Solution {\\n    public int numIslands(char[][] grid) {\\n        // Write your BFS solution here\\n        return 0;\\n    }\\n}",
      cpp: "int numIslands(vector<vector<char>>& grid) {\\n    // Write your BFS solution here\\n    return 0;\\n}"
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
      javascript: "function maxDepth(root) {\\n  // Write your DFS solution here\\n  // root is an array representation: [3,9,20,null,null,15,7]\\n  if (!root || root.length === 0) return 0;\\n  return 0;\\n}",
      python: "def max_depth(root):\\n    # Write your DFS solution here\\n    # root is an array representation: [3,9,20,None,None,15,7]\\n    if not root: return 0\\n    return 0",
      java: "class Solution {\\n    public int maxDepth(int[] root) {\\n        // Write your DFS solution here\\n        return 0;\\n    }\\n}",
      cpp: "int maxDepth(vector<int>& root) {\\n    // Write your DFS solution here\\n    return 0;\\n}"
    },
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expected: "3" },
      { input: "[1,null,2]", expected: "2" }
    ]
  },
  "Hash Map": {
    title: "Two Sum (Hash Map)",
    funcName: "twoSum",
    description: "Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`. You must solve it using a Hash Map.",
    exampleInput: "nums = [2,7,11,15], target = 9",
    exampleOutput: "[0, 1]",
    constraints: ["2 <= nums.length <= 10^4", "Only one valid answer exists."],
    starterCode: {
      javascript: "function twoSum(nums, target) {\\n  // Write your solution using a Hash Map\\n  return [];\\n}",
      python: "def two_sum(nums, target):\\n    # Write your solution using a Hash Map\\n    return []",
      java: "class Solution {\\n    public int[] twoSum(int[] nums, int target) {\\n        // Write your solution using a Hash Map\\n        return new int[]{};\\n    }\\n}",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) {\\n    // Write your solution using a Hash Map\\n    return {};\\n}"
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
      javascript: "function isPalindrome(s) {\\n  // Write your Two Pointers solution here\\n  return false;\\n}",
      python: "def is_palindrome(s):\\n    # Write your Two Pointers solution here\\n    return False",
      java: "class Solution {\\n    public boolean isPalindrome(String s) {\\n        // Write your Two Pointers solution here\\n        return false;\\n    }\\n}",
      cpp: "bool isPalindrome(string s) {\\n    // Write your Two Pointers solution here\\n    return false;\\n}"
    },
    testCases: [
      { input: "'A man, a plan, a canal: Panama'", expected: "true" },
      { input: "'race a car'", expected: "false" }
    ]
  }
};`;

// Replace QUESTIONS
content = content.replace(/const QUESTIONS = {[\s\S]*?^};\n/m, newQuestions + '\n');

// Replace handleRunCode lines
const runCodeRegex1 = /const testCase = \{ input: currentProblem\.exampleInput, expected: currentProblem\.exampleOutput \};\s+const funcName = currentProblem\.title\.replace\(\/\\s\/g, ""\); \/\/ basic camelcase approx/;
content = content.replace(runCodeRegex1, `const tc = currentProblem.testCases ? currentProblem.testCases[0] : { input: currentProblem.exampleInput, expected: currentProblem.exampleOutput };
      const funcName = currentProblem.funcName || currentProblem.title.replace(/\\s/g, "");`);

content = content.replace(/testCase,\s+funcName/, 'testCase: tc,\n          funcName');

// Replace handleAnalyze lines
const analyzeRegex1 = /const funcName = currentProblem\.title\.replace\(\/\\s\/g, ""\);/;
content = content.replace(analyzeRegex1, 'const funcName = currentProblem.funcName || currentProblem.title.replace(/\\s/g, "");');

const analyzeRegex2 = /testCases: \[\{ input: currentProblem\.exampleInput, expected: currentProblem\.exampleOutput \}\],/;
content = content.replace(analyzeRegex2, `testCases: currentProblem.testCases || [{ input: currentProblem.exampleInput, expected: currentProblem.exampleOutput }],`);

// Add useEffect
const useEffectRegex = /(const currentProblem = QUESTIONS\[topic\];\n?)([\s\S]*?)(const handleRunCode = async \(\) => {)/;
const useEffectReplacement = `$1
  useEffect(() => {
    const q = QUESTIONS[topic];
    if (q && q.starterCode && q.starterCode[language]) {
      setCode(q.starterCode[language]);
    } else {
      setCode("// Write your solution here\\n");
    }
    setResult(null);
    setRunResult(null);
    setTranscript("");
    setThinkingTime(0);
    setIsThinking(true);
  }, [topic, language]);
$2$3`;

content = content.replace(useEffectRegex, useEffectReplacement);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Fixed InterviewPrep.jsx");
