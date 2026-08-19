import React from "react";
import { ArrowRight, TrendingUp, AlertTriangle, Target, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const TOPIC_PROBLEMS = {
  arrays: { path: "/practice", problems: ["Two Sum", "Maximum Subarray", "Binary Search"] },
  trees: { path: "/learn", problems: ["BST Traversal", "Tree Height", "LCA"] },
  graphs: { path: "/practice", problems: ["Number of Islands", "BFS/DFS Practice"] },
  dp: { path: "/learn", problems: ["Climbing Stairs", "Coin Change", "Knapsack"] },
  hashing: { path: "/practice", problems: ["Two Sum (HashMap)", "Group Anagrams"] },
  sorting: { path: "/practice", problems: ["Merge Sort", "Quick Sort"] },
};

export default function AdaptiveLearning({ quizScores = {}, problemsSolved = 0, voiceScores = [], weakAreas = [] }) {
  // Build recommendations from weak areas + quiz scores
  const recommendations = [];

  // From quiz scores — topics < 60% need work
  Object.entries(quizScores).forEach(([topic, score]) => {
    if (score < 60) {
      recommendations.push({
        topic,
        score,
        reason: `Quiz score ${score}% — below mastery threshold`,
        priority: score < 40 ? "critical" : "moderate",
        action: TOPIC_PROBLEMS[topic] || { path: "/learn", problems: [] },
      });
    }
  });

  // From explicit weak areas
  weakAreas.forEach((area) => {
    const areaKey = area.toLowerCase();
    if (!recommendations.find((r) => r.topic === areaKey)) {
      recommendations.push({
        topic: areaKey,
        score: 0,
        reason: `Identified as weak area from past performance`,
        priority: "critical",
        action: TOPIC_PROBLEMS[areaKey] || { path: "/learn", problems: [] },
      });
    }
  });

  // Sort by priority (critical first)
  recommendations.sort((a, b) => (a.priority === "critical" ? -1 : 1));

  // Improvement suggestions based on problem count
  const generalTips = [];
  if (problemsSolved < 3) {
    generalTips.push({ icon: Target, text: "Solve at least 5 problems to unlock pattern insights", color: "text-primary" });
  }
  if (voiceScores.length < 2) {
    generalTips.push({ icon: Target, text: "Complete 2+ voice explanations to calibrate communication score", color: "text-text" });
  }
  if (Object.keys(quizScores).length < 3) {
    generalTips.push({ icon: BookOpen, text: "Take quizzes in more topics to build your skill profile", color: "text-warning" });
  }

  return (
    <div className="bg-surface border border-border p-5 shadow-card">
      <h3 className="font-geist font-bold uppercase text-text text-sm mb-4 flex items-center gap-2 tracking-wider pb-2 border-b border-border">
        <TrendingUp size={18} className="text-primary" /> ADAPTIVE LEARNING
      </h3>

      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.slice(0, 4).map((rec, i) => (
            <div
              key={i}
              className={`p-3 border border-border flex items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-soft transition-all ${
                rec.priority === "critical"
                  ? "bg-danger text-surface"
                  : "bg-warning text-text"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle
                    size={14}
                    className={rec.priority === "critical" ? "text-surface" : "text-text"}
                  />
                  <span className="text-sm font-bold uppercase tracking-wider truncate">{rec.topic}</span>
                  {rec.score > 0 && (
                    <span className="text-[10px] font-bold bg-background text-text px-1 border border-text shadow-inner">{rec.score}%</span>
                  )}
                </div>
                <p className="text-xs font-bold opacity-90 truncate">{rec.reason}</p>
                {rec.action.problems.length > 0 && (
                  <p className="text-xs font-bold uppercase mt-2 bg-background/20 inline-block px-1 border border-text/20">
                    → Try: {rec.action.problems.slice(0, 2).join(", ")}
                  </p>
                )}
              </div>
              <Link
                to={rec.action.path}
                className={`flex-shrink-0 p-2 border border-border transition-all hover:-translate-y-0.5 hover:shadow-soft ${
                  rec.priority === "critical" ? "bg-surface text-text hover:bg-background" : "bg-surface text-text hover:bg-primary"
                }`}
              >
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      ) : generalTips.length > 0 ? (
        <div className="space-y-3">
          {generalTips.map((tip, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-background border border-border hover:-translate-y-0.5 hover:shadow-soft transition-all">
              <tip.icon size={16} className={tip.color} />
              <p className="text-sm font-bold text-text">{tip.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-success border border-border shadow-card">
          <p className="text-surface text-lg font-bold uppercase mb-1 tracking-wider">🎉 All topics on track!</p>
          <p className="text-surface/80 text-xs font-bold font-mono">KEEP PRACTICING TO MAINTAIN YOUR SKILLS</p>
        </div>
      )}
    </div>
  );
}
