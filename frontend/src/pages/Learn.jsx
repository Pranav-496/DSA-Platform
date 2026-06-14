import React, { useState } from "react";
import {
  Play,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Code,
  Clock,
  Zap,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const MODULES = [
  {
    title: "Arrays & Sorting",
    desc: "Master array operations, Bubble Sort, Merge Sort, and Two Pointers.",
    progress: 100,
    quizTopic: "sorting",
    difficulty: "Beginner",
    estimatedTime: "2 hours",
    subtopics: [
      {
        name: "Array Basics",
        content:
          "Arrays are contiguous blocks of memory that store elements of the same type. Access is O(1) by index, insertion/deletion is O(n) due to shifting.",
      },
      {
        name: "Bubble Sort",
        content:
          "Compare adjacent elements and swap if out of order. Repeat until sorted. Time: O(n²), Space: O(1). Stable sort.",
      },
      {
        name: "Selection Sort",
        content:
          "Find the minimum element in the unsorted portion and place it at the beginning. Time: O(n²), Space: O(1). Not stable.",
      },
      {
        name: "Merge Sort",
        content:
          "Divide array in half, recursively sort each half, then merge. Time: O(n log n), Space: O(n). Stable sort, uses divide & conquer.",
      },
      {
        name: "Quick Sort",
        content:
          "Pick a pivot, partition elements around it, recursively sort partitions. Average: O(n log n), Worst: O(n²), Space: O(log n).",
      },
      {
        name: "Two Pointers",
        content:
          "Use two pointers moving towards each other or in the same direction on a sorted array. Useful for pair sum, removing duplicates, etc.",
      },
    ],
  },
  {
    title: "Trees & BST",
    desc: "Traverse binary trees with BFS, DFS, and master BST operations.",
    progress: 40,
    quizTopic: "trees",
    difficulty: "Intermediate",
    estimatedTime: "3 hours",
    subtopics: [
      {
        name: "Binary Tree Basics",
        content:
          "A tree where each node has at most two children (left and right). Used for hierarchical data representation.",
      },
      {
        name: "Tree Traversals",
        content:
          "In-order (Left→Root→Right), Pre-order (Root→Left→Right), Post-order (Left→Right→Root), Level-order (BFS).",
      },
      {
        name: "Binary Search Tree",
        content:
          "BST property: left subtree < root < right subtree. Enables O(log n) search, insert, delete on average.",
      },
      {
        name: "BST Operations",
        content:
          "Search: compare with root, go left/right. Insert: find correct null position. Delete: handle 0, 1, or 2 children cases.",
      },
    ],
  },
  {
    title: "Graphs",
    desc: "Learn graph representations, BFS, DFS, and shortest paths.",
    progress: 20,
    quizTopic: "graphs",
    difficulty: "Intermediate",
    estimatedTime: "4 hours",
    subtopics: [
      {
        name: "Graph Representation",
        content:
          "Adjacency Matrix (O(V²) space, O(1) lookup) vs Adjacency List (O(V+E) space, efficient for sparse graphs).",
      },
      {
        name: "BFS (Breadth-First Search)",
        content:
          "Uses a queue, explores level by level. Time: O(V+E). Used for shortest path in unweighted graphs.",
      },
      {
        name: "DFS (Depth-First Search)",
        content:
          "Uses a stack/recursion, explores as deep as possible. Time: O(V+E). Used for cycle detection, topological sort.",
      },
      {
        name: "Shortest Paths",
        content:
          "Dijkstra (non-negative weights, O((V+E)logV)), Bellman-Ford (handles negative weights, O(VE)).",
      },
    ],
  },
  {
    title: "Dynamic Programming",
    desc: "Optimize recursive approaches with memoization and tabulation.",
    progress: 0,
    quizTopic: "dp",
    difficulty: "Advanced",
    estimatedTime: "5 hours",
    subtopics: [
      {
        name: "DP Fundamentals",
        content:
          "DP applies when a problem has optimal substructure and overlapping subproblems. Two approaches: top-down (memoization) and bottom-up (tabulation).",
      },
      {
        name: "Classic Problems",
        content:
          "Fibonacci, Climbing Stairs, Coin Change, Longest Common Subsequence, 0/1 Knapsack, Edit Distance.",
      },
      {
        name: "Memoization",
        content:
          "Top-down approach: solve recursively but cache results of subproblems. Often easier to implement from recursive solution.",
      },
      {
        name: "Tabulation",
        content:
          "Bottom-up approach: build solution iteratively from smallest subproblems. Often more space-efficient.",
      },
    ],
  },
  {
    title: "Hashing",
    desc: "Understand hash tables, collision resolution, and applications.",
    progress: 0,
    quizTopic: "hashing",
    difficulty: "Intermediate",
    estimatedTime: "2 hours",
    subtopics: [
      {
        name: "Hash Functions",
        content:
          "Maps keys to array indices. Good hash functions distribute keys uniformly. Common: division method (k mod m).",
      },
      {
        name: "Collision Resolution",
        content:
          "Separate Chaining (linked list per bucket) vs Open Addressing (linear probing, quadratic probing, double hashing).",
      },
      {
        name: "Applications",
        content:
          "Two Sum problem, frequency counting, caching (LRU), duplicate detection, string matching (Rabin-Karp).",
      },
    ],
  },
  {
    title: "Stacks & Queues",
    desc: "Master LIFO/FIFO structures and their applications.",
    progress: 0,
    quizTopic: "arrays",
    difficulty: "Beginner",
    estimatedTime: "1.5 hours",
    subtopics: [
      {
        name: "Stack (LIFO)",
        content:
          "Last In First Out. Operations: push, pop, peek — all O(1). Used in: undo operations, balanced parentheses, function call stack.",
      },
      {
        name: "Queue (FIFO)",
        content:
          "First In First Out. Operations: enqueue, dequeue, front — all O(1). Used in: BFS, task scheduling, buffering.",
      },
      {
        name: "Applications",
        content:
          "Stack: expression evaluation, backtracking. Queue: level-order traversal, producer-consumer. Deque: sliding window maximum.",
      },
    ],
  },
];

const difficultyColors = {
  Beginner: "bg-success text-surface border-2 border-text",
  Intermediate: "bg-warning text-text border-2 border-text",
  Advanced: "bg-danger text-surface border-2 border-text",
};

export default function Learn() {
  const [expandedIdx, setExpandedIdx] = useState(-1);

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-geist font-black uppercase tracking-tight">
          Learning Paths
        </h2>
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm bg-surface border-4 border-text px-4 py-2 rounded-lg shadow-brutal-sm">
          <BookOpen size={20} />
          <span>{MODULES.length} modules</span>
        </div>
      </div>

      <div className="grid gap-6">
        {MODULES.map((mod, idx) => {
          const isExpanded = expandedIdx === idx;
          return (
            <div
              key={idx}
              className={`brutal-card bg-surface transition-all duration-200
              ${isExpanded ? "shadow-brutal-lg -translate-y-1" : ""}`}
            >
              {/* Header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedIdx(isExpanded ? -1 : idx)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 bg-background border-4 border-text p-2 rounded-lg">
                      {isExpanded ? (
                        <ChevronDown size={24} className="text-text" />
                      ) : (
                        <ChevronRight size={24} className="text-text" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black font-geist uppercase tracking-tight">
                          {mod.title}
                        </h3>
                        <span
                          className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${difficultyColors[mod.difficulty]}`}
                        >
                          {mod.difficulty}
                        </span>
                      </div>
                      <p className="font-medium text-text/80">{mod.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 md:ml-4 flex-shrink-0">
                    <div className="flex items-center gap-2 font-bold text-sm bg-background border-2 border-text px-3 py-1 rounded">
                      <Clock size={16} />
                      <span>{mod.estimatedTime}</span>
                    </div>
                    <div className="w-32">
                      <div className="w-full bg-background border-2 border-text rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-primary h-full border-r-2 border-text transition-all"
                          style={{ width: `${mod.progress}%` }}
                        />
                      </div>
                      <p className="text-xs font-bold text-right mt-1 uppercase tracking-wider">
                        {mod.progress}% Done
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t-4 border-text p-6 bg-background rounded-b-sm space-y-4">
                  {mod.subtopics.map((sub, subIdx) => (
                    <div
                      key={subIdx}
                      className="bg-surface border-4 border-text rounded-lg p-5 hover:-translate-y-1 transition-transform shadow-brutal-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary border-2 border-text p-1.5 rounded">
                          <Code size={18} className="text-text" />
                        </div>
                        <h4 className="font-bold text-lg uppercase tracking-tight">
                          {sub.name}
                        </h4>
                      </div>
                      <p className="font-medium leading-relaxed">
                        {sub.content}
                      </p>
                    </div>
                  ))}

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link
                      to={`/quiz/${mod.quizTopic}`}
                      className="brutal-btn-secondary flex items-center gap-2 bg-warning flex-1 justify-center"
                    >
                      <Zap size={20} /> Take Quiz
                    </Link>
                    <Link
                      to="/visualize"
                      className="brutal-btn flex items-center gap-2 flex-1 justify-center"
                    >
                      <BarChart3 size={20} /> Visualize
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
