import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Terminal, Mail, Lock, UserPlus, KeyRound, ShieldAlert } from 'lucide-react';
import API_BASE from '../config/api';

function OtpInput({ value, onChange }) {
  const inputRefs = React.useRef([]);
  const digits = value.padEnd(6, '').split('').slice(0, 6);

  const handleChange = (index, val) => {
    if (val.length > 1) val = val.slice(-1);
    if (val && !/^\d$/.test(val)) return;
    const newDigits = [...digits];
    newDigits[index] = val;
    onChange(newDigits.join(''));
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => inputRefs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-black bg-background border-4 border-text shadow-brutal-sm focus:border-primary focus:ring-0 outline-none transition-colors"
        />
      ))}
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // login | register | register-otp | forgot | otp | reset
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const { login, register, verifyRegistration } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/profile');
      } else {
        const res = await register(name, email, password);
        setSuccessMsg(res.message || 'OTP sent to your email.');
        setMode('register-otp');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await verifyRegistration(email, otp);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMsg('OTP sent to your email.');
      setMode('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMsg('Identity verified. Provide new password.');
      setMode('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMsg('Password updated successfully.');
      setPassword('');
      setMode('login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (mode === 'login' || mode === 'register') {
      return (
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block font-bold mb-2 uppercase text-sm">Full Name</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-text w-5 h-5" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="brutal-input w-full !pl-12" placeholder="John Doe" />
              </div>
            </div>
          )}
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text w-5 h-5" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="brutal-input w-full !pl-12" placeholder="developer@algonova.com" />
            </div>
          </div>
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text w-5 h-5" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="brutal-input w-full !pl-12" placeholder="••••••••" />
            </div>
          </div>
          {mode === 'login' && (
            <div className="text-right">
               <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }} className="font-bold text-sm hover:underline hover:text-primary transition-colors">Forgot Password?</button>
            </div>
          )}
          <button type="submit" disabled={loading} className="brutal-btn w-full mt-4">
            {loading ? "Authenticating..." : (mode === 'login' ? "Login" : "Create Account")}
          </button>
        </form>
      );
    }

    if (mode === 'forgot') {
      return (
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text w-5 h-5" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="brutal-input w-full !pl-12" placeholder="developer@algonova.com" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="brutal-btn w-full">
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
          <button type="button" onClick={() => setMode('login')} className="w-full font-bold text-sm hover:underline mt-4">Back to Login</button>
        </form>
      );
    }

    if (mode === 'otp') {
      return (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-3 uppercase text-sm text-center">Enter 6-Digit Code</label>
            <OtpInput value={otp} onChange={setOtp} />
          </div>
          <button type="submit" disabled={loading} className="brutal-btn w-full">
            {loading ? "Verifying..." : "Verify Code"}
          </button>
          <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }} className="w-full font-bold text-sm hover:underline mt-4">← Back to Forgot Password</button>
        </form>
      );
    }

    if (mode === 'register-otp') {
      return (
        <form onSubmit={handleRegisterOtpSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-3 uppercase text-sm text-center">Enter 6-Digit Code</label>
            <OtpInput value={otp} onChange={setOtp} />
          </div>
          <button type="submit" disabled={loading} className="brutal-btn w-full">
            {loading ? "Verifying..." : "Complete Registration"}
          </button>
          <button type="button" onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); setOtp(''); }} className="w-full font-bold text-sm hover:underline mt-4">← Back to Registration</button>
        </form>
      );
    }

    if (mode === 'reset') {
      return (
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">New Password</label>
            <div className="relative">
              <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-text w-5 h-5" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="brutal-input w-full !pl-12" placeholder="New Password" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="brutal-btn w-full">
            {loading ? "Updating..." : "Update Password"}
          </button>
          <button type="button" onClick={() => setMode('login')} className="w-full font-bold text-sm hover:underline mt-4">← Back to Login</button>
        </form>
      );
    }
  };

  const titles = {
    login: "Welcome Back",
    register: "Create Account",
    'register-otp': "Verify Email",
    forgot: "Reset Password",
    otp: "Enter Code",
    reset: "New Password"
  };

  const subtitles = {
    login: "Enter your credentials to access your account.",
    register: "Join AlgoNova and master algorithms.",
    'register-otp': "Enter the 6-digit code sent to your email.",
    forgot: "We'll send a code to reset your password.",
    otp: "Enter the code sent to your email.",
    reset: "Set a new password for your account."
  };

  return (
    <div className="h-full min-h-[500px] w-full bg-background flex flex-col items-center justify-center p-2 relative">
      <div className="brutal-card bg-surface w-full max-w-sm p-6 md:p-8 relative z-10">
        
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="mb-4">
            <img src="/favicon.svg" alt="AlgoNova Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-geist font-black uppercase tracking-tight mb-1">
            {titles[mode]}
          </h1>
          <p className="font-medium opacity-80 text-sm">
            {subtitles[mode]}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger border-4 border-text rounded-lg text-surface font-bold">
            ERROR: {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-6 p-4 bg-success border-4 border-text rounded-lg text-surface font-bold">
            SUCCESS: {successMsg}
          </div>
        )}

        {renderForm()}

        {(mode === 'login' || mode === 'register') && (
          <div className="mt-6 pt-4 border-t-4 border-text text-center font-bold text-sm">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccessMsg(''); }}
              className="text-primary hover:underline hover:text-[#E6C200] transition-colors ml-1"
            >
              {mode === 'login' ? "Sign up" : "Log in"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
