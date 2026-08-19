import React, { useState, useContext, useRef, useCallback } from 'react';
import {
  FileText, Upload, Shield, Zap, Target, CheckCircle, XCircle,
  AlertTriangle, TrendingUp, Award, BarChart3, ArrowRight,
  Sparkles, RefreshCw, ChevronRight, ExternalLink, Lightbulb,
  User, Mail, Link, Code2, Globe, Hash, FileSearch,
  Star, Loader2,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API_BASE from '../config/api';

/* ═══════════════════════════════════════════════════════
   Score Ring — Reusable animated circular gauge
   ═══════════════════════════════════════════════════════ */
function ScoreRing({ score, size = 120, sw = 8, label, showGrade }) {
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const col = score >= 70 ? 'var(--success)' : score >= 45 ? 'var(--warning)' : 'var(--danger)';

  let grade = 'F';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B+';
  else if (score >= 60) grade = 'B';
  else if (score >= 50) grade = 'C';
  else if (score >= 35) grade = 'D';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-color)" strokeWidth={sw} opacity={0.12} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={sw}
            strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
            className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showGrade ? (
            <>
              <span className="text-3xl font-bold" style={{ color: col }}>{grade}</span>
              <span className="text-xs font-bold opacity-60">{score}/100</span>
            </>
          ) : (
            <span className="text-2xl font-bold" style={{ color: col }}>{score}%</span>
          )}
        </div>
      </div>
      {label && <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">{label}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Mini Score Bar — Horizontal bar for sub-scores
   ═══════════════════════════════════════════════════════ */
function ScoreBar({ label, score, max, icon: Icon }) {
  const pct = max > 0 ? Math.min(100, (score / max) * 100) : 0;
  const col = pct >= 70 ? 'bg-success' : pct >= 45 ? 'bg-warning' : 'bg-danger';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="opacity-60" />}
          <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-xs font-bold">{score}/{max}</span>
      </div>
      <div className="w-full h-2.5 bg-background border border-border rounded-full overflow-hidden">
        <div className={`h-full ${col} transition-all duration-1000 ease-out rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Keyword Chip — Individual keyword tag
   ═══════════════════════════════════════════════════════ */
function KeywordChip({ keyword, type }) {
  const styles = {
    technical: 'bg-primary/20 border-primary text-text',
    impact: 'bg-success/20 border-success text-text',
    general: 'bg-warning/20 border-warning text-text',
    missing: 'bg-danger/20 border-danger text-text line-through opacity-60',
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider border-2 rounded ${styles[type] || styles.general}`}>
      {keyword}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   PDF Text Extraction (Client-Side via FileReader)
   ═══════════════════════════════════════════════════════ */
async function extractTextFromPDF(file) {
  const pdfjsLib = await import('pdfjs-dist');

  // Use local worker bundled with pdfjs-dist (Vite resolves this via ?url)
  const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default;

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Join items with spacing logic: add space between items, newline between lines
    const pageText = content.items
      .map(item => item.str)
      .join(' ')
      .replace(/\s+/g, ' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}

/* ═══════════════════════════════════════════════════════
   Main Component: ResumeScreener
   ═══════════════════════════════════════════════════════ */
export default function ResumeScreener() {
  const { token } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // States
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'paste'
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loadingStage, setLoadingStage] = useState('');

  /* ── File Handling ── */
  const handleFile = useCallback(async (file) => {
    setError('');
    setResult(null);

    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.pdf')) {
      setError('Please upload a PDF or TXT file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setFileName(file.name);

    try {
      let text = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setLoadingStage('Extracting text from PDF...');
        text = await extractTextFromPDF(file);
      } else {
        text = await file.text();
      }

      if (text.trim().length < 30) {
        setError('Could not extract enough text from this file. Please try pasting your resume text instead.');
        setLoadingStage('');
        return;
      }

      setResumeText(text);
      setLoadingStage('');
    } catch (err) {
      console.error('File parsing error:', err);
      setError('Failed to parse the file. Try pasting your resume text directly.');
      setLoadingStage('');
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  /* ── Submit to Backend ── */
  const handleAnalyze = async () => {
    if (!resumeText || resumeText.trim().length < 30) {
      setError('Please provide your resume text (at least 30 characters).');
      return;
    }

    setError('');
    setAnalyzing(true);
    setResult(null);

    const stages = [
      'Parsing resume structure...',
      'Scanning for ATS keywords...',
      'Evaluating impact language...',
      'Analyzing formatting & sections...',
      'Running AI deep analysis...',
      'Generating recommendations...',
    ];

    let stageIndex = 0;
    setLoadingStage(stages[0]);
    const interval = setInterval(() => {
      stageIndex++;
      if (stageIndex < stages.length) {
        setLoadingStage(stages[stageIndex]);
      }
    }, 1200);

    try {
      const res = await fetch(`${API_BASE}/api/resume/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeText: resumeText.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      clearInterval(interval);
      setLoadingStage('');
      setResult(data);

      // Track progress & earn XP
      try {
        await fetch(`${API_BASE}/api/progress/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: 'resume',
            data: { score: data.totalScore, grade: data.grade },
          }),
        });
      } catch (e) {
        // Non-critical — don't block the user
        console.warn('Progress tracking failed:', e.message);
      }
    } catch (err) {
      clearInterval(interval);
      setLoadingStage('');
      setError(err.message || 'Failed to analyze resume. Please check your backend connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setResumeText('');
    setFileName('');
    setResult(null);
    setError('');
    setLoadingStage('');
    setAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <div className="w-full min-h-full bg-background text-text p-2 md:p-4 overflow-y-auto font-inter">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="brutal-card bg-surface p-4 md:p-6 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary border border-border rounded-lg shadow-soft">
              <FileSearch size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-geist font-bold uppercase tracking-tight">
                Resume ATS Screener
              </h1>
              <p className="text-sm font-medium opacity-70 mt-0.5">
                Get your resume scored, analyzed, and optimized for Applicant Tracking Systems.
              </p>
            </div>
          </div>
          {result && (
            <button onClick={handleReset} className="brutal-btn-secondary py-2 px-4 text-sm flex items-center gap-2">
              <RefreshCw size={16} /> New Scan
            </button>
          )}
        </div>

        {/* ── Error Display ── */}
        {error && (
          <div className="brutal-card bg-danger border border-border p-4 mb-4 text-surface font-bold text-sm flex items-center gap-3">
            <AlertTriangle size={20} />
            <span>ERROR: {error}</span>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            UPLOAD / INPUT SECTION (shown when no result)
            ════════════════════════════════════════════════ */}
        {!result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left: Upload Area */}
            <div className="lg:col-span-2">
              <div className="brutal-card bg-surface p-4 md:p-6">
                {/* Mode Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setInputMode('upload')}
                    className={`px-4 py-2 text-xs font-bold uppercase border border-border rounded-lg transition-all ${inputMode === 'upload' ? 'bg-primary shadow-soft -translate-y-0.5' : 'bg-background hover:bg-primary/30'}`}
                  >
                    <Upload size={14} className="inline mr-1.5 -mt-0.5" /> Upload File
                  </button>
                  <button
                    onClick={() => setInputMode('paste')}
                    className={`px-4 py-2 text-xs font-bold uppercase border border-border rounded-lg transition-all ${inputMode === 'paste' ? 'bg-primary shadow-soft -translate-y-0.5' : 'bg-background hover:bg-primary/30'}`}
                  >
                    <FileText size={14} className="inline mr-1.5 -mt-0.5" /> Paste Text
                  </button>
                </div>

                {inputMode === 'upload' ? (
                  /* ── Drag & Drop Zone ── */
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-4 border-dashed rounded-lg p-8 md:p-12 text-center cursor-pointer transition-all
                      ${dragActive
                        ? 'border-primary bg-primary/10 scale-[1.02]'
                        : fileName
                          ? 'border-success bg-success/5'
                          : 'border-text/30 bg-background hover:border-primary hover:bg-primary/5'
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={(e) => handleFile(e.target.files[0])}
                      className="hidden"
                    />

                    {fileName ? (
                      <div className="space-y-3">
                        <CheckCircle size={48} className="mx-auto text-success" />
                        <p className="text-lg font-bold uppercase">{fileName}</p>
                        <p className="text-sm font-bold opacity-60">
                          {resumeText.split(/\s+/).length} words extracted • Ready to analyze
                        </p>
                      </div>
                    ) : loadingStage ? (
                      <div className="space-y-3">
                        <Loader2 size={48} className="mx-auto animate-spin text-primary" />
                        <p className="text-sm font-bold uppercase animate-pulse">{loadingStage}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload size={48} className="mx-auto opacity-40" />
                        <p className="text-lg font-bold uppercase">Drop your resume here</p>
                        <p className="text-sm font-medium opacity-60">
                          or click to browse • PDF, TXT supported • Max 5MB
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── Text Paste Area ── */
                  <textarea
                    value={resumeText}
                    onChange={(e) => { setResumeText(e.target.value); setFileName('pasted-text'); }}
                    placeholder="Paste your entire resume text here...&#10;&#10;Include all sections: Summary, Experience, Skills, Education, Projects, etc."
                    className="brutal-input w-full h-64 resize-none text-sm font-mono"
                  />
                )}

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || (!resumeText && !fileName)}
                  className="brutal-btn w-full mt-4 py-3 text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>{loadingStage || 'Analyzing...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      <span>Analyze Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Info Panel */}
            <div className="space-y-4">
              <div className="brutal-card bg-primary p-4 md:p-5">
                <h3 className="text-lg font-bold uppercase mb-3 flex items-center gap-2">
                  <Shield size={20} /> What We Analyze
                </h3>
                <ul className="space-y-2.5 text-sm font-bold">
                  {[
                    ['Section Structure', 'Experience, Skills, Education headers'],
                    ['ATS Keywords', 'Technical skills, tools, frameworks'],
                    ['Impact Language', 'Action verbs and achievement metrics'],
                    ['Quantification', 'Numbers, percentages, dollar amounts'],
                    ['Contact Info', 'Email, LinkedIn, GitHub, Portfolio'],
                    ['Formatting', 'Bullet points, line length, readability'],
                  ].map(([title, desc], i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="block uppercase tracking-wider text-xs">{title}</span>
                        <span className="block text-[11px] opacity-70 font-medium normal-case">{desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="brutal-card bg-surface p-4 md:p-5">
                <h3 className="text-sm font-bold uppercase mb-2 flex items-center gap-2">
                  <Sparkles size={16} /> AI-Powered
                </h3>
                <p className="text-xs font-medium opacity-70 leading-relaxed">
                  Our screener combines a rule-based ATS engine with Google Gemini AI for deep critique,
                  bullet point rewrites, and missing keyword suggestions — just like a real recruiter review.
                </p>
              </div>
            </div>
          </div>
        )}


        {/* ════════════════════════════════════════════════
            RESULTS DASHBOARD (shown when analysis complete)
            ════════════════════════════════════════════════ */}
        {result && (
          <div className="space-y-4">

            {/* ── Row 1: Overall Score + Grade ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Big Score Card */}
              <div className="brutal-card bg-surface p-6 flex flex-col items-center justify-center text-center">
                <h2 className="text-xs font-bold uppercase tracking-wider mb-4 opacity-50">ATS Score</h2>
                <ScoreRing score={result.totalScore} size={140} sw={10} showGrade />
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-bold opacity-60">{result.wordCount} words</span>
                  <span className="text-xs font-bold opacity-40">•</span>
                  <span className="text-xs font-bold opacity-60">{result.lineCount} lines</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-40 mt-1">
                  Source: {result.source === 'gemini' ? '✦ AI Enhanced' : '⚙ Rule Engine'}
                </span>
              </div>

              {/* Score Breakdown */}
              <div className="md:col-span-2 brutal-card bg-surface p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BarChart3 size={16} /> Score Breakdown
                </h3>
                <div className="space-y-3">
                  <ScoreBar label="Keyword Optimization" score={result.scores.keywordOptimization} max={25} icon={Target} />
                  <ScoreBar label="Impact Language" score={result.scores.impactLanguage} max={20} icon={TrendingUp} />
                  <ScoreBar label="Section Structure" score={result.scores.sectionStructure} max={15} icon={FileText} />
                  <ScoreBar label="Quantification" score={result.scores.quantification} max={15} icon={Hash} />
                  <ScoreBar label="Contact Info" score={result.scores.contactCompleteness} max={10} icon={Mail} />
                  <ScoreBar label="Formatting" score={result.scores.formatting} max={10} icon={Award} />
                  <ScoreBar label="Length" score={result.scores.length} max={5} icon={FileText} />
                </div>
              </div>
            </div>

            {/* ── Row 2: Strengths + Suggestions ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="brutal-card bg-success/10 border-success p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-success">
                  <Star size={16} /> Strengths
                </h3>
                <ul className="space-y-2">
                  {(result.aiCritique?.topStrengths || result.strengths).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-medium">
                      <CheckCircle size={14} className="text-success mt-0.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="brutal-card bg-danger/10 border-danger p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-danger">
                  <AlertTriangle size={16} /> Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {(result.aiCritique?.criticalImprovements || result.suggestions).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-medium">
                      <ArrowRight size={14} className="text-danger mt-0.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Row 3: Keywords Found ── */}
            <div className="brutal-card bg-surface p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target size={16} /> Keywords Detected ({result.keywords.totalFound})
              </h3>
              <div className="space-y-3">
                {result.keywords.technical.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-1.5">Technical Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords.technical.map((kw, i) => <KeywordChip key={i} keyword={kw} type="technical" />)}
                    </div>
                  </div>
                )}
                {result.keywords.impact.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-1.5">Action Verbs</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords.impact.map((kw, i) => <KeywordChip key={i} keyword={kw} type="impact" />)}
                    </div>
                  </div>
                )}
                {result.keywords.general.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-1.5">Soft Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords.general.map((kw, i) => <KeywordChip key={i} keyword={kw} type="general" />)}
                    </div>
                  </div>
                )}
                {result.aiCritique?.missingKeywords && result.aiCritique.missingKeywords.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-1.5">Missing Keywords (AI Suggested)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.aiCritique.missingKeywords.map((kw, i) => <KeywordChip key={i} keyword={kw} type="missing" />)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Row 4: Contact & Section Checks ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Info */}
              <div className="brutal-card bg-surface p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User size={16} /> Contact Information
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Email Address', found: result.contact.hasEmail, icon: Mail },
                    { label: 'Phone Number', found: result.contact.hasPhone, icon: User },
                    { label: 'LinkedIn Profile', found: result.contact.hasLinkedIn, icon: Link },
                    { label: 'GitHub Profile', found: result.contact.hasGitHub, icon: Code2 },
                    { label: 'Portfolio / Website', found: result.contact.hasPortfolio, icon: Globe },
                  ].map(({ label, found, icon: Icon }, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2 rounded border-2 ${found ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5'}`}>
                      <Icon size={14} className={found ? 'text-success' : 'text-danger'} />
                      <span className="text-xs font-bold flex-1">{label}</span>
                      {found ? <CheckCircle size={14} className="text-success" /> : <XCircle size={14} className="text-danger" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume Sections */}
              <div className="brutal-card bg-surface p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={16} /> Section Detection
                </h3>
                <div className="space-y-2">
                  {result.detectedSections.map((section, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded border-2 border-success/30 bg-success/5">
                      <CheckCircle size={14} className="text-success" />
                      <span className="text-xs font-bold uppercase">{section}</span>
                      <span className="text-[10px] font-bold text-success ml-auto">Found</span>
                    </div>
                  ))}
                  {result.missingSections.map((section, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded border-2 border-danger/30 bg-danger/5">
                      <XCircle size={14} className="text-danger" />
                      <span className="text-xs font-bold uppercase">{section}</span>
                      <span className="text-[10px] font-bold text-danger ml-auto">Missing</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Row 5: AI Critique & Bullet Rewrites ── */}
            {result.aiCritique && (
              <div className="brutal-card bg-primary/10 border-primary p-5">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" /> AI Deep Analysis
                  <span className="text-[10px] font-bold bg-primary px-2 py-0.5 rounded uppercase">Gemini</span>
                </h3>
                {result.aiCritique.overallImpression && (
                  <p className="text-sm font-medium leading-relaxed mb-4 p-3 bg-surface border border-border rounded-lg">
                    {result.aiCritique.overallImpression}
                  </p>
                )}
                {result.aiCritique.bulletRewrites && result.aiCritique.bulletRewrites.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Lightbulb size={14} /> Suggested Bullet Point Rewrites
                    </h4>
                    <div className="space-y-3">
                      {result.aiCritique.bulletRewrites.map((item, i) => (
                        <div key={i} className="bg-surface border border-border rounded-lg p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <XCircle size={12} className="text-danger mt-0.5 flex-shrink-0" />
                            <span className="text-xs font-medium opacity-60 line-through">{item.original}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle size={12} className="text-success mt-0.5 flex-shrink-0" />
                            <span className="text-xs font-bold text-success">{item.improved}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Row 6: Quantification Stats ── */}
            <div className="brutal-card bg-surface p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Hash size={16} /> Quantification Analysis
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-background border border-border rounded-lg">
                  <span className="text-2xl font-bold block">{result.quantification.quantifiedLines}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Lines with Metrics</span>
                </div>
                <div className="p-3 bg-background border border-border rounded-lg">
                  <span className="text-2xl font-bold block">{result.quantification.totalLines}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Total Lines</span>
                </div>
                <div className="p-3 bg-background border border-border rounded-lg">
                  <span className={`text-2xl font-bold block ${result.quantification.ratio >= 20 ? 'text-success' : result.quantification.ratio >= 10 ? 'text-warning' : 'text-danger'}`}>
                    {result.quantification.ratio}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">Quantification Ratio</span>
                </div>
              </div>
              <p className="text-xs font-medium opacity-60 mt-3 text-center">
                Aim for 20%+ of your bullet points to include measurable metrics (%, $, numbers).
              </p>
            </div>

            {/* ── Pro Tips ── */}
            <div className="brutal-card bg-warning/10 border-warning p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-warning">
                <Lightbulb size={16} /> Pro Tips
              </h3>
              <ul className="space-y-2 text-sm font-medium">
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-warning mt-0.5 flex-shrink-0" />
                  <span>Tailor your resume to each job description — mirror their exact keywords.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-warning mt-0.5 flex-shrink-0" />
                  <span>Use the X-Y-Z formula: "Accomplished [X] by doing [Y], resulting in [Z]".</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-warning mt-0.5 flex-shrink-0" />
                  <span>Keep your resume to 1 page if you have &lt;5 years of experience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-warning mt-0.5 flex-shrink-0" />
                  <span>Avoid tables, graphics, and columns — most ATS cannot parse them correctly.</span>
                </li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
