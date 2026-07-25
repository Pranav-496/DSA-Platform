import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, BrainCircuit, Volume2 } from "lucide-react";
import API_BASE from "../config/api";

const TOPICS = [
  "Binary Search",
  "Bubble Sort",
  "Merge Sort",
  "Quick Sort",
  "BFS",
  "DFS",
  "Hash Map",
  "Two Pointers",
];

const SAMPLE_TRANSCRIPTS = {
  "Binary Search":
    "Binary search works on a sorted array by checking the middle element. If the target is less than the middle, we search the left half. If greater, we search the right half. This halves the search space each time giving us logarithmic time complexity.",
  "Bubble Sort":
    "Bubble sort works by comparing adjacent elements and swapping them if they're in the wrong order. After each pass, the largest element bubbles to the end. The time complexity is O(n squared) and it's a stable in-place sorting algorithm.",
  "Merge Sort":
    "Merge sort uses divide and conquer. We divide the array in half recursively until we have single elements, then merge the sorted subarrays back together. It has O(n log n) time complexity but requires O(n) extra space.",
  "Quick Sort":
    "Quick sort picks a pivot element, then partitions the array so elements less than pivot go left and greater go right. We recursively sort both partitions. Average case is O(n log n) but worst case with bad pivot is O(n squared).",
  BFS: "BFS or breadth first search uses a queue to traverse a graph level by level. We start at a node, visit all its neighbors, then visit their neighbors. It's useful for finding shortest path in unweighted graphs. Time complexity is O(V+E).",
  DFS: "DFS or depth first search uses a stack or recursion to explore as deep as possible along each branch before backtracking. It's useful for cycle detection and topological sorting in graphs. Time complexity is O(V+E).",
  "Hash Map":
    "A hash map uses a hash function to map keys to indices in an array for O(1) average lookup time. When two keys map to the same index, we have a collision, which can be resolved through chaining with linked lists or open addressing.",
  "Two Pointers":
    "The two pointers technique uses two pointers that converge from opposite ends of a sorted array. We move the left pointer right if the sum is too small, or the right pointer left if too large. This gives us O(n) time for problems like pair sum.",
};

