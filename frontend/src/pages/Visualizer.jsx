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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const ActiveComponent = VISUALIZER_COMPONENTS[activeCategory];

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full relative">
      {/* Category Sidebar */}
      <div 
        className={`flex-shrink-0 flex flex-col gap-2 overflow-y-auto brutal-card bg-surface transition-all duration-300 h-full ${
          isSidebarOpen ? 'w-full lg:w-64 p-4' : 'w-[72px] p-2'
        }`}
      >
        <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} border-b-4 border-text pb-2 mb-2`}>
          {isSidebarOpen && (
            <h2 className="text-xl font-black uppercase font-geist tracking-tight">
              Visualizer
            </h2>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 border-2 border-transparent hover:border-text rounded transition-all"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          const iconColor = isActive ? (cat.color === 'bg-success' || cat.color === 'bg-danger' ? 'text-surface' : 'text-text') : 'text-text';

          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              title={!isSidebarOpen ? cat.label : undefined}
              className={`w-full text-left rounded-lg border-4 transition-all duration-200 group flex items-center justify-center
                ${isSidebarOpen ? 'px-3 py-3' : 'px-2 py-3'}
                ${isActive
                  ? `${cat.color} border-text shadow-[2px_2px_0px_#111] -translate-y-0.5`
                  : `bg-background border-border hover:border-text hover:bg-surface`}`}
            >
              <div className={`flex items-center ${isSidebarOpen ? 'gap-3 w-full' : 'justify-center'}`}>
                <Icon size={20} className={`${iconColor} flex-shrink-0`} />
                {isSidebarOpen && (
                  <div className="min-w-0">
                    <p className={`font-black text-sm uppercase tracking-tight ${iconColor}`}>
                      {cat.label}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider truncate leading-tight mt-0.5 ${isActive ? (cat.color === 'bg-success' || cat.color === 'bg-danger' ? 'text-surface/80' : 'text-text/70') : 'opacity-70'}`}>
                      {cat.desc}
                    </p>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Info box at bottom */}
        {isSidebarOpen && (
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
        )}
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 min-w-0 overflow-y-auto brutal-card bg-surface p-0 flex flex-col h-full">
        <ActiveComponent />
      </div>
    </div>
  );
}
