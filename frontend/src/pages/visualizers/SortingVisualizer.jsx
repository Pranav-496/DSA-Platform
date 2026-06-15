import React, { useState, useEffect, useCallback, useRef } from 'react';
import ControlBar from './ControlBar';
import useAnimationControl from './useAnimationControl';
import { Shuffle, SlidersHorizontal, BrainCircuit, Activity } from 'lucide-react';

const ALGORITHMS = {
  bubble: { name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)', best: 'O(n)', description: 'Repeatedly swaps adjacent elements if they are in wrong order.' },
  selection: { name: 'Selection Sort', time: 'O(n²)', space: 'O(1)', best: 'O(n²)', description: 'Finds the minimum element and places it at the beginning.' },
  insertion: { name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)', best: 'O(n)', description: 'Builds sorted array one item at a time by insertion.' },
  merge: { name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)', best: 'O(n log n)', description: 'Divides array in half, sorts each half, then merges them.' },
  quick: { name: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)', best: 'O(n log n)', description: 'Picks a pivot, partitions around it, recursively sorts partitions.' },
  heap: { name: 'Heap Sort', time: 'O(n log n)', space: 'O(1)', best: 'O(n log n)', description: 'Builds a max heap, then repeatedly extracts the maximum element.' },
  shell: { name: 'Shell Sort', time: 'O(n log n)', space: 'O(1)', best: 'O(n log n)', description: 'Optimization of insertion sort allowing exchange of far items.' },
  cocktail: { name: 'Cocktail Sort', time: 'O(n²)', space: 'O(1)', best: 'O(n)', description: 'Bidirectional bubble sort, traverses both forwards and backwards.' },
};

function generateArray(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 90) + 10);
  }
  return arr;
}

