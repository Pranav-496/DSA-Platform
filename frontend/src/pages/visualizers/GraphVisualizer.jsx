import React, { useState, useCallback } from 'react';
import ControlBar from './ControlBar';
import useAnimationControl from './useAnimationControl';

const SAMPLE_GRAPHS = {
  simple: {
    name: 'Simple Graph',
    nodes: [
      { id: 0, x: 400, y: 60 },
      { id: 1, x: 220, y: 160 },
      { id: 2, x: 580, y: 160 },
      { id: 3, x: 140, y: 300 },
      { id: 4, x: 320, y: 300 },
      { id: 5, x: 480, y: 300 },
      { id: 6, x: 660, y: 300 },
      { id: 7, x: 230, y: 420 },
      { id: 8, x: 560, y: 420 },
    ],
    edges: [
      [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [4, 7], [5, 8], [6, 8],
    ],
  },
  cyclic: {
    name: 'Cyclic Graph',
    nodes: [
      { id: 0, x: 400, y: 50 },
      { id: 1, x: 200, y: 150 },
      { id: 2, x: 600, y: 150 },
      { id: 3, x: 150, y: 300 },
      { id: 4, x: 400, y: 250 },
      { id: 5, x: 650, y: 300 },
      { id: 6, x: 300, y: 400 },
      { id: 7, x: 500, y: 400 },
    ],
    edges: [
      [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 6], [4, 6], [4, 7], [5, 7], [6, 7],
    ],
  },
};

export default function GraphVisualizer() {
  const [algorithm, setAlgorithm] = useState('bfs');
  const [graphKey, setGraphKey] = useState('simple');
  const [startNode, setStartNode] = useState(0);
  const [visitedIds, setVisitedIds] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(-1);
  const [activeEdge, setActiveEdge] = useState(null);
  const [queueOrStack, setQueueOrStack] = useState([]);
  const [visitOrder, setVisitOrder] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const anim = useAnimationControl();
  const graph = SAMPLE_GRAPHS[graphKey];

  const delay = useCallback(async (ms = 1) => {
    const result = await anim.sleep(ms);
    if (result === 'cancelled') throw new Error('cancelled');
  }, [anim]);

  const resetHighlights = () => {
    setVisitedIds([]);
    setActiveNodeId(-1);
    setActiveEdge(null);
    setQueueOrStack([]);
    setVisitOrder([]);
    setStatusMessage('');
  };

  const getAdj = useCallback(() => {
    const adj = {};
    graph.nodes.forEach(n => adj[n.id] = []);
    graph.edges.forEach(([u, v]) => {
      adj[u].push(v);
      adj[v].push(u);
    });
    return adj;
  }, [graph]);

  const bfs = useCallback(async () => {
    anim.start();
    resetHighlights();
    try {
      const adj = getAdj();
      const visited = new Set();
      const queue = [startNode];
      visited.add(startNode);
      const order = [];

      setQueueOrStack([...queue]);
      setStatusMessage(`BFS starting from node ${startNode}`);
      await delay(anim.speed);

      while (queue.length > 0) {
        const node = queue.shift();
        setActiveNodeId(node);
        setVisitedIds(prev => [...prev, node]);
        order.push(node);
        setVisitOrder([...order]);
        setStatusMessage(`Dequeue: ${node} | Queue: [${queue.join(', ')}]`);
        anim.incrementStep();
        await delay(anim.speed);

        for (const neighbor of adj[node]) {
          setActiveEdge([node, neighbor]);
          await delay(anim.speed * 0.4);

          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
            setQueueOrStack([...queue]);
            setStatusMessage(`Enqueue neighbor ${neighbor} | Queue: [${queue.join(', ')}]`);
            await delay(anim.speed * 0.5);
          }
          setActiveEdge(null);
        }
      }
      setStatusMessage(`✅ BFS complete! Order: [${order.join(' → ')}]`);
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [startNode, anim, delay, getAdj]);

  const dfs = useCallback(async () => {
    anim.start();
    resetHighlights();
    try {
      const adj = getAdj();
      const visited = new Set();
      const order = [];

      async function dfsVisit(node) {
        visited.add(node);
        setActiveNodeId(node);
        setVisitedIds(prev => [...prev, node]);
        order.push(node);
        setVisitOrder([...order]);
        setQueueOrStack(prev => [...prev, node]);
        setStatusMessage(`DFS visit: ${node} | Stack: [${[...visited].join(', ')}]`);
        anim.incrementStep();
        await delay(anim.speed);

        for (const neighbor of adj[node]) {
          if (!visited.has(neighbor)) {
            setActiveEdge([node, neighbor]);
            setStatusMessage(`Exploring edge ${node} → ${neighbor}`);
            await delay(anim.speed * 0.5);
            setActiveEdge(null);
            await dfsVisit(neighbor);
          }
        }
        setQueueOrStack(prev => prev.filter(n => n !== node));
      }

      await dfsVisit(startNode);
      setStatusMessage(`✅ DFS complete! Order: [${order.join(' → ')}]`);
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [startNode, anim, delay, getAdj]);

  const runAlgorithm = () => {
    if (algorithm === 'bfs') bfs();
    else dfs();
  };

  const isEdgeActive = (u, v) => {
    if (!activeEdge) return false;
    return (activeEdge[0] === u && activeEdge[1] === v) || (activeEdge[0] === v && activeEdge[1] === u);
  };

  const isEdgeVisited = (u, v) => visitedIds.includes(u) && visitedIds.includes(v);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Algorithm Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[['bfs', 'BFS (Breadth-First)'], ['dfs', 'DFS (Depth-First)']].map(([key, label]) => (
          <button key={key} onClick={() => { setAlgorithm(key); resetHighlights(); }}
            className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider transition-all border-2
              ${algorithm === key ? 'bg-primary text-text border-text shadow-[2px_2px_0px_#111]'
                : 'bg-surface text-text/70 border-text hover:text-text hover:bg-background'}`}>
            {label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-3">
          <select value={graphKey} onChange={(e) => { setGraphKey(e.target.value); resetHighlights(); }}
            className="bg-surface border-2 border-text text-text px-2 py-1.5 rounded-lg text-sm font-bold focus:border-primary outline-none shadow-[2px_2px_0px_#111]">
            {Object.entries(SAMPLE_GRAPHS).map(([key, g]) => (
              <option key={key} value={key}>{g.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-text/70 font-bold uppercase">Start:</label>
            <input type="number" min="0" max={graph.nodes.length - 1} value={startNode}
              onChange={(e) => setStartNode(Number(e.target.value))}
              className="w-14 bg-surface border-2 border-text text-text px-2 py-1.5 rounded-lg text-sm font-mono font-bold focus:border-primary outline-none shadow-[2px_2px_0px_#111]" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-surface border-2 border-text rounded-lg px-4 py-2 flex items-center justify-between shadow-brutal-sm">
        <p className="text-text/70 text-sm font-bold">
          {algorithm === 'bfs' ? 'BFS explores level by level using a Queue (FIFO).' : 'DFS explores as deep as possible using a Stack (LIFO / recursion).'}
        </p>
        <div className="flex gap-4 text-xs">
          <span className="text-text/70 font-bold">Time: <span className="text-warning font-mono font-black">O(V+E)</span></span>
          <span className="text-text/70 font-bold">Space: <span className="text-primary font-mono font-black">O(V)</span></span>
        </div>
      </div>

      {/* Graph SVG */}
      <div className="flex-1 bg-surface border-4 border-text shadow-brutal rounded-lg relative min-h-[150px] overflow-hidden">
        <div className="absolute top-3 left-4 text-xs text-text/70 font-mono font-bold z-10">{statusMessage}</div>

        {/* Queue/Stack display */}
        <div className="absolute top-3 right-4 z-10">
          <div className="bg-background border-2 border-text rounded-lg p-2 text-xs shadow-[2px_2px_0px_#111]">
            <span className="text-text/70 font-mono font-bold">{algorithm === 'bfs' ? 'Queue' : 'Stack'}: </span>
            <span className="text-primary font-mono font-black">[{queueOrStack.join(', ')}]</span>
          </div>
        </div>

        {visitOrder.length > 0 && (
          <div className="absolute bottom-3 left-4 z-10 text-xs text-text/70 font-mono font-bold">
            Visit order: [<span className="text-success font-black">{visitOrder.join(' → ')}</span>]
          </div>
        )}

        <svg width="100%" height="100%" viewBox="0 0 800 480" className="absolute inset-0">
          {/* Edges */}
          {graph.edges.map(([u, v], i) => {
            const n1 = graph.nodes.find(n => n.id === u);
            const n2 = graph.nodes.find(n => n.id === v);
            const active = isEdgeActive(u, v);
            const visited = isEdgeVisited(u, v);
            return (
              <line key={i} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                stroke={active ? '#EF4444' : visited ? '#111111' : '#cccccc'}
                strokeWidth={active ? 4 : 2}
                className="transition-all duration-300"
                style={{}} />
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((node) => {
            const isActive = activeNodeId === node.id;
            const isVisited = visitedIds.includes(node.id);
            const isStart = startNode === node.id;

            let fill = '#FFFFFF';
            let stroke = '#111111';
            let textFill = '#111111';
            let strokeW = 3;

            if (isActive) { fill = '#FFD600'; stroke = '#111111'; textFill = '#111111'; strokeW = 4; }
            else if (isVisited) { fill = '#22C55E'; stroke = '#111111'; textFill = '#111111'; strokeW = 3; }
            else if (isStart) { fill = '#FAFAFA'; stroke = '#111111'; textFill = '#111111'; strokeW = 4; }

            return (
              <g key={node.id} className="transition-all duration-300 cursor-pointer"
                onClick={() => setStartNode(node.id)}>
                <circle cx={node.x} cy={node.y} r={24} fill={fill} stroke={stroke} strokeWidth={strokeW} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fill={textFill}
                  fontSize="15" fontFamily="monospace" fontWeight="900">{node.id}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Controls */}
      <ControlBar
        isPlaying={anim.isPlaying} isPaused={anim.isPaused} speed={anim.speed}
        stepCount={anim.stepCount}
        onStart={runAlgorithm} onPause={anim.pause} onResume={anim.resume}
        onStop={anim.stop} onReset={resetHighlights}
        onSpeedChange={anim.setSpeed}
        complexity={{ time: 'O(V+E)', space: 'O(V)' }}
      />
    </div>
  );
}
