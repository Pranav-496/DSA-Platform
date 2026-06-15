import React, { useState, lazy, Suspense } from 'react';
import { Zap, Activity } from 'lucide-react';

const ExcalidrawWrapper = lazy(() => 
  import('@excalidraw/excalidraw').then(mod => ({ default: mod.Excalidraw }))
);

export default function SystemDesign() {
  const [analyzing, setAnalyzing] = useState(false);

  const simulateAIFeedback = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      alert("AI Feedback: The architecture looks solid, but consider adding a Redis caching layer in front of your database to reduce latency. Additionally, your message broker might become a bottleneck under high load.");
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black font-geist uppercase tracking-tighter mb-2">
            System Design
          </h1>
          <p className="font-bold text-lg max-w-3xl opacity-80 uppercase tracking-widest border-l-4 border-primary pl-4">
            Interactive Architecture Sandbox
          </p>
        </div>
        <button 
          onClick={simulateAIFeedback}
          disabled={analyzing}
          className="brutal-btn flex items-center gap-2 bg-warning text-surface border-4 border-text shadow-[4px_4px_0px_#111] hover:translate-y-1 hover:shadow-none"
        >
          {analyzing ? (
            <><Activity className="animate-spin" /> Analyzing...</>
          ) : (
            <><Zap /> Request AI Critique</>
          )}
        </button>
      </div>

      <div className="flex-1 brutal-card p-0 overflow-hidden relative border-4 border-text shadow-brutal-lg" style={{ minHeight: '600px' }}>
         <Suspense fallback={
           <div className="flex items-center justify-center h-full w-full bg-background">
             <div className="text-center">
               <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
               <p className="font-black uppercase tracking-widest text-lg">Loading Whiteboard...</p>
             </div>
           </div>
         }>
           <div style={{ height: '100%', width: '100%' }}>
              <ExcalidrawWrapper 
                theme="dark"
                initialData={{
                   appState: { viewBackgroundColor: "#1c1917" }
                }}
              />
           </div>
         </Suspense>
      </div>
    </div>
  );
}
