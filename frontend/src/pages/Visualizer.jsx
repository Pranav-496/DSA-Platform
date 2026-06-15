import React, { useState } from 'react';
import { BarChart3, Search, Link2, TreePine, GitFork, Layers, Hash, Triangle } from 'lucide-react';
import SortingVisualizer from './visualizers/SortingVisualizer';
import SearchingVisualizer from './visualizers/SearchingVisualizer';
import LinkedListVisualizer from './visualizers/LinkedListVisualizer';
import BSTVisualizer from './visualizers/BSTVisualizer';
import GraphVisualizer from './visualizers/GraphVisualizer';
import StackQueueVisualizer from './visualizers/StackQueueVisualizer';
import HashTableVisualizer from './visualizers/HashTableVisualizer';
import HeapVisualizer from './visualizers/HeapVisualizer';

const CATEGORIES = [
  { key: 'sorting', label: 'Sorting', icon: BarChart3, color: 'bg-primary', desc: 'Bubble, Selection, Insertion, Merge, Quick Sort' },
  { key: 'searching', label: 'Searching', icon: Search, color: 'bg-success', desc: 'Linear Search, Binary Search' },
  { key: 'linkedlist', label: 'Linked List', icon: Link2, color: 'bg-danger', desc: 'Insert, Delete, Search, Traverse' },
  { key: 'bst', label: 'Binary Search Tree', icon: TreePine, color: 'bg-warning', desc: 'Insert, Search, Traversals' },
  { key: 'graph', label: 'Graph Traversal', icon: GitFork, color: 'bg-primary', desc: 'BFS, DFS' },
  { key: 'stackqueue', label: 'Stack & Queue', icon: Layers, color: 'bg-success', desc: 'Push, Pop, Enqueue, Dequeue' },
  { key: 'hashtable', label: 'Hash Table', icon: Hash, color: 'bg-danger', desc: 'Insert, Search, Delete, Chaining' },
  { key: 'heap', label: 'Binary Heap', icon: Triangle, color: 'bg-warning', desc: 'Min-Heap, Max-Heap, Insert, Extract' },
];

const VISUALIZER_COMPONENTS = {
  sorting: SortingVisualizer,
  searching: SearchingVisualizer,
  linkedlist: LinkedListVisualizer,
  bst: BSTVisualizer,
  graph: GraphVisualizer,
  stackqueue: StackQueueVisualizer,
  hashtable: HashTableVisualizer,
  heap: HeapVisualizer,
};

export default function Visualizer() {
  const [activeCategory, setActiveCategory] = useState('sorting');
  const ActiveComponent = VISUALIZER_COMPONENTS[activeCategory];

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Category Sidebar */}
      <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2 overflow-y-auto brutal-card bg-surface p-4 h-full">
        <h2 className="text-xl font-black uppercase font-geist tracking-tight border-b-4 border-text pb-2 mb-2">
          Visualizer
        </h2>

        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;

          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`w-full text-left px-3 py-3 rounded-lg border-4 transition-all duration-200 group
                ${isActive
                  ? `${cat.color} border-text shadow-[2px_2px_0px_#111] -translate-y-0.5`
                  : `bg-background border-border hover:border-text hover:bg-surface`}`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={`${isActive ? (cat.color === 'bg-success' || cat.color === 'bg-danger' ? 'text-surface' : 'text-text') : 'text-text'} flex-shrink-0`} />
                <div className="min-w-0">
                  <p className={`font-black text-sm uppercase tracking-tight ${isActive ? (cat.color === 'bg-success' || cat.color === 'bg-danger' ? 'text-surface' : 'text-text') : 'text-text'}`}>
                    {cat.label}
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider truncate leading-tight mt-0.5 ${isActive ? (cat.color === 'bg-success' || cat.color === 'bg-danger' ? 'text-surface/80' : 'text-text/70') : 'opacity-70'}`}>
                    {cat.desc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Info box at bottom */}
        <div className="mt-auto pt-4">
          <div className="bg-background border-4 border-text rounded-lg p-4 shadow-[2px_2px_0px_#111]">
            <p className="font-black uppercase text-xs mb-2 border-b-2 border-text pb-1">💡 Tips</p>
            <div className="font-bold text-[10px] uppercase tracking-wide opacity-80 space-y-1">
              <p>• Speed slider controls animation</p>
              <p>• Click Run to start</p>
              <p>• Pause anytime to inspect</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 min-w-0 overflow-y-auto brutal-card bg-surface p-0 flex flex-col h-full">
        <ActiveComponent />
      </div>
    </div>
  );
}
