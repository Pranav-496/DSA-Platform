import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Terminal, Code, Activity, Award, CheckCircle, HelpCircle } from 'lucide-react';

export default function LandingPage() {
  const { token, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token) {
      navigate('/profile');
    }
  }, [token, loading, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen w-full bg-background text-text overflow-x-hidden pt-16 md:pt-24 font-inter">
      
      <nav className="fixed top-0 w-full bg-surface border-b-4 border-border z-50 px-6 py-4 flex justify-between items-center shadow-brutal-sm">
        <div className="font-geist font-bold text-2xl tracking-tight">ALGONOVA</div>
        <div>
          <Link to="/login" className="brutal-btn-secondary mr-4 py-2 px-4 text-sm">Login</Link>
          <Link to="/register" className="brutal-btn py-2 px-4 text-sm">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="brutal-card inline-block p-4 mb-8 bg-surface transform -rotate-2">
          <Terminal className="w-12 h-12 text-text" />
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-geist font-extrabold leading-none mb-6 tracking-tight uppercase">
          Master Algorithms.<br /> <span className="bg-primary px-2">Visualized.</span>
        </h1>
        <p className="text-lg md:text-2xl font-medium mb-12 max-w-3xl leading-relaxed">
          The premium Neo-Brutalist platform for learning, practicing, and mastering Data Structures & Algorithms. 
          Stop memorizing. Start visualizing.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto justify-center">
          <Link to="/login" className="brutal-btn w-full sm:w-auto text-lg py-4 px-8">
            Start Learning
          </Link>
          <Link to="/visualizer" className="brutal-btn-secondary w-full sm:w-auto text-lg py-4 px-8">
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

      {/* Statistics Section */}
      <section className="py-20 bg-background">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <div className="brutal-card bg-surface p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-geist font-bold mb-12 uppercase">By the Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-6xl font-black font-geist mb-2">50+</div>
                <div className="text-xl font-bold uppercase tracking-wider">Algorithms Visualized</div>
              </div>
              <div>
                <div className="text-6xl font-black font-geist mb-2">10k+</div>
                <div className="text-xl font-bold uppercase tracking-wider">Active Learners</div>
              </div>
              <div>
                <div className="text-6xl font-black font-geist mb-2">99%</div>
                <div className="text-xl font-bold uppercase tracking-wider">Interview Success</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#E2E8F0] border-y-4 border-border">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-geist font-bold mb-16 text-center uppercase">Wall of Love</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard 
              quote="AlgoNova completely changed how I understand dynamic programming. The visualizer is an absolute game-changer."
              author="Sarah Jenkins"
              role="Software Engineer @ TechCorp"
            />
            <TestimonialCard 
              quote="The brutalist UI is incredibly refreshing. It keeps me focused on the code and the logic, not unnecessary fluff."
              author="David Chen"
              role="CS Student"
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

      {/* Footer */}
      <footer className="bg-text text-surface py-12 border-t-8 border-primary">
        <div className="w-full max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="font-geist font-bold text-3xl mb-4">ALGONOVA</div>
            <p className="opacity-80 max-w-sm">Learn. Visualize. Master Algorithms.<br/>The ultimate platform for serious developers.</p>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-4 uppercase">Product</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link to="/visualizer" className="hover:text-primary transition-colors">Visualizer</Link></li>
              <li><Link to="/practice" className="hover:text-primary transition-colors">Practice</Link></li>
              <li><Link to="/learn" className="hover:text-primary transition-colors">Learn</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-4 uppercase">Company</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">About</Link></li>
              <li><a href="mailto:support@algonova.dev" className="hover:text-primary transition-colors">Contact</a></li>
              <li><span className="opacity-60 cursor-default">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="w-full max-w-[1200px] mx-auto px-6 mt-12 pt-8 border-t border-surface/30 text-center opacity-60">
          © {new Date().getFullYear()} AlgoNova. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description, color }) => (
  <div className={`brutal-card p-8 ${color}`}>
    <div className="bg-text text-surface w-14 h-14 flex items-center justify-center rounded-lg border-2 border-text mb-6 shadow-brutal-sm">
      {icon}
    </div>
    <h3 className="text-2xl font-bold font-geist mb-4 uppercase tracking-wide">{title}</h3>
    <p className="font-medium opacity-90 leading-relaxed text-lg">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role }) => (
  <div className="brutal-card bg-surface p-8">
    <div className="text-3xl text-primary mb-4 font-geist">"</div>
    <p className="text-lg font-medium mb-8 leading-relaxed">{quote}</p>
    <div className="flex items-center gap-4 border-t-2 border-border pt-6">
      <div className="w-12 h-12 bg-primary border-2 border-border rounded-full flex items-center justify-center font-bold">
        {author.charAt(0)}
      </div>
      <div>
        <div className="font-bold font-geist uppercase">{author}</div>
        <div className="text-sm opacity-80 font-medium">{role}</div>
      </div>
    </div>
  </div>
);

const FAQItem = ({ question, answer }) => (
  <div className="brutal-card bg-surface p-6 text-left">
    <h3 className="flex items-center gap-3 font-bold text-xl font-geist mb-2 uppercase">
      <HelpCircle className="w-6 h-6 text-primary flex-shrink-0" />
      {question}
    </h3>
    <p className="pl-9 font-medium text-lg">{answer}</p>
  </div>
);
