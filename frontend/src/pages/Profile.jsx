import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Trophy,
  TrendingUp,
  Cpu,
  Activity,
  Flame,
  Medal,
  Award,
  LogOut,
  AlertTriangle,
  Edit2,
  Check,
  X,
  Link as LinkIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import API_BASE from "../config/api";

export default function Profile() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "", website: "" });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.ok ? await res.json() : null;
        setProfileData(data);
        if (data?.user) {
          setEditForm({
            name: data.user.name || user?.name || "",
            bio: data.user.bio || "",
            website: data.user.website || ""
          });
        } else {
          setEditForm(prev => ({ ...prev, name: user?.name || "" }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/profile/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response from server:", text);
        data = { error: `Server returned non-JSON response (Status: ${res.status})` };
      }
      
      if (res.ok) {
        // Merge with existing user data to ensure we don't lose the email
        setProfileData(prev => ({ 
          ...prev, 
          user: { ...prev.user, ...data.user } 
        }));
        setIsEditing(false);
        if (data.user && data.user.name) {
          localStorage.setItem("algonova_name", data.user.name);
        }
      } else {
        alert(data.error || data.message || `Failed to save profile (Status: ${res.status}). Please try again.`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Could not reach the server to save profile. Is the backend running?");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-text font-bold font-geist text-xl uppercase animate-pulse">
        Loading Profile...
      </div>
    );
  }

  const stats = profileData?.progress || {
    problemsSolved: 0,
    placementReadiness: 0,
    accuracy: 100,
    weakAreas: ["No Data"],
  };

  const gamify = profileData?.gamification || {
    xp: 0,
    rankTier: "Bronze",
    streak: { current: 0 },
    badges: [],
  };

  const userInfo = profileData?.user || { name: user?.name, bio: "", website: "", email: user?.email };

  return (
    <div className="text-text h-full">
      <div className="flex flex-col md:flex-row justify-between md:items-start mb-8 gap-4">
        {isEditing ? (
          <div className="flex-1 max-w-xl brutal-card bg-surface p-6 shadow-[4px_4px_0px_#111]">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1">Display Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-background border-4 border-text px-3 py-2 font-bold focus:outline-none focus:ring-4 focus:ring-primary shadow-brutal-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  rows={2}
                  className="w-full bg-background border-4 border-text px-3 py-2 font-medium focus:outline-none focus:ring-4 focus:ring-primary shadow-brutal-sm resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1">Portfolio / LeetCode Link</label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                  className="w-full bg-background border-4 border-text px-3 py-2 font-mono text-sm focus:outline-none focus:ring-4 focus:ring-primary shadow-brutal-sm"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSaveProfile} className="brutal-btn bg-success text-surface flex items-center justify-center gap-2 py-2 flex-1">
                  <Check size={18} /> Save Profile
                </button>
                <button onClick={() => setIsEditing(false)} className="brutal-btn-secondary bg-danger text-surface flex items-center justify-center py-2 px-4">
                  <X size={18} /> Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-black font-geist uppercase tracking-tight">
                {userInfo.name ? `${userInfo.name}` : "Operator"}
              </h2>
              <button onClick={() => setIsEditing(true)} className="p-2 border-4 border-transparent hover:border-text hover:bg-surface rounded transition-all text-text/50 hover:text-text shadow-none" title="Edit Profile">
                <Edit2 size={20} />
              </button>
            </div>
            <p className="text-text/70 font-bold uppercase tracking-wider text-sm mt-1">
              ID: {user?.id?.substring(0, 8)}... | {userInfo.email || user?.email}
            </p>
            {userInfo.bio && (
              <p className="mt-3 font-medium text-lg max-w-2xl border-l-4 border-primary pl-4">{userInfo.bio}</p>
            )}
            {userInfo.website && (
              <a href={userInfo.website.startsWith('http') ? userInfo.website : `https://${userInfo.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-3 text-sm font-bold bg-surface border-2 border-text px-3 py-1 shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#111] transition-all">
                <LinkIcon size={14} /> {userInfo.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        )}

        <div className="flex items-start self-start pt-2">
          <button
            onClick={handleLogout}
            className="brutal-btn-secondary flex items-center gap-2 bg-danger text-surface border-4 border-text shadow-[2px_2px_0px_#111] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#111]"
          >
            <LogOut size={20} /> Disconnect
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="brutal-card bg-primary text-text p-6 relative overflow-hidden group">
          <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 text-text/10 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-90">
            Global Rank
          </h3>
          <p className="text-4xl font-black font-geist uppercase">
            {gamify.rankTier}
          </p>
          <p className="font-bold mt-2 text-sm">{gamify.xp} Total XP</p>
        </div>

        <div className="brutal-card bg-surface text-text p-6 relative overflow-hidden group">
          <Cpu className="absolute -right-4 -bottom-4 w-32 h-32 text-text/5 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-90">
            Problems Solved
          </h3>
          <p className="text-4xl font-black font-geist">
            {stats.problemsSolved}
          </p>
        </div>

        <div className="brutal-card bg-surface text-text p-6 relative overflow-hidden group">
          <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-text/5 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-90">
            Accuracy Rate
          </h3>
          <p className="text-4xl font-black font-geist">
            {stats.accuracy}%
          </p>
        </div>

        <div className="brutal-card bg-surface text-text p-6 relative overflow-hidden group">
          <Flame className="absolute -right-4 -bottom-4 w-32 h-32 text-text/5 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-90">
            Active Streak
          </h3>
          <p className="text-4xl font-black font-geist">
            {gamify.streak?.current || 0} Days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Achievements / Badges */}
        <div className="brutal-card bg-surface p-8">
          <h3 className="text-2xl font-black uppercase font-geist mb-6 flex items-center gap-3">
            <Medal className="w-8 h-8 text-primary" /> Earned Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {gamify.badges.length === 0 ? (
              <p className="font-bold col-span-3 border-4 border-dashed border-border rounded-lg p-6 text-center">
                No badges yet. Start practicing to earn rewards.
              </p>
            ) : (
              gamify.badges.map((badge, i) => (
                <div
                  key={i}
                  className="bg-background border-4 border-border rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-brutal-sm hover:-translate-y-1 transition-transform"
                >
                  <div
                    className="w-16 h-16 rounded-full bg-primary border-4 border-text flex items-center justify-center mb-3"
                  >
                    <Award className="w-8 h-8 text-text" />
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-tight">
                      {badge.name}
                    </p>
                    <p className="text-xs font-medium mt-1">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Weakness Radar / Suggestions */}
        <div className="brutal-card bg-surface p-8 flex flex-col">
          <h3 className="text-2xl font-black uppercase font-geist mb-6 flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" /> Optimization AI
          </h3>
          <div className="bg-danger text-surface border-4 border-text p-6 rounded-lg shadow-brutal-sm mb-6">
            <p className="font-bold mb-4 flex items-center gap-2 text-lg">
              <AlertTriangle className="w-6 h-6" /> Algorithmic Instability Detected
            </p>
            <ul className="flex flex-wrap gap-3">
              {stats.weakAreas && stats.weakAreas.length > 0 ? (
                stats.weakAreas.map((area, i) => (
                  <li
                    key={i}
                    className="font-black text-sm uppercase tracking-wider bg-surface text-danger px-3 py-1 rounded"
                  >
                    {area}
                  </li>
                ))
              ) : (
                <li className="font-black text-sm uppercase tracking-wider bg-success text-surface px-3 py-1 rounded border-2 border-text">
                  ALL SYSTEMS OPTIMAL
                </li>
              )}
            </ul>
          </div>
          
          <h4 className="font-black uppercase tracking-widest text-sm mb-4">
            Recommended Action
          </h4>
          <div className="bg-background border-4 border-text p-4 rounded-lg flex items-center justify-between shadow-brutal-sm hover:-translate-y-1 transition-transform">
            <div>
              <p className="font-bold uppercase text-lg">
                Graph Traversal (BFS/DFS)
              </p>
              <p className="font-medium text-sm mt-1">
                15 min reading + 2 code executions
              </p>
            </div>
            <button onClick={() => navigate('/learn')} className="brutal-btn py-2 px-6 text-sm">
              Execute
            </button>
          </div>
        </div>
      </div>

      {/* GitHub-style Contribution Heatmap */}
      <div className="brutal-card bg-surface p-8 mb-8 col-span-full">
        <h3 className="text-2xl font-black uppercase font-geist mb-6 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" /> Activity Heatmap
        </h3>
        <div className="overflow-x-auto pb-4">
          <MonthSeparatedHeatmap heatmapObj={profileData?.progress?.activityHeatmap} />
        </div>
      </div>

    </div>
  );
}

// Generate the 365-day array mapping realtime counts from the database
function getRealtimeActivity(heatmapObj) {
  const data = [];
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = (heatmapObj && heatmapObj[dateStr]) ? heatmapObj[dateStr] : 0;
    
    // Scale level out of 4 based on count
    let level = 0;
    if (count > 10) level = 4;
    else if (count > 5) level = 3;
    else if (count > 2) level = 2;
    else if (count > 0) level = 1;
    
    data.push({
      date: dateStr,
      count,
      level
    });
  }
  return data;
}


// Custom Heatmap that separates months visually
export function MonthSeparatedHeatmap({ heatmapObj }) {
  const [selectedYear, setSelectedYear] = useState("Current");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Parse available years from heatmapObj
  const availableYears = ["Current"];
  if (heatmapObj) {
    const yearsSet = new Set(Object.keys(heatmapObj).map(d => d.split('-')[0]));
    const sortedYears = Array.from(yearsSet).sort().reverse();
    availableYears.push(...sortedYears);
  }

  const monthsData = [];
  const today = new Date();
  
  // Determine which months to render
  const targetMonths = [];
  if (selectedYear === "Current") {
    for (let i = 11; i >= 0; i--) {
      targetMonths.push(new Date(today.getFullYear(), today.getMonth() - i, 1));
    }
  } else {
    const yearInt = parseInt(selectedYear, 10);
    for (let i = 0; i < 12; i++) {
      targetMonths.push(new Date(yearInt, i, 1));
    }
  }
  
  for (const targetMonth of targetMonths) {
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    const monthName = targetMonth.toLocaleString('default', { month: 'short' });
    
    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Day of the week of the 1st (0 = Sun, 6 = Sat)
    const firstDayOfWeek = targetMonth.getDay();
    
    const days = [];
    
    // Empty padding for the first column
    for (let p = 0; p < firstDayOfWeek; p++) {
      days.push(null);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;
      
      const count = (heatmapObj && heatmapObj[dateStr]) ? heatmapObj[dateStr] : 0;
      
      let level = 0;
      if (count >= 10) level = 4;
      else if (count >= 5) level = 3;
      else if (count >= 2) level = 2;
      else if (count >= 1) level = 1;

      // Ensure we don't display days in the future
      const currentIterDate = new Date(year, month, d);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      if (currentIterDate > todayEnd) {
         continue; 
      }
      
      days.push({ 
        date: dateStr, 
        count, 
        level, 
        monthName, 
        displayDate: currentIterDate.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' }) 
      });
    }
    
    monthsData.push({ monthName, days });
  }

  const getColor = (level) => {
    switch (level) {
      case 4: return "bg-[#047857]";
      case 3: return "bg-[#10b981]";
      case 2: return "bg-[#34d399]";
      case 1: return "bg-[#a7f3d0]";
      default: return "bg-background border border-border";
    }
  };

  // Calculate total submissions based on selected filter
  let totalSubmissions = 0;
  if (heatmapObj) {
    if (selectedYear === "Current") {
      // Count for the last 365 days
      const oneYearAgo = new Date();
      oneYearAgo.setDate(today.getDate() - 365);
      Object.entries(heatmapObj).forEach(([dateStr, val]) => {
        const d = new Date(dateStr);
        if (d >= oneYearAgo && d <= today) {
          totalSubmissions += val;
        }
      });
    } else {
      // Count for the specific year
      Object.entries(heatmapObj).forEach(([dateStr, val]) => {
        if (dateStr.startsWith(selectedYear)) {
          totalSubmissions += val;
        }
      });
    }
  }

  return (
    <div className="w-full flex flex-col items-start gap-4 relative">
      <div className="flex items-center justify-between w-full relative z-10">
        <p className="text-sm font-medium text-text-muted">
          {totalSubmissions} submissions in {selectedYear === "Current" ? "the past one year" : selectedYear}
        </p>

        {/* Dropdown Container */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border hover:border-primary rounded-md text-sm transition-colors"
          >
            {selectedYear}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50">
              <div className="py-1">
                {availableYears.map(y => (
                  <button
                    key={y}
                    onClick={() => { setSelectedYear(y); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-background flex items-center justify-between transition-colors"
                  >
                    {y}
                    {selectedYear === y && (
                      <svg className="text-primary w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 max-w-full">
        {monthsData.map((m, mIdx) => (
          <div key={mIdx} className="flex flex-col gap-2 shrink-0">
            <div className="grid grid-rows-7 grid-flow-col gap-[4px]">
              {m.days.map((day, dIdx) => {
                if (!day) return <div key={dIdx} className="w-[14px] h-[14px] bg-transparent"></div>;
                
                return (
                  <div
                    key={dIdx}
                    title={`${day.count} submissions on ${day.displayDate}`}
                    className={`w-[14px] h-[14px] rounded-sm ${getColor(day.level)} hover:ring-2 hover:ring-text hover:scale-110 transition-all cursor-pointer shadow-brutal-sm`}
                  ></div>
                );
              })}
            </div>
            <div className="text-xs text-text-muted text-center mt-1 select-none">
              {m.monthName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
