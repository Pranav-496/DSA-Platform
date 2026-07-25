import React, { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import {
  Zap, Activity, Clock, Save, Upload, LayoutTemplate,
  BookOpen, CheckCircle, Circle, AlertTriangle, Shield,
  Gauge, Lightbulb, X, Timer, Image as ImageIcon,
  Award, Pause, Play, RotateCcw,
  Trash2, FileUp, Target, ArrowRightLeft, Lock,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  Sparkles, ChevronRight, FileDown, FolderOpen,
} from 'lucide-react';
import { SYSTEM_DESIGN_CHALLENGES } from '../data/systemDesignChallenges';
import { SYSTEM_DESIGN_TEMPLATES } from '../data/systemDesignTemplates';
import API_BASE from '../config/api';

import '@excalidraw/excalidraw/index.css';

const ExcalidrawWrapper = lazy(() =>
  import('@excalidraw/excalidraw').then(mod => ({ default: mod.Excalidraw }))
);

const DIFF_STYLE = {
  L4: 'bg-success text-surface border-text',
  L5: 'bg-warning text-text border-text',
  L6: 'bg-danger text-surface border-text',
};
const DIFF_LABEL = { L4: 'Mid', L5: 'Senior', L6: 'Staff' };
const GRADE_COLOR = {
  'A+': 'text-success', A: 'text-success',
  'B+': 'text-primary', B: 'text-primary',
  C: 'text-warning', D: 'text-danger', F: 'text-danger',
};

/* ── Score Ring ──────────────────────────────────────── */
function ScoreRing({ score, size = 56, sw = 5, label }) {
  const r = (size - sw) / 2, c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const col = score >= 70 ? 'var(--success)' : score >= 40 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-color)" strokeWidth={sw} opacity={0.15}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={sw}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" className="transition-all duration-700"/>
      </svg>
      <span className="text-[9px] font-bold uppercase tracking-wider opacity-50">{label}</span>
      <span className="text-xs font-black" style={{ color: col }}>{score}%</span>
    </div>
  );
}

/* ── Abbreviation map for component detection ──────── */
const ABBR = {
  'load balancer': ['lb','nginx','haproxy','elb','alb','balancer'],
  'cache': ['redis','memcached','caching','cache layer','in-memory'],
  'database': ['db','mysql','postgres','mongodb','sql','nosql','dynamo'],
  'message queue': ['kafka','rabbitmq','sqs','queue','pub/sub','pubsub','broker','event bus'],
  'cdn': ['cloudfront','akamai','content delivery','edge'],
  'api gateway': ['gateway','api gw','api layer'],
  'object storage': ['s3','blob','gcs','object store'],
  'search': ['elasticsearch','solr','opensearch','algolia'],
  'notification': ['push','sns','notification service'],
  'websocket': ['ws','socket','real-time','realtime','socket.io'],
  'consistent hashing': ['hash ring','consistent hash'],
  'replica': ['replica','replication','follower','secondary'],
  'trie': ['trie','prefix tree'],
  'data pipeline': ['pipeline','etl','batch','spark'],
  'transcoding': ['transcode','encoding','ffmpeg'],
  'presence': ['presence','heartbeat'],
  'block server': ['block','chunk','chunking'],
  'sync service': ['sync','synchronization'],
  'fanout': ['fanout','fan-out','fan out'],
  'timeline': ['timeline','feed','news feed'],
  'routing service': ['routing','pathfinding','navigation'],
  'inventory': ['inventory','stock'],
  'order service': ['order','checkout'],
  'payment': ['payment','billing','stripe'],
};

