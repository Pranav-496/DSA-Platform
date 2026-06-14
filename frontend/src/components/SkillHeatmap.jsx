import React from "react";

const TOPICS = [
  { key: "arrays", label: "Arrays" },
  { key: "trees", label: "Trees" },
  { key: "graphs", label: "Graphs" },
  { key: "dp", label: "DP" },
  { key: "hashing", label: "Hashing" },
  { key: "sorting", label: "Sorting" },
  { key: "linkedlist", label: "Linked List" },
  { key: "stack", label: "Stack/Queue" },
];

function getColor(val) {
  if (val >= 80) return "bg-success border-text text-surface";
  if (val >= 60) return "bg-success/70 border-text text-surface";
  if (val >= 40) return "bg-warning border-text text-text";
  if (val >= 20) return "bg-warning/70 border-text text-text";
  if (val > 0) return "bg-danger border-text text-surface";
  return "bg-background border-text text-text/50";
}

function getTextColor(val) {
  if (val >= 80) return "text-surface";
  if (val >= 60) return "text-surface";
  if (val >= 40) return "text-text";
  if (val >= 20) return "text-text";
  if (val > 0) return "text-surface";
  return "text-text/50";
}

export default function SkillHeatmap({ quizScores = {}, problemData = {}, voiceScores = [] }) {
  // Calculate mastery per topic from quiz scores, problem tags, and voice scores
  const topicMastery = TOPICS.map(({ key, label }) => {
    let score = 0;
    let sources = 0;

    // Quiz score for this topic
    const qScore = quizScores[key];
    if (qScore !== undefined && qScore !== null) {
      score += qScore;
      sources++;
    }

    // Voice scores matching this topic
    const matchingVoice = voiceScores.filter(
      (v) => v.topic && v.topic.toLowerCase().includes(key.toLowerCase())
    );
    if (matchingVoice.length > 0) {
      const avgVoice = matchingVoice.reduce((a, b) => a + (b.score || 0), 0) / matchingVoice.length;
      score += avgVoice;
      sources++;
    }

    // Problem solving data
    const pScore = problemData[key];
    if (pScore !== undefined) {
      score += pScore;
      sources++;
    }

    const mastery = sources > 0 ? Math.round(score / sources) : 0;
    return { key, label, mastery };
  });

  return (
    <div className="bg-surface border-4 border-text p-6 shadow-[4px_4px_0px_#111]">
      <h3 className="font-geist font-black uppercase text-text text-sm mb-6 flex items-center gap-3 tracking-widest border-b-4 border-text pb-2">
        <span className="w-4 h-4 bg-text border-2 border-text shadow-[2px_2px_0px_#111]" /> SKILL HEATMAP
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {topicMastery.map(({ key, label, mastery }) => (
          <div
            key={key}
            className={`relative p-4 border-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#111] ${getColor(mastery)}`}
            title={`${label}: ${mastery}%`}
          >
            <p className="text-xs font-black uppercase tracking-wider mb-2 truncate">{label}</p>
            <p className={`text-2xl font-black font-geist ${getTextColor(mastery)}`}>
              {mastery}%
            </p>
            <div className="mt-3 w-full bg-background border-2 border-text h-2 overflow-hidden shadow-inner">
              <div
                className={`h-full border-r-2 border-text transition-all duration-700 ${mastery >= 60 ? "bg-text" : mastery >= 30 ? "bg-text" : "bg-text"}`}
                style={{ width: `${mastery}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 text-xs font-bold text-text uppercase tracking-wider">
        <span className="flex items-center gap-2"><span className="w-4 h-4 bg-success border-2 border-text shadow-[2px_2px_0px_#111]" /> 80%+</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 bg-warning border-2 border-text shadow-[2px_2px_0px_#111]" /> 40-79%</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 bg-danger border-2 border-text shadow-[2px_2px_0px_#111]" /> 1-39%</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 bg-background border-2 border-text shadow-[2px_2px_0px_#111]" /> No data</span>
      </div>
    </div>
  );
}
