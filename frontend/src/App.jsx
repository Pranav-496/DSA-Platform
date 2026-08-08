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

function MainLayout() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem("theme") || "light";
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
  ].filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hideSidebarRoutes = ["/", "/login", "/terms", "/privacy"];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col bg-background h-[100dvh] w-full max-w-[100vw] overflow-hidden text-text font-geist">
      {/* Sticky Top Navbar */}
      {shouldShowSidebar && (
        <header className="sticky top-0 z-30 bg-surface border-b-2 border-text shadow-[0px_2px_0px_var(--text-color)] flex items-center justify-between px-3 md:px-4 py-1.5 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="px-2 py-1 bg-primary border-2 border-text rounded shadow-[2px_2px_0px_var(--text-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--text-color)] transition-all flex items-center gap-1.5"
            >
              <Menu size={18} className="text-text" />
              <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Menu</span>
            </button>
            <h1 className="font-black text-lg tracking-tighter uppercase hidden lg:block ml-2">
              AlgoNova
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="px-2 py-1 bg-primary border-2 border-text rounded shadow-[2px_2px_0px_var(--text-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--text-color)] transition-all flex items-center gap-1.5"
            title="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon size={18} className="text-text" />
            ) : (
              <Sun size={18} className="text-text" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">Theme</span>
          </button>
        </header>
      )}

      <div className="flex-1 flex overflow-hidden relative">
      
      {shouldShowSidebar && <Sidebar setSearchOpen={setSearchOpen} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-2xl mx-auto brutal-card bg-surface p-6 shadow-brutal-lg">
            <div className="flex items-center gap-4 mb-6 border-b-4 border-text pb-4">
              <Search className="text-text" size={28} />
              <input
                type="text"
                placeholder="Search algorithms, problems, quizzes... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-xl font-bold placeholder-text/50 outline-none"
                autoFocus
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); setSidebarOpen(false); }} className="text-text hover:bg-danger hover:text-surface border-2 border-transparent hover:border-text p-1 transition-all">
                <X size={28} />
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {searchResults.map((result, i) => (
                <Link
                  key={i}
                  to={result.path}
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); setSidebarOpen(false); }}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-primary border-4 border-transparent hover:border-text transition-all group shadow-sm hover:shadow-brutal-sm"
                >
                  <result.icon size={24} className="text-text" />
                  <div>
                    <p className="font-black text-lg uppercase tracking-tight">{result.title}</p>
                    <p className="font-bold text-sm opacity-80">{result.type}</p>
                  </div>
                </Link>
              ))}
              {searchQuery && searchResults.length === 0 && (
                <p className="text-center py-8 font-bold text-lg border-4 border-dashed border-text bg-background">No results found for "{searchQuery}"</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 p-2 md:p-4 relative overflow-y-auto h-full w-full transition-all">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/visualize" element={<Visualizer />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/interview" element={<InterviewPrep />} />
          <Route path="/system-design" element={<SystemDesign />} />
          <Route path="/resume-screener" element={<ResumeScreener />} />
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-200 ease-in-out w-64 bg-surface border-r-8 border-text flex flex-col items-center py-6 z-50 shadow-[4px_0_0_#111] h-screen`}>
        
        {/* Close Button */}
        <button 
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1 hover:bg-danger hover:text-surface border-2 border-transparent hover:border-text transition-all rounded"
        >
          <X size={24} />
        </button>
      <div className="flex items-center gap-3 mb-10 px-6 w-full">
        <img src="/favicon.svg" alt="AlgoNova Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-black uppercase tracking-tighter">
          AlgoNova
        </h1>
      </div>

      <nav className="w-full flex-1 px-4 space-y-2 overflow-y-auto min-h-0">
        {/* Search Button */}
        <button
          onClick={handleSearchClick}
          className="w-full text-left px-4 py-3 rounded-lg border-4 border-text bg-background hover:bg-primary transition-all shadow-brutal-sm hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#111] mb-6"
        >
          <div className="flex items-center gap-3">
            <Search size={20} className="text-text" />
            <span className="font-bold text-sm tracking-wide">
              Search (Ctrl+K)
            </span>
          </div>
        </button>

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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-4 transition-all group relative
                ${
                  isActive
                    ? "bg-primary border-text shadow-[4px_4px_0px_#111] -translate-y-1"
                    : "bg-transparent border-transparent hover:border-text hover:bg-background"
                }`}
            >
              <Icon size={20} className="text-text" />
              <span className="font-bold text-sm uppercase tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 w-full mt-auto pt-4 border-t-4 border-text flex flex-col gap-3">
        {user && (
          <Link to="/profile" className="flex items-center gap-3 p-3 bg-surface border-4 border-text rounded-lg shadow-brutal-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_#111] transition-all cursor-pointer block">
            <div className="w-10 h-10 rounded-full bg-warning border-4 border-text flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-text" />
            </div>
            <div className="min-w-0">
               <p className="text-sm font-black truncate uppercase">{user.name || "Operator"}</p>
               <p className="text-xs font-bold opacity-70 truncate">{user.email}</p>
            </div>
          </Link>
        )}
        <div className="p-2.5 bg-background border-2 border-text rounded-lg text-center text-xs font-bold shadow-brutal-sm">
          <span className="opacity-90">Designed & Developed by <strong>Pranav Landge</strong></span>
          <a 
            href="https://pranavlandge.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-extrabold block mt-1"
          >
            Explore on pranavlandge.in ↗
          </a>
        </div>
      </div>
    </aside>
    </>
  );
}

export default App;