export default function VoiceAI() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState(null);
  const [topic, setTopic] = useState("Binary Search");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        finalTranscriptRef.current = finalTranscript;
        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      const finalTranscript =
        finalTranscriptRef.current ||
        transcript ||
        SAMPLE_TRANSCRIPTS[topic] ||
        "This is a sample explanation.";
      analyzeTranscript(finalTranscript);
    } else {
      // Start recording
      if (recognitionRef.current) {
        finalTranscriptRef.current = "";
        setTranscript("");
        setResults(null);
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        // Fallback to sample if speech recognition not available
        setIsRecording(true);
        setTranscript("");
        setResults(null);
        setTimeout(() => {
          setTranscript(
            SAMPLE_TRANSCRIPTS[topic] || "Sample explanation for " + topic,
          );
        }, 2500);
      }
    }
  };

  const analyzeTranscript = async (finalTranscript) => {
    setTranscript(finalTranscript);
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai/voice/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: finalTranscript, topic }),
      });
      const data = await res.json();
      setResults(data);

      // Send progress update
      fetch(`${API_BASE}/api/progress/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "voice",
          data: { topic, score: data.score },
        }),
      }).catch((err) => console.log("Progress update failed", err));
    } catch (e) {
      console.error("Analysis failed, using offline fallback:", e);
      // Offline fallback
      const words = finalTranscript.toLowerCase().split(/\W+/);
      const score = Math.min(95, 50 + words.length);
      setResults({
        score: score.toFixed(2),
        confidence: Math.min(90, 40 + words.length * 2).toFixed(2),
        communication: words.length > 30 ? 90 : words.length > 15 ? 60 : 30,
        feedback:
          score > 70
            ? "Good explanation with key concepts covered."
            : "Try to cover more key concepts.",
        missedSteps: [],
        matchedKeywords: [],
      });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-text pb-12">
      {/* Header */}
      <div className="text-center space-y-3 mb-8 bg-surface border-4 border-text p-8 shadow-[8px_8px_0px_#111]">
        <h2 className="text-4xl font-geist font-black uppercase tracking-widest text-text">
          Voice AI Evaluator
        </h2>
        <p className="text-text font-bold text-lg">
          Explain an algorithm and let our AI engine grade your communication.
        </p>

        <div className="flex items-center justify-center gap-4 mt-6">
          <label className="text-sm font-black uppercase tracking-widest text-text">Topic:</label>
          <select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setResults(null);
              setTranscript("");
            }}
            className="bg-background border-4 border-text text-text font-bold px-4 py-2 rounded-none text-sm focus:border-primary outline-none shadow-[2px_2px_0px_#111] cursor-pointer"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recording Area */}
      <div className="bg-background border-4 border-text shadow-[8px_8px_0px_#111] p-10 flex flex-col items-center justify-center relative overflow-hidden">
        {isRecording && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-text animate-ping"></div>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-4 border-text animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
        )}

        <button
          onClick={toggleRecording}
          disabled={isAnalyzing}
          className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center border-4 border-text transition-all duration-300
            ${
              isRecording
                ? "bg-danger text-surface shadow-[8px_8px_0px_#111] translate-y-[-4px]"
                : "bg-surface text-text hover:bg-primary hover:shadow-[8px_8px_0px_#111] hover:-translate-y-1 shadow-[4px_4px_0px_#111]"
            }
            ${isAnalyzing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isRecording ? (
            <Mic size={44} className="animate-bounce" />
          ) : (
            <MicOff size={44} />
          )}
        </button>

        <p className="mt-8 text-lg font-black uppercase tracking-wider text-text">
          {isAnalyzing
            ? "🧠 Analyzing your response..."
            : isRecording
              ? "🎙️ Listening & Recording..."
              : "Click to start your explanation"}
        </p>
        <p className="text-sm font-bold text-text/80 mt-2 bg-surface px-3 py-1 border-2 border-text shadow-[2px_2px_0px_#111]">
          {isRecording ? "Click again to stop and analyze" : `Topic: ${topic}`}
        </p>
        {!("webkitSpeechRecognition" in window) &&
          !("SpeechRecognition" in window) && (
            <p className="text-xs font-bold uppercase text-warning bg-text px-3 py-1 mt-4 shadow-[2px_2px_0px_#111]">
              ⚠️ Speech recognition not supported in this browser. Using sample
              transcripts.
            </p>
          )}

        {transcript && (
          <div className="mt-8 w-full bg-surface border-4 border-text p-6 relative shadow-inner">
            <div className="absolute -top-4 -right-4 bg-primary border-4 border-text rounded-none p-2 shadow-[2px_2px_0px_#111]">
              <Volume2 className="text-text" size={20} />
            </div>
            <p className="text-text text-lg font-bold leading-relaxed italic">
              "{transcript}"
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6 animate-fade-in">
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScoreCard
              title="Confidence"
              score={results.confidence}
              color="primary"
            />
            <ScoreCard
              title="Logic Score"
              score={results.score}
              color="warning"
            />
            <ScoreCard
              title="Communication"
              score={results.communication}
              color="success"
            />
          </div>

          {/* Detailed Feedback */}
          <div className="bg-surface border-4 border-text p-6 shadow-[8px_8px_0px_#111]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-4 border-text">
              <BrainCircuit size={24} className="text-text" />
              <h3 className="text-2xl font-black font-geist uppercase tracking-widest text-text">
                AI Feedback
              </h3>
            </div>
            <p className="text-text text-lg font-bold bg-background border-4 border-text p-4 leading-relaxed shadow-inner">
              {results.feedback}
            </p>

            {results.matchedKeywords && results.matchedKeywords.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-black uppercase text-text mb-3">Keywords matched:</p>
                <div className="flex flex-wrap gap-2">
                  {results.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs font-black uppercase px-3 py-1 bg-success text-surface border-2 border-text shadow-[2px_2px_0px_#111]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.missedSteps && results.missedSteps.length > 0 && (
              <div className="mt-6 border-4 border-text bg-warning p-4 shadow-[4px_4px_0px_#111]">
                <p className="text-text font-black text-lg uppercase mb-3 flex items-center gap-2">
                  <span className="bg-surface text-text px-2 py-0.5 border-2 border-text">⚠</span>
                  Concept gaps detected:
                </p>
                <ul className="space-y-2">
                  {results.missedSteps.map((step, i) => (
                    <li
                      key={i}
                      className="text-text font-bold text-base flex items-center gap-3 bg-surface p-2 border-2 border-text"
                    >
                      <span className="w-3 h-3 bg-text flex-shrink-0"></span>
                      Mention "{step}"
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ title, score, color }) {
  const numScore = parseFloat(score);
  const configs = {
    primary: {
      bg: "bg-primary",
    },
    warning: {
      bg: "bg-warning",
    },
    success: {
      bg: "bg-success",
    },
  };
  const c = configs[color] || configs.primary;

  return (
    <div
      className={`bg-surface p-6 flex flex-col items-center justify-center border-4 border-text shadow-[6px_6px_0px_#111] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#111]`}
    >
      <p className="text-text font-black text-sm uppercase tracking-widest mb-3 bg-background px-3 py-1 border-2 border-text shadow-inner">
        {title}
      </p>
      <p className="text-5xl font-black font-geist text-text">
        {Math.round(numScore)}%
      </p>
      {/* Progress bar */}
      <div className="w-full mt-6 bg-background border-2 border-text h-3 overflow-hidden shadow-inner">
        <div
          className={`${c.bg} h-full transition-all duration-1000 border-r-2 border-text`}
          style={{ width: `${numScore}%` }}
        ></div>
      </div>
    </div>
  );
}
