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
    <div className="flex flex-col h-full bg-background border-4 border-text rounded-none overflow-hidden shadow-[4px_4px_0px_#111]">
      <div className="p-3 bg-surface border-b-4 border-text flex items-center justify-between">
         <h3 className="text-text text-sm font-black font-geist uppercase flex items-center gap-2 tracking-wider">
            <Mic className="text-primary" size={18} /> Verbal Execution
         </h3>
         {isRecording && (
            <motion.div
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
               className="w-3 h-3 rounded-none bg-danger border-2 border-text shadow-[2px_2px_0px_#111]"
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

      <div className="p-4 bg-surface border-t-4 border-text flex flex-col gap-3">
        <button
          onClick={toggleRecording}
          disabled={isAnalyzing}
          className={`flex items-center justify-center gap-2 w-full py-3 border-4 border-text font-black uppercase tracking-widest text-sm transition-all shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] active:translate-y-0 active:shadow-[2px_2px_0px_#111] ${
            isRecording ? "bg-danger text-surface" : "bg-text text-surface"
          }`}
        >
           {isRecording ? <Square size={16} /> : <Mic size={16} />}
           {isRecording ? "STOP RECORDING" : "START RECORDING"}
        </button>

        <button
          onClick={onAnalyze}
          disabled={!transcript || isAnalyzing || isRecording}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-text border-4 border-text font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] active:translate-y-0 active:shadow-[2px_2px_0px_#111] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#111] transition-all"
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
