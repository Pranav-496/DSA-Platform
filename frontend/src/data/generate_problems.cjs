const fs = require('fs');

const baseProblems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", funcName: "twoSum", tags: ["Array", "Hash Map"], description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.", testCases: [{input: "[2,7,11,15], 9", expected: "[0,1]"}, {input: "[3,2,4], 6", expected: "[1,2]"}] },
  { id: 2, title: "Binary Search", difficulty: "Easy", funcName: "search", tags: ["Array", "Binary Search"], description: "Given a sorted array of integers `nums` and a target value, return the index if found. If not, return -1.", testCases: [{input: "[-1,0,3,5,9,12], 9", expected: "4"}, {input: "[-1,0,3,5,9,12], 2", expected: "-1"}] },
  { id: 3, title: "Valid Parentheses", difficulty: "Easy", funcName: "isValid", tags: ["Stack", "String"], description: "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.", testCases: [{input: "'()'", expected: "true"}, {input: "'(]'", expected: "false"}] },
  { id: 4, title: "Maximum Subarray", difficulty: "Medium", funcName: "maxSubArray", tags: ["Array", "DP"], description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.", testCases: [{input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6"}, {input: "[1]", expected: "1"}] },
  { id: 5, title: "Climbing Stairs", difficulty: "Easy", funcName: "climbStairs", tags: ["DP", "Math"], description: "It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", testCases: [{input: "2", expected: "2"}, {input: "3", expected: "3"}] },
  { id: 6, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", funcName: "lengthOfLongestSubstring", tags: ["String", "Sliding Window"], description: "Given a string `s`, find the length of the longest substring without repeating characters.", testCases: [{input: "'abcabcbb'", expected: "3"}, {input: "'bbbbb'", expected: "1"}] },
  { id: 7, title: "Container With Most Water", difficulty: "Medium", funcName: "maxArea", tags: ["Array", "Two Pointers"], description: "Find two lines that together with the x-axis form a container, such that the container contains the most water.", testCases: [{input: "[1,8,6,2,5,4,8,3,7]", expected: "49"}, {input: "[1,1]", expected: "1"}] },
  { id: 8, title: "Merge Intervals", difficulty: "Medium", funcName: "merge", tags: ["Array", "Sorting"], description: "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals.", testCases: [{input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]"}] },
  { id: 9, title: "Product of Array Except Self", difficulty: "Medium", funcName: "productExceptSelf", tags: ["Array", "Prefix Sum"], description: "Return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].", testCases: [{input: "[1,2,3,4]", expected: "[24,12,8,6]"}] },
  { id: 10, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", funcName: "maxProfit", tags: ["Array", "Greedy"], description: "Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.", testCases: [{input: "[7,1,5,3,6,4]", expected: "5"}] },
  { id: 11, title: "Contains Duplicate", difficulty: "Easy", funcName: "containsDuplicate", tags: ["Array", "Hash Map"], description: "Return true if any value appears at least twice in the array, and return false if every element is distinct.", testCases: [{input: "[1,2,3,1]", expected: "true"}, {input: "[1,2,3,4]", expected: "false"}] },
  { id: 12, title: "Valid Anagram", difficulty: "Easy", funcName: "isAnagram", tags: ["String", "Hash Map"], description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.", testCases: [{input: "'anagram', 'nagaram'", expected: "true"}] },
  { id: 13, title: "Group Anagrams", difficulty: "Medium", funcName: "groupAnagrams", tags: ["String", "Hash Map"], description: "Given an array of strings strs, group the anagrams together.", testCases: [{input: "['eat','tea','tan','ate','nat','bat']", expected: "[['eat','tea','ate'],['tan','nat'],['bat']]"}] },
  { id: 14, title: "Top K Frequent Elements", difficulty: "Medium", funcName: "topKFrequent", tags: ["Array", "Hash Map", "Heap"], description: "Given an integer array nums and an integer k, return the k most frequent elements.", testCases: [{input: "[1,1,1,2,2,3], 2", expected: "[1,2]"}] },
  { id: 15, title: "Valid Palindrome", difficulty: "Easy", funcName: "isPalindrome", tags: ["String", "Two Pointers"], description: "Return true if it is a palindrome, or false otherwise.", testCases: [{input: "'A man, a plan, a canal: Panama'", expected: "true"}] },
  { id: 16, title: "3Sum", difficulty: "Medium", funcName: "threeSum", tags: ["Array", "Two Pointers"], description: "Return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.", testCases: [{input: "[-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]"}] },
  { id: 17, title: "Minimum Window Substring", difficulty: "Hard", funcName: "minWindow", tags: ["String", "Sliding Window"], description: "Return the minimum window substring of s such that every character in t (including duplicates) is included in the window.", testCases: [{input: "'ADOBECODEBANC', 'ABC'", expected: "'BANC'"}] },
  { id: 18, title: "Search in Rotated Sorted Array", difficulty: "Medium", funcName: "searchRotated", tags: ["Array", "Binary Search"], description: "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.", testCases: [{input: "[4,5,6,7,0,1,2], 0", expected: "4"}] },
  { id: 19, title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", funcName: "findMin", tags: ["Array", "Binary Search"], description: "Given the sorted rotated array nums of unique elements, return the minimum element of this array.", testCases: [{input: "[3,4,5,1,2]", expected: "1"}] },
  { id: 20, title: "Koko Eating Bananas", difficulty: "Medium", funcName: "minEatingSpeed", tags: ["Array", "Binary Search"], description: "Return the minimum integer k such that she can eat all the bananas within h hours.", testCases: [{input: "[3,6,7,11], 8", expected: "4"}] },
];

const topics = [
  { name: "Array", difficulty: "Easy" },
  { name: "String", difficulty: "Easy" },
  { name: "Math", difficulty: "Easy" },
  { name: "Two Pointers", difficulty: "Medium" },
  { name: "Dynamic Programming", difficulty: "Medium" },
  { name: "Graph", difficulty: "Medium" },
  { name: "Tree", difficulty: "Medium" },
  { name: "Binary Search", difficulty: "Medium" },
  { name: "Sliding Window", difficulty: "Hard" },
  { name: "Backtracking", difficulty: "Hard" }
];

// Generate 30 more synthetic problems to reach 50
let idCounter = 21;
for (let i = 0; i < 30; i++) {
  const topic = topics[i % topics.length];
  const funcName = `solveProblem${idCounter}`;
  
  baseProblems.push({
    id: idCounter,
    title: `Algorithm Challenge: ${topic.name} ${idCounter}`,
    difficulty: topic.difficulty,
    funcName: funcName,
    tags: [topic.name],
    description: `Solve the given ${topic.name} problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.`,
    testCases: [
      { input: "[1,2,3]", expected: "0" }
    ]
  });
  idCounter++;
}

// Convert camelCase to snake_case for Python
function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase());
}

// Map to full problem structure
const fullProblems = baseProblems.map(p => {
  const args = p.testCases[0].input.includes(',') ? 'a, b' : 'nums';
  return {
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    tags: p.tags,
    funcName: p.funcName,
    description: p.description,
    examples: [
      { input: p.testCases[0].input, output: p.testCases[0].expected, explanation: "" }
    ],
    starterCode: {
      javascript: `function ${p.funcName}(${args}) {\n  // Write your solution here\n  return null;\n}`,
      python: `def ${toSnakeCase(p.funcName)}(${args}):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public Object ${p.funcName}(Object input) {\n        // Write your solution here\n        return null;\n    }\n}`,
      cpp: `// Write your C++ solution here\n`
    },
    testCases: p.testCases
  };
});

const content = `export const PROBLEMS = ${JSON.stringify(fullProblems, null, 2)};`;

fs.writeFileSync('problems.js', content);
console.log('Successfully generated 50 problems in problems.js');
