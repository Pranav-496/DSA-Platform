import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-text pt-24 font-inter px-4 sm:px-6">
      <div className="max-w-[800px] mx-auto pb-20">
        <div className="brutal-card bg-surface p-8 mb-8 border-4 border-text shadow-brutal-lg">
          <div className="flex items-center gap-4 mb-6 border-b-4 border-text pb-4">
            <div className="p-3 bg-primary border-4 border-text rounded-lg">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-geist font-black uppercase tracking-tight">Privacy Policy</h1>
          </div>
          
          <div className="space-y-6 font-medium text-lg leading-relaxed">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="space-y-3">
              <h2 className="text-2xl font-bold uppercase border-b-2 border-text inline-block mb-2">1. Information We Collect</h2>
              <p>When you use AlgoNova, we collect certain information to provide and improve our services. Since we utilize Google Authentication, we access basic profile information including your <strong>Name</strong>, <strong>Email Address</strong>, and <strong>Profile Picture</strong>.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold uppercase border-b-2 border-text inline-block mb-2">2. How We Use Your Information</h2>
              <p>The information we collect is strictly used to:</p>
              <ul className="list-disc pl-6 space-y-2 font-bold">
                <li>Create and manage your AlgoNova account.</li>
                <li>Display your name and avatar on leaderboards and your profile.</li>
                <li>Track your learning progress, saved code, and quiz scores.</li>
                <li>Provide essential communication regarding your account.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold uppercase border-b-2 border-text inline-block mb-2">3. Data Security & Storage</h2>
              <p>We implement robust neo-brutalist security measures (and actual cryptography) to protect your personal information. Your data is stored securely and is never sold to third parties.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold uppercase border-b-2 border-text inline-block mb-2">4. Your Rights</h2>
              <p>You have the right to request access to or deletion of your personal data at any time. To exercise these rights, please contact us.</p>
            </section>
            
            <div className="mt-8 pt-6 border-t-4 border-text">
              <Link to="/" className="brutal-btn inline-block">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
