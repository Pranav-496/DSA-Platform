import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-text pt-24 font-inter px-4 sm:px-6">
      <div className="max-w-[800px] mx-auto pb-20">
        <div className="brutal-card bg-surface p-8 mb-8 border border-border shadow-elevated">
          <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
            <div className="p-3 bg-warning border border-border rounded-lg">
              <BookOpen size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-geist font-bold uppercase tracking-tight">Terms of Service</h1>
          </div>
          
          <div className="space-y-6 font-medium text-lg leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="space-y-3">
              <h2 className="text-2xl font-bold uppercase border-b border-border inline-block mb-2">1. Acceptance of Terms</h2>
              <p>By accessing and using AlgoNova, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use our service.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold uppercase border-b border-border inline-block mb-2">2. Google Account Usage</h2>
              <p>To provide a seamless experience, AlgoNova allows you to sign in using your Google account. By doing so, you authorize us to access and use your <strong>Google account name, email, and profile picture</strong> as your identity on our platform.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold uppercase border-b border-border inline-block mb-2">3. Acceptable Use</h2>
              <p>You agree not to use the platform to:</p>
              <ul className="list-disc pl-6 space-y-2 font-bold">
                <li>Submit malicious code or exploit the code execution environments.</li>
                <li>Harass other users or attempt to manipulate the leaderboard ranking systems.</li>
                <li>Scrape, copy, or redistribute our educational content without permission.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold uppercase border-b border-border inline-block mb-2">4. Termination</h2>
              <p>We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            </section>
            
            <div className="mt-8 pt-6 border-t border-border">
              <Link to="/" className="brutal-btn inline-block">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
