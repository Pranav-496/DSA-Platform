import React, { useState, useCallback } from 'react';
import ControlBar from './ControlBar';
import useAnimationControl from './useAnimationControl';

let bstIdCounter = 100;

function insertBST(root, val) {
  if (!root) return { id: ++bstIdCounter, val, left: null, right: null };
  const newRoot = { ...root };
  if (val < root.val) newRoot.left = insertBST(root.left, val);
  else if (val > root.val) newRoot.right = insertBST(root.right, val);
  return newRoot;
}

function getTreeLayout(root) {
  if (!root) return { nodes: [], edges: [] };
  const nodes = [];
  const edges = [];

  function traverse(node, x, y, dx) {
    if (!node) return;
    nodes.push({ id: node.id, val: node.val, x, y });
    if (node.left) {
      edges.push({ from: node.id, to: node.left.id, x1: x, y1: y, x2: x - dx, y2: y + 80 });
      traverse(node.left, x - dx, y + 80, dx * 0.55);
    }
    if (node.right) {
      edges.push({ from: node.id, to: node.right.id, x1: x, y1: y, x2: x + dx, y2: y + 80 });
      traverse(node.right, x + dx, y + 80, dx * 0.55);
    }
  }

  traverse(root, 400, 40, 160);
  return { nodes, edges };
}

