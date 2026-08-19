import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Shuffle, SlidersHorizontal, Trophy, Footprints, ArrowLeftRight, Timer, Zap, Flag } from 'lucide-react';

// ============================================================
// RACE ALGORITHMS — progressive sorted tracking
// ============================================================
function bubbleSortSteps(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  const frames = [];
  let cmp = 0, sw = 0;
  const sorted = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      cmp++;
      if (arr[j] > arr[j + 1]) {
        sw++;
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
      frames.push({ array: [...arr], comparing: [j, j + 1], sorted: [...sorted], cmp, sw });
    }
    sorted.push(n - i - 1);
    frames.push({ array: [...arr], comparing: [], sorted: [...sorted], cmp, sw });
  }
  frames.push({ array: [...arr], comparing: [], sorted: arr.map((_, i) => i), cmp, sw, done: true });
  return frames;
}

function selectionSortSteps(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  const frames = [];
  let cmp = 0, sw = 0;
  const sorted = [];
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      cmp++;
      if (arr[j] < arr[minIdx]) minIdx = j;
      frames.push({ array: [...arr], comparing: [minIdx, j], sorted: [...sorted], cmp, sw });
    }
    if (minIdx !== i) {
      sw++;
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    sorted.push(i);
    frames.push({ array: [...arr], comparing: [], sorted: [...sorted], cmp, sw });
  }
  frames.push({ array: [...arr], comparing: [], sorted: arr.map((_, i) => i), cmp, sw, done: true });
  return frames;
}

function insertionSortSteps(inputArr) {
  const arr = [...inputArr];
  const n = arr.length;
  const frames = [];
  let cmp = 0, sw = 0;
  const sorted = [0];
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      cmp++;
      sw++;
      arr[j + 1] = arr[j];
      frames.push({ array: [...arr], comparing: [j, j + 1], sorted: [...sorted], cmp, sw });
      j--;
    }
    cmp++;
    arr[j + 1] = key;
    sorted.push(i);
    frames.push({ array: [...arr], comparing: [], sorted: [...sorted], cmp, sw });
  }
  frames.push({ array: [...arr], comparing: [], sorted: arr.map((_, i) => i), cmp, sw, done: true });
  return frames;
}

function mergeSortSteps(inputArr) {
  const arr = [...inputArr];
  const frames = [];
  let cmp = 0, sw = 0;
  const sorted = [];

  function mergeInPlace(arr, l, m, r) {
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      cmp++;
      if (left[i] <= right[j]) {
        arr[k] = left[i]; i++;
      } else {
        arr[k] = right[j]; j++;
        sw++;
      }
      k++;
      frames.push({ array: [...arr], comparing: [l + Math.min(i, left.length - 1), m + 1 + Math.min(j, right.length - 1)], sorted: [...sorted], cmp, sw });
    }
    while (i < left.length) { arr[k] = left[i]; i++; k++; }
    while (j < right.length) { arr[k] = right[j]; j++; k++; }
    // After final merge, mark all as sorted
    if (l === 0 && r === arr.length - 1) {
      for (let x = l; x <= r; x++) { if (!sorted.includes(x)) sorted.push(x); }
    }
    frames.push({ array: [...arr], comparing: [], sorted: [...sorted], cmp, sw });
  }

  function sort(arr, l, r) {
    if (l < r) {
      let m = Math.floor((l + r) / 2);
      sort(arr, l, m);
      sort(arr, m + 1, r);
      mergeInPlace(arr, l, m, r);
    }
  }
  sort(arr, 0, arr.length - 1);
  frames.push({ array: [...arr], comparing: [], sorted: arr.map((_, i) => i), cmp, sw, done: true });
  return frames;
}