/* ═══════════════════════════════════════════════════════ */
export default function SystemDesign() {
  const [challenge, setChallenge] = useState(null);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [template, setTemplate] = useState('blank');
  const [timerOn, setTimerOn] = useState(false);
  const [secs, setSecs] = useState(0);
  const [hints, setHints] = useState(0);
  const [tab, setTab] = useState('req');          // req | eval | review
  const [analyzing, setAnalyzing] = useState(false);
  const [review, setReview] = useState(null);
  const [loadModal, setLoadModal] = useState(false);
  const [saves, setSaves] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [detected, setDetected] = useState(new Set());
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem('algonova-sd-done') || '{}'); } catch { return {}; }
  });
  const [api, setApi] = useState(null);
  const fileRef = useRef(null);
  const canvasRef = useRef(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // ── Theme watcher ───────────────────────────────
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light'));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // ── Close sidebar on mount ─────────────────────
  useEffect(() => {
    if (api) {
      try { api.updateScene({ appState: { openSidebar: null, openMenu: null } }); } catch (e) { console.error(e); }
    }
  }, [api]);

  // ── Timer ───────────────────────────────────────
  useEffect(() => {
    if (!timerOn) return;
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerOn]);

  // ── Toast dismiss ──────────────────────────────
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2500); return () => clearTimeout(t); } }, [toast]);

  // ── Persist completions ─────────────────────────
  useEffect(() => { localStorage.setItem('algonova-sd-done', JSON.stringify(done)); }, [done]);

  // ── Mark completed ─────────────────────────────
  // (Moved into doReview to avoid set-state-in-effect)

  // ── Live detection ─────────────────────────────
  useEffect(() => {
    if (!api || !challenge) return;
    const run = () => {
      const els = api.getSceneElements();
      const labels = els.filter(e => e.type === 'text' && e.text && !e.isDeleted).map(e => e.text.trim().toLowerCase());
      const all = labels.join(' ');
      const found = new Set();
      (challenge.keyComponents || []).forEach(c => {
        const cl = c.toLowerCase(), vars = [cl];
        Object.entries(ABBR).forEach(([k, a]) => { if (cl.includes(k)) vars.push(...a); });
        if (vars.some(v => all.includes(v))) found.add(c);
      });
      setDetected(found);
    };
    run();
    const id = setInterval(run, 2500);
    return () => clearInterval(id);
  }, [api, challenge]);

  // ── Auto-save ──────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (!api) return;
      const els = api.getSceneElements();
      if (els.length > 0) {
        localStorage.setItem('algonova-sd-auto', JSON.stringify({
          elements: els,
          appState: { viewBackgroundColor: api.getAppState().viewBackgroundColor },
          challengeId: challenge?.id || null, ts: Date.now(),
        }));
      }
    }, 30000);
    return () => clearInterval(id);
  }, [api, challenge]);

  // ── Actions ────────────────────────────────────
  const loadTpl = useCallback((id) => {
    setTemplate(id);
    const t = SYSTEM_DESIGN_TEMPLATES.find(x => x.id === id);
    if (t && api) { api.updateScene({ elements: t.elements }); api.scrollToContent(); }
  }, [api]);

  const pickChallenge = (c) => {
    setChallenge(c); setHints(0); setReview(null); setTimerOn(true); setSecs(0);
    setRightOpen(true); setTab('req'); setDetected(new Set());
    if (api) api.updateScene({ elements: [] });
  };

  const doReview = async () => {
    if (!api) return;
    setAnalyzing(true); setRightOpen(true); setTab('review');
    const els = api.getSceneElements();
    try {
      const r = await fetch(`${API_BASE}/api/ai/system-design-review`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: challenge?.title || 'Free Design', elements: els,
          keyComponents: challenge?.keyComponents || [],
          evaluationCriteria: challenge?.evaluationCriteria || null,
        }),
      });
      const reviewResult = await r.json();
      setReview(reviewResult);
      if (challenge && reviewResult.overallScore >= 60) {
        setDone(p => ({ ...p, [challenge.id]: {
          score: Math.max(p[challenge.id]?.score || 0, reviewResult.overallScore),
          grade: reviewResult.grade || 'B', ts: Date.now(),
        }}));
      }
    } catch (err) {
      console.error("AI review failed, falling back to offline estimate:", err);
      const tEls = els.filter(e => e.type === 'text' && e.text && !e.isDeleted).map(e => e.text.trim().toLowerCase());
      const rc = els.filter(e => ['rectangle','ellipse','diamond'].includes(e.type) && !e.isDeleted).length;
      const ac = els.filter(e => (e.type === 'arrow' || e.type === 'line') && !e.isDeleted).length;
      const reviewResult = {
        overallScore: Math.min(100, rc * 8 + ac * 5), grade: rc >= 6 ? 'B' : 'D',
        scores: { componentCoverage: Math.min(100, rc*12), scalability: tEls.some(t => t.includes('cache')||t.includes('lb')) ? 60:20,
          availability: tEls.some(t => t.includes('replica')) ? 50:15, dataFlow: Math.min(100, ac*15),
          consistency: tEls.some(t => t.includes('db')||t.includes('sql')) ? 30:10 },
        foundComponents: [], missingComponents: challenge?.keyComponents || [],
        suggestions: ['Backend unreachable — offline estimate.'],
        aiCritique: 'Offline estimate based on element counts.', source: 'offline',
        stats: { componentCount: rc, connectionCount: ac, textLabels: tEls.length },
      };
      setReview(reviewResult);
      if (challenge && reviewResult.overallScore >= 60) {
        setDone(p => ({ ...p, [challenge.id]: {
          score: Math.max(p[challenge.id]?.score || 0, reviewResult.overallScore),
          grade: reviewResult.grade || 'B', ts: Date.now(),
        }}));
      }
    }
    setAnalyzing(false);
  };

  const exportPNG = async () => {
    if (!api) return;
    try {
      const mod = await import('@excalidraw/excalidraw');
      const blob = await mod.exportToBlob({
        elements: api.getSceneElements(),
        appState: { ...api.getAppState(), exportWithDarkMode: theme === 'dark' },
        files: api.getFiles(),
        mimeType: 'image/png'
      });
      const u = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = u; a.download = `${challenge?.title || 'design'}.png`; a.click(); URL.revokeObjectURL(u);
      setToast({ t: 'ok', m: 'PNG exported!' });
    } catch (err) {
      console.error('Export error:', err);
      setToast({ t: 'err', m: 'Export failed' });
    }
  };

  const exportJSON = () => {
    if (!api) return;
    const d = { elements: api.getSceneElements(), appState: { viewBackgroundColor: api.getAppState().viewBackgroundColor }};
    const b = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const u = URL.createObjectURL(b), a = document.createElement('a');
    a.href = u; a.download = `${challenge?.title || 'design'}.json`; a.click(); URL.revokeObjectURL(u);
    setToast({ t: 'ok', m: 'JSON exported!' });
  };

  const importJSON = (ev) => {
    const f = ev.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (e) => { try { const d = JSON.parse(e.target.result);
      if (d.elements && api) { api.updateScene({ elements: d.elements }); api.scrollToContent(); setToast({ t: 'ok', m: 'Imported!' }); }
    } catch { setToast({ t: 'err', m: 'Invalid file' }); }};
    r.readAsText(f); ev.target.value = '';
  };

  const saveCloud = async () => {
    if (!api) return; setSaving(true);
    const payload = { elements: api.getSceneElements(),
      appState: { viewBackgroundColor: api.getAppState().viewBackgroundColor },
      challengeId: challenge?.id || null, name: challenge?.title || 'Free Design' };
    try {
      const r = await fetch(`${API_BASE}/api/system-design/save`, { method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('algonova_token')}` },
        body: JSON.stringify(payload) });
      if (r.ok) setToast({ t: 'ok', m: 'Saved!' }); else throw 0;
    } catch { localStorage.setItem('algonova-sd-save', JSON.stringify({ ...payload, ts: Date.now() }));
      setToast({ t: 'warn', m: 'Saved locally' }); }
    setSaving(false);
  };

  const loadCloud = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/system-design/saves`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('algonova_token')}` }});
      if (r.ok) { setSaves(await r.json()); setLoadModal(true); } else throw 0;
    } catch { loadLocal(); }
  };

  const loadLocal = () => {
    const s = localStorage.getItem('algonova-sd-save') || localStorage.getItem('algonova-sd-auto');
    if (!s) { setToast({ t: 'warn', m: 'No saves found' }); return; }
    try { applyLoad(JSON.parse(s)); setToast({ t: 'ok', m: 'Local save loaded!' }); } catch (err) { console.error('Load parse error', err); }
  };

  const applyLoad = (d) => {
    if (!api || !d.elements) return;
    api.updateScene({ elements: d.elements }); api.scrollToContent();
    if (d.challengeId) { const c = SYSTEM_DESIGN_CHALLENGES.find(x => x.id === d.challengeId);
      if (c) { setChallenge(c); setRightOpen(true); setTab('req'); }}
    setLoadModal(false);
  };

  const delSave = async (id) => {
    try { const r = await fetch(`${API_BASE}/api/system-design/saves/${id}`,
      { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('algonova_token')}` }});
      if (r.ok) { setSaves(p => p.filter(s => s._id !== id)); setToast({ t: 'ok', m: 'Deleted' }); }
    } catch (err) { console.error('Delete save error', err); }
  };

  const bg = theme === 'dark' ? '#121212' : '#FAFAFA';
  const mm = Math.floor(secs/60), ss = secs%60;
  const over = challenge && secs > challenge.estimatedMinutes * 60;
  const doneN = Object.keys(done).length;

  /* ═══════════════════════════════════════════════════ */
  return (
    <div className="-m-2 md:-m-4 flex flex-col h-full overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-[100] px-4 py-2.5 border-4 border-text shadow-brutal font-bold text-sm max-w-xs animate-slide-in ${
          toast.t === 'ok' ? 'bg-success text-surface' : toast.t === 'warn' ? 'bg-warning text-text' : 'bg-danger text-surface'
        }`}>{toast.t === 'ok' ? '✓ ' : '⚠ '}{toast.m}</div>
      )}

      <input type="file" ref={fileRef} accept=".json" onChange={importJSON} className="hidden" />

      {/* ── Toolbar ─────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border-b-4 border-border shrink-0 overflow-x-auto">
        <button onClick={() => setLeftOpen(v => !v)}
          className={`p-1.5 border-2 rounded shrink-0 transition-all ${leftOpen ? 'border-primary bg-primary text-text' : 'border-border hover:border-primary'}`}
          title="Challenges">
          {leftOpen ? <PanelLeftClose size={16}/> : <PanelLeftOpen size={16}/>}
        </button>

        <div className="hidden sm:flex items-center gap-1 mr-1">
          <span className="font-black text-xs uppercase tracking-wider whitespace-nowrap">System Design</span>
          {challenge && <span className="text-[10px] opacity-50 truncate max-w-[140px]">— {challenge.title}</span>}
        </div>

        <span className="w-px h-5 bg-border/30 shrink-0"/>

        <div className="flex items-center gap-1 border-2 border-border rounded px-1.5 py-0.5 shrink-0 hover:border-primary transition-colors">
          <LayoutTemplate size={12} className="opacity-40"/>
          <select value={template} onChange={e => loadTpl(e.target.value)}
            className="bg-transparent text-[11px] font-bold outline-none cursor-pointer">
            {SYSTEM_DESIGN_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <span className="w-px h-5 bg-border/30 shrink-0"/>

        <button onClick={exportPNG} className="p-1.5 border-2 border-border rounded hover:border-primary transition-all shrink-0" title="Export PNG">
          <ImageIcon size={14}/>
        </button>
        <button onClick={exportJSON} className="p-1.5 border-2 border-border rounded hover:border-primary transition-all shrink-0" title="Export JSON">
          <FileDown size={14}/>
        </button>
        <button onClick={() => fileRef.current?.click()} className="p-1.5 border-2 border-border rounded hover:border-primary transition-all shrink-0" title="Import JSON">
          <FileUp size={14}/>
        </button>

        <span className="w-px h-5 bg-border/30 shrink-0"/>

        <button onClick={saveCloud} disabled={saving}
          className="p-1.5 border-2 border-border rounded hover:border-success transition-all shrink-0 disabled:opacity-40" title="Save">
          <Save size={14}/>
        </button>
        <button onClick={loadCloud}
          className="p-1.5 border-2 border-border rounded hover:border-warning transition-all shrink-0" title="Load">
          <FolderOpen size={14}/>
        </button>

        <span className="w-px h-5 bg-border/30 shrink-0"/>

        <button onClick={doReview} disabled={analyzing}
          className="flex items-center gap-1.5 px-3 py-1 bg-primary text-text font-black text-[11px] uppercase tracking-wider border-2 border-text rounded shadow-brutal-sm hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 shrink-0">
          {analyzing ? <><Activity size={13} className="animate-spin"/> Analyzing...</> : <><Sparkles size={13}/> AI Review</>}
        </button>

        <div className="flex-1 min-w-2"/>

        {/* Timer */}
        <div className="flex items-center gap-1 shrink-0">
          <div className={`flex items-center gap-1 px-2 py-1 border-2 rounded font-mono text-[11px] font-bold transition-colors ${
            over ? 'bg-danger/15 border-danger text-danger' : 'bg-background border-border'}`}>
            <Timer size={11}/>
            {String(mm).padStart(2,'0')}:{String(ss).padStart(2,'0')}
            {challenge && <span className="text-[9px] opacity-35">/{challenge.estimatedMinutes}m</span>}
          </div>
          <button onClick={() => setTimerOn(v => !v)}
            className={`p-1 border-2 rounded transition-all ${timerOn ? 'border-warning bg-warning/10' : 'border-border hover:border-primary'}`} title={timerOn ? 'Pause' : 'Start'}>
            {timerOn ? <Pause size={11}/> : <Play size={11}/>}
          </button>
          <button onClick={() => { setSecs(0); setTimerOn(false); }}
            className="p-1 border-2 border-border rounded hover:border-danger transition-all" title="Reset">
            <RotateCcw size={11}/>
          </button>
        </div>

        <span className="w-px h-5 bg-border/30 shrink-0"/>

        <button onClick={() => setRightOpen(v => !v)}
          className={`p-1.5 border-2 rounded shrink-0 transition-all ${rightOpen ? 'border-primary bg-primary text-text' : 'border-border hover:border-primary'}`}
          title="Panel">
          {rightOpen ? <PanelRightClose size={16}/> : <PanelRightOpen size={16}/>}
        </button>
      </div>

      {/* ── Main 3-column body ──────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* LEFT: Challenge list */}
        {leftOpen && (
          <div className="w-[260px] shrink-0 border-r-4 border-border bg-surface flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b-2 border-border bg-background/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-black text-[10px] uppercase tracking-widest">Challenges</span>
                <span className="text-[9px] font-bold opacity-40">{doneN}/{SYSTEM_DESIGN_CHALLENGES.length}</span>
              </div>
              <div className="w-16 bg-border/20 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-success rounded-full transition-all" style={{ width: `${(doneN/SYSTEM_DESIGN_CHALLENGES.length)*100}%` }}/>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
              <button onClick={() => {
                setChallenge(null); setReview(null); setTimerOn(false); setSecs(0); setHints(0); setDetected(new Set()); setRightOpen(false);
                if (api) api.updateScene({ elements: [] });
              }}
                className={`w-full text-left px-3 py-2 rounded border-2 transition-all ${
                  !challenge ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-background'}`}>
                <div className="flex items-center gap-2">
                  <span>🎨</span>
                  <div><div className="font-bold text-xs">Free Design</div><div className="text-[9px] opacity-40">Open whiteboard</div></div>
                </div>
              </button>

              {['L4','L5','L6'].map(lv => {
                const chs = SYSTEM_DESIGN_CHALLENGES.filter(c => c.difficulty === lv);
                if (!chs.length) return null;
                return (
                  <div key={lv}>
                    <div className="flex items-center gap-1.5 px-2 pt-3 pb-1">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 border-2 rounded ${DIFF_STYLE[lv]}`}>{lv}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-30">{DIFF_LABEL[lv]}</span>
                    </div>
                    {chs.map(ch => {
                      const comp = done[ch.id], active = challenge?.id === ch.id;
                      return (
                        <button key={ch.id} onClick={() => pickChallenge(ch)}
                          className={`w-full text-left px-3 py-2 rounded border-2 transition-all ${
                            active ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-background'}`}>
                          <div className="flex items-center gap-1.5">
                            {comp ? <Award size={12} className="text-success shrink-0"/> : <Circle size={12} className="opacity-15 shrink-0"/>}
                            <span className="font-bold text-[11px] leading-tight flex-1">{ch.title}</span>
                            {comp && <span className={`text-[9px] font-black ${GRADE_COLOR[comp.grade]||''}`}>{comp.grade}</span>}
                          </div>
                          <div className="flex items-center gap-2 pl-[18px] mt-0.5">
                            <span className="text-[9px] opacity-30 flex items-center gap-0.5"><Clock size={8}/>{ch.estimatedMinutes}m</span>
                            <span className="text-[9px] px-1 border border-border/40 rounded opacity-30">{ch.category}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CENTER: Excalidraw */}
        <div className="flex-1 relative min-w-0" style={{ background: bg }} ref={canvasRef}>
          <Suspense fallback={
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-center">
                <Activity className="w-8 h-8 animate-spin mx-auto mb-2 text-primary"/>
                <p className="font-black uppercase tracking-widest text-xs">Loading Canvas...</p>
              </div>
            </div>
          }>
            <div className="absolute inset-0">
              <ExcalidrawWrapper
                excalidrawAPI={a => setApi(a)}
                theme={theme}
                initialData={{
                  appState: { viewBackgroundColor: bg, currentItemFontFamily: 1, openSidebar: null },
                  libraryItems: [],
                }}
              />
            </div>
          </Suspense>

          {/* Detection badge */}
          {challenge && detected.size > 0 && (
            <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1.5 bg-success text-surface border-2 border-text rounded font-bold text-[10px] shadow-brutal-sm flex items-center gap-1.5 pointer-events-none">
              <CheckCircle size={12}/> {detected.size}/{challenge.keyComponents.length} found
            </div>
          )}

          {/* Getting started overlay for challenges */}
          {challenge && !review && detected.size === 0 && secs < 5 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div className="bg-surface/95 backdrop-blur-sm border-4 border-text shadow-brutal rounded-xl p-6 max-w-sm text-center pointer-events-auto animate-fade-in">
                <h3 className="font-black text-lg uppercase tracking-wider mb-2">{challenge.title}</h3>
                <p className="text-xs opacity-60 mb-4 leading-relaxed">
                  Use the toolbar above to draw rectangles, text labels, and arrows.
                  Label each component (e.g. "Load Balancer", "Database").
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {challenge.keyComponents.slice(0, 5).map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-primary/15 border-2 border-primary/30 rounded font-bold">{c}</span>
                  ))}
                  {challenge.keyComponents.length > 5 && (
                    <span className="text-[10px] px-2 py-0.5 bg-background border-2 border-border rounded font-bold opacity-50">+{challenge.keyComponents.length - 5} more</span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-primary">Start drawing — this overlay disappears automatically</p>
              </div>
            </div>
          )}

          {/* Free design hint */}
          {!challenge && !review && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 bg-surface/80 backdrop-blur border-2 border-border rounded text-[10px] font-bold opacity-50 pointer-events-none">
              Pick a challenge or draw freely → click AI Review
            </div>
          )}
        </div>

        {/* RIGHT: Info panel */}
        {rightOpen && (
          <div className="w-[300px] shrink-0 border-l-4 border-border bg-surface flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b-2 border-border shrink-0 bg-background/20">
              {challenge && <>
                <button onClick={() => setTab('req')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 ${
                    tab==='req' ? 'border-primary text-primary bg-surface' : 'border-transparent opacity-40 hover:opacity-80'}`}>
                  Requirements
                </button>
                <button onClick={() => setTab('eval')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 ${
                    tab==='eval' ? 'border-primary text-primary bg-surface' : 'border-transparent opacity-40 hover:opacity-80'}`}>
                  Eval Guide
                </button>
              </>}
              {(review || analyzing) && (
                <button onClick={() => setTab('review')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-1 ${
                    tab==='review' ? 'border-primary text-primary bg-surface' : 'border-transparent opacity-40 hover:opacity-80'}`}>
                  <Sparkles size={9}/> Review
                </button>
              )}
              <button onClick={() => setRightOpen(false)} className="px-2 opacity-20 hover:opacity-100 hover:bg-danger hover:text-surface transition-all">
                <X size={12}/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* ── REQUIREMENTS ─────────────────── */}
              {tab === 'req' && challenge && <>
                <div className="pb-2 border-b-2 border-border">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 border-2 rounded ${DIFF_STYLE[challenge.difficulty]}`}>{challenge.difficulty}</span>
                    <span className="text-[9px] px-1 border border-border rounded font-bold opacity-50">{challenge.category}</span>
                  </div>
                  <h3 className="font-black text-sm leading-tight">{challenge.title}</h3>
                  <p className="text-[11px] opacity-60 mt-1 leading-relaxed">{challenge.description}</p>
                </div>

                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest mb-1.5 text-success flex items-center gap-1"><CheckCircle size={10}/> Functional</h4>
                  <ul className="space-y-1">
                    {challenge.requirements.map((r,i) => (
                      <li key={i} className="text-[11px] flex gap-1.5 leading-relaxed"><ChevronRight size={9} className="text-success mt-0.5 shrink-0 opacity-40"/>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest mb-1.5 text-warning flex items-center gap-1"><Shield size={10}/> Non-Functional</h4>
                  <ul className="space-y-1">
                    {challenge.nonFunctional.map((r,i) => (
                      <li key={i} className="text-[11px] flex gap-1.5 leading-relaxed"><ChevronRight size={9} className="text-warning mt-0.5 shrink-0 opacity-40"/>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest mb-1.5 text-primary flex items-center gap-1">
                    <Gauge size={10}/> Components
                    <span className="ml-auto text-text opacity-30">{detected.size}/{challenge.keyComponents.length}</span>
                  </h4>
                  <div className="space-y-0.5">
                    {challenge.keyComponents.map((c,i) => {
                      const ok = detected.has(c);
                      return (
                        <div key={i} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          ok ? 'bg-success/10 text-success' : 'bg-background opacity-50'}`}>
                          {ok ? <CheckCircle size={10}/> : <Circle size={10} className="opacity-25"/>}
                          <span className={ok ? 'line-through' : ''}>{c}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest mb-1.5 text-warning flex items-center gap-1">
                    <Lightbulb size={10}/> Hints
                    <span className="ml-auto text-text opacity-30">{hints}/{challenge.hints.length}</span>
                  </h4>
                  {challenge.hints.slice(0, hints).map((h,i) => (
                    <div key={i} className="text-[10px] p-2 bg-warning/5 border border-warning/15 rounded mb-1.5 leading-relaxed">
                      <span className="font-black text-warning">#{i+1}</span> {h}
                    </div>
                  ))}
                  {hints < challenge.hints.length && (
                    <button onClick={() => setHints(h => h+1)}
                      className="w-full text-[10px] font-bold py-1.5 border-2 border-dashed border-warning/25 rounded text-warning hover:bg-warning/5 transition-all flex items-center justify-center gap-1">
                      <Lock size={9}/> Reveal Hint {hints+1}
                    </button>
                  )}
                </div>
              </>}

              {/* ── EVAL GUIDE ───────────────────── */}
              {tab === 'eval' && challenge?.evaluationCriteria && <>
                <div className="p-2.5 bg-primary/5 border-2 border-primary/15 rounded">
                  <h3 className="text-[10px] font-black uppercase tracking-wider mb-0.5 flex items-center gap-1"><Award size={10} className="text-primary"/> Interviewer Rubric</h3>
                  <p className="text-[9px] opacity-50">How a FAANG interviewer would score this design.</p>
                </div>
                {Object.entries(challenge.evaluationCriteria).map(([k, desc]) => {
                  const cfg = { scalability: { I: ArrowRightLeft, c: 'text-primary', b: 'border-primary/15' },
                    availability: { I: Shield, c: 'text-success', b: 'border-success/15' },
                    consistency: { I: Lock, c: 'text-warning', b: 'border-warning/15' },
                    performance: { I: Zap, c: 'text-danger', b: 'border-danger/15' }
                  }[k] || { I: Target, c: 'text-text', b: 'border-border' };
                  return (
                    <div key={k} className={`p-2.5 rounded border-2 ${cfg.b} bg-background/30`}>
                      <div className="flex items-center gap-1.5 mb-1"><cfg.I size={12} className={cfg.c}/><span className="text-[10px] font-black uppercase tracking-wider capitalize">{k}</span></div>
                      <p className="text-[10px] leading-relaxed opacity-65">{desc}</p>
                    </div>
                  );
                })}
                <div className="p-2.5 bg-background border-2 border-border rounded">
                  <p className="text-[10px] font-bold opacity-50">💡 Start with requirements → high-level design → deep dive. Always discuss trade-offs.</p>
                </div>
              </>}

              {/* ── AI REVIEW ────────────────────── */}
              {tab === 'review' && analyzing && (
                <div className="text-center py-12">
                  <Activity className="w-8 h-8 animate-spin mx-auto mb-2 text-primary"/>
                  <p className="font-black text-xs uppercase tracking-wider">Analyzing...</p>
                </div>
              )}

              {tab === 'review' && !analyzing && review && <>
                <div className="text-center py-2">
                  {review.grade && <div className={`text-4xl font-black mb-0.5 ${GRADE_COLOR[review.grade]||''}`}>{review.grade}</div>}
                  <ScoreRing score={review.overallScore} size={64} sw={6} label="Overall"/>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <ScoreRing score={review.scores.componentCoverage} size={44} sw={4} label="Cover"/>
                  <ScoreRing score={review.scores.scalability} size={44} sw={4} label="Scale"/>
                  <ScoreRing score={review.scores.availability} size={44} sw={4} label="Uptime"/>
                  <ScoreRing score={review.scores.dataFlow} size={44} sw={4} label="Flow"/>
                  {review.scores.consistency !== undefined && <ScoreRing score={review.scores.consistency} size={44} sw={4} label="Consist."/>}
                </div>

                <div className="p-2.5 bg-background border-2 border-border rounded">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles size={10} className="text-primary"/>
                    <span className="text-[9px] font-black uppercase tracking-wider">Critique</span>
                    <span className="text-[8px] px-1 bg-primary/10 border border-primary/15 rounded font-bold ml-auto capitalize">{review.source}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed">{review.aiCritique}</p>
                </div>

                {review.foundComponents?.length > 0 && <div>
                  <h3 className="text-[9px] font-black uppercase tracking-wider mb-1 text-success flex items-center gap-1"><CheckCircle size={9}/> Found ({review.foundComponents.length})</h3>
                  <div className="flex flex-wrap gap-0.5">{review.foundComponents.map((c,i) =>
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-success/10 border border-success/25 rounded-full font-bold capitalize">{c}</span>
                  )}</div>
                </div>}

                {review.missingComponents?.length > 0 && <div>
                  <h3 className="text-[9px] font-black uppercase tracking-wider mb-1 text-danger flex items-center gap-1"><AlertTriangle size={9}/> Missing ({review.missingComponents.length})</h3>
                  <div className="flex flex-wrap gap-0.5">{review.missingComponents.map((c,i) =>
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-danger/10 border border-danger/25 rounded-full font-bold capitalize">{c}</span>
                  )}</div>
                </div>}

                {review.suggestions?.length > 0 && <div>
                  <h3 className="text-[9px] font-black uppercase tracking-wider mb-1 text-warning flex items-center gap-1"><Lightbulb size={9}/> Suggestions</h3>
                  <ul className="space-y-1">{review.suggestions.map((s,i) =>
                    <li key={i} className="text-[10px] leading-relaxed flex gap-1.5 p-1.5 bg-warning/5 border border-warning/10 rounded">
                      <span className="text-warning font-bold shrink-0">→</span>{s}</li>
                  )}</ul>
                </div>}

                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t-2 border-border">
                  {[['Shapes', review.stats?.componentCount], ['Arrows', review.stats?.connectionCount], ['Labels', review.stats?.textLabels]].map(([l,v]) => (
                    <div key={l} className="text-center p-1.5 bg-background rounded">
                      <div className="text-sm font-black">{v||0}</div>
                      <div className="text-[8px] opacity-40 uppercase font-bold">{l}</div>
                    </div>
                  ))}
                </div>
              </>}

              {tab === 'review' && !analyzing && !review && (
                <div className="text-center py-12 opacity-40">
                  <Sparkles size={28} className="mx-auto mb-2 text-primary"/>
                  <p className="font-bold text-xs">No review yet</p>
                  <p className="text-[10px] mt-1">Draw and click AI Review.</p>
                </div>
              )}

              {!challenge && tab !== 'review' && (
                <div className="text-center py-12 opacity-40">
                  <BookOpen size={28} className="mx-auto mb-2 text-primary"/>
                  <p className="font-bold text-xs">Select a Challenge</p>
                  <p className="text-[10px] mt-1">Pick one from the left panel.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Load Modal ──────────────────────────────── */}
      {loadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLoadModal(false)}>
          <div className="bg-surface border-4 border-text shadow-brutal-lg rounded-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b-4 border-text bg-background">
              <h3 className="font-black text-base uppercase tracking-widest flex items-center gap-2"><FolderOpen size={16} className="text-primary"/> Load</h3>
              <button onClick={() => setLoadModal(false)} className="p-1 hover:bg-danger hover:text-surface rounded transition-colors"><X size={18}/></button>
            </div>
            <div className="p-3 max-h-72 overflow-y-auto space-y-1.5">
              {saves.length === 0 ? (
                <div className="text-center py-8 opacity-40">
                  <p className="font-bold text-sm">No cloud saves</p>
                  <button onClick={() => { loadLocal(); setLoadModal(false); }}
                    className="mt-3 px-3 py-1.5 border-2 border-border rounded hover:bg-primary font-bold text-xs transition-all">Load Local</button>
                </div>
              ) : saves.map(s => (
                <div key={s._id} className="flex items-center gap-1.5 group">
                  <button onClick={() => applyLoad(s)} className="flex-1 text-left px-3 py-2.5 border-2 border-border rounded hover:border-primary hover:bg-background transition-all">
                    <div className="font-bold text-xs">{s.name}</div>
                    <div className="text-[9px] opacity-30 mt-0.5">{new Date(s.updatedAt).toLocaleDateString()} · {s.elements?.length||0} els</div>
                  </button>
                  <button onClick={() => delSave(s._id)} className="p-1.5 border-2 border-transparent rounded hover:border-danger hover:bg-danger hover:text-surface transition-all opacity-0 group-hover:opacity-100" title="Delete">
                    <Trash2 size={12}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
