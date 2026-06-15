const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'src', 'data', 'problems.js');
let content = fs.readFileSync(filePath, 'utf-8');

const fixes = {
  1: { js: "twoSum(nums, target)", py: "two_sum(nums, target)" },
  2: { js: "search(nums, target)", py: "search(nums, target)" },
  3: { js: "isValid(s)", py: "is_valid(s)" },
  4: { js: "maxSubArray(nums)", py: "max_sub_array(nums)" },
  5: { js: "climbStairs(n)", py: "climb_stairs(n)" },
  6: { js: "lengthOfLongestSubstring(s)", py: "length_of_longest_substring(s)" },
  7: { js: "maxArea(height)", py: "max_area(height)" },
  8: { js: "merge(intervals)", py: "merge(intervals)" },
  9: { js: "productExceptSelf(nums)", py: "product_except_self(nums)" },
  10: { js: "maxProfit(prices)", py: "max_profit(prices)" },
  11: { js: "containsDuplicate(nums)", py: "contains_duplicate(nums)" },
  12: { js: "isAnagram(s, t)", py: "is_anagram(s, t)" },
  13: { js: "groupAnagrams(strs)", py: "group_anagrams(strs)" },
  14: { js: "topKFrequent(nums, k)", py: "top_k_frequent(nums, k)" },
  15: { js: "isPalindrome(s)", py: "is_palindrome(s)" },
  16: { js: "threeSum(nums)", py: "three_sum(nums)" },
  17: { js: "minWindow(s, t)", py: "min_window(s, t)" },
  18: { js: "searchRotated(nums, target)", py: "search_rotated(nums, target)" },
  19: { js: "findMin(nums)", py: "find_min(nums)" },
  20: { js: "minEatingSpeed(piles, h)", py: "min_eating_speed(piles, h)" }
};

// We will parse the file using a simple regex since it's a JS object structure.
// For each problem ID 1-20, we replace the `javascript` and `python` starter code lines.
for (let id = 1; id <= 20; id++) {
  const fix = fixes[id];
  
  // Find the block for this ID
  const idMatch = new RegExp(`"id":\\s*${id}\\s*,[\\s\\S]*?"starterCode":\\s*{[\\s\\S]*?}`, 'g');
  
  content = content.replace(idMatch, (match) => {
    let newMatch = match;
    // Replace JS
    newMatch = newMatch.replace(/"javascript":\s*"function\s+\w+\([^)]*\)/, `"javascript": "function ${fix.js}`);
    // Replace Python
    newMatch = newMatch.replace(/"python":\s*"def\s+\w+\([^)]*\)/, `"python": "def ${fix.py}`);
    return newMatch;
  });
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Fixed starter code parameters in problems.js");
