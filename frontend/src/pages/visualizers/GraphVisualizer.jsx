import React, { useState, useCallback } from 'react';
import ControlBar from './ControlBar';
import useAnimationControl from './useAnimationControl';

// ── Graph definitions with heuristics & weights ──
const SAMPLE_GRAPHS = {
  simple: {
    name: 'Simple Graph',
    nodes: [
      { id: 0, x: 400, y: 60, h: 6 },
      { id: 1, x: 220, y: 160, h: 4 },
      { id: 2, x: 580, y: 160, h: 5 },
      { id: 3, x: 140, y: 300, h: 3 },
      { id: 4, x: 320, y: 300, h: 2 },
      { id: 5, x: 480, y: 300, h: 3 },
      { id: 6, x: 660, y: 300, h: 4 },
      { id: 7, x: 230, y: 420, h: 1 },
      { id: 8, x: 560, y: 420, h: 0 },
    ],
    edges: [
      [0, 1, 2], [0, 2, 4], [1, 3, 3], [1, 4, 1], [2, 5, 2], [2, 6, 3], [3, 7, 2], [4, 7, 4], [5, 8, 1], [6, 8, 2],
    ],
    goal: 8,
  },
  cyclic: {
    name: 'Cyclic Graph',
    nodes: [
      { id: 0, x: 400, y: 50, h: 5 },
      { id: 1, x: 200, y: 150, h: 4 },
      { id: 2, x: 600, y: 150, h: 3 },
      { id: 3, x: 150, y: 300, h: 3 },
      { id: 4, x: 400, y: 250, h: 2 },
      { id: 5, x: 650, y: 300, h: 2 },
      { id: 6, x: 300, y: 400, h: 1 },
      { id: 7, x: 500, y: 400, h: 0 },
    ],
    edges: [
      [0, 1, 3], [0, 2, 2], [1, 3, 4], [1, 4, 1], [2, 4, 2], [2, 5, 3], [3, 6, 2], [4, 6, 3], [4, 7, 2], [5, 7, 1], [6, 7, 1],
    ],
    goal: 7,
  },
};

const ALGORITHM_INFO = {
  bfs:         { name: 'BFS',                  time: 'O(V+E)', space: 'O(V)',   desc: 'Explores level by level using a Queue (FIFO).' },
  dfs:         { name: 'DFS',                  time: 'O(V+E)', space: 'O(V)',   desc: 'Explores as deep as possible using a Stack (LIFO / recursion).' },
  dls:         { name: 'Depth-Limited',        time: 'O(b^l)', space: 'O(bl)',  desc: 'DFS with a maximum depth limit to prevent infinite paths.' },
  bidirectional:{ name: 'Bidirectional',       time: 'O(b^(d/2))', space: 'O(b^(d/2))', desc: 'Runs BFS from start & goal simultaneously until they meet.' },
  greedy:      { name: 'Greedy Best-First',    time: 'O(b^m)', space: 'O(b^m)', desc: 'Expands the node closest to the goal by heuristic h(n).' },
  astar:       { name: 'A* Search',            time: 'O(b^d)', space: 'O(b^d)', desc: 'Uses f(n) = g(n) + h(n) to find the optimal path.' },
  hillclimb:   { name: 'Hill Climbing',        time: 'O(∞)',   space: 'O(1)',   desc: 'Greedy local search — always picks the best neighbor.' },
  sa:          { name: 'Simulated Annealing',  time: 'O(∞)',   space: 'O(1)',   desc: 'Probabilistic hill climbing that accepts worse moves to escape local optima.' },
};

