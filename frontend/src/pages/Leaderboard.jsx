import React, { useState, useEffect } from "react";
import { Trophy, Medal, Hexagon, Crown, Target, Flame } from "lucide-react";
import API_BASE from "../config/api";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("xp");

  useEffect(() => {
    fetch(`${API_BASE}/api/leaderboard`)
      .then((res) => res.json())
      .then((data) => {
        setLeaders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getSortedLeaders = () => {
    let sorted = [...leaders];
    if (sortBy === "xp") {
      sorted.sort((a, b) => b.xp - a.xp);
    } else if (sortBy === "problems") {
      sorted.sort((a, b) => b.problems - a.problems);
    } else if (sortBy === "streak") {
      sorted.sort((a, b) => b.streak - a.streak);
    }
    return sorted;
  };

  const sortedLeaders = getSortedLeaders();

  if (loading) {
    return (
      <div className="p-8 text-text font-bold uppercase tracking-wider animate-pulse">
        Loading Global Rankings...
      </div>
    );
  }

  const getRankStyle = (displayRank) => {
    if (displayRank === 1)
      return "bg-primary border border-border text-text shadow-card translate-y-[-2px]";
    if (displayRank === 2)
      return "bg-background border border-border text-text shadow-card translate-y-[-1px]";
    if (displayRank === 3)
      return "bg-warning border border-border text-text shadow-card translate-y-[-1px]";
    return "bg-surface border border-border text-text shadow-soft";
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case "AlgoNova Elite":
        return <Crown size={20} className="text-text" />;
      case "Diamond":
        return <Hexagon size={20} className="text-text" />;
      case "Gold":
        return <Medal size={20} className="text-text" />;
      case "Silver":
        return <Medal size={20} className="text-text" />;
      default:
        return <Trophy size={20} className="text-text" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto pr-4 text-text">
      <div className="flex flex-col items-center justify-center py-12 mb-8 border border-border bg-primary shadow-[8px_8px_0px_#111]">
        <div className="bg-surface border border-border p-4 rounded-none shadow-card mb-6">
          <Trophy size={56} className="text-text" />
        </div>
        <h2 className="text-5xl font-bold font-geist uppercase tracking-widest text-text">
          Global Arena
        </h2>
        <p className="text-text font-bold text-sm mt-4 bg-surface px-4 py-1 border border-border shadow-soft">
          TOP 100 HACKERS ALL-TIME
        </p>
      </div>

      <div className="max-w-5xl mx-auto mb-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setSortBy("xp")}
          className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-wider border border-border transition-all ${
            sortBy === "xp" ? "bg-text text-surface shadow-card -translate-y-1" : "bg-surface text-text hover:bg-primary shadow-soft"
          }`}
        >
          <Trophy size={20} /> Total XP
        </button>
        <button
          onClick={() => setSortBy("problems")}
          className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-wider border border-border transition-all ${
            sortBy === "problems" ? "bg-text text-surface shadow-card -translate-y-1" : "bg-surface text-text hover:bg-primary shadow-soft"
          }`}
        >
          <Target size={20} /> Problems Solved
        </button>
        <button
          onClick={() => setSortBy("streak")}
          className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-wider border border-border transition-all ${
            sortBy === "streak" ? "bg-text text-surface shadow-card -translate-y-1" : "bg-surface text-text hover:bg-primary shadow-soft"
          }`}
        >
          <Flame size={20} /> Active Streak
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-surface border border-border p-4 md:p-8 shadow-[8px_8px_0px_#111] mb-12">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-sm font-bold uppercase tracking-widest text-text bg-background mb-6 shadow-soft">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-5">Operator ID</div>
          <div className="col-span-2 text-right">Value</div>
          <div className="col-span-3 text-right hidden sm:block">Tier</div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {sortedLeaders.map((leader, index) => {
            const displayRank = index + 1;
            return (
              <div
                key={leader.id}
                className={`grid grid-cols-12 gap-4 p-4 items-center transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] ${getRankStyle(displayRank)}`}
              >
                <div className="col-span-2 text-center font-geist font-bold text-2xl">
                  #{displayRank}
                </div>
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface border border-border flex items-center justify-center shadow-soft">
                    <span className="text-sm font-bold uppercase text-text">
                      {leader.identity.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-text uppercase tracking-wide">
                      {leader.identity}
                    </p>
                    <p className="text-xs font-bold text-text/80 hidden sm:block mt-1">
                      🔥 {leader.streak} DAY STREAK | 💻 {leader.problems} SOLVED
                    </p>
                  </div>
                </div>
                <div className="col-span-2 text-right font-geist font-bold text-xl text-text">
                  {sortBy === "xp" && `${leader.xp.toLocaleString()} XP`}
                  {sortBy === "problems" && `${leader.problems} Problems`}
                  {sortBy === "streak" && `${leader.streak} Days`}
                </div>
                <div className="col-span-3 hidden sm:flex items-center justify-end gap-3 font-bold uppercase tracking-wider text-sm text-text">
                  <div className="bg-surface p-1 border border-border shadow-soft">
                    {getTierIcon(leader.tier)}
                  </div>
                  <span className="truncate">{leader.tier}</span>
                </div>
              </div>
            );
          })}

          {leaders.length === 0 && (
            <div className="p-8 text-center text-text font-bold uppercase tracking-wider bg-warning border border-border shadow-card">
              No signal found. Be the first to execute code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
