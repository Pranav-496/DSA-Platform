import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Editor from "@monaco-editor/react";
import CodeReviewPanel from "../components/CodeReviewPanel";
import API_BASE from "../config/api";
import {
  Play,
  CheckCircle,
  XCircle,
  Send,
  Tag,
  Mic,
  Loader,
  Clock,
  Cpu,
  Zap,
} from "lucide-react";

import { PROBLEMS } from "../data/problems.js";

const diffColors = {
  Easy: "bg-success text-surface border-text",
  Medium: "bg-warning text-text border-text",
  Hard: "bg-danger text-surface border-text",
};

export default function Practice() {
  const [selectedId, setSelectedId] = useState(1);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceResults, setVoiceResults] = useState(null);
  const [codeReview, setCodeReview] = useState(null);
  const [speechData, setSpeechData] = useState(null);
  const recognitionRef = useRef(null);
  const { token } = useContext(AuthContext);

  const problem = PROBLEMS.find((p) => p.id === selectedId);
  const langMap = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp",
  };
  const LANGS = ["javascript", "python", "java", "cpp"];

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[language] || "");
      setResults(null);
      setShowVoice(false);
      setTranscript("");
      setVoiceResults(null);
    }
  }, [selectedId, language]);

  const runCode = async () => {
    setIsRunning(true);
    setResults(null);
    try {
      const tc = problem.testCases[0];
      const res = await fetch(`${API_BASE}/api/code/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          problemId: problem.id,
          funcName: problem.funcName,
          testCase: tc,
        }),
      });
      const data = await res.json();
      setResults({
        mode: "run",
        status: data.status,
        output: data.output,
        expected: data.expected,
        passed: data.passed,
        runtime: data.runtime,
        error: data.error,
      });
    } catch (e) {
      setResults({
        mode: "run",
        status: "error",
        error: "Backend unreachable. Ensure server is running.",
      });
    }
    setIsRunning(false);
  };

  const submitCode = async () => {
    setIsSubmitting(true);
    setResults(null);
    try {
      const res = await fetch(`${API_BASE}/api/code/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          problemId: problem.id,
          funcName: problem.funcName,
          testCases: problem.testCases,
        }),
      });
      const data = await res.json();
      setResults({ mode: "submit", ...data });

      fetch(`${API_BASE}/api/ai/code-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, topic: problem.title, language }),
      })
        .then((r) => r.json())
        .then((review) => setCodeReview(review))
        .catch(() => {});

      if (data.status === "accepted" && token) {
        fetch(`${API_BASE}/api/progress/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: "problem",
            data: { title: problem.title },
          }),
        }).catch(() => {});
      }
      setShowVoice(true);
    } catch (e) {
      setResults({
        mode: "submit",
        status: "error",
        error: "Backend unreachable.",
      });
    }
    setIsSubmitting(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      analyzeTranscript();
    } else {
      if (
        "webkitSpeechRecognition" in window ||
        "SpeechRecognition" in window
      ) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SR();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.onresult = (event) => {
          let t = "";
          for (let i = 0; i < event.results.length; i++)
            t += event.results[i][0].transcript;
          setTranscript(t);
        };
        recognitionRef.current.onend = () => setIsRecording(false);
        setTranscript("");
        setVoiceResults(null);
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        alert("Speech recognition is not supported in your browser.");
      }
    }
  };

  const analyzeTranscript = async () => {
    try {
      const [voiceRes, speechRes] = await Promise.all([
        fetch(`${API_BASE}/api/ai/voice/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, topic: problem.title }),
        }),
        fetch(`${API_BASE}/api/ai/speech-quality`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        }),
      ]);
      const voiceData = await voiceRes.json();
      const speechResult = await speechRes.json();
      setVoiceResults(voiceData);
      setSpeechData(speechResult);
    } catch (e) {
      setVoiceResults({
        feedback: "Backend unavailable for analysis.",
        score: 0,
      });
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-4 text-text p-4">
      {/* Problem List Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2 overflow-y-auto brutal-card bg-surface p-4">
        <h3 className="text-sm font-black uppercase tracking-wider mb-2 font-geist">
          Problems
        </h3>
        {PROBLEMS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={`w-full text-left px-3 py-3 rounded-lg border-4 transition-all font-bold text-sm
              ${selectedId === p.id ? "bg-primary border-text shadow-brutal-sm -translate-y-0.5" : "bg-background border-border hover:border-text hover:bg-[#E2E8F0]"}`}
          >
            <div className="flex flex-col gap-2">
              <span className="truncate">
                {p.id}. {p.title}
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider font-black w-fit px-2 py-0.5 border-2 ${diffColors[p.difficulty]} rounded`}
              >
                {p.difficulty}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Problem Description */}
      <div className="w-full md:w-96 flex-shrink-0 brutal-card bg-surface p-6 overflow-y-auto">
        <h2 className="text-2xl font-black font-geist uppercase tracking-tight mb-4 border-b-4 border-text pb-4">
          {problem.id}. {problem.title}
        </h2>
        <div className="flex gap-2 mb-6 flex-wrap">
          <span
            className={`text-xs px-2 py-1 rounded border-2 font-black uppercase tracking-wider ${diffColors[problem.difficulty]}`}
          >
            {problem.difficulty}
          </span>
          {problem.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-background text-text rounded border-2 border-text font-bold flex items-center gap-1 uppercase tracking-wider"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-6">
          <p className="font-medium whitespace-pre-line leading-relaxed text-[15px]">
            {problem.description}
          </p>
          {problem.examples.map((ex, i) => (
            <div
              key={i}
              className="bg-background border-4 border-text p-4 rounded-lg space-y-2 shadow-brutal-sm"
            >
              <p className="font-black uppercase tracking-wide">
                Example {i + 1}:
              </p>
              <p className="font-mono text-sm">
                <strong className="text-primary bg-text px-1">Input:</strong> {ex.input}
              </p>
              <p className="font-mono text-sm">
                <strong className="text-primary bg-text px-1">Output:</strong> {ex.output}
              </p>
              {ex.explanation && (
                <p className="font-medium text-sm mt-2 border-t-2 border-dashed border-text pt-2">
                  <strong className="uppercase">Explanation:</strong> {ex.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor + Console */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="brutal-card bg-surface overflow-hidden flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-background border-b-4 border-text">
            <div className="flex gap-2">
              {LANGS.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded text-sm font-bold border-2 transition-all uppercase tracking-wider
                    ${language === lang ? "bg-primary border-text shadow-[2px_2px_0px_#111] -translate-y-0.5" : "bg-surface border-transparent hover:border-text"}`}
                >
                  {lang === "cpp"
                    ? "C++"
                    : lang === "javascript"
                      ? "JS"
                      : lang}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 p-2">
            <Editor
              height="100%"
              theme="vs-light"
              language={langMap[language]}
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "Geist, Fira Code, monospace",
                padding: { top: 12 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>

        {/* Console + Actions */}
        <div
          className={`brutal-card bg-surface p-4 flex flex-col gap-4 transition-all ${showVoice ? "h-auto" : "max-h-[400px]"}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-geist font-black uppercase tracking-wider text-lg">
              Terminal
            </h3>
            <div className="flex gap-3">
              <button
                onClick={runCode}
                disabled={isRunning || isSubmitting}
                className="brutal-btn-secondary flex items-center gap-2 py-2 px-4"
              >
                {isRunning ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Play size={16} />
                )}{" "}
                {isRunning ? "Running" : "Run"}
              </button>
              <button
                onClick={submitCode}
                disabled={isRunning || isSubmitting}
                className="brutal-btn flex items-center gap-2 py-2 px-4 bg-success"
              >
                {isSubmitting ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}{" "}
                {isSubmitting ? "Judging" : "Submit"}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {results && (
            <div className="bg-background p-4 rounded-lg border-4 border-text max-h-[200px] overflow-y-auto space-y-3 font-mono shadow-inner">
              {results.mode === "run" && (
                <>
                  <div
                    className={`flex items-center gap-2 text-base font-bold px-2 py-1 w-fit border-2 ${results.passed ? "bg-success text-surface border-text" : "bg-danger text-surface border-text"}`}
                  >
                    {results.passed ? (
                      <CheckCircle size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                    {results.passed
                      ? "TEST PASSED"
                      : results.status === "error"
                        ? "ERROR"
                        : "WRONG ANSWER"}
                  </div>
                  {results.runtime > 0 && (
                    <div className="flex items-center gap-2 font-bold px-2">
                      <Clock size={14} /> Runtime: {results.runtime}ms
                    </div>
                  )}
                  {results.output && (
                    <div className="px-2">
                      <span className="font-bold">Output:</span>{" "}
                      {results.output}
                    </div>
                  )}
                  {results.expected && !results.passed && (
                    <div className="px-2">
                      <span className="font-bold">Expected:</span>{" "}
                      {results.expected}
                    </div>
                  )}
                  {results.error && (
                    <div className="text-danger font-bold px-2">{results.error}</div>
                  )}
                </>
              )}
              {results.mode === "submit" && (
                <>
                  <div
                    className={`flex items-center gap-2 text-base font-bold px-2 py-1 w-fit border-2 ${results.status === "accepted" ? "bg-success text-surface border-text" : "bg-danger text-surface border-text"}`}
                  >
                    {results.status === "accepted" ? (
                      <CheckCircle size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                    {results.status === "accepted"
                      ? "ACCEPTED"
                      : `WRONG ANSWER (${results.passed}/${results.total} passed)`}
                  </div>
                  <div className="flex gap-4 font-bold px-2">
                    <span className="flex items-center gap-1">
                      <Cpu size={14} /> Pass Rate: {results.passPercentage}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> Avg Runtime: {results.avgRuntime}ms
                    </span>
                  </div>
                  {results.results &&
                    results.results.map((r, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 py-2 px-3 border-b-2 border-text last:border-0 ${r.passed ? "bg-success/20" : "bg-danger/20"}`}
                      >
                        {r.passed ? (
                          <CheckCircle size={14} className="text-success" />
                        ) : (
                          <XCircle size={14} className="text-danger" />
                        )}
                        <span className="font-bold">
                          Test {r.testCase}: Input: {r.input}
                        </span>
                        {!r.passed && r.actual && (
                          <span className="text-danger font-bold ml-auto bg-surface px-1 border border-danger">
                            Got: {r.actual}
                          </span>
                        )}
                        {r.error && (
                          <span className="text-danger font-bold ml-auto text-[11px] bg-surface px-1 border border-danger">
                            {r.error.substring(0, 80)}
                          </span>
                        )}
                      </div>
                    ))}
                </>
              )}
            </div>
          )}

          {!results && (
            <div className="bg-background p-4 rounded-lg font-bold text-sm border-4 border-dashed border-text text-center">
              Awaiting execution. Click Run to test or Submit to judge.
            </div>
          )}

          {/* Voice AI Section */}
          {showVoice && (
            <div className="mt-4 p-6 bg-surface border-4 border-primary rounded-lg flex flex-col gap-4 shadow-brutal-sm">
              <div className="flex flex-wrap justify-between items-center gap-4 border-b-4 border-text pb-4">
                <h4 className="font-black uppercase text-lg flex items-center gap-2 font-geist">
                  <Mic size={20} /> Explain Approach
                </h4>
                <button
                  onClick={toggleRecording}
                  className={`brutal-btn py-2 px-4 text-sm ${isRecording ? "bg-danger text-surface animate-pulse" : "bg-primary"}`}
                >
                  {isRecording ? "Stop & Analyze" : "Start Recording"}
                </button>
              </div>
              {(isRecording || transcript) && (
                <textarea
                  className="brutal-input w-full h-24 text-base resize-none"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Type your explanation or start recording..."
                />
              )}
              {voiceResults && (
                <div className="p-4 bg-background border-4 border-text rounded-lg mt-2 shadow-brutal-sm">
                  <p className="font-black uppercase tracking-wider mb-2 text-lg">
                    AI Score:{" "}
                    <span className="bg-primary px-2 border-2 border-text ml-2">
                      {Math.round(voiceResults.score || 0)}%
                    </span>
                  </p>
                  <p className="font-medium text-base mb-4 bg-surface p-3 border-2 border-text rounded">
                    {voiceResults.feedback}
                  </p>
                  {voiceResults.missedSteps &&
                    voiceResults.missedSteps.length > 0 && (
                      <div className="mt-4 border-t-2 border-dashed border-text pt-4">
                        <strong className="uppercase font-black flex items-center gap-2 text-danger">
                          <XCircle size={16} /> Missed Concepts
                        </strong>
                        <ul className="list-disc pl-6 mt-2 font-medium">
                          {voiceResults.missedSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}
              {/* Speech Quality Analysis */}
              {speechData && (
                <div className="p-4 bg-surface border-4 border-text rounded-lg mt-2 shadow-brutal-sm">
                  <p className="font-black uppercase tracking-wider flex items-center gap-2 text-lg mb-4">
                    <Zap size={20} className="text-warning" /> Speech Quality
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-background rounded-lg border-2 border-text shadow-[2px_2px_0px_#111]">
                      <p className="font-bold uppercase tracking-wider text-xs mb-1">Clarity</p>
                      <p
                        className={`font-black text-2xl ${speechData.clarityScore >= 70 ? "text-success" : "text-warning"}`}
                      >
                        {speechData.clarityScore}%
                      </p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg border-2 border-text shadow-[2px_2px_0px_#111]">
                      <p className="font-bold uppercase tracking-wider text-xs mb-1">Structure</p>
                      <p
                        className={`font-black text-2xl ${speechData.structureScore >= 60 ? "text-success" : "text-warning"}`}
                      >
                        {speechData.structureScore}%
                      </p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg border-2 border-text shadow-[2px_2px_0px_#111]">
                      <p className="font-bold uppercase tracking-wider text-xs mb-1">Fillers</p>
                      <p
                        className={`font-black text-2xl ${speechData.totalFillers <= 2 ? "text-success" : "text-danger"}`}
                      >
                        {speechData.totalFillers}
                      </p>
                    </div>
                  </div>
                  {speechData.suggestions &&
                    speechData.suggestions.length > 0 && (
                      <div className="space-y-2 mt-6 border-t-2 border-dashed border-text pt-4">
                        {speechData.suggestions.map((s, i) => (
                          <p key={i} className="font-medium text-sm flex items-start gap-2">
                            <span className="font-black text-primary text-base">→</span> {s}
                          </p>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {/* Code Review AI Panel */}
          {codeReview && <CodeReviewPanel reviewData={codeReview} />}
        </div>
      </div>
    </div>
  );
}
