export const PROBLEMS = [
  {
    "id": 1,
    "title": "Two Sum",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "funcName": "twoSum",
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    "examples": [
      {
        "input": "[2,7,11,15], 9",
        "output": "[0,1]",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function twoSum(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def two_sum(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object twoSum(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[2,7,11,15], 9",
        "expected": "[0,1]"
      },
      {
        "input": "[3,2,4], 6",
        "expected": "[1,2]"
      }
    ]
  },
  {
    "id": 2,
    "title": "Binary Search",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "funcName": "search",
    "description": "Given a sorted array of integers `nums` and a target value, return the index if found. If not, return -1.",
    "examples": [
      {
        "input": "[-1,0,3,5,9,12], 9",
        "output": "4",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function search(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def search(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object search(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[-1,0,3,5,9,12], 9",
        "expected": "4"
      },
      {
        "input": "[-1,0,3,5,9,12], 2",
        "expected": "-1"
      }
    ]
  },
  {
    "id": 3,
    "title": "Valid Parentheses",
    "difficulty": "Easy",
    "tags": [
      "Stack",
      "String"
    ],
    "funcName": "isValid",
    "description": "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.",
    "examples": [
      {
        "input": "'()'",
        "output": "true",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function isValid(nums) {\n  // Write your solution here\n  return null;\n}",
      "python": "def is_valid(nums):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object isValid(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "'()'",
        "expected": "true"
      },
      {
        "input": "'(]'",
        "expected": "false"
      }
    ]
  },
  {
    "id": 4,
    "title": "Maximum Subarray",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "DP"
    ],
    "funcName": "maxSubArray",
    "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "examples": [
      {
        "input": "[-2,1,-3,4,-1,2,1,-5,4]",
        "output": "6",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function maxSubArray(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def max_sub_array(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object maxSubArray(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[-2,1,-3,4,-1,2,1,-5,4]",
        "expected": "6"
      },
      {
        "input": "[1]",
        "expected": "1"
      }
    ]
  },
  {
    "id": 5,
    "title": "Climbing Stairs",
    "difficulty": "Easy",
    "tags": [
      "DP",
      "Math"
    ],
    "funcName": "climbStairs",
    "description": "It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "examples": [
      {
        "input": "2",
        "output": "2",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function climbStairs(nums) {\n  // Write your solution here\n  return null;\n}",
      "python": "def climb_stairs(nums):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object climbStairs(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "2",
        "expected": "2"
      },
      {
        "input": "3",
        "expected": "3"
      }
    ]
  },
  {
    "id": 6,
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Sliding Window"
    ],
    "funcName": "lengthOfLongestSubstring",
    "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
    "examples": [
      {
        "input": "'abcabcbb'",
        "output": "3",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function lengthOfLongestSubstring(nums) {\n  // Write your solution here\n  return null;\n}",
      "python": "def length_of_longest_substring(nums):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object lengthOfLongestSubstring(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "'abcabcbb'",
        "expected": "3"
      },
      {
        "input": "'bbbbb'",
        "expected": "1"
      }
    ]
  },
  {
    "id": 7,
    "title": "Container With Most Water",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "funcName": "maxArea",
    "description": "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    "examples": [
      {
        "input": "[1,8,6,2,5,4,8,3,7]",
        "output": "49",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function maxArea(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def max_area(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object maxArea(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,8,6,2,5,4,8,3,7]",
        "expected": "49"
      },
      {
        "input": "[1,1]",
        "expected": "1"
      }
    ]
  },
  {
    "id": 8,
    "title": "Merge Intervals",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Sorting"
    ],
    "funcName": "merge",
    "description": "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals.",
    "examples": [
      {
        "input": "[[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function merge(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def merge(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object merge(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[[1,3],[2,6],[8,10],[15,18]]",
        "expected": "[[1,6],[8,10],[15,18]]"
      }
    ]
  },
  {
    "id": 9,
    "title": "Product of Array Except Self",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Prefix Sum"
    ],
    "funcName": "productExceptSelf",
    "description": "Return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
    "examples": [
      {
        "input": "[1,2,3,4]",
        "output": "[24,12,8,6]",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function productExceptSelf(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def product_except_self(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object productExceptSelf(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3,4]",
        "expected": "[24,12,8,6]"
      }
    ]
  },
  {
    "id": 10,
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Greedy"
    ],
    "funcName": "maxProfit",
    "description": "Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    "examples": [
      {
        "input": "[7,1,5,3,6,4]",
        "output": "5",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function maxProfit(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def max_profit(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object maxProfit(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[7,1,5,3,6,4]",
        "expected": "5"
      }
    ]
  },
  {
    "id": 11,
    "title": "Contains Duplicate",
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Hash Map"
    ],
    "funcName": "containsDuplicate",
    "description": "Return true if any value appears at least twice in the array, and return false if every element is distinct.",
    "examples": [
      {
        "input": "[1,2,3,1]",
        "output": "true",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function containsDuplicate(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def contains_duplicate(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object containsDuplicate(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3,1]",
        "expected": "true"
      },
      {
        "input": "[1,2,3,4]",
        "expected": "false"
      }
    ]
  },
  {
    "id": 12,
    "title": "Valid Anagram",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Hash Map"
    ],
    "funcName": "isAnagram",
    "description": "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    "examples": [
      {
        "input": "'anagram', 'nagaram'",
        "output": "true",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function isAnagram(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def is_anagram(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object isAnagram(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "'anagram', 'nagaram'",
        "expected": "true"
      }
    ]
  },
  {
    "id": 13,
    "title": "Group Anagrams",
    "difficulty": "Medium",
    "tags": [
      "String",
      "Hash Map"
    ],
    "funcName": "groupAnagrams",
    "description": "Given an array of strings strs, group the anagrams together.",
    "examples": [
      {
        "input": "['eat','tea','tan','ate','nat','bat']",
        "output": "[['eat','tea','ate'],['tan','nat'],['bat']]",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function groupAnagrams(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def group_anagrams(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object groupAnagrams(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "['eat','tea','tan','ate','nat','bat']",
        "expected": "[['eat','tea','ate'],['tan','nat'],['bat']]"
      }
    ]
  },
  {
    "id": 14,
    "title": "Top K Frequent Elements",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Hash Map",
      "Heap"
    ],
    "funcName": "topKFrequent",
    "description": "Given an integer array nums and an integer k, return the k most frequent elements.",
    "examples": [
      {
        "input": "[1,1,1,2,2,3], 2",
        "output": "[1,2]",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function topKFrequent(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def top_k_frequent(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object topKFrequent(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,1,1,2,2,3], 2",
        "expected": "[1,2]"
      }
    ]
  },
  {
    "id": 15,
    "title": "Valid Palindrome",
    "difficulty": "Easy",
    "tags": [
      "String",
      "Two Pointers"
    ],
    "funcName": "isPalindrome",
    "description": "Return true if it is a palindrome, or false otherwise.",
    "examples": [
      {
        "input": "'A man, a plan, a canal: Panama'",
        "output": "true",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function isPalindrome(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def is_palindrome(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object isPalindrome(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "'A man, a plan, a canal: Panama'",
        "expected": "true"
      }
    ]
  },
  {
    "id": 16,
    "title": "3Sum",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Two Pointers"
    ],
    "funcName": "threeSum",
    "description": "Return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    "examples": [
      {
        "input": "[-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function threeSum(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def three_sum(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object threeSum(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[-1,0,1,2,-1,-4]",
        "expected": "[[-1,-1,2],[-1,0,1]]"
      }
    ]
  },
  {
    "id": 17,
    "title": "Minimum Window Substring",
    "difficulty": "Hard",
    "tags": [
      "String",
      "Sliding Window"
    ],
    "funcName": "minWindow",
    "description": "Return the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
    "examples": [
      {
        "input": "'ADOBECODEBANC', 'ABC'",
        "output": "'BANC'",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function minWindow(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def min_window(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object minWindow(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "'ADOBECODEBANC', 'ABC'",
        "expected": "'BANC'"
      }
    ]
  },
  {
    "id": 18,
    "title": "Search in Rotated Sorted Array",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "funcName": "searchRotated",
    "description": "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
    "examples": [
      {
        "input": "[4,5,6,7,0,1,2], 0",
        "output": "4",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function searchRotated(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def search_rotated(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object searchRotated(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[4,5,6,7,0,1,2], 0",
        "expected": "4"
      }
    ]
  },
  {
    "id": 19,
    "title": "Find Minimum in Rotated Sorted Array",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "funcName": "findMin",
    "description": "Given the sorted rotated array nums of unique elements, return the minimum element of this array.",
    "examples": [
      {
        "input": "[3,4,5,1,2]",
        "output": "1",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function findMin(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def find_min(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object findMin(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[3,4,5,1,2]",
        "expected": "1"
      }
    ]
  },
  {
    "id": 20,
    "title": "Koko Eating Bananas",
    "difficulty": "Medium",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "funcName": "minEatingSpeed",
    "description": "Return the minimum integer k such that she can eat all the bananas within h hours.",
    "examples": [
      {
        "input": "[3,6,7,11], 8",
        "output": "4",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function minEatingSpeed(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def min_eating_speed(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object minEatingSpeed(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[3,6,7,11], 8",
        "expected": "4"
      }
    ]
  },
  {
    "id": 21,
    "title": "Algorithm Challenge: Array 21",
    "difficulty": "Easy",
    "tags": [
      "Array"
    ],
    "funcName": "solveProblem21",
    "description": "Solve the given Array problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem21(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem21(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem21(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 22,
    "title": "Algorithm Challenge: String 22",
    "difficulty": "Easy",
    "tags": [
      "String"
    ],
    "funcName": "solveProblem22",
    "description": "Solve the given String problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem22(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem22(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem22(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 23,
    "title": "Algorithm Challenge: Math 23",
    "difficulty": "Easy",
    "tags": [
      "Math"
    ],
    "funcName": "solveProblem23",
    "description": "Solve the given Math problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem23(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem23(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem23(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 24,
    "title": "Algorithm Challenge: Two Pointers 24",
    "difficulty": "Medium",
    "tags": [
      "Two Pointers"
    ],
    "funcName": "solveProblem24",
    "description": "Solve the given Two Pointers problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem24(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem24(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem24(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 25,
    "title": "Algorithm Challenge: Dynamic Programming 25",
    "difficulty": "Medium",
    "tags": [
      "Dynamic Programming"
    ],
    "funcName": "solveProblem25",
    "description": "Solve the given Dynamic Programming problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem25(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem25(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem25(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 26,
    "title": "Algorithm Challenge: Graph 26",
    "difficulty": "Medium",
    "tags": [
      "Graph"
    ],
    "funcName": "solveProblem26",
    "description": "Solve the given Graph problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem26(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem26(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem26(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 27,
    "title": "Algorithm Challenge: Tree 27",
    "difficulty": "Medium",
    "tags": [
      "Tree"
    ],
    "funcName": "solveProblem27",
    "description": "Solve the given Tree problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem27(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem27(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem27(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 28,
    "title": "Algorithm Challenge: Binary Search 28",
    "difficulty": "Medium",
    "tags": [
      "Binary Search"
    ],
    "funcName": "solveProblem28",
    "description": "Solve the given Binary Search problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem28(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem28(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem28(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 29,
    "title": "Algorithm Challenge: Sliding Window 29",
    "difficulty": "Hard",
    "tags": [
      "Sliding Window"
    ],
    "funcName": "solveProblem29",
    "description": "Solve the given Sliding Window problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem29(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem29(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem29(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 30,
    "title": "Algorithm Challenge: Backtracking 30",
    "difficulty": "Hard",
    "tags": [
      "Backtracking"
    ],
    "funcName": "solveProblem30",
    "description": "Solve the given Backtracking problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem30(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem30(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem30(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 31,
    "title": "Algorithm Challenge: Array 31",
    "difficulty": "Easy",
    "tags": [
      "Array"
    ],
    "funcName": "solveProblem31",
    "description": "Solve the given Array problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem31(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem31(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem31(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 32,
    "title": "Algorithm Challenge: String 32",
    "difficulty": "Easy",
    "tags": [
      "String"
    ],
    "funcName": "solveProblem32",
    "description": "Solve the given String problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem32(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem32(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem32(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 33,
    "title": "Algorithm Challenge: Math 33",
    "difficulty": "Easy",
    "tags": [
      "Math"
    ],
    "funcName": "solveProblem33",
    "description": "Solve the given Math problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem33(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem33(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem33(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 34,
    "title": "Algorithm Challenge: Two Pointers 34",
    "difficulty": "Medium",
    "tags": [
      "Two Pointers"
    ],
    "funcName": "solveProblem34",
    "description": "Solve the given Two Pointers problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem34(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem34(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem34(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 35,
    "title": "Algorithm Challenge: Dynamic Programming 35",
    "difficulty": "Medium",
    "tags": [
      "Dynamic Programming"
    ],
    "funcName": "solveProblem35",
    "description": "Solve the given Dynamic Programming problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem35(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem35(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem35(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 36,
    "title": "Algorithm Challenge: Graph 36",
    "difficulty": "Medium",
    "tags": [
      "Graph"
    ],
    "funcName": "solveProblem36",
    "description": "Solve the given Graph problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem36(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem36(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem36(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 37,
    "title": "Algorithm Challenge: Tree 37",
    "difficulty": "Medium",
    "tags": [
      "Tree"
    ],
    "funcName": "solveProblem37",
    "description": "Solve the given Tree problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem37(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem37(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem37(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 38,
    "title": "Algorithm Challenge: Binary Search 38",
    "difficulty": "Medium",
    "tags": [
      "Binary Search"
    ],
    "funcName": "solveProblem38",
    "description": "Solve the given Binary Search problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem38(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem38(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem38(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 39,
    "title": "Algorithm Challenge: Sliding Window 39",
    "difficulty": "Hard",
    "tags": [
      "Sliding Window"
    ],
    "funcName": "solveProblem39",
    "description": "Solve the given Sliding Window problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem39(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem39(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem39(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 40,
    "title": "Algorithm Challenge: Backtracking 40",
    "difficulty": "Hard",
    "tags": [
      "Backtracking"
    ],
    "funcName": "solveProblem40",
    "description": "Solve the given Backtracking problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem40(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem40(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem40(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 41,
    "title": "Algorithm Challenge: Array 41",
    "difficulty": "Easy",
    "tags": [
      "Array"
    ],
    "funcName": "solveProblem41",
    "description": "Solve the given Array problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem41(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem41(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem41(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 42,
    "title": "Algorithm Challenge: String 42",
    "difficulty": "Easy",
    "tags": [
      "String"
    ],
    "funcName": "solveProblem42",
    "description": "Solve the given String problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem42(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem42(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem42(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 43,
    "title": "Algorithm Challenge: Math 43",
    "difficulty": "Easy",
    "tags": [
      "Math"
    ],
    "funcName": "solveProblem43",
    "description": "Solve the given Math problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem43(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem43(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem43(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 44,
    "title": "Algorithm Challenge: Two Pointers 44",
    "difficulty": "Medium",
    "tags": [
      "Two Pointers"
    ],
    "funcName": "solveProblem44",
    "description": "Solve the given Two Pointers problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem44(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem44(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem44(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 45,
    "title": "Algorithm Challenge: Dynamic Programming 45",
    "difficulty": "Medium",
    "tags": [
      "Dynamic Programming"
    ],
    "funcName": "solveProblem45",
    "description": "Solve the given Dynamic Programming problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem45(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem45(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem45(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 46,
    "title": "Algorithm Challenge: Graph 46",
    "difficulty": "Medium",
    "tags": [
      "Graph"
    ],
    "funcName": "solveProblem46",
    "description": "Solve the given Graph problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem46(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem46(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem46(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 47,
    "title": "Algorithm Challenge: Tree 47",
    "difficulty": "Medium",
    "tags": [
      "Tree"
    ],
    "funcName": "solveProblem47",
    "description": "Solve the given Tree problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem47(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem47(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem47(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 48,
    "title": "Algorithm Challenge: Binary Search 48",
    "difficulty": "Medium",
    "tags": [
      "Binary Search"
    ],
    "funcName": "solveProblem48",
    "description": "Solve the given Binary Search problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem48(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem48(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem48(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 49,
    "title": "Algorithm Challenge: Sliding Window 49",
    "difficulty": "Hard",
    "tags": [
      "Sliding Window"
    ],
    "funcName": "solveProblem49",
    "description": "Solve the given Sliding Window problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem49(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem49(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem49(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  },
  {
    "id": 50,
    "title": "Algorithm Challenge: Backtracking 50",
    "difficulty": "Hard",
    "tags": [
      "Backtracking"
    ],
    "funcName": "solveProblem50",
    "description": "Solve the given Backtracking problem optimally. This is a synthetic problem created for practice. Implement your solution carefully considering time and space complexity.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "0",
        "explanation": ""
      }
    ],
    "starterCode": {
      "javascript": "function solveProblem50(a, b) {\n  // Write your solution here\n  return null;\n}",
      "python": "def solve_problem50(a, b):\n    # Write your solution here\n    pass",
      "java": "class Solution {\n    public Object solveProblem50(Object input) {\n        // Write your solution here\n        return null;\n    }\n}",
      "cpp": "// Write your C++ solution here\n"
    },
    "testCases": [
      {
        "input": "[1,2,3]",
        "expected": "0"
      }
    ]
  }
];