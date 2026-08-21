import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserPlus, LogIn, Check } from 'lucide-react';
import { api, setToken } from '../api/client';

const AVATARS = [
  '/avatars/avatar-1.svg',
  '/avatars/avatar-2.svg',
  '/avatars/avatar-3.svg',
  '/avatars/avatar-4.svg',
];

export default function LoginPage({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await api.signup({
          name,
          username,
          email,
          password,
          profilePictureUrl: selectedAvatar,
        });
        setToken(res.token);
        onLoginSuccess(res.user);
      } else {
        const res = await api.login({
          emailOrUsername: email,
          password,
        });
        setToken(res.token);
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.login({
        emailOrUsername: 'adomin',
        password: 'password123',
      });
      setToken(res.token);
      onLoginSuccess(res.user);
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E2D9FC] flex flex-col items-center justify-center p-4 selection:bg-[#FEF08A]">
      {/* Brand Hero */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FEF08A] rounded-full border-2 border-black shadow-[3px_3px_0px_#000] mb-3">
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span className="text-xs font-black uppercase tracking-wider">Social Task Streak PWA</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tight">
          Task Streak
        </h1>
        <p className="text-sm font-bold text-black/70 mt-1 max-w-xs mx-auto">
          Build habits, grind pomodoros in 3D, and compete with friends.
        </p>
      </div>

      {/* Main Neo-Brutalist Form Card */}
      <div className="w-full max-w-md bg-white border-3 border-black rounded-neo-xl shadow-neo-xl p-6 sm:p-8">
        <div className="flex border-2 border-black rounded-2xl p-1 bg-zinc-100 mb-6">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
              !isSignUp ? 'bg-black text-white shadow-[2px_2px_0px_#000]' : 'text-black hover:bg-zinc-200'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
              isSignUp ? 'bg-black text-white shadow-[2px_2px_0px_#000]' : 'text-black hover:bg-zinc-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#FBCFE8] border-2 border-black rounded-xl text-xs font-extrabold text-black">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2 text-black/70">
                  Select Profile Avatar
                </label>
                <div className="flex items-center justify-around gap-2">
                  {AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`relative w-12 h-12 rounded-2xl border-2 border-black overflow-hidden bg-[#FED7AA] transition-all ${
                        selectedAvatar === av ? 'scale-110 shadow-[3px_3px_0px_#000] ring-2 ring-black' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                      {selectedAvatar === av && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-black">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-bold bg-zinc-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-black">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. alex_dev"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-bold bg-zinc-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1 text-black">
              {isSignUp ? 'Email Address' : 'Email or Username'}
            </label>
            <input
              type={isSignUp ? 'email' : 'text'}
              required
              placeholder={isSignUp ? 'alex@example.com' : 'adomin or user@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm font-bold bg-zinc-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1 text-black">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-sm font-bold bg-zinc-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-black text-white font-black text-sm border-2 border-black rounded-2xl shadow-neo hover:bg-zinc-800 active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2"
          >
            {isSignUp ? (
              <>
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Free Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>{loading ? 'Logging In...' : 'Login to Task Streak'}</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-4 pt-4 border-t-2 border-black/15 text-center">
          <p className="text-[11px] font-bold text-black/60 mb-2">Want to test instantly?</p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 bg-[#BBF7D0] hover:bg-[#86EFAC] text-black font-extrabold text-xs border-2 border-black rounded-xl shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition"
          >
            Instant Demo Login (as Adomin)
          </button>
        </div>
      </div>
    </div>
  );
}