export default function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState('bubble');
  const [arraySize, setArraySize] = useState(25);
  const [array, setArray] = useState(() => generateArray(25));
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const anim = useAnimationControl();
  const arrayRef = useRef(array);

  useEffect(() => { arrayRef.current = array; }, [array]);

  const resetVisualization = useCallback(() => {
    anim.stop();
    const newArr = generateArray(arraySize);
    setArray(newArr);
    setActiveIndices([]);
    setSortedIndices([]);
    setPivotIndex(-1);
    setComparing([]);
    setSwapping([]);
    setStatusMessage('');
  }, [arraySize, anim]);

  const handleNewArray = () => {
    resetVisualization();
  };

  const delay = useCallback(async (ms = 1) => {
    const result = await anim.sleep(ms);
    if (result === 'cancelled') throw new Error('cancelled');
  }, [anim]);

  // ================================================
  // BUBBLE SORT
  // ================================================
  const bubbleSort = useCallback(async () => {
    let arr = [...arrayRef.current];
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        setStatusMessage(`Comparing index ${j} and ${j + 1}`);
        anim.incrementStep();
        await delay(anim.speed);
        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          setStatusMessage(`Swapping ${arr[j]} and ${arr[j + 1]}`);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await delay(anim.speed * 0.6);
          setSwapping([]);
        }
        setComparing([]);
      }
      setSortedIndices(prev => [...prev, n - i - 1]);
    }
  }, [anim, delay]);

  // ================================================
  // SELECTION SORT
  // ================================================
  const selectionSort = useCallback(async () => {
    let arr = [...arrayRef.current];
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      let minIdx = i;
      setActiveIndices([i]);
      setStatusMessage(`Finding minimum from index ${i} to ${n - 1}`);
      for (let j = i + 1; j < n; j++) {
        setComparing([minIdx, j]);
        anim.incrementStep();
        await delay(anim.speed);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setActiveIndices([minIdx]);
        }
      }
      if (minIdx !== i) {
        setSwapping([i, minIdx]);
        setStatusMessage(`Swapping index ${i} (${arr[i]}) with min at ${minIdx} (${arr[minIdx]})`);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        await delay(anim.speed * 0.6);
        setSwapping([]);
      }
      setSortedIndices(prev => [...prev, i]);
      setComparing([]);
      setActiveIndices([]);
    }
  }, [anim, delay]);

  // ================================================
  // INSERTION SORT
  // ================================================
  const insertionSort = useCallback(async () => {
    let arr = [...arrayRef.current];
    const n = arr.length;
    setSortedIndices([0]);
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      setActiveIndices([i]);
      setStatusMessage(`Inserting ${key} into sorted position`);
      anim.incrementStep();
      await delay(anim.speed);
      while (j >= 0 && arr[j] > key) {
        setComparing([j, j + 1]);
        setSwapping([j, j + 1]);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        anim.incrementStep();
        await delay(anim.speed * 0.5);
        j--;
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setSortedIndices(prev => [...new Set([...prev, i])]);
      setComparing([]);
      setSwapping([]);
      setActiveIndices([]);
      await delay(anim.speed * 0.3);
    }
    setSortedIndices(arr.map((_, i) => i));
  }, [anim, delay]);

  // ================================================
  // MERGE SORT
  // ================================================
  const mergeSort = useCallback(async () => {
    let arr = [...arrayRef.current];

    async function merge(arr, l, m, r) {
      let left = arr.slice(l, m + 1);
      let right = arr.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;

      while (i < left.length && j < right.length) {
        setComparing([l + i, m + 1 + j]);
        setStatusMessage(`Merging: comparing ${left[i]} and ${right[j]}`);
        anim.incrementStep();
        await delay(anim.speed);
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          i++;
        } else {
          arr[k] = right[j];
          j++;
        }
        setArray([...arr]);
        setActiveIndices(Array.from({ length: r - l + 1 }, (_, idx) => l + idx));
        k++;
      }

      while (i < left.length) {
        arr[k] = left[i]; i++; k++;
        setArray([...arr]);
        await delay(anim.speed * 0.3);
      }
      while (j < right.length) {
        arr[k] = right[j]; j++; k++;
        setArray([...arr]);
        await delay(anim.speed * 0.3);
      }
      setComparing([]);
    }

    async function sort(arr, l, r) {
      if (l < r) {
        let m = Math.floor((l + r) / 2);
        await sort(arr, l, m);
        await sort(arr, m + 1, r);
        await merge(arr, l, m, r);
      }
    }

    await sort(arr, 0, arr.length - 1);
    setSortedIndices(arr.map((_, i) => i));
    setActiveIndices([]);
  }, [anim, delay]);

  // ================================================
  // QUICK SORT
  // ================================================
  const quickSort = useCallback(async () => {
    let arr = [...arrayRef.current];

    async function partition(arr, low, high) {
      let pivot = arr[high];
      setPivotIndex(high);
      setStatusMessage(`Pivot: ${pivot} at index ${high}`);
      let i = low - 1;

      for (let j = low; j < high; j++) {
        setComparing([j, high]);
        anim.incrementStep();
        await delay(anim.speed);
        if (arr[j] < pivot) {
          i++;
          setSwapping([i, j]);
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          await delay(anim.speed * 0.5);
          setSwapping([]);
        }
        setComparing([]);
      }
      setSwapping([i + 1, high]);
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await delay(anim.speed * 0.5);
      setSwapping([]);
      setSortedIndices(prev => [...prev, i + 1]);
      return i + 1;
    }

    async function sort(arr, low, high) {
      if (low < high) {
        let pi = await partition(arr, low, high);
        await sort(arr, low, pi - 1);
        await sort(arr, pi + 1, high);
      } else if (low === high) {
        setSortedIndices(prev => [...prev, low]);
      }
    }

    await sort(arr, 0, arr.length - 1);
    setSortedIndices(arr.map((_, i) => i));
    setPivotIndex(-1);
  }, [anim, delay]);

  // ================================================
  // HEAP SORT
  // ================================================
  const heapSort = useCallback(async () => {
    let arr = [...arrayRef.current];
    const n = arr.length;

    async function heapify(arr, n, i) {
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;

      if (left < n) {
        setComparing([largest, left]);
        anim.incrementStep();
        await delay(anim.speed);
        if (arr[left] > arr[largest]) largest = left;
        setComparing([]);
      }

      if (right < n) {
        setComparing([largest, right]);
        anim.incrementStep();
        await delay(anim.speed);
        if (arr[right] > arr[largest]) largest = right;
        setComparing([]);
      }

      if (largest !== i) {
        setSwapping([i, largest]);
        setStatusMessage(`Swapping ${arr[i]} and ${arr[largest]} to maintain heap property`);
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        setArray([...arr]);
        await delay(anim.speed * 0.5);
        setSwapping([]);
        await heapify(arr, n, largest);
      }
    }

    setStatusMessage('Phase 1: Building Max Heap');
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
    }

    setStatusMessage('Phase 2: Extracting elements from heap');
    for (let i = n - 1; i > 0; i--) {
      setStatusMessage(`Extracting max element ${arr[0]} to end`);
      setSwapping([0, i]);
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      await delay(anim.speed * 0.5);
      setSwapping([]);
      setSortedIndices(prev => [...prev, i]);
      await heapify(arr, i, 0);
    }
    setSortedIndices(prev => [...prev, 0]);
  }, [anim, delay]);

  // ================================================
  // SHELL SORT
  // ================================================
  const shellSort = useCallback(async () => {
    let arr = [...arrayRef.current];
    const n = arr.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      setStatusMessage(`Sorting with gap ${gap}`);
      for (let i = gap; i < n; i++) {
        let temp = arr[i];
        let j;
        setActiveIndices([i]);
        for (j = i; j >= gap; j -= gap) {
          setComparing([j - gap, i]);
          anim.incrementStep();
          await delay(anim.speed);
          if (arr[j - gap] > temp) {
             setSwapping([j, j - gap]);
             arr[j] = arr[j - gap];
             setArray([...arr]);
             await delay(anim.speed * 0.4);
             setSwapping([]);
          } else {
             setComparing([]);
             break;
          }
          setComparing([]);
        }
        arr[j] = temp;
        setArray([...arr]);
        setActiveIndices([]);
        await delay(anim.speed * 0.3);
      }
    }
    setSortedIndices(arr.map((_, i) => i));
  }, [anim, delay]);

  // ================================================
  // COCKTAIL SHAKER SORT
  // ================================================
  const cocktailSort = useCallback(async () => {
    let arr = [...arrayRef.current];
    let n = arr.length;
    let swapped = true;
    let start = 0;
    let end = n - 1;

    while (swapped) {
      swapped = false;
      setStatusMessage(`Forward pass from index ${start} to ${end}`);
      for (let i = start; i < end; i++) {
        setComparing([i, i + 1]);
        anim.incrementStep();
        await delay(anim.speed);
        if (arr[i] > arr[i + 1]) {
          setSwapping([i, i + 1]);
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          setArray([...arr]);
          swapped = true;
          await delay(anim.speed * 0.5);
          setSwapping([]);
        }
        setComparing([]);
      }
      
      if (!swapped) break;
      setSortedIndices(prev => [...prev, end]);
      end--;
      swapped = false;
      
      setStatusMessage(`Backward pass from index ${end} to ${start}`);
      for (let i = end - 1; i >= start; i--) {
        setComparing([i, i + 1]);
        anim.incrementStep();
        await delay(anim.speed);
        if (arr[i] > arr[i + 1]) {
          setSwapping([i, i + 1]);
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          setArray([...arr]);
          swapped = true;
          await delay(anim.speed * 0.5);
          setSwapping([]);
        }
        setComparing([]);
      }
      setSortedIndices(prev => [...prev, start]);
      start++;
    }
    setSortedIndices(arr.map((_, i) => i));
  }, [anim, delay]);


  const runAlgorithm = async () => {
    anim.start();
    setSortedIndices([]);
    setComparing([]);
    setSwapping([]);
    setActiveIndices([]);
    setPivotIndex(-1);
    setStatusMessage('Starting...');

    try {
      switch (algorithm) {
        case 'bubble': await bubbleSort(); break;
        case 'selection': await selectionSort(); break;
        case 'insertion': await insertionSort(); break;
        case 'merge': await mergeSort(); break;
        case 'quick': await quickSort(); break;
        case 'heap': await heapSort(); break;
        case 'shell': await shellSort(); break;
        case 'cocktail': await cocktailSort(); break;
      }
      setStatusMessage('✅ Sorting complete!');
    } catch (e) {
      if (e.message !== 'cancelled') console.error(e);
      setStatusMessage('Stopped.');
    }
    anim.finish();
  };

  const maxVal = Math.max(...array);
  const info = ALGORITHMS[algorithm];

  return (
    <div className="flex flex-col gap-4 h-full bg-surface p-4 text-text">
      {/* Algorithm Selector */}
      <div className="flex flex-wrap items-center gap-3">
        {Object.entries(ALGORITHMS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => { setAlgorithm(key); resetVisualization(); }}
            className={`px-4 py-2 text-sm font-black uppercase tracking-wider transition-all border-4 shadow-brutal-sm
              ${algorithm === key
                ? 'bg-primary text-text border-text -translate-y-0.5 shadow-[4px_4px_0px_#111]'
                : 'bg-background text-text border-text hover:bg-surface hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111]'}`}
          >
            {val.name}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-4 bg-background border-4 border-text p-2 rounded shadow-brutal-sm">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-text" />
            <span className="text-sm font-bold uppercase">Size: {arraySize}</span>
            <input
              type="range" min="5" max="60" value={arraySize}
              onChange={(e) => { setArraySize(Number(e.target.value)); }}
              onMouseUp={() => resetVisualization()}
              className="w-24 accent-primary h-2 cursor-pointer border-2 border-text bg-surface"
            />
          </div>
          <div className="w-1 h-6 bg-text"></div>
          <button onClick={handleNewArray} className="flex items-center gap-2 px-3 py-1 bg-warning hover:bg-warning/80 text-text font-black uppercase border-2 border-text transition-all shadow-[2px_2px_0px_#111] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111]">
            <Shuffle size={16} /> Randomize
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-background border-4 border-text rounded p-4 flex flex-wrap items-center justify-between gap-4 shadow-[4px_4px_0px_#111]">
        <p className="text-text font-bold text-sm flex-1">{info.description}</p>
        
        {/* Time Complexity */}
        <div className="flex items-center gap-6 bg-surface p-3 border-4 border-text shadow-inner">
          <div className="flex flex-col gap-1 text-xs font-black uppercase tracking-wider">
            <span className="text-text">Best: <span className="text-success font-mono bg-text px-1">{info.best}</span></span>
            <span className="text-text">Avg/Worst: <span className="text-warning font-mono bg-text px-1">{info.time}</span></span>
            <span className="text-text">Space: <span className="text-primary font-mono bg-text px-1">{info.space}</span></span>
          </div>
          <div className="relative w-12 h-10 border-l-4 border-b-4 border-text ml-2" title="Time Complexity Curve">
             <span className="absolute -left-4 -top-3 text-[10px] font-black text-text">T</span>
             <span className="absolute -bottom-4 right-0 text-[10px] font-black text-text">N</span>
             <svg width="48" height="40" className="absolute bottom-0 left-0 overflow-visible">
               <path 
                 d={info.time.includes('n²') ? "M 0 40 Q 30 40 48 0" : "M 0 40 Q 35 25 48 10"} 
                 fill="none" 
                 stroke={info.time.includes('n²') ? "#ef4444" : "#000"} 
                 strokeWidth="4" 
                 strokeLinecap="square" 
               />
             </svg>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-surface border-4 border-text p-2 shadow-[4px_4px_0px_#111]">
        <span className="flex items-center gap-2 font-black text-[10px] uppercase"><span className="w-4 h-4 border-2 border-text bg-text shadow-[2px_2px_0px_#111]"></span> Default</span>
        <span className="flex items-center gap-2 font-black text-[10px] uppercase"><span className="w-4 h-4 border-2 border-text bg-primary opacity-60 shadow-[2px_2px_0px_#111]"></span> Comparing</span>
        <span className="flex items-center gap-2 font-black text-[10px] uppercase"><span className="w-4 h-4 border-2 border-text bg-danger shadow-[2px_2px_0px_#111]"></span> Swapping</span>
        <span className="flex items-center gap-2 font-black text-[10px] uppercase"><span className="w-4 h-4 border-2 border-text bg-warning shadow-[2px_2px_0px_#111]"></span> Pivot</span>
        <span className="flex items-center gap-2 font-black text-[10px] uppercase"><span className="w-4 h-4 border-2 border-text bg-success shadow-[2px_2px_0px_#111]"></span> Sorted</span>
      </div>

      {/* Bar Visualization */}
      <div className="flex-1 bg-background border-4 border-text flex items-end justify-center gap-1 p-6 pt-12 relative min-h-[400px] lg:min-h-[500px] overflow-hidden shadow-brutal-md">
        {/* Thinking Overlay / AI Tooltip */}
        {(anim.isPlaying || statusMessage) && statusMessage && (
          <div className="absolute top-4 right-4 bg-surface border-4 border-text p-2 px-4 shadow-[4px_4px_0px_#111] animate-fade-in flex items-center gap-3 z-20 min-w-[250px] max-w-[350px]">
             <div className="bg-primary border-2 border-text rounded-none p-1.5 flex-shrink-0 shadow-[2px_2px_0px_#111]">
                <BrainCircuit size={18} className="text-text animate-pulse" />
             </div>
             <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                   <p className="text-[10px] font-black text-text uppercase tracking-widest border-b-2 border-text pb-0.5 inline-block">AI Thinking Trace</p>
                </div>
                <p className="text-sm font-bold break-words">{statusMessage}</p>
             </div>
          </div>
        )}

        {array.map((val, idx) => {
          const isSorted = sortedIndices.includes(idx);
          const isComparing = comparing.includes(idx);
          const isSwapping = swapping.includes(idx);
          const isActive = activeIndices.includes(idx);
          const isPivot = pivotIndex === idx;
          const heightPercent = (val / maxVal) * 75; // Leave top 25% empty for AI trace

          let barColor = 'bg-text';
          if (isPivot) barColor = 'bg-warning';
          else if (isSwapping) barColor = 'bg-danger';
          else if (isComparing) barColor = 'bg-primary opacity-60';
          else if (isActive) barColor = 'bg-primary';
          else if (isSorted) barColor = 'bg-success';

          return (
            <div
              key={idx}
              className={`transition-all duration-100 ${barColor} border-2 border-text relative group shadow-[2px_2px_0px_#111]`}
              style={{
                height: `${heightPercent}%`,
                width: `${Math.max(100 / array.length - 1, 3)}%`,
                minWidth: '10px',
              }}
            >
              {array.length <= 30 && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-black text-text">
                  {val}
                </span>
              )}
            </div>
          );
        })}

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
