import React from 'react';
import { Play, Pause, Square, RotateCcw, Gauge, Footprints } from 'lucide-react';

export default function ControlBar({ isPlaying, isPaused, speed, stepCount, onStart, onPause, onResume, onStop, onReset, onSpeedChange, complexity }) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-background border-4 border-text shadow-brutal-sm p-4 w-full">
      {/* Playback Controls */}
      <div className="flex items-center gap-3">
        {!isPlaying ? (
          <button onClick={onStart} className="flex items-center gap-2 bg-success text-surface font-black uppercase tracking-wider px-4 py-2 border-2 border-text transition-all shadow-[2px_2px_0px_#111] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111]">
            <Play size={16} /> Run
          </button>
        ) : isPaused ? (
          <button onClick={onResume} className="flex items-center gap-2 bg-warning text-text font-black uppercase tracking-wider px-4 py-2 border-2 border-text transition-all shadow-[2px_2px_0px_#111] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111]">
            <Play size={16} /> Resume
          </button>
        ) : (
          <button onClick={onPause} className="flex items-center gap-2 bg-warning text-text font-black uppercase tracking-wider px-4 py-2 border-2 border-text transition-all shadow-[2px_2px_0px_#111] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111]">
            <Pause size={16} /> Pause
          </button>
        )}

        <button onClick={onStop} disabled={!isPlaying} className="flex items-center gap-2 bg-danger text-surface font-black uppercase tracking-wider px-4 py-2 border-2 border-text transition-all shadow-[2px_2px_0px_#111] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111] disabled:opacity-50 disabled:cursor-not-allowed">
          <Square size={16} /> Stop
        </button>

        <button onClick={onReset} className="flex items-center gap-2 bg-surface hover:bg-primary text-text font-black uppercase tracking-wider px-4 py-2 border-2 border-text transition-all shadow-[2px_2px_0px_#111] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111]">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-3 ml-auto bg-surface border-2 border-text px-3 py-1.5 shadow-[2px_2px_0px_#111]">
        <Gauge size={16} className="text-text" />
        <span className="text-sm font-black uppercase w-14">{speed}ms</span>
        <input
          type="range"
          min="50"
          max="1500"
          step="50"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-28 accent-primary h-2 bg-background border border-text cursor-pointer"
        />
        <div className="flex gap-1 text-[10px] font-bold uppercase tracking-widest text-text">
          <span>Fast</span>
          <span>—</span>
          <span>Slow</span>
        </div>
      </div>

      {/* Step Counter */}
      <div className="flex items-center gap-2 text-text font-black text-sm border-l-4 border-text pl-4">
        <Footprints size={18} className="text-text" />
        <span className="font-mono bg-text text-surface px-2 py-0.5">{stepCount} STEPS</span>
      </div>

      {/* Complexity Info */}
      {complexity && (
        <div className="hidden lg:flex items-center gap-4 text-xs font-black uppercase border-l-4 border-text pl-4">
          <div className="flex flex-col">
            <span className="text-text">Time</span>
            <span className="text-text font-mono bg-warning px-1 border border-text">{complexity.time}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-text">Space</span>
            <span className="text-text font-mono bg-primary px-1 border border-text">{complexity.space}</span>
          </div>
        </div>
      )}
    </div>
  );
}
