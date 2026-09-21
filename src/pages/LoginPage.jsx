import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, UserPlus, LogIn, Camera, Upload, Check } from 'lucide-react';
import { api, setToken } from '../api/client';

export default function LoginPage({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('/avatars/avatar-1.svg');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signupFileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Profile image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        setProfilePicture(base64Data);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await api.signup({
          name: name.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          password,
          profilePictureUrl: profilePicture,
        });
        setToken(res.token);
        onLoginSuccess(res.user);
      } else {
        const res = await api.login({
          emailOrUsername: email.trim().toLowerCase(),
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
          <div className="mb-4 p-3 bg-[#FBCFE8] border-2 border-black rounded-xl text-xs font-extrabold text-black shadow-[2px_2px_0px_#000]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              {/* Photo Upload for Signup */}
              <div className="flex flex-col items-center gap-2 pb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-black/70">
                  Profile Photo (Gallery / Camera)
                </label>
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl border-2 border-black bg-[#FFE2CA] shadow-[2.5px_2.5px_0px_#000] overflow-hidden flex items-center justify-center">
                    <img
                      src={profilePicture}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/avatars/avatar-1.svg';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => signupFileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 bg-[#FEF08A] hover:bg-amber-300 text-black rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_#000]"
                    title="Upload Photo"
                  >
                    <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <input
                    ref={signupFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => signupFileInputRef.current?.click()}
                  className="text-[11px] font-black underline text-black/80 hover:text-black"
                >
                  Choose Custom Image
                </button>
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
              placeholder={isSignUp ? 'alex@example.com' : 'username or email'}
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
      </div>
    </div>
  );
}