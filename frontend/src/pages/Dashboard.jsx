import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Activity,
  Code,
  Target,
  Zap,
  BookOpen,
  BarChart3,
  Mic,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import SkillHeatmap from "../components/SkillHeatmap";
import AdaptiveLearning from "../components/AdaptiveLearning";
import API_BASE from "../config/api";

function AnimatedCounter({ end, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

function RadarChart({ data }) {
  const cx = 150,
    cy = 150,
    maxR = 105;
  const n = data.length;

  const getPoint = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (val / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridLevels = [25, 50, 75, 100];

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full max-w-[300px]">
      {/* Grid */}
      {gridLevels.map((level) => {
        const points = data.map((_, i) => getPoint(i, level));
        return (
          <polygon
            key={level}
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#111111"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Axis lines */}
      {data.map((_, i) => {
        const p = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#111111"
            strokeWidth="2"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={data
          .map((d, i) => {
            const p = getPoint(i, d.value);
            return `${p.x},${p.y}`;
          })
          .join(" ")}
        fill="rgba(255, 214, 0, 0.4)"
        stroke="#111111"
        strokeWidth="4"
      />

      {/* Data points */}
      {data.map((d, i) => {
        const p = getPoint(i, d.value);
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="6"
              fill="#FFD600"
              stroke="#111111"
              strokeWidth="3"
            />
          </g>
        );
      })}

      {/* Labels */}
      {data.map((d, i) => {
        const p = getPoint(i, 125);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#111111"
            fontSize="12"
            fontWeight="bold"
            fontFamily="Geist, sans-serif"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const { token } = useContext(AuthContext);

  const interviewHistory = JSON.parse(
    localStorage.getItem("interview_history") || "[]",
  );
  const avgThinkingTime =
    interviewHistory.length > 0
      ? Math.round(
          interviewHistory.reduce(
            (acc, curr) => acc + (curr.thinkingTime || 0),
            0,
          ) /
            interviewHistory.length /
            1000,
        )
      : 0;

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => console.log("Progress fetch failed, using defaults"));
  }, [token]);

  const problemsSolved = userData?.progress?.problemsSolved || 0;
  const totalProblems = 8;
  const codingScore = Math.min(
    100,
    Math.round((problemsSolved / totalProblems) * 100),
  );

  const quizScores = userData?.progress?.quizScores;
  let avgQuizScore = 0;
  if (quizScores) {
    const vals =
      typeof quizScores === "object" ? Object.values(quizScores) : [];
    if (vals.length > 0)
      avgQuizScore = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }

  const voiceScores = userData?.progress?.voiceScores || [];
  let avgVoiceScore = 0;
  if (voiceScores.length > 0) {
    avgVoiceScore = Math.round(
      voiceScores.reduce((a, b) => a + (b.score || 0), 0) / voiceScores.length,
    );
  }

  const stats = [
    {
      label: "Placement Ready",
      value: userData?.progress?.placementReadiness || 0,
      suffix: "%",
      icon: <Target className="w-8 h-8 text-surface" />,
      color: "bg-primary text-surface",
    },
    {
      label: "Problems Solved",
      value: problemsSolved,
      suffix: `/${totalProblems}`,
      icon: <Code className="w-8 h-8 text-surface" />,
      color: "bg-text text-surface",
    },
    {
      label: "Quiz Accuracy",
      value: avgQuizScore,
      suffix: "%",
      icon: <Activity className="w-8 h-8 text-surface" />,
      color: "bg-success text-surface",
    },
    {
      label: "Current Streak",
      value: userData?.gamification?.streak?.current || 0,
      suffix: " Days",
      icon: <Zap className="w-8 h-8 text-surface" />,
      color: "bg-warning text-surface",
    },
    {
      label: "Avg Thinking Time",
      value: avgThinkingTime,
      suffix: "s",
      icon: <BarChart3 className="w-8 h-8 text-surface" />,
      color: "bg-danger text-surface",
    },
  ];

  const radarData = [
    { label: "CODING", value: codingScore },
    { label: "LOGIC", value: avgQuizScore },
    { label: "COMM", value: avgVoiceScore },
    {
      label: "SPEED",
      value: avgThinkingTime > 0 ? Math.max(0, 100 - avgThinkingTime) : 0,
    },
    { label: "DSA", value: Math.round((codingScore + avgQuizScore) / 2) },
    { label: "READY", value: userData?.progress?.placementReadiness || 0 },
  ];

  const activities =
    userData?.progress?.recentActivity?.map((act) => ({
      text: act.text,
      time: act.time ? new Date(act.time).toLocaleString() : "Recently",
      type:
        act.type === "problem"
          ? "success"
          : act.type === "quiz"
            ? "info"
            : act.type === "system"
              ? "warning"
              : "info",
      icon:
        act.type === "problem" ? Code : act.type === "quiz" ? BookOpen : Mic,
    })) || [];

  return (
    <div className="space-y-8 pb-12">
      <h2 className="text-4xl font-geist font-bold uppercase tracking-tight">
        Dashboard
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`brutal-card ${stat.color} p-6 flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-bold uppercase tracking-wider opacity-90">
                {stat.label}
              </p>
              {stat.icon}
            </div>
            <div>
              <p className="text-4xl font-geist font-bold">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 brutal-card bg-surface p-8">
          <h3 className="text-2xl font-bold mb-6 font-geist uppercase flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" /> Activity Log
          </h3>
          <ul className="space-y-4">
            {activities.map((act, i) => {
              const Icon = act.icon;
              return (
                <li
                  key={i}
                  className="flex items-center gap-4 p-4 border-2 border-border rounded-lg bg-background hover:bg-[#E2E8F0] transition-colors"
                >
                  <div className="p-3 bg-primary border-2 border-border rounded-lg shadow-soft">
                    <Icon className="w-6 h-6 text-text" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg">
                      {act.text}
                    </p>
                    <p className="text-sm font-medium opacity-70">{act.time}</p>
                  </div>
                </li>
              );
            })}
            {activities.length === 0 && (
              <li className="p-8 text-center text-lg font-bold border-4 border-dashed border-border rounded-lg bg-background">
                No activity yet. Start coding to log your progress.
              </li>
            )}
          </ul>
        </div>

        {/* Radar Chart & Weak Areas */}
        <div className="brutal-card bg-surface p-8 flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-6 font-geist uppercase w-full text-left">
            Skill Radar
          </h3>
          <RadarChart data={radarData} />

          <div className="w-full mt-8 bg-warning border border-border p-6 rounded-lg shadow-soft">
            <h4 className="text-lg font-geist font-bold mb-3 uppercase flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" /> Alerts
            </h4>
            <ul className="font-medium space-y-2">
              {(userData?.progress?.weakAreas || []).length > 0 ? (
                userData.progress.weakAreas.map((area, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold">→</span>
                    <span>Needs improvement: <strong>{area}</strong> (Below 60%)</span>
                  </li>
                ))
              ) : codingScore === 0 && avgQuizScore === 0 ? (
                <li className="flex items-start gap-2">
                  <span className="font-bold">→</span>
                  No data yet. Complete quizzes to unlock insights.
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <span className="font-bold text-success">✓</span>
                  No weak areas detected!
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Skill Heatmap + Adaptive Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkillHeatmap
          quizScores={
            quizScores ? (typeof quizScores === "object" ? quizScores : {}) : {}
          }
          problemData={{}}
          voiceScores={voiceScores}
        />
        <AdaptiveLearning
          quizScores={
            quizScores ? (typeof quizScores === "object" ? quizScores : {}) : {}
          }
          problemsSolved={problemsSolved}
          voiceScores={voiceScores}
          weakAreas={userData?.progress?.weakAreas || []}
        />
      </div>

      {/* Consistency Tracking */}
      {(() => {
        const history = JSON.parse(
          localStorage.getItem("interview_history") || "[]",
        );
        if (history.length < 2) return null;
        const recent = history.slice(-5);
        const first = recent[0]?.finalScore || 0;
        const last = recent[recent.length - 1]?.finalScore || 0;
        const improvement = last - first;
        return (
          <div className="brutal-card bg-surface p-8">
            <h3 className="font-geist font-bold text-2xl mb-6 uppercase flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" /> Consistency
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 w-full">
                <div className="flex items-end gap-4 mb-4 h-32 border-b-4 border-border pb-2">
                  {recent.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        className={`w-full border border-border border-b-0 rounded-t-lg shadow-soft transition-all
                          ${h.finalScore >= 70 ? "bg-success" : h.finalScore >= 40 ? "bg-warning" : "bg-danger"}`}
                        style={{
                          height: `${Math.max(10, h.finalScore)}%`,
                        }}
                      />
                      <span className="text-sm font-bold mt-2">
                        {h.finalScore}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="font-bold text-lg">
                  {improvement > 0 ? (
                    <span className="text-success flex items-center gap-2">
                      ↑ Improved {improvement} pts over {recent.length} sessions
                    </span>
                  ) : improvement < 0 ? (
                    <span className="text-danger flex items-center gap-2">
                      ↓ Declined {Math.abs(improvement)} pts. Keep practicing!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      → Consistent performance.
                    </span>
                  )}
                </p>
              </div>
              <div className="text-center p-6 bg-primary border border-border rounded-lg shadow-soft min-w-[150px]">
                <p className="font-bold uppercase tracking-wider mb-2">Sessions</p>
                <p className="text-5xl font-bold font-geist">
                  {history.length}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Visualizer",
            to: "/visualize",
            icon: BarChart3,
            color: "bg-surface",
          },
          {
            label: "Practice",
            to: "/practice",
            icon: Code,
            color: "bg-[#E2E8F0]",
          },
          { label: "Learn", to: "/learn", icon: BookOpen, color: "bg-primary" },
          {
            label: "Mock Interview",
            to: "/interview",
            icon: Mic,
            color: "bg-warning",
          },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <Link
              key={i}
              to={action.to}
              className={`brutal-card ${action.color} p-6 flex flex-col justify-between group h-32`}
            >
              <div className="flex justify-between items-start">
                <Icon className="w-8 h-8 text-text" />
                <ArrowRight className="w-6 h-6 text-text opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all" />
              </div>
              <span className="font-bold text-xl font-geist uppercase mt-4">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
