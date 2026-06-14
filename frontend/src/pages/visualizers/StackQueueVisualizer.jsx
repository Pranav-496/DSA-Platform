import React, { useState, useCallback } from 'react';
import ControlBar from './ControlBar';
import useAnimationControl from './useAnimationControl';
import { Plus, Minus } from 'lucide-react';

export default function StackQueueVisualizer() {
  const [mode, setMode] = useState('stack');
  const [items, setItems] = useState([10, 20, 30]);
  const [inputVal, setInputVal] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [highlightTop, setHighlightTop] = useState(false);
  const [removingIndex, setRemovingIndex] = useState(-1);
  const [addingValue, setAddingValue] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const anim = useAnimationControl();

  const delay = useCallback(async (ms = 1) => {
    const result = await anim.sleep(ms);
    if (result === 'cancelled') throw new Error('cancelled');
  }, [anim]);

  const resetHighlights = () => {
    setActiveIndex(-1);
    setHighlightTop(false);
    setRemovingIndex(-1);
    setAddingValue(null);
    setStatusMessage('');
  };

  const push = useCallback(async () => {
    const val = parseInt(inputVal);
    if (isNaN(val)) { setStatusMessage('⚠ Enter a valid number'); return; }
    anim.start();
    resetHighlights();
    try {
      if (mode === 'stack') {
        setStatusMessage(`Pushing ${val} onto the stack...`);
        setAddingValue(val);
        await delay(anim.speed * 1.5);
        setItems(prev => [...prev, val]);
        setAddingValue(null);
        setActiveIndex(items.length);
        setStatusMessage(`✅ Pushed ${val}. Stack size: ${items.length + 1}`);
        anim.incrementStep();
        await delay(anim.speed);
      } else {
        setStatusMessage(`Enqueuing ${val}...`);
        setAddingValue(val);
        await delay(anim.speed * 1.5);
        setItems(prev => [...prev, val]);
        setAddingValue(null);
        setActiveIndex(items.length);
        setStatusMessage(`✅ Enqueued ${val}. Queue size: ${items.length + 1}`);
        anim.incrementStep();
        await delay(anim.speed);
      }
      setActiveIndex(-1);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [inputVal, mode, items, anim, delay]);

  const pop = useCallback(async () => {
    if (items.length === 0) { setStatusMessage('⚠ Empty!'); return; }
    anim.start();
    resetHighlights();
    try {
      if (mode === 'stack') {
        const topIdx = items.length - 1;
        setHighlightTop(true);
        setActiveIndex(topIdx);
        setStatusMessage(`Popping top element: ${items[topIdx]}`);
        anim.incrementStep();
        await delay(anim.speed * 1.2);
        setRemovingIndex(topIdx);
        await delay(anim.speed);
        const removed = items[topIdx];
        setItems(prev => prev.slice(0, -1));
        setRemovingIndex(-1);
        setStatusMessage(`✅ Popped ${removed}. Stack size: ${items.length - 1}`);
        await delay(anim.speed * 0.5);
      } else {
        setActiveIndex(0);
        setStatusMessage(`Dequeuing front element: ${items[0]}`);
        anim.incrementStep();
        await delay(anim.speed * 1.2);
        setRemovingIndex(0);
        await delay(anim.speed);
        const removed = items[0];
        setItems(prev => prev.slice(1));
        setRemovingIndex(-1);
        setStatusMessage(`✅ Dequeued ${removed}. Queue size: ${items.length - 1}`);
        await delay(anim.speed * 0.5);
      }
      setActiveIndex(-1);
      setHighlightTop(false);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [items, mode, anim, delay]);

  const peek = useCallback(async () => {
    if (items.length === 0) { setStatusMessage('⚠ Empty!'); return; }
    anim.start();
    resetHighlights();
    try {
      const peekIdx = mode === 'stack' ? items.length - 1 : 0;
      setActiveIndex(peekIdx);
      setHighlightTop(true);
      setStatusMessage(`${mode === 'stack' ? 'Top' : 'Front'}: ${items[peekIdx]} (peek — no removal)`);
      anim.incrementStep();
      await delay(anim.speed * 2);
      setActiveIndex(-1);
      setHighlightTop(false);
    } catch (e) { if (e.message !== 'cancelled') console.error(e); }
    anim.finish();
  }, [items, mode, anim, delay]);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[['stack', 'Stack (LIFO)'], ['queue', 'Queue (FIFO)']].map(([key, label]) => (
          <button key={key} onClick={() => { setMode(key); resetHighlights(); setItems([10, 20, 30]); }}
            className={`px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider transition-all border-2
              ${mode === key ? 'bg-primary text-text border-text shadow-[2px_2px_0px_#111]'
                : 'bg-surface text-text/70 border-text hover:text-text hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_#111]'}`}>
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
            placeholder="Value" className="w-20 bg-surface border-2 border-text text-text px-2 py-1.5 rounded-lg text-sm font-mono focus:border-primary outline-none shadow-[2px_2px_0px_#111]" />
          <button onClick={push} className="flex items-center gap-1 px-3 py-1.5 bg-success text-text border-2 border-text rounded-lg text-sm font-bold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111] shadow-[2px_2px_0px_#111] transition-all">
            <Plus size={14} /> {mode === 'stack' ? 'Push' : 'Enqueue'}
          </button>
          <button onClick={pop} className="flex items-center gap-1 px-3 py-1.5 bg-danger text-text border-2 border-text rounded-lg text-sm font-bold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111] shadow-[2px_2px_0px_#111] transition-all">
            <Minus size={14} /> {mode === 'stack' ? 'Pop' : 'Dequeue'}
          </button>
          <button onClick={peek} className="px-3 py-1.5 bg-primary text-text border-2 border-text rounded-lg text-sm font-bold uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111] shadow-[2px_2px_0px_#111] transition-all">
            Peek
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-surface border-2 border-text rounded-lg px-4 py-2 flex items-center justify-between shadow-brutal-sm">
        <p className="text-text/70 text-sm font-geist">
          {mode === 'stack' ? 'Stack — Last In, First Out. Push/Pop from the top.' : 'Queue — First In, First Out. Enqueue at back, dequeue from front.'}
        </p>
        <div className="flex gap-4 text-xs">
          <span className="text-text/70">Push/Enqueue: <span className="text-success font-mono font-bold">O(1)</span></span>
          <span className="text-text/70">Pop/Dequeue: <span className="text-success font-mono font-bold">O(1)</span></span>
          <span className="text-text/70">Peek: <span className="text-success font-mono font-bold">O(1)</span></span>
        </div>
      </div>

      {/* Visualization */}
      <div className="flex-1 bg-surface border-4 border-text shadow-brutal rounded-lg p-8 flex items-center justify-center min-h-[150px] relative overflow-hidden">
        <div className="absolute top-3 left-4 text-xs text-text/70 font-mono font-bold">{statusMessage}</div>
        <div className="absolute top-3 right-4 text-xs text-text/50 font-mono font-bold">Size: {items.length}</div>

        {mode === 'stack' ? (
          /* STACK: vertical, top at top */
          <div className="flex flex-col-reverse items-center gap-1">
            {addingValue !== null && (
              <div className="w-48 py-3 rounded-lg border-4 border-warning border-dashed bg-warning/20 text-warning font-mono font-bold text-center animate-bounce text-lg">
                {addingValue}
              </div>
            )}
            {items.map((item, idx) => {
              const isTop = idx === items.length - 1;
              const isActive = activeIndex === idx;
              const isRemoving = removingIndex === idx;

              let cls = 'border-text bg-background text-text';
              if (isRemoving) cls = 'border-danger bg-danger/20 text-danger opacity-50 scale-90';
              else if (isActive) cls = 'border-primary bg-primary/20 text-text shadow-[4px_4px_0px_#111]';
              else if (isTop && highlightTop) cls = 'border-warning bg-warning/20 text-warning';

              return (
                <div key={idx} className={`w-48 py-3 rounded-lg border-4 font-mono font-bold text-center transition-all duration-300 text-lg relative ${cls}`}>
                  {item}
                  {isTop && <span className="absolute -right-16 top-1/2 -translate-y-1/2 text-[10px] text-warning font-mono font-black uppercase">← TOP</span>}
                  {idx === 0 && <span className="absolute -right-20 top-1/2 -translate-y-1/2 text-[10px] text-text/50 font-mono font-black uppercase">← BOTTOM</span>}
                </div>
              );
            })}
            {items.length === 0 && <div className="text-text/50 text-sm font-bold">Empty Stack</div>}
          </div>
        ) : (
          /* QUEUE: horizontal, front at left */
          <div className="flex items-center gap-2">
            <span className="text-success text-xs font-mono font-black uppercase mr-2 -rotate-90">FRONT</span>
            {items.map((item, idx) => {
              const isFront = idx === 0;
              const isBack = idx === items.length - 1;
              const isActive = activeIndex === idx;
              const isRemoving = removingIndex === idx;

              let cls = 'border-text bg-background text-text';
              if (isRemoving) cls = 'border-danger bg-danger/20 text-danger opacity-50 scale-90';
              else if (isActive) cls = 'border-primary bg-primary/20 text-text shadow-[4px_4px_0px_#111]';

              return (
                <div key={idx} className={`w-16 h-20 rounded-lg border-4 font-mono font-bold flex flex-col items-center justify-center transition-all duration-300 ${cls}`}>
                  <span className="text-lg">{item}</span>
                  <span className="text-[9px] opacity-50">{idx}</span>
                </div>
              );
            })}
            {addingValue !== null && (
              <div className="w-16 h-20 rounded-lg border-4 border-warning border-dashed bg-warning/20 text-warning font-mono font-bold flex items-center justify-center animate-bounce text-lg">
                {addingValue}
              </div>
            )}
            <span className="text-primary text-xs font-mono font-black uppercase ml-2 -rotate-90">BACK</span>
            {items.length === 0 && <div className="text-text/50 text-sm font-bold">Empty Queue</div>}
          </div>
        )}
      </div>

      {/* Controls */}
      <ControlBar
        isPlaying={anim.isPlaying} isPaused={anim.isPaused} speed={anim.speed}
        stepCount={anim.stepCount}
        onStart={push} onPause={anim.pause} onResume={anim.resume}
        onStop={anim.stop} onReset={() => { resetHighlights(); setItems([10, 20, 30]); }}
        onSpeedChange={anim.setSpeed}
        complexity={{ time: 'O(1)', space: 'O(n)' }}
      />
    </div>
  );
}
