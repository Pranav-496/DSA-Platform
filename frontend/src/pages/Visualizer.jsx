import React, { useState } from 'react';
import { BarChart3, Search, Link2, TreePine, GitFork, Layers, Hash, Triangle, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import SortingVisualizer from './visualizers/SortingVisualizer';
import SearchingVisualizer from './visualizers/SearchingVisualizer';
import LinkedListVisualizer from './visualizers/LinkedListVisualizer';
import BSTVisualizer from './visualizers/BSTVisualizer';
import GraphVisualizer from './visualizers/GraphVisualizer';
import StackQueueVisualizer from './visualizers/StackQueueVisualizer';
import HashTableVisualizer from './visualizers/HashTableVisualizer';
import HeapVisualizer from './visualizers/HeapVisualizer';

const CATEGORIES = [
  { key: 'sorting', label: 'Sorting', icon: BarChart3, desc: 'Bubble, Selection, Insertion, Merge, Quick Sort' },
  { key: 'searching', label: 'Searching', icon: Search, desc: 'Linear Search, Binary Search' },
  { key: 'linkedlist', label: 'Linked List', icon: Link2, desc: 'Insert, Delete, Search, Traverse' },
  { key: 'bst', label: 'Binary Search Tree', icon: TreePine, desc: 'Insert, Search, Traversals' },
  { key: 'graph', label: 'Graph Traversal', icon: GitFork, desc: 'BFS, DFS, DLS, Bidirectional, A*, Greedy, Hill Climbing, SA' },
  { key: 'stackqueue', label: 'Stack & Queue', icon: Layers, desc: 'Push, Pop, Enqueue, Dequeue' },
  { key: 'hashtable', label: 'Hash Table', icon: Hash, desc: 'Insert, Search, Delete, Chaining' },
  { key: 'heap', label: 'Binary Heap', icon: Triangle, desc: 'Min-Heap, Max-Heap, Insert, Extract' },
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const ActiveComponent = VISUALIZER_COMPONENTS[activeCategory];

  return (
    <div className="flex flex-col lg:flex-row gap-3 h-full relative">
      {/* Category Sidebar */}
      <div 
        className={`flex-shrink-0 flex flex-col gap-1 overflow-y-auto bg-surface border border-border rounded-2xl transition-all duration-300 h-full ${
          isSidebarOpen ? 'w-full lg:w-56 p-3' : 'w-14 p-2'
        }`}
      >
        <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} pb-2 mb-1 border-b border-border`}>
          {isSidebarOpen && (
            <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">
              Visualizer
            </h2>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-surface-alt text-text-muted hover:text-text transition-colors"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        </div>

        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;

          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              title={!isSidebarOpen ? cat.label : undefined}
              className={`w-full text-left rounded-xl transition-all duration-150 flex items-center
                ${isSidebarOpen ? 'px-3 py-2.5 gap-3' : 'px-2 py-2.5 justify-center'}
                ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-muted hover:text-text hover:bg-surface-alt'}`}
            >
              <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {isSidebarOpen && (
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${isActive ? 'text-primary' : ''}`}>
                    {cat.label}
                  </p>
                  <p className="text-[10px] text-text-muted truncate leading-tight mt-0.5">
                    {cat.desc}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 min-w-0 overflow-y-auto bg-surface border border-border rounded-2xl p-0 flex flex-col h-full">
        <ActiveComponent />
      </div>
    </div>
  );
}
