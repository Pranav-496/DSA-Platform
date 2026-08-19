import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Terminal,
  Code,
  BookOpen,
  Mic,
  LayoutDashboard,
  BarChart3,
  Search,
  Menu,
  X,
  Trophy,
  User,
  Sun,
  Moon,
  FileSearch,
  Swords,
  ChevronRight,
} from "lucide-react";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Visualizer from "./pages/Visualizer";
import Practice from "./pages/Practice";
import Learn from "./pages/Learn";
import Quiz from "./pages/Quiz";
import InterviewPrep from "./pages/InterviewPrep";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import SystemDesign from "./pages/SystemDesign";
import { AuthProvider } from "./context/AuthContext";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ResumeScreener from "./pages/ResumeScreener";
import AlgorithmRace from "./pages/AlgorithmRace";
import CustomVisualizer from "./pages/CustomVisualizer";
function MainLayout() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchResults = [
    { title: "Two Sum", type: "Problem", path: "/practice", icon: Code },
    { title: "Binary Search", type: "Algorithm", path: "/visualize", icon: BarChart3 },
    { title: "Bubble Sort", type: "Algorithm", path: "/visualize", icon: BarChart3 },
    { title: "Arrays Quiz", type: "Quiz", path: "/quiz/arrays", icon: BookOpen },
    { title: "Interview Prep", type: "Practice", path: "/interview", icon: Mic },
    { title: "System Design", type: "Sandbox", path: "/system-design", icon: LayoutDashboard },
    { title: "Resume Screener", type: "Tool", path: "/resume-screener", icon: FileSearch },
    { title: "Algorithm Race", type: "Race", path: "/race", icon: Swords },
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hideSidebarRoutes = ["/", "/login", "/terms", "/privacy"];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col bg-background h-[100dvh] w-full max-w-[100vw] overflow-hidden text-text font-inter">
      {/* Top Navbar */}
      {shouldShowSidebar && (
        <header className="sticky top-0 z-30 glass border-b border-border flex items-center justify-between px-4 md:px-6 py-2.5 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-surface-alt transition-colors"
            >
              <Menu size={20} className="text-text" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/favicon.svg" alt="Logo" className="w-7 h-7" />
              <h1 className="font-geist font-extrabold text-lg tracking-tight hidden lg:block">
                AlgoNova
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-alt border border-border text-text-muted text-sm hover:border-primary/40 transition-colors"
            >
              <Search size={15} />
              <span>Search...</span>
              <kbd className="ml-4 text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-surface-alt transition-colors"
              title="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon size={18} className="text-text-muted" />
              ) : (
                <Sun size={18} className="text-text-muted" />
              )}
            </button>
          </div>
        </header>
      )}

      <div className="flex-1 flex overflow-hidden relative">
      
      {shouldShowSidebar && <Sidebar setSearchOpen={setSearchOpen} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center pt-[12vh] p-4">
          <div className="w-full max-w-xl mx-auto bg-surface rounded-2xl border border-border shadow-glass overflow-hidden animate-fade-in">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search className="text-text-muted" size={20} />
              <input
                type="text"
                placeholder="Search algorithms, problems, quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-base font-medium placeholder-text-muted/50 outline-none"
                autoFocus
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); setSidebarOpen(false); }}
                className="text-text-muted hover:text-text p-1 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {searchResults.map((result, i) => (
                <Link
                  key={i}
                  to={result.path}
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); setSidebarOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-alt transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-surface-alt group-hover:bg-primary/10 transition-colors">
                    <result.icon size={16} className="text-text-muted group-hover:text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{result.title}</p>
                    <p className="text-xs text-text-muted">{result.type}</p>
                  </div>
                  <ChevronRight size={14} className="text-text-muted/40 group-hover:text-primary" />
                </Link>
              ))}
              {searchQuery && searchResults.length === 0 && (
                <p className="text-center py-8 text-text-muted text-sm">No results for "{searchQuery}"</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-3 md:p-5 relative overflow-y-auto h-full w-full transition-all">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/visualize" element={<Visualizer />} />
          <Route path="/custom-visualizer" element={<CustomVisualizer />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/interview" element={<InterviewPrep />} />
          <Route path="/system-design" element={<SystemDesign />} />
          <Route path="/resume-screener" element={<ResumeScreener />} />
          <Route path="/race" element={<AlgorithmRace />} />
          <Route path="/quiz/:topic" element={<Quiz />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

function Sidebar({ setSearchOpen, sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { user } = React.useContext(AuthContext);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", matchExact: true },
    { to: "/profile", icon: Code, label: "My Profile" },
    { to: "/leaderboard", icon: Trophy, label: "Global Arena" },
    { to: "/learn", icon: BookOpen, label: "Learn Path" },
    { to: "/visualize", icon: BarChart3, label: "Visualizer" },
    { to: "/custom-visualizer", icon: Code, label: "Code Visualizer" },
    { to: "/race", icon: Swords, label: "Algorithm Race" },
    { to: "/practice", icon: Terminal, label: "Practice HQ" },
    { to: "/interview", icon: Mic, label: "Interview Prep" },
    { to: "/system-design", icon: LayoutDashboard, label: "System Design" },
    { to: "/resume-screener", icon: FileSearch, label: "Resume Screener" },
  ];

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-300 ease-out w-72 bg-surface border-r border-border flex flex-col z-50 shadow-glass h-screen`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="AlgoNova Logo" className="w-8 h-8" />
            <h1 className="text-xl font-geist font-extrabold tracking-tight">
              AlgoNova
            </h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-surface-alt text-text-muted hover:text-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 mb-2">
          <button
            onClick={handleSearchClick}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-text-muted text-sm hover:border-primary/40 transition-colors"
          >
            <Search size={15} />
            <span>Search...</span>
            <kbd className="ml-auto text-[10px] font-mono bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto min-h-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchExact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 group relative text-sm
                  ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-text-muted hover:text-text hover:bg-surface-alt"
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <Icon size={18} className={isActive ? 'text-primary' : 'text-text-muted group-hover:text-text'} />
                <span className="font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 mt-auto border-t border-border space-y-3">
          {user && (
            <Link to="/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-alt transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{user.name || "User"}</p>
                <p className="text-xs text-text-muted truncate">{user.email}</p>
              </div>
            </Link>
          )}
          <div className="px-3 py-2 text-center text-[11px] text-text-muted">
            <span>Built by <strong className="text-text font-semibold">Pranav Landge</strong></span>
            <a 
              href="https://pranavlandge.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium block mt-0.5"
            >
              pranavlandge.in ↗
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

export default App;