export default function BSTVisualizer() {
  const [root, setRoot] = useState(() => {
    let r = null;
    [50, 30, 70, 20, 40, 60, 80].forEach(v => r = insertBST(r, v));
    return r;
  });

  const [inputVal, setInputVal] = useState('');
  const [operation, setOperation] = useState('insert');
  const [activeNodeId, setActiveNodeId] = useState(-1);
  const [foundNodeId, setFoundNodeId] = useState(-1);
  const [visitedIds, setVisitedIds] = useState([]);
  const [pathIds, setPathIds] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [traversalOrder, setTraversalOrder] = useState([]);

  const anim = useAnimationControl();

  const delay = useCallback(async (ms = 1) => {
    const result = await anim.sleep(ms);
    if (result === 'cancelled') throw new Error('cancelled');
  }, [anim]);

  const resetHighlights = () => {
    setActiveNodeId(-1);
    setFoundNodeId(-1);
    setVisitedIds([]);
    setPathIds([]);
    setStatusMessage('');
    setTraversalOrder([]);
  };

  // Search
  const searchBST = useCallback(async () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) { setStatusMessage('⚠ Enter a valid number'); return; }
    anim.start();
    resetHighlights();
    try {
      let cur = root;
      while (cur) {
        setActiveNodeId(cur.id);
        setPathIds(prev => [...prev, cur.id]);
        setStatusMessage(`Visiting ${cur.val}: ${val} ${val === cur.val ? '==' : val < cur.val ? '<' : '>'} ${cur.val}`);
        anim.incrementStep();
        await delay(anim.speed * 1.2);
        if (val === cur.val) {
          setFoundNodeId(cur.id);
          setStatusMessage(`✅ Found ${val}!`);
          anim.finish();
          return;
        } else if (val < cur.val) {
          setStatusMessage(`${val} < ${cur.val} → go left`);
          await delay(anim.speed * 0.5);
          cur = cur.left;
        } else {
          setStatusMessage(`${val} > ${cur.val} → go right`);
          await delay(anim.speed * 0.5);
          cur = cur.right;
        }
      }
      setStatusMessage(`❌ ${val} not found`);
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [root, inputVal, anim, delay]);

  // Insert
  const insertNode = useCallback(async () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) { setStatusMessage('⚠ Enter a valid number'); return; }
    anim.start();
    resetHighlights();
    try {
      let cur = root;
      while (cur) {
        setActiveNodeId(cur.id);
        setPathIds(prev => [...prev, cur.id]);
        anim.incrementStep();
        await delay(anim.speed);
        if (val === cur.val) {
          setStatusMessage(`⚠ ${val} already exists`);
          anim.finish();
          return;
        } else if (val < cur.val) {
          setStatusMessage(`${val} < ${cur.val} → go left`);
          if (!cur.left) break;
          cur = cur.left;
        } else {
          setStatusMessage(`${val} > ${cur.val} → go right`);
          if (!cur.right) break;
          cur = cur.right;
        }
        await delay(anim.speed * 0.5);
      }
      setStatusMessage(`Inserting ${val}...`);
      await delay(anim.speed);
      setRoot(prev => insertBST(prev, val));
      setStatusMessage(`✅ Inserted ${val}`);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [root, inputVal, anim, delay]);

  // Inorder Traversal
  const inorderTraversal = useCallback(async () => {
    anim.start();
    resetHighlights();
    const order = [];
    try {
      async function inorder(node) {
        if (!node) return;
        await inorder(node.left);
        setActiveNodeId(node.id);
        setVisitedIds(prev => [...prev, node.id]);
        order.push(node.val);
        setTraversalOrder([...order]);
        setStatusMessage(`In-order visit: ${node.val}`);
        anim.incrementStep();
        await delay(anim.speed);
        await inorder(node.right);
      }
      await inorder(root);
      setStatusMessage(`✅ In-order: [${order.join(', ')}]`);
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [root, anim, delay]);

  // Preorder Traversal
  const preorderTraversal = useCallback(async () => {
    anim.start();
    resetHighlights();
    const order = [];
    try {
      async function preorder(node) {
        if (!node) return;
        setActiveNodeId(node.id);
        setVisitedIds(prev => [...prev, node.id]);
        order.push(node.val);
        setTraversalOrder([...order]);
        setStatusMessage(`Pre-order visit: ${node.val}`);
        anim.incrementStep();
        await delay(anim.speed);
        await preorder(node.left);
        await preorder(node.right);
      }
      await preorder(root);
      setStatusMessage(`✅ Pre-order: [${order.join(', ')}]`);
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [root, anim, delay]);

  // Postorder Traversal
  const postorderTraversal = useCallback(async () => {
    anim.start();
    resetHighlights();
    const order = [];
    try {
      async function postorder(node) {
        if (!node) return;
        await postorder(node.left);
        await postorder(node.right);
        setActiveNodeId(node.id);
        setVisitedIds(prev => [...prev, node.id]);
        order.push(node.val);
        setTraversalOrder([...order]);
        setStatusMessage(`Post-order visit: ${node.val}`);
        anim.incrementStep();
        await delay(anim.speed);
      }
      await postorder(root);
      setStatusMessage(`✅ Post-order: [${order.join(', ')}]`);
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [root, anim, delay]);

  const operations = {
    insert: { fn: insertNode, label: 'Insert', needsInput: true },
    search: { fn: searchBST, label: 'Search', needsInput: true },
    inorder: { fn: inorderTraversal, label: 'In-Order', needsInput: false },
    preorder: { fn: preorderTraversal, label: 'Pre-Order', needsInput: false },
    postorder: { fn: postorderTraversal, label: 'Post-Order', needsInput: false },
  };

  const layout = getTreeLayout(root);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Operation Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.entries(operations).map(([key, op]) => (
          <button key={key} onClick={() => { setOperation(key); resetHighlights(); }}
            className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider transition-all border-2
              ${operation === key ? 'bg-primary text-text border-text shadow-[2px_2px_0px_#111]'
                : 'bg-surface text-text/70 border-text hover:text-text hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#111]'}`}>
            {op.label}
          </button>
        ))}
        {operations[operation].needsInput && (
          <div className="ml-auto flex items-center gap-2">
            <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
              placeholder="Value" className="w-20 bg-surface border-2 border-text text-text px-2 py-1.5 rounded-lg text-sm font-mono focus:border-primary outline-none shadow-[2px_2px_0px_#111]" />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-surface border-2 border-text rounded-lg px-4 py-2 flex items-center justify-between shadow-brutal-sm">
        <p className="text-text/70 text-sm font-geist">Binary Search Tree — left subtree {"<"} root {"<"} right subtree.</p>
        <div className="flex gap-4 text-xs">
          <span className="text-text/70">Search: <span className="text-success font-mono font-bold">O(log n)</span></span>
          <span className="text-text/70">Insert: <span className="text-success font-mono font-bold">O(log n)</span></span>
          <span className="text-text/70">Worst: <span className="text-warning font-mono font-bold">O(n)</span></span>
        </div>
      </div>

      {/* Tree SVG */}
      <div className="flex-1 bg-surface border-4 border-text shadow-brutal rounded-lg relative min-h-[150px] overflow-hidden">
        <div className="absolute top-3 left-4 text-xs text-text/70 font-mono font-bold z-10">{statusMessage}</div>

        {traversalOrder.length > 0 && (
          <div className="absolute bottom-3 left-4 text-xs text-text/70 font-mono font-bold z-10">
            Order: [<span className="text-primary">{traversalOrder.join(', ')}</span>]
          </div>
        )}

        <svg width="100%" height="100%" viewBox="0 0 800 450" className="absolute inset-0">
          {/* Edges */}
          {layout.edges.map((edge, i) => {
            const isOnPath = pathIds.includes(edge.from) && pathIds.includes(edge.to);
            return (
              <line key={i} x1={edge.x1} y1={edge.y1 + 20} x2={edge.x2} y2={edge.y2}
                stroke={isOnPath ? '#111111' : '#cccccc'} strokeWidth={isOnPath ? 3 : 2}
                className="transition-all duration-300" />
            );
          })}
          {/* Nodes */}
          {layout.nodes.map((node) => {
            const isActive = activeNodeId === node.id;
            const isFound = foundNodeId === node.id;
            const isVisited = visitedIds.includes(node.id);
            const isOnPath = pathIds.includes(node.id);

            let fill = '#FFFFFF';
            let stroke = '#111111';
            let textFill = '#111111';
            let strokeW = 2;

            if (isFound) { fill = '#22C55E'; stroke = '#111111'; textFill = '#111111'; strokeW = 3; }
            else if (isActive) { fill = '#FFD600'; stroke = '#111111'; textFill = '#111111'; strokeW = 3; }
            else if (isVisited) { fill = '#E0E0E0'; stroke = '#111111'; textFill = '#111111'; strokeW = 2; }
            else if (isOnPath) { fill = '#FFF9C4'; stroke = '#111111'; textFill = '#111111'; strokeW = 2; }

            return (
              <g key={node.id} className="transition-all duration-300">
                <circle cx={node.x} cy={node.y + 20} r={22} fill={fill} stroke={stroke} strokeWidth={strokeW} />
                <text x={node.x} y={node.y + 26} textAnchor="middle" fill={textFill}
                  fontSize="14" fontFamily="monospace" fontWeight="bold">{node.val}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Controls */}
      <ControlBar
        isPlaying={anim.isPlaying} isPaused={anim.isPaused} speed={anim.speed}
        stepCount={anim.stepCount}
        onStart={operations[operation].fn}
        onPause={anim.pause} onResume={anim.resume}
        onStop={anim.stop} onReset={resetHighlights}
        onSpeedChange={anim.setSpeed}
        complexity={{ time: 'O(log n)', space: 'O(n)' }}
      />
    </div>
  );
}
