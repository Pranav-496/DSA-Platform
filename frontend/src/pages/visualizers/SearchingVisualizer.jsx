import React, { useState, useCallback, useRef, useEffect } from 'react';
import ControlBar from './ControlBar';
import useAnimationControl from './useAnimationControl';
import { Shuffle } from 'lucide-react';

const ALGORITHMS = {
  linear: { name: 'Linear Search', time: 'O(n)', space: 'O(1)', best: 'O(1)', description: 'Sequentially checks each element until the target is found.' },
  binary: { name: 'Binary Search', time: 'O(log n)', space: 'O(1)', best: 'O(1)', description: 'Efficiently searches a sorted array by halving the search space.' },
};

function generateSortedArray(size) {
  const arr = [];
  let val = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < size; i++) {
    arr.push(val);
    val += Math.floor(Math.random() * 8) + 1;
  }
  return arr;
}

export default function SearchingVisualizer() {
  const [algorithm, setAlgorithm] = useState('binary');
  const [array, setArray] = useState(() => generateSortedArray(20));
  const [target, setTarget] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [visited, setVisited] = useState([]);
  const [eliminated, setEliminated] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const anim = useAnimationControl();

  const resetVisualization = useCallback(() => {
    anim.stop();
    setCurrentIndex(-1);
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setFoundIndex(-1);
    setVisited([]);
    setEliminated([]);
    setStatusMessage('');
  }, [anim]);

  const handleNewArray = () => {
    resetVisualization();
    const newArr = generateSortedArray(20);
    setArray(newArr);
    setTarget('');
  };

  const delay = useCallback(async (ms = 1) => {
    const result = await anim.sleep(ms);
    if (result === 'cancelled') throw new Error('cancelled');
  }, [anim]);

  const linearSearch = useCallback(async () => {
    const t = parseInt(target);
    if (isNaN(t)) { setStatusMessage('⚠ Enter a valid target number'); anim.finish(); return; }
    
    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      setVisited(prev => [...prev, i]);
      setStatusMessage(`Checking index ${i}: ${array[i]} === ${t}?`);
      anim.incrementStep();
      await delay(anim.speed);
      
      if (array[i] === t) {
        setFoundIndex(i);
        setStatusMessage(`✅ Found ${t} at index ${i}!`);
        return;
      }
    }
    setStatusMessage(`❌ ${t} not found in the array.`);
    setCurrentIndex(-1);
  }, [array, target, anim, delay]);

  const binarySearch = useCallback(async () => {
    const t = parseInt(target);
    if (isNaN(t)) { setStatusMessage('⚠ Enter a valid target number'); anim.finish(); return; }

    let lo = 0, hi = array.length - 1;
    setLeft(lo);
    setRight(hi);

    while (lo <= hi) {
      const m = Math.floor((lo + hi) / 2);
      setMid(m);
      setLeft(lo);
      setRight(hi);
      setStatusMessage(`left=${lo}, right=${hi}, mid=${m} → array[${m}]=${array[m]}, target=${t}`);
      anim.incrementStep();
      await delay(anim.speed * 1.5);

      if (array[m] === t) {
        setFoundIndex(m);
        setStatusMessage(`✅ Found ${t} at index ${m}!`);
        return;
      } else if (array[m] < t) {
        // Eliminate left portion
        for (let i = lo; i <= m; i++) setEliminated(prev => [...prev, i]);
        setStatusMessage(`${array[m]} < ${t} → search right half`);
        await delay(anim.speed);
        lo = m + 1;
      } else {
        // Eliminate right portion
        for (let i = m; i <= hi; i++) setEliminated(prev => [...prev, i]);
        setStatusMessage(`${array[m]} > ${t} → search left half`);
        await delay(anim.speed);
        hi = m - 1;
      }
    }
    setStatusMessage(`❌ ${t} not found in the array.`);
    setMid(-1);
    setLeft(-1);
    setRight(-1);
  }, [array, target, anim, delay]);

  const runAlgorithm = async () => {
    resetVisualization();
    anim.start();
    try {
      if (algorithm === 'linear') await linearSearch();
      else await binarySearch();
    } catch (e) {
      if (e.message !== 'cancelled') console.error(e);
      setStatusMessage('Stopped.');
    }
    anim.finish();
  };

  const info = ALGORITHMS[algorithm];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Algorithm Tabs */}
      <div className="flex items-center gap-2">
        {Object.entries(ALGORITHMS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => { setAlgorithm(key); resetVisualization(); }}
            className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider transition-all border-4
              ${algorithm === key
                ? 'bg-primary text-text border-text shadow-[2px_2px_0px_#111]'
                : 'bg-surface text-text/70 border-text/30 hover:text-text hover:border-text hover:shadow-[2px_2px_0px_#111]'}`}
          >
            {val.name}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-text/70 font-black uppercase tracking-wider">Target:</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 23"
              className="w-20 bg-surface border-4 border-text text-text px-2 py-1.5 rounded-lg text-sm font-mono focus:border-primary outline-none shadow-[2px_2px_0px_#111]"
            />
          </div>
          <button onClick={handleNewArray} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-background text-text rounded-lg text-sm font-black uppercase tracking-wider border-4 border-text shadow-[2px_2px_0px_#111] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111] transition-all">
            <Shuffle size={14} /> New Array
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-surface border-4 border-text rounded-lg px-4 py-2 flex items-center justify-between shadow-brutal-sm">
        <p className="text-text/70 text-sm">{info.description}</p>
        <div className="flex gap-4 text-xs">
          <span className="text-text/70 font-black">Best: <span className="text-success font-mono">{info.best}</span></span>
          <span className="text-text/70 font-black">Worst: <span className="text-warning font-mono">{info.time}</span></span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-text/70 font-bold bg-surface border-4 border-text p-2 shadow-brutal-sm">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary/10 border-2 border-text/30 inline-block"></span> In Range</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-warning border-2 border-text inline-block"></span> Current</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-surface border-2 border-dashed border-text/30 opacity-40 inline-block"></span> Eliminated</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-success border-2 border-text inline-block"></span> Found</span>
      </div>

      {/* Array Cells Visualization */}
      <div className="flex-1 bg-background border-4 border-text shadow-brutal p-8 flex flex-col items-center justify-center min-h-[150px] relative overflow-hidden rounded-lg">
        <div className="absolute top-3 left-4 text-xs text-text/70 font-mono font-bold">{statusMessage}</div>

        {/* Binary Search Pointers */}
        {algorithm === 'binary' && left >= 0 && right >= 0 && (
          <div className="flex gap-[2px] mb-2 w-full justify-center">
            {array.map((_, idx) => (
              <div key={idx} className="flex flex-col items-center" style={{ width: `${Math.min(100/array.length, 5)}%`, minWidth: '30px', maxWidth: '60px' }}>
                {idx === left && <span className="text-success text-[10px] font-mono font-black animate-bounce">L</span>}
                {idx === mid && <span className="text-warning text-[10px] font-mono font-black animate-bounce">M</span>}
                {idx === right && <span className="text-danger text-[10px] font-mono font-black animate-bounce">R</span>}
                {idx !== left && idx !== mid && idx !== right && <span className="text-transparent text-[10px]">-</span>}
              </div>
            ))}
          </div>
        )}

        {/* Array Cells */}
        <div className="flex gap-[2px] w-full justify-center">
          {array.map((val, idx) => {
            const isFound = foundIndex === idx;
            const isCurrent = currentIndex === idx;
            const isMid = mid === idx;
            const isVisited = visited.includes(idx);
            const isEliminated = eliminated.includes(idx);
            const isInRange = algorithm === 'binary' && idx >= left && idx <= right && left >= 0;

            let cellClass = 'bg-surface border-text/30 text-text';
            if (isFound) cellClass = 'bg-success border-text text-text shadow-[2px_2px_0px_#111] scale-110 border-4';
            else if (isCurrent || isMid) cellClass = 'bg-warning border-text text-text shadow-[2px_2px_0px_#111] border-4';
            else if (isEliminated) cellClass = 'bg-surface opacity-40 border-dashed border-text/30 text-text/50';
            else if (isVisited) cellClass = 'bg-primary/30 border-text/50 text-text';
            else if (isInRange) cellClass = 'bg-primary/10 border-text/30 text-text';

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-300 ${cellClass}`}
                style={{ width: `${Math.min(100/array.length, 5)}%`, minWidth: '30px', maxWidth: '60px', height: '60px' }}
              >
                <span className="font-mono font-black text-sm">{val}</span>
                <span className="text-[9px] opacity-50">{idx}</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Controls */}
      <ControlBar
        isPlaying={anim.isPlaying} isPaused={anim.isPaused} speed={anim.speed}
        stepCount={anim.stepCount}
        onStart={runAlgorithm} onPause={anim.pause} onResume={anim.resume}
        onStop={anim.stop} onReset={resetVisualization}
        onSpeedChange={anim.setSpeed}
        complexity={{ time: info.time, space: info.space }}
      />
    </div>
  );
}
