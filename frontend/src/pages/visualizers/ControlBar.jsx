import React from 'react';
import { Play, Pause, Square, RotateCcw, Gauge, Footprints } from 'lucide-react';

export default function ControlBar({ isPlaying, isPaused, speed, stepCount, onStart, onPause, onResume, onStop, onReset, onSpeedChange, complexity }) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-surface-alt border border-border rounded-xl p-3 w-full">
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        {!isPlaying ? (
          <button onClick={onStart} className="flex items-center gap-1.5 bg-success text-white font-semibold text-sm px-3.5 py-2 rounded-lg transition-all hover:brightness-110 shadow-soft">
            <Play size={14} /> Run
          </button>
        ) : isPaused ? (
          <button onClick={onResume} className="flex items-center gap-1.5 bg-warning text-white font-semibold text-sm px-3.5 py-2 rounded-lg transition-all hover:brightness-110 shadow-soft">
            <Play size={14} /> Resume
          </button>
        ) : (
          <button onClick={onPause} className="flex items-center gap-1.5 bg-warning text-white font-semibold text-sm px-3.5 py-2 rounded-lg transition-all hover:brightness-110 shadow-soft">
            <Pause size={14} /> Pause
          </button>
        )}

        <button onClick={onStop} disabled={!isPlaying} className="flex items-center gap-1.5 bg-danger text-white font-semibold text-sm px-3.5 py-2 rounded-lg transition-all hover:brightness-110 shadow-soft disabled:opacity-40 disabled:cursor-not-allowed">
          <Square size={14} /> Stop
        </button>

        <button onClick={onReset} className="flex items-center gap-1.5 bg-surface hover:bg-primary/10 text-text font-semibold text-sm px-3.5 py-2 rounded-lg border border-border transition-all hover:border-primary/30">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-2.5 ml-auto bg-surface border border-border rounded-lg px-3 py-2">
        <Gauge size={14} className="text-text-muted" />
        <span className="text-xs font-semibold text-text-muted w-10">{speed}ms</span>
        <input
          type="range"
          min="50"
          max="1500"
          step="50"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-24 accent-primary h-1.5 bg-surface-alt cursor-pointer rounded-full"
        />
        <span className="text-[10px] font-medium text-text-muted">Fast — Slow</span>
      </div>

      {/* Step Counter */}
      <div className="flex items-center gap-2 text-sm border-l border-border pl-3">
        <Footprints size={14} className="text-text-muted" />
        <span className="font-mono font-semibold text-text bg-surface-alt px-2 py-0.5 rounded text-xs">{stepCount} steps</span>
      </div>

      {/* Complexity Info */}
      {complexity && (
        <div className="hidden lg:flex items-center gap-3 text-xs border-l border-border pl-3">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted font-medium">Time</span>
            <span className="font-mono font-semibold text-warning bg-warning/10 px-1.5 py-0.5 rounded">{complexity.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted font-medium">Space</span>
            <span className="font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{complexity.space}</span>
          </div>
        </div>
      )}
    </div>
  );
}
