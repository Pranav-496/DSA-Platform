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
      if (res.ok) {
        const data = await res.json();
        setProfileData(prev => ({ ...prev, user: data.user }));
        setIsEditing(false);
        // Also update local storage so Sidebar updates on refresh
        localStorage.setItem("algonova_name", data.user.name);
      }
    } catch (err) {
      console.error(err);
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
              <a href={userInfo.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-3 text-sm font-bold bg-surface border-2 border-text px-3 py-1 shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#111] transition-all">
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
            <button className="brutal-btn py-2 px-6 text-sm">
              Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