function quickSortSteps(inputArr) {
  const arr = [...inputArr];
  const frames = [];
  let cmp = 0, sw = 0;
  const sorted = [];

  function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      cmp++;
      frames.push({ array: [...arr], comparing: [j, high], sorted: [...sorted], cmp, sw });
      if (arr[j] < pivot) {
        i++;
        sw++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        frames.push({ array: [...arr], comparing: [i, j], sorted: [...sorted], cmp, sw });
      }
    }
    sw++;
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    sorted.push(i + 1);
    frames.push({ array: [...arr], comparing: [], sorted: [...sorted], cmp, sw });
    return i + 1;
  }

  function sort(arr, low, high) {
    if (low < high) {
      let pi = partition(arr, low, high);
      sort(arr, low, pi - 1);
      sort(arr, pi + 1, high);
    } else if (low === high) {
      if (!sorted.includes(low)) sorted.push(low);
      frames.push({ array: [...arr], comparing: [], sorted: [...sorted], cmp, sw });
    }
  }
  sort(arr, 0, arr.length - 1);
  frames.push({ array: [...arr], comparing: [], sorted: arr.map((_, i) => i), cmp, sw, done: true });
  return frames;
}

function heapSortSteps(inputArr) {
  const arr = [...inputArr];
  const frames = [];
  let cmp = 0, sw = 0;
  const n = arr.length;
  const sorted = [];

  function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    if (left < n) { cmp++; if (arr[left] > arr[largest]) largest = left; }
    if (right < n) { cmp++; if (arr[right] > arr[largest]) largest = right; }
    if (largest !== i) {
      sw++;
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      frames.push({ array: [...arr], comparing: [i, largest], sorted: [...sorted], cmp, sw });
      heapify(arr, n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    sw++;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    sorted.push(i);
    frames.push({ array: [...arr], comparing: [0, i], sorted: [...sorted], cmp, sw });
    heapify(arr, i, 0);
  }
  sorted.push(0);
  frames.push({ array: [...arr], comparing: [], sorted: arr.map((_, i) => i), cmp, sw, done: true });
  return frames;
}

// ============================================================
// AVAILABLE RACE ALGORITHMS
// ============================================================
const RACE_ALGORITHMS = {
  bubble: { name: 'Bubble Sort', color: 'bg-danger', textColor: 'text-danger', generate: bubbleSortSteps },
  selection: { name: 'Selection Sort', color: 'bg-warning', textColor: 'text-warning', generate: selectionSortSteps },
  insertion: { name: 'Insertion Sort', color: 'bg-success', textColor: 'text-success', generate: insertionSortSteps },
  merge: { name: 'Merge Sort', color: 'bg-primary', textColor: 'text-primary', generate: mergeSortSteps },
  quick: { name: 'Quick Sort', color: 'bg-[#8b5cf6]', textColor: 'text-[#8b5cf6]', generate: quickSortSteps },
  heap: { name: 'Heap Sort', color: 'bg-[#06b6d4]', textColor: 'text-[#06b6d4]', generate: heapSortSteps },
};

function generateArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 90) + 10);
  }
  return arr;
}

