import React from "react";
import { AlertTriangle, CheckCircle, Lightbulb, Zap, Bug } from "lucide-react";

export default function CodeReviewPanel({ reviewData }) {
  if (!reviewData) return null;

  const { code_score, time_complexity, space_complexity, is_optimal, issues = [], strengths = [] } = reviewData;

  return (
    <div className="bg-background border border-border p-5 space-y-4 shadow-card animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h4 className="font-geist text-sm font-bold uppercase tracking-widest text-text flex items-center gap-2">
          <Bug size={16} /> CODE REVIEW AI
        </h4>
        <span className={`text-xs font-bold px-3 py-1 border border-border shadow-soft ${
          code_score >= 70 ? "text-surface bg-success"
          : code_score >= 40 ? "text-text bg-warning"
          : "text-surface bg-danger"
        }`}>
          Score: {code_score}/100
        </span>
      </div>

      {/* Complexity Analysis */}
      <div className="flex gap-3">
        <div className="flex-1 bg-surface border border-border p-3 shadow-soft hover:-translate-y-0.5 transition-all">
          <p className="text-[10px] text-text/70 font-bold uppercase tracking-wider">Time</p>
          <p className="text-sm font-bold text-text font-mono mt-1">{time_complexity || "—"}</p>
        </div>
        <div className="flex-1 bg-surface border border-border p-3 shadow-soft hover:-translate-y-0.5 transition-all">
          <p className="text-[10px] text-text/70 font-bold uppercase tracking-wider">Space</p>
          <p className="text-sm font-bold text-text font-mono mt-1">{space_complexity || "—"}</p>
        </div>
        <div className="flex-1 bg-surface border border-border p-3 shadow-soft hover:-translate-y-0.5 transition-all">
          <p className="text-[10px] text-text/70 font-bold uppercase tracking-wider">Optimal?</p>
          <p className={`text-sm font-bold mt-1 ${is_optimal ? "text-success" : "text-danger"}`}>
            {is_optimal ? "✓ YES" : "✗ NO"}
          </p>
        </div>
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-xs text-text bg-danger text-surface px-2 py-1 inline-flex border border-border shadow-soft font-bold uppercase tracking-wider items-center gap-2">
            <AlertTriangle size={12} /> Issues Found
          </p>
          {issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-bold text-text bg-surface border border-border p-3 shadow-soft">
              <span className="text-danger mt-0.5">▪</span>
              <span>{issue}</span>
            </div>
          ))}
        </div>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-xs text-text bg-success text-surface px-2 py-1 inline-flex border border-border shadow-soft font-bold uppercase tracking-wider items-center gap-2">
            <CheckCircle size={12} /> Strengths
          </p>
          {strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-bold text-text bg-surface border border-border p-3 shadow-soft">
              <span className="text-success mt-0.5">✓</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Optimization hint */}
      {!is_optimal && (
        <div className="flex items-start gap-3 p-4 bg-primary border border-border shadow-card mt-4">
          <Lightbulb size={18} className="text-text flex-shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-text leading-relaxed">
            <strong className="text-text font-bold uppercase tracking-wide border-b border-border mr-1">Optimization Tip:</strong> Your solution works but isn't optimal. Consider a more efficient approach to reduce the complexity.
          </p>
        </div>
      )}
    </div>
  );
}
