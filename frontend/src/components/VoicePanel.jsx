import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Loader, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function VoicePanel({ transcript, setTranscript, onAnalyze, isAnalyzing }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };
      recognitionRef.current.onerror = (e) => {
        console.error("Speech reco error: ", e);
        setIsRecording(false);
      };
    } else {
      console.error("Speech recognition not supported");
    }

    return () => {
      if (recognitionRef.current) {
         recognitionRef.current.stop();
      }
    };
  }, [setTranscript]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return alert("Browser does not support Speech Recognition");
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-none overflow-hidden shadow-card">
      <div className="p-3 bg-surface border-b border-border flex items-center justify-between">
         <h3 className="text-text text-sm font-bold font-geist uppercase flex items-center gap-2 tracking-wider">
            <Mic className="text-primary" size={18} /> Verbal Execution
         </h3>
         {isRecording && (
            <motion.div
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
               className="w-3 h-3 rounded-none bg-danger border border-border shadow-soft"
            />
         )}
      </div>

      <div className="flex-1 p-4 bg-background">
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Explain your approach..."
          className="w-full h-full bg-transparent text-text resize-none outline-none font-bold text-sm placeholder-text/50"
        ></textarea>
      </div>

      <div className="p-4 bg-surface border-t border-border flex flex-col gap-3">
        <button
          onClick={toggleRecording}
          disabled={isAnalyzing}
          className={`flex items-center justify-center gap-2 w-full py-3 border border-border font-bold uppercase tracking-widest text-sm transition-all shadow-card hover:-translate-y-1 hover:shadow-elevated active:translate-y-0 active:shadow-soft ${
            isRecording ? "bg-danger text-surface" : "bg-text text-surface"
          }`}
        >
           {isRecording ? <Square size={16} /> : <Mic size={16} />}
           {isRecording ? "STOP RECORDING" : "START RECORDING"}
        </button>

        <button
          onClick={onAnalyze}
          disabled={!transcript || isAnalyzing || isRecording}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-text border border-border font-bold uppercase tracking-widest text-sm shadow-card hover:-translate-y-1 hover:shadow-elevated active:translate-y-0 active:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-card transition-all"
        >
          {isAnalyzing ? (
            <><Loader className="animate-spin" size={16} /> ANALYZING...</>
          ) : (
            <><CheckCircle size={16} /> ANALYZE LOGIC</>
          )}
        </button>
      </div>
    </div>
  );
}