// ============================================================
// MINI BAR CHART COMPONENT
// ============================================================
function MiniBarChart({ frame, maxVal, algoName, color, totalSteps, finishOrder }) {
  const { array, comparing, sorted, cmp, sw, done } = frame;
  return (
    <div className={`brutal-card bg-surface p-4 border border-border shadow-soft relative transition-all ${done ? 'ring-4 ring-success' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold uppercase text-sm tracking-tight">{algoName}</h3>
        {done && finishOrder !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-0.5 border border-border shadow-soft ${finishOrder === 0 ? 'bg-primary' : finishOrder === 1 ? 'bg-warning' : 'bg-surface'}`}>
            <Trophy size={12} />
            <span className="text-[10px] font-bold uppercase">#{finishOrder + 1}</span>
          </div>
        )}
      </div>

      {/* Bars */}
      <div className="flex items-end gap-[1px] h-[140px] bg-[#f0f0f0] dark:bg-[#1a1a2e] border border-border p-2 rounded">
        {array.map((val, idx) => {
          const h = (val / maxVal) * 100;
          const isComparing = comparing.includes(idx);
          const isSorted = sorted?.includes(idx);
          let barBg = 'bg-[#555] dark:bg-[#888]';
          if (isSorted) barBg = 'bg-success';
          else if (isComparing) barBg = color;
          return (
            <div
              key={idx}
              className={`flex-1 min-w-[2px] transition-all duration-75 ${barBg} border border-black/10`}
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-3 text-[10px] font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1">
          <Footprints size={10} /> Steps <span className="font-mono bg-text text-surface px-1">{frame.stepIndex || 0}/{totalSteps}</span>
        </span>
        <span className="flex items-center gap-1">
          <ArrowLeftRight size={10} /> cmp <span className="font-mono bg-text text-surface px-1">{cmp}</span>
        </span>
        <span className="flex items-center gap-1">
          <Shuffle size={10} /> swap <span className="font-mono bg-text text-surface px-1">{sw}</span>
        </span>
      </div>
    </div>
  );
}

// ============================================================
// MAIN RACE COMPONENT
// ============================================================
export default function AlgorithmRace() {
  const [selectedAlgos, setSelectedAlgos] = useState(['bubble', 'insertion', 'merge', 'quick']);
  const [arraySize, setArraySize] = useState(22);
  const [sourceArray, setSourceArray] = useState(() => generateArray(22));
  const [isRacing, setIsRacing] = useState(false);
  const [raceSpeed, setRaceSpeed] = useState(30);
  const [raceFrames, setRaceFrames] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [finishOrder, setFinishOrder] = useState([]);
  const [raceComplete, setRaceComplete] = useState(false);
  const timerRef = useRef(null);
  const finishOrderRef = useRef([]);

  const maxVal = Math.max(...sourceArray);

  const toggleAlgo = (key) => {
    if (isRacing) return;
    setSelectedAlgos(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleNewArray = () => {
    if (isRacing) return;
    const newArr = generateArray(arraySize);
    setSourceArray(newArr);
    setRaceFrames({});
    setCurrentStep(0);
    setFinishOrder([]);
    setRaceComplete(false);
    finishOrderRef.current = [];
  };

  const startRace = useCallback(() => {
    if (selectedAlgos.length < 2) return;

    // Pre-compute all frames for each algorithm
    const allFrames = {};
    let maxFrames = 0;
    selectedAlgos.forEach(key => {
      const frames = RACE_ALGORITHMS[key].generate(sourceArray);
      // Annotate step index
      frames.forEach((f, i) => { f.stepIndex = i; });
      allFrames[key] = frames;
      maxFrames = Math.max(maxFrames, frames.length);
    });

    setRaceFrames(allFrames);
    setCurrentStep(0);
    setFinishOrder([]);
    setRaceComplete(false);
    setIsRacing(true);
    finishOrderRef.current = [];

    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      setCurrentStep(step);

      // Check for newly finished algorithms
      let allDone = true;
      selectedAlgos.forEach(key => {
        const frames = allFrames[key];
        const frameIdx = Math.min(step, frames.length - 1);
        const frame = frames[frameIdx];
        if (frame.done) {
          if (!finishOrderRef.current.includes(key)) {
            finishOrderRef.current = [...finishOrderRef.current, key];
            setFinishOrder([...finishOrderRef.current]);
          }
        } else {
          allDone = false;
        }
      });

      if (allDone || step >= maxFrames + 5) {
        clearInterval(timerRef.current);
        setIsRacing(false);
        setRaceComplete(true);
      }
    }, raceSpeed);
  }, [selectedAlgos, sourceArray, raceSpeed]);

  const stopRace = () => {
    clearInterval(timerRef.current);
    setIsRacing(false);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Get the current frame for a given algorithm
  const getFrame = (key) => {
    const frames = raceFrames[key];
    if (!frames) return { array: sourceArray, comparing: [], sorted: [], cmp: 0, sw: 0, stepIndex: 0 };
    const idx = Math.min(currentStep, frames.length - 1);
    return frames[idx];
  };

  return (
    <div className="flex flex-col gap-6 h-full bg-surface p-4 md:p-6 text-text overflow-y-auto">
      {/* Hero Header */}
      <div className="bg-primary border border-border rounded p-6 shadow-card text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-text p-2 border border-border shadow-[3px_3px_0px_#555]">
            <Trophy size={28} className="text-primary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter">Algorithm Race</h1>
        <p className="text-sm font-bold uppercase tracking-wider mt-1 opacity-80">
          Pick algorithms, hit start, and watch them compete in real-time
        </p>
      </div>

      {/* Algorithm Selector Pills */}
      <div className="flex flex-wrap items-center gap-3">
        {Object.entries(RACE_ALGORITHMS).map(([key, algo]) => {
          const isSelected = selectedAlgos.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggleAlgo(key)}
              disabled={isRacing}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all border-4 shadow-soft
                ${isSelected
                  ? `${algo.color} text-text border-text -translate-y-0.5 shadow-card`
                  : 'bg-background text-text border-text hover:bg-surface hover:-translate-y-0.5 opacity-60 hover:opacity-100'
                }
                ${isRacing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {algo.name}
            </button>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-background border border-border shadow-soft p-4">
        {/* Array Size */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} />
          <span className="text-sm font-bold uppercase">Array size {arraySize}</span>
          <input
            type="range" min="8" max="50" value={arraySize}
            onChange={(e) => { if (!isRacing) { setArraySize(Number(e.target.value)); } }}
            onMouseUp={() => { if (!isRacing) handleNewArray(); }}
            className="w-28 accent-primary h-2 cursor-pointer border border-border bg-surface"
            disabled={isRacing}
          />
        </div>

        <div className="w-1 h-6 bg-text"></div>

        {/* Speed */}
        <div className="flex items-center gap-2">
          <Timer size={16} />
          <span className="text-sm font-bold uppercase">{raceSpeed}ms</span>
          <input
            type="range" min="5" max="200" step="5" value={raceSpeed}
            onChange={(e) => setRaceSpeed(Number(e.target.value))}
            className="w-24 accent-primary h-2 cursor-pointer border border-border bg-surface"
          />
          <div className="flex gap-1 text-[10px] font-bold uppercase tracking-widest">
            <span>Fast</span><span>—</span><span>Slow</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={handleNewArray}
            disabled={isRacing}
            className="flex items-center gap-2 px-3 py-2 bg-warning hover:bg-warning/80 text-text font-bold uppercase border border-border transition-all shadow-soft hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111] disabled:opacity-50"
          >
            <RotateCcw size={16} /> New array
          </button>

          {!isRacing ? (
            <button
              onClick={startRace}
              disabled={selectedAlgos.length < 2}
              className="flex items-center gap-2 px-5 py-2 bg-success text-surface font-bold uppercase tracking-wider border border-border transition-all shadow-soft hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={16} /> Start race
            </button>
          ) : (
            <button
              onClick={stopRace}
              className="flex items-center gap-2 px-5 py-2 bg-danger text-surface font-bold uppercase tracking-wider border border-border transition-all shadow-soft hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111]"
            >
              <Flag size={16} /> Stop
            </button>
          )}
        </div>
      </div>

      {/* Race Grid */}
      <div className={`grid gap-4 ${selectedAlgos.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
        {selectedAlgos.map((key) => {
          const algo = RACE_ALGORITHMS[key];
          const frame = getFrame(key);
          const totalSteps = raceFrames[key]?.length || 0;
          const orderIdx = finishOrder.indexOf(key);
          return (
            <MiniBarChart
              key={key}
              frame={frame}
              maxVal={maxVal}
              algoName={algo.name}
              color={algo.color}
              totalSteps={totalSteps}
              finishOrder={orderIdx >= 0 ? orderIdx : undefined}
            />
          );
        })}
      </div>

      {/* Results Banner */}
      {raceComplete && finishOrder.length > 0 && (
        <div className="bg-primary border border-border rounded p-5 shadow-card">
          <h2 className="font-bold uppercase text-lg tracking-tight mb-3 border-b border-border pb-2 flex items-center gap-2">
            <Trophy size={20} /> Race Results
          </h2>
          <div className="flex flex-wrap gap-4">
            {finishOrder.map((key, idx) => {
              const algo = RACE_ALGORITHMS[key];
              const frames = raceFrames[key];
              const lastFrame = frames[frames.length - 1];
              return (
                <div key={key} className="flex items-center gap-3 bg-surface border border-border p-3 rounded shadow-soft">
                  <div className={`w-8 h-8 flex items-center justify-center font-bold text-lg border border-border ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-warning' : 'bg-surface'} shadow-soft`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold uppercase text-sm">{algo.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {lastFrame.cmp} cmp · {lastFrame.sw} swaps · {frames.length} steps
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Min selection warning */}
      {selectedAlgos.length < 2 && (
        <div className="bg-warning/20 border-4 border-warning text-text p-4 rounded shadow-soft text-center font-bold uppercase text-sm">
          <Zap size={16} className="inline mr-2" />
          Select at least 2 algorithms to start a race
        </div>
      )}
    </div>
  );
}
