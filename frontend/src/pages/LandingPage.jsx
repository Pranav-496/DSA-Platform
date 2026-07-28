import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Terminal, Code, Activity, Award, CheckCircle, HelpCircle, Sun, Moon } from 'lucide-react';

export default function LandingPage() {
  const { token, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (!loading && token) {
      navigate('/profile');
    }
  }, [token, loading, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-[100dvh] w-full max-w-[100vw] bg-background text-text overflow-x-hidden pt-16 md:pt-24 font-inter">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full max-w-[100vw] bg-surface border-b-4 border-border z-50 px-4 sm:px-6 py-3.5 flex justify-between items-center shadow-brutal-sm">
        <div className="font-geist font-bold text-xl sm:text-2xl tracking-tight">ALGONOVA</div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="px-2.5 py-1.5 bg-primary border-2 border-text rounded shadow-brutal-sm hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5 font-bold text-xs uppercase cursor-pointer"
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            <span className="hidden sm:inline">Theme</span>
          </button>
          <Link to="/login" className="brutal-btn py-1.5 px-4 sm:px-6 text-xs sm:text-sm font-bold uppercase">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-32 flex flex-col items-center text-center">
        <div className="brutal-card inline-block p-3 sm:p-4 mb-6 sm:mb-8 bg-surface transform -rotate-2">
          <Terminal className="w-8 h-8 sm:w-12 sm:h-12 text-text" />
        </div>
        <h1 className="text-3.5xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-geist font-extrabold leading-tight mb-6 tracking-tight uppercase">
          Master Algorithms.<br /> <span className="bg-primary px-2">Visualized.</span>
        </h1>
        <p className="text-base sm:text-lg md:text-2xl font-medium mb-8 sm:mb-12 max-w-3xl leading-relaxed">
          The premium Neo-Brutalist platform for learning, practicing, and mastering Data Structures & Algorithms. 
          Stop memorizing. Start visualizing.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto justify-center">
          <Link to={token ? "/dashboard" : "/login"} className="brutal-btn w-full sm:w-auto text-lg py-4 px-8">
            Start Learning
          </Link>
          <Link to={token ? "/visualize" : "/login"} className="brutal-btn-secondary w-full sm:w-auto text-lg py-4 px-8">
            Try Visualizer
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-primary border-y-4 border-border py-20">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-geist font-bold mb-16 text-center uppercase">Why AlgoNova?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
              icon={<Code />}
              title="DSA Visualization"
              description="Step-by-step interactive visualizers for sorting, searching, trees, and graphs. See exactly how the code manipulates data in real-time."
              color="bg-surface"
            />
            <FeatureCard 
              icon={<Terminal />}
              title="Algorithm Playground"
              description="A sandboxed, zero-setup coding environment. Write Python, JavaScript, or C++ and test against robust test cases instantly."
              color="bg-[#E2E8F0]"
            />
            <FeatureCard 
              icon={<Activity />}
              title="Interactive Learning"
              description="AI-driven mock interviews, voice analysis, and code reviews that provide actionable feedback to improve your logic."
              color="bg-success text-surface"
            />
            <FeatureCard 
              icon={<Award />}
              title="Progress Tracking"
              description="Gamified skill heatmaps, global leaderboards, and placement readiness scores. Track your journey from novice to master."
              color="bg-warning"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="w-full max-w-[800px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-geist font-bold mb-16 text-center uppercase">FAQ</h2>
          <div className="space-y-6">
            <FAQItem 
              question="Is AlgoNova free to use?"
              answer="Yes! The core visualizers and practice platform are completely free. We believe in accessible education for all developers."
            />
            <FAQItem 
              question="What languages are supported?"
              answer="Our algorithm playground currently supports JavaScript, Python, and C++. We are continuously adding more languages."
            />
            <FAQItem 
              question="How does the AI interview work?"
              answer="We use advanced speech-to-text and LLMs to simulate a real tech interview, providing feedback on your communication, code quality, and time complexity analysis."
            />
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-text text-surface py-12 border-t-8 border-primary">
        <div className="w-full max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="font-geist font-bold text-3xl mb-4">ALGONOVA</div>
            <p className="opacity-80 max-w-sm">Learn. Visualize. Master Algorithms.<br/>The ultimate platform for serious developers.</p>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-4 uppercase">Product</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link to="/login" className="hover:text-primary transition-colors">Visualizer</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Practice</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Learn</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-4 uppercase">Platform</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link to="/login" className="hover:text-primary transition-colors">Login / Register</Link></li>
              <li><a href="mailto:support@algonova.dev" className="hover:text-primary transition-colors">Contact</a></li>
              <li><span className="opacity-60 cursor-default">Terms & Privacy</span></li>
            </ul>
          </div>
        </div>
        <div className="w-full max-w-[1200px] mx-auto px-6 mt-12 pt-8 border-t border-surface/30 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <div className="opacity-80">
            © {new Date().getFullYear()} AlgoNova. All rights reserved.
          </div>
          <div className="bg-surface text-text px-4 py-2 rounded-lg border-2 border-surface shadow-brutal-sm font-bold flex flex-wrap items-center justify-center gap-2">
            <span>Designed & Developed by <strong className="text-primary">Pranav Landge</strong></span>
            <span className="hidden sm:inline">•</span>
            <a 
              href="https://pranavlandge.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline font-extrabold flex items-center gap-1"
            >
              Explore more on pranavlandge.in ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description, color }) => (
  <div className={`brutal-card p-8 ${color}`}>
    <div className="bg-text text-surface w-14 h-14 flex items-center justify-center rounded-lg border-2 border-text mb-6 shadow-brutal-sm">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h3 className="text-2xl font-geist font-bold mb-4 uppercase">{title}</h3>
    <p className="font-medium opacity-90 leading-relaxed text-base">{description}</p>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="brutal-card bg-surface p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold uppercase">{question}</h3>
        <span className="text-2xl font-black">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <p className="mt-4 font-medium opacity-80 pt-4 border-t-2 border-text leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
};