export default function GraphVisualizer() {
  const [algorithm, setAlgorithm] = useState('bfs');
  const [graphKey, setGraphKey] = useState('simple');
  const [startNode, setStartNode] = useState(0);
  const [goalNode, setGoalNode] = useState(8);
  const [depthLimit, setDepthLimit] = useState(3);
  const [visitedIds, setVisitedIds] = useState([]);
  const [activeNodeId, setActiveNodeId] = useState(-1);
  const [activeEdge, setActiveEdge] = useState(null);
  const [queueOrStack, setQueueOrStack] = useState([]);
  const [visitOrder, setVisitOrder] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [pathEdges, setPathEdges] = useState([]); // for highlighting final path
  const [frontierFwd, setFrontierFwd] = useState([]); // bidirectional forward frontier
  const [frontierBwd, setFrontierBwd] = useState([]); // bidirectional backward frontier

  const anim = useAnimationControl();
  const graph = SAMPLE_GRAPHS[graphKey];
  const info = ALGORITHM_INFO[algorithm];

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
    setPathEdges([]);
    setFrontierFwd([]);
    setFrontierBwd([]);
  };

  const getAdj = useCallback(() => {
    const adj = {};
    graph.nodes.forEach(n => adj[n.id] = []);
    graph.edges.forEach(([u, v, w]) => {
      adj[u].push({ node: v, weight: w || 1 });
      adj[v].push({ node: u, weight: w || 1 });
    });
    return adj;
  }, [graph]);

  // ── 1. BFS ──
  const bfs = useCallback(async () => {
    anim.start(); resetHighlights();
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
        for (const { node: neighbor } of adj[node]) {
          setActiveEdge([node, neighbor]);
          await delay(anim.speed * 0.4);
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
            setQueueOrStack([...queue]);
            setStatusMessage(`Enqueue ${neighbor} | Queue: [${queue.join(', ')}]`);
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

  // ── 2. DFS ──
  const dfs = useCallback(async () => {
    anim.start(); resetHighlights();
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
        for (const { node: neighbor } of adj[node]) {
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

  // ── 3. Depth-Limited Search ──
  const depthLimitedSearch = useCallback(async () => {
    anim.start(); resetHighlights();
    try {
      const adj = getAdj();
      const visited = new Set();
      const order = [];
      let found = false;

      async function dlsVisit(node, depth) {
        if (found) return;
        visited.add(node);
        setActiveNodeId(node);
        setVisitedIds(prev => [...prev, node]);
        order.push(node);
        setVisitOrder([...order]);
        setStatusMessage(`DLS visit: ${node} | Depth: ${depth}/${depthLimit}`);
        anim.incrementStep();
        await delay(anim.speed);

        if (node === goalNode) {
          found = true;
          setStatusMessage(`✅ Goal ${goalNode} found at depth ${depth}!`);
          return;
        }

        if (depth >= depthLimit) {
          setStatusMessage(`⚠️ Depth limit ${depthLimit} reached at node ${node}`);
          await delay(anim.speed * 0.5);
          return;
        }

        for (const { node: neighbor } of adj[node]) {
          if (!visited.has(neighbor) && !found) {
            setActiveEdge([node, neighbor]);
            await delay(anim.speed * 0.4);
            setActiveEdge(null);
            await dlsVisit(neighbor, depth + 1);
          }
        }
      }

      await dlsVisit(startNode, 0);
      if (!found) setStatusMessage(`❌ Goal ${goalNode} not found within depth limit ${depthLimit}`);
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [startNode, goalNode, depthLimit, anim, delay, getAdj]);

  // ── 4. Bidirectional Search ──
  const bidirectionalSearch = useCallback(async () => {
    anim.start(); resetHighlights();
    try {
      const adj = getAdj();
      const visitedFwd = new Set([startNode]);
      const visitedBwd = new Set([goalNode]);
      const qFwd = [startNode];
      const qBwd = [goalNode];
      const order = [];
      let meetNode = -1;

      setStatusMessage(`Bidirectional: Forward from ${startNode}, Backward from ${goalNode}`);
      await delay(anim.speed);

      while (qFwd.length > 0 && qBwd.length > 0 && meetNode === -1) {
        // Forward step
        if (qFwd.length > 0) {
          const node = qFwd.shift();
          setActiveNodeId(node);
          setVisitedIds(prev => [...prev, node]);
          order.push(node);
          setVisitOrder([...order]);
          setFrontierFwd([...qFwd]);
          setStatusMessage(`Forward BFS: visit ${node}`);
          anim.incrementStep();
          await delay(anim.speed);

          for (const { node: neighbor } of adj[node]) {
            setActiveEdge([node, neighbor]);
            await delay(anim.speed * 0.3);
            if (visitedBwd.has(neighbor)) {
              meetNode = neighbor;
              setStatusMessage(`🤝 Frontiers met at node ${neighbor}!`);
              await delay(anim.speed);
              break;
            }
            if (!visitedFwd.has(neighbor)) {
              visitedFwd.add(neighbor);
              qFwd.push(neighbor);
            }
            setActiveEdge(null);
          }
          if (meetNode !== -1) break;
        }

        // Backward step
        if (qBwd.length > 0) {
          const node = qBwd.shift();
          setActiveNodeId(node);
          setVisitedIds(prev => [...prev, node]);
          order.push(node);
          setVisitOrder([...order]);
          setFrontierBwd([...qBwd]);
          setStatusMessage(`Backward BFS: visit ${node}`);
          anim.incrementStep();
          await delay(anim.speed);

          for (const { node: neighbor } of adj[node]) {
            setActiveEdge([node, neighbor]);
            await delay(anim.speed * 0.3);
            if (visitedFwd.has(neighbor)) {
              meetNode = neighbor;
              setStatusMessage(`🤝 Frontiers met at node ${neighbor}!`);
              await delay(anim.speed);
              break;
            }
            if (!visitedBwd.has(neighbor)) {
              visitedBwd.add(neighbor);
              qBwd.push(neighbor);
            }
            setActiveEdge(null);
          }
        }
      }

      if (meetNode !== -1) {
        setStatusMessage(`✅ Bidirectional search found path via node ${meetNode}! Visited: [${order.join(' → ')}]`);
      } else {
        setStatusMessage(`❌ No path between ${startNode} and ${goalNode}`);
      }
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [startNode, goalNode, anim, delay, getAdj]);

  // ── 5. Greedy Best-First Search ──
  const greedyBestFirst = useCallback(async () => {
    anim.start(); resetHighlights();
    try {
      const adj = getAdj();
      const visited = new Set();
      const order = [];
      // Priority queue as sorted array: [{ node, h }]
      const pq = [{ node: startNode, h: graph.nodes.find(n => n.id === startNode).h }];
      const parent = {};

      setStatusMessage(`Greedy Best-First: start=${startNode}, goal=${goalNode}, using h(n)`);
      await delay(anim.speed);

      while (pq.length > 0) {
        pq.sort((a, b) => a.h - b.h);
        const { node } = pq.shift();
        if (visited.has(node)) continue;

        visited.add(node);
        setActiveNodeId(node);
        setVisitedIds(prev => [...prev, node]);
        order.push(node);
        setVisitOrder([...order]);
        const hVal = graph.nodes.find(n => n.id === node).h;
        setStatusMessage(`Greedy: expand ${node} | h(${node})=${hVal}`);
        setQueueOrStack(pq.map(p => `${p.node}(h=${p.h})`));
        anim.incrementStep();
        await delay(anim.speed);

        if (node === goalNode) {
          // Reconstruct path
          const path = [];
          let cur = goalNode;
          while (cur !== undefined && cur !== startNode) {
            const prev = parent[cur];
            if (prev !== undefined) path.unshift([prev, cur]);
            cur = prev;
          }
          setPathEdges(path);
          setStatusMessage(`✅ Goal ${goalNode} found! Path: ${startNode} → ${path.map(p => p[1]).join(' → ')}`);
          break;
        }

        for (const { node: neighbor } of adj[node]) {
          setActiveEdge([node, neighbor]);
          await delay(anim.speed * 0.3);
          if (!visited.has(neighbor)) {
            const neighborH = graph.nodes.find(n => n.id === neighbor).h;
            pq.push({ node: neighbor, h: neighborH });
            if (parent[neighbor] === undefined) parent[neighbor] = node;
            setStatusMessage(`  → Add ${neighbor} (h=${neighborH}) to frontier`);
            await delay(anim.speed * 0.3);
          }
          setActiveEdge(null);
        }
      }

      if (!visited.has(goalNode)) setStatusMessage(`❌ Goal ${goalNode} not reachable`);
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [startNode, goalNode, graph, anim, delay, getAdj]);

  // ── 6. A* Search ──
  const astarSearch = useCallback(async () => {
    anim.start(); resetHighlights();
    try {
      const adj = getAdj();
      const gScore = {};
      graph.nodes.forEach(n => gScore[n.id] = Infinity);
      gScore[startNode] = 0;
      const parent = {};
      const visited = new Set();
      const order = [];
      const startH = graph.nodes.find(n => n.id === startNode).h;
      const pq = [{ node: startNode, f: startH, g: 0 }];

      setStatusMessage(`A*: start=${startNode}, goal=${goalNode}, f(n)=g(n)+h(n)`);
      await delay(anim.speed);

      while (pq.length > 0) {
        pq.sort((a, b) => a.f - b.f);
        const { node, g } = pq.shift();
        if (visited.has(node)) continue;

        visited.add(node);
        setActiveNodeId(node);
        setVisitedIds(prev => [...prev, node]);
        order.push(node);
        setVisitOrder([...order]);
        const hVal = graph.nodes.find(n => n.id === node).h;
        setStatusMessage(`A*: expand ${node} | g=${g}, h=${hVal}, f=${g + hVal}`);
        setQueueOrStack(pq.map(p => `${p.node}(f=${p.f})`));
        anim.incrementStep();
        await delay(anim.speed);

        if (node === goalNode) {
          const path = [];
          let cur = goalNode;
          while (cur !== undefined && cur !== startNode) {
            const prev = parent[cur];
            if (prev !== undefined) path.unshift([prev, cur]);
            cur = prev;
          }
          setPathEdges(path);
          setStatusMessage(`✅ A* optimal path found! Cost=${g} | ${startNode} → ${path.map(p => p[1]).join(' → ')}`);
          break;
        }

        for (const { node: neighbor, weight } of adj[node]) {
          setActiveEdge([node, neighbor]);
          await delay(anim.speed * 0.3);
          const tentativeG = g + weight;
          if (tentativeG < gScore[neighbor]) {
            gScore[neighbor] = tentativeG;
            parent[neighbor] = node;
            const neighborH = graph.nodes.find(n => n.id === neighbor).h;
            const f = tentativeG + neighborH;
            pq.push({ node: neighbor, f, g: tentativeG });
            setStatusMessage(`  → ${neighbor}: g=${tentativeG}, h=${neighborH}, f=${f}`);
            await delay(anim.speed * 0.3);
          }
          setActiveEdge(null);
        }
      }

      if (!visited.has(goalNode)) setStatusMessage(`❌ Goal ${goalNode} not reachable`);
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [startNode, goalNode, graph, anim, delay, getAdj]);

  // ── 7. Hill Climbing ──
  const hillClimbing = useCallback(async () => {
    anim.start(); resetHighlights();
    try {
      const adj = getAdj();
      const order = [];
      let current = startNode;

      setStatusMessage(`Hill Climbing: start=${startNode}, goal=${goalNode}`);
      await delay(anim.speed);

      while (true) {
        setActiveNodeId(current);
        setVisitedIds(prev => [...prev, current]);
        order.push(current);
        setVisitOrder([...order]);
        const currentH = graph.nodes.find(n => n.id === current).h;
        setStatusMessage(`Hill Climbing at ${current} | h(${current})=${currentH}`);
        anim.incrementStep();
        await delay(anim.speed);

        if (current === goalNode) {
          setStatusMessage(`✅ Goal ${goalNode} reached! Path: [${order.join(' → ')}]`);
          break;
        }

        // Find best neighbor
        let bestNeighbor = -1;
        let bestH = currentH;
        for (const { node: neighbor } of adj[current]) {
          const nh = graph.nodes.find(n => n.id === neighbor).h;
          setActiveEdge([current, neighbor]);
          setStatusMessage(`  Checking ${neighbor}: h=${nh}`);
          await delay(anim.speed * 0.4);
          setActiveEdge(null);
          if (nh < bestH) {
            bestH = nh;
            bestNeighbor = neighbor;
          }
        }

        if (bestNeighbor === -1) {
          setStatusMessage(`⚠️ Stuck at local optimum! Node ${current}, h=${currentH}. No better neighbor.`);
          break;
        }

        setActiveEdge([current, bestNeighbor]);
        setStatusMessage(`  → Move to ${bestNeighbor} (h=${bestH})`);
        await delay(anim.speed * 0.5);
        setActiveEdge(null);
        current = bestNeighbor;
      }
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [startNode, goalNode, graph, anim, delay, getAdj]);

  // ── 8. Simulated Annealing ──
  const simulatedAnnealing = useCallback(async () => {
    anim.start(); resetHighlights();
    try {
      const adj = getAdj();
      const order = [];
      let current = startNode;
      let temperature = 100;
      const coolingRate = 0.85;
      const minTemp = 1;
      let iteration = 0;

      setStatusMessage(`Simulated Annealing: start=${startNode}, goal=${goalNode}, T₀=100`);
      await delay(anim.speed);

      while (temperature > minTemp && iteration < 50) {
        iteration++;
        setActiveNodeId(current);
        setVisitedIds(prev => [...prev, current]);
        if (!order.includes(current)) order.push(current);
        setVisitOrder([...order]);
        const currentH = graph.nodes.find(n => n.id === current).h;
        setStatusMessage(`SA iter ${iteration}: node=${current}, h=${currentH}, T=${temperature.toFixed(1)}`);
        anim.incrementStep();
        await delay(anim.speed);

        if (current === goalNode) {
          setStatusMessage(`✅ Goal reached at iteration ${iteration}! Path: [${order.join(' → ')}]`);
          break;
        }

        // Pick random neighbor
        const neighbors = adj[current];
        if (neighbors.length === 0) break;
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        const neighborH = graph.nodes.find(n => n.id === randomNeighbor.node).h;
        const delta = neighborH - currentH;

        setActiveEdge([current, randomNeighbor.node]);

        if (delta < 0) {
          // Better — always accept
          setStatusMessage(`  → Accept ${randomNeighbor.node} (h=${neighborH}, Δ=${delta}, better)`);
          await delay(anim.speed * 0.5);
          current = randomNeighbor.node;
        } else {
          // Worse — accept with probability e^(-delta/T)
          const prob = Math.exp(-delta / temperature);
          const rand = Math.random();
          if (rand < prob) {
            setStatusMessage(`  → Accept worse ${randomNeighbor.node} (h=${neighborH}, Δ=+${delta}, p=${prob.toFixed(2)} > ${rand.toFixed(2)})`);
            await delay(anim.speed * 0.5);
            current = randomNeighbor.node;
          } else {
            setStatusMessage(`  → Reject ${randomNeighbor.node} (h=${neighborH}, Δ=+${delta}, p=${prob.toFixed(2)} < ${rand.toFixed(2)})`);
            await delay(anim.speed * 0.5);
          }
        }

        setActiveEdge(null);
        temperature *= coolingRate;
      }

      if (current !== goalNode) {
        setStatusMessage(`⚠️ SA ended — final node ${current}, T=${temperature.toFixed(1)}. Goal not reached.`);
      }
      setActiveNodeId(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [startNode, goalNode, graph, anim, delay, getAdj]);

  // ── Router ──
  const runAlgorithm = () => {
    const runners = { bfs, dfs, dls: depthLimitedSearch, bidirectional: bidirectionalSearch, greedy: greedyBestFirst, astar: astarSearch, hillclimb: hillClimbing, sa: simulatedAnnealing };
    runners[algorithm]?.();
  };

  const isEdgeActive = (u, v) => {
    if (!activeEdge) return false;
    return (activeEdge[0] === u && activeEdge[1] === v) || (activeEdge[0] === v && activeEdge[1] === u);
  };

  const isEdgeVisited = (u, v) => visitedIds.includes(u) && visitedIds.includes(v);
  const isEdgePath = (u, v) => pathEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u));

  const needsGoal = ['dls', 'bidirectional', 'greedy', 'astar', 'hillclimb', 'sa'].includes(algorithm);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Algorithm Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {Object.entries(ALGORITHM_INFO).map(([key, a]) => (
          <button key={key} onClick={() => { setAlgorithm(key); resetHighlights(); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border-2
              ${algorithm === key ? 'bg-primary text-text border-text shadow-soft'
                : 'bg-surface text-text/70 border-text hover:text-text hover:bg-background'}`}>
            {a.name}
          </button>
        ))}
      </div>

      {/* Config Row */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={graphKey} onChange={(e) => { setGraphKey(e.target.value); resetHighlights(); setGoalNode(SAMPLE_GRAPHS[e.target.value].goal); }}
          className="bg-surface border border-border text-text px-2 py-1.5 rounded-lg text-sm font-bold focus:border-primary outline-none shadow-soft">
          {Object.entries(SAMPLE_GRAPHS).map(([key, g]) => (
            <option key={key} value={key}>{g.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-1.5">
          <label className="text-[10px] text-text/70 font-bold uppercase">Start:</label>
          <input type="number" min="0" max={graph.nodes.length - 1} value={startNode}
            onChange={(e) => setStartNode(Number(e.target.value))}
            className="w-12 bg-surface border border-border text-text px-1.5 py-1 rounded-lg text-sm font-mono font-bold focus:border-primary outline-none shadow-soft" />
        </div>

        {needsGoal && (
          <div className="flex items-center gap-1.5">
            <label className="text-[10px] text-text/70 font-bold uppercase">Goal:</label>
            <input type="number" min="0" max={graph.nodes.length - 1} value={goalNode}
              onChange={(e) => setGoalNode(Number(e.target.value))}
              className="w-12 bg-surface border border-border text-text px-1.5 py-1 rounded-lg text-sm font-mono font-bold focus:border-primary outline-none shadow-soft" />
          </div>
        )}

        {algorithm === 'dls' && (
          <div className="flex items-center gap-1.5">
            <label className="text-[10px] text-text/70 font-bold uppercase">Depth Limit:</label>
            <input type="number" min="1" max="10" value={depthLimit}
              onChange={(e) => setDepthLimit(Number(e.target.value))}
              className="w-12 bg-surface border border-border text-text px-1.5 py-1 rounded-lg text-sm font-mono font-bold focus:border-primary outline-none shadow-soft" />
          </div>
        )}

        {/* Description */}
        <div className="ml-auto text-text/60 text-xs font-bold max-w-[300px] truncate" title={info.desc}>{info.desc}</div>
      </div>

      {/* Complexity badges */}
      <div className="bg-surface border border-border rounded-lg px-4 py-1.5 flex items-center gap-4 shadow-soft text-xs">
        <span className="text-text/70 font-bold">Time: <span className="text-warning font-mono font-bold">{info.time}</span></span>
        <span className="text-text/70 font-bold">Space: <span className="text-primary font-mono font-bold">{info.space}</span></span>
        {needsGoal && <span className="text-text/50 font-bold">Goal: <span className="text-danger font-mono font-bold">{goalNode}</span></span>}
      </div>

      {/* Graph SVG */}
      <div className="flex-1 bg-surface border border-border shadow-card rounded-lg relative min-h-[150px] overflow-hidden">
        <div className="absolute top-3 left-4 text-xs text-text/70 font-mono font-bold z-10 max-w-[60%]">{statusMessage}</div>

        {/* Queue/Stack display */}
        <div className="absolute top-3 right-4 z-10">
          <div className="bg-background border border-border rounded-lg p-2 text-xs shadow-soft">
            <span className="text-text/70 font-mono font-bold">{algorithm === 'bfs' || algorithm === 'bidirectional' ? 'Queue' : algorithm === 'dfs' || algorithm === 'dls' ? 'Stack' : 'Frontier'}: </span>
            <span className="text-primary font-mono font-bold text-[10px]">[{queueOrStack.join(', ')}]</span>
          </div>
        </div>

        {visitOrder.length > 0 && (
          <div className="absolute bottom-3 left-4 z-10 text-xs text-text/70 font-mono font-bold">
            Visit: [<span className="text-success font-bold">{visitOrder.join(' → ')}</span>]
          </div>
        )}

        <svg width="100%" height="100%" viewBox="0 0 800 480" className="absolute inset-0">
          {/* Edges */}
          {graph.edges.map(([u, v, w], i) => {
            const n1 = graph.nodes.find(n => n.id === u);
            const n2 = graph.nodes.find(n => n.id === v);
            const active = isEdgeActive(u, v);
            const onPath = isEdgePath(u, v);
            const visited = isEdgeVisited(u, v);
            const mx = (n1.x + n2.x) / 2;
            const my = (n1.y + n2.y) / 2;
            return (
              <g key={i}>
                <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                  stroke={onPath ? '#22C55E' : active ? '#EF4444' : visited ? '#111111' : '#cccccc'}
                  strokeWidth={onPath ? 5 : active ? 4 : 2}
                  className="transition-all duration-300" />
                {/* Edge weight */}
                <text x={mx} y={my - 6} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="900"
                  fill={onPath ? '#22C55E' : '#888'}>{w || 1}</text>
              </g>
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((node) => {
            const isActive = activeNodeId === node.id;
            const isVisited = visitedIds.includes(node.id);
            const isStart = startNode === node.id;
            const isGoal = needsGoal && goalNode === node.id;

            let fill = '#FFFFFF';
            let stroke = '#111111';
            let textFill = '#111111';
            let strokeW = 3;

            if (isActive) { fill = '#FFD600'; stroke = '#111111'; strokeW = 4; }
            else if (isGoal && isVisited) { fill = '#22C55E'; stroke = '#111111'; strokeW = 4; }
            else if (isVisited) { fill = '#22C55E'; stroke = '#111111'; strokeW = 3; }
            else if (isGoal) { fill = '#EF4444'; stroke = '#111111'; strokeW = 4; textFill = '#FFFFFF'; }
            else if (isStart) { fill = '#FAFAFA'; stroke = '#111111'; strokeW = 4; }

            return (
              <g key={node.id} className="transition-all duration-300 cursor-pointer"
                onClick={() => setStartNode(node.id)}>
                <circle cx={node.x} cy={node.y} r={24} fill={fill} stroke={stroke} strokeWidth={strokeW} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fill={textFill}
                  fontSize="15" fontFamily="monospace" fontWeight="900">{node.id}</text>
                {/* Heuristic label */}
                {needsGoal && (
                  <text x={node.x + 28} y={node.y - 14} textAnchor="start" fontSize="9" fontFamily="monospace"
                    fontWeight="bold" fill="#888">h={node.h}</text>
                )}
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
        complexity={{ time: info.time, space: info.space }}
      />
    </div>
  );
}
