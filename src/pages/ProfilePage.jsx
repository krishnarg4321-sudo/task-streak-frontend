import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, LogOut, Flame, CheckCircle2, Award, Camera, Upload, Zap, Clock, Sparkles } from 'lucide-react';
import { api } from '../api/client';

export default function ProfilePage({ user, onBack, onUpdateUser, onLogout }) {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.profilePictureUrl || '/avatars/avatar-1.svg');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      if (base64Data) {
        setAvatar(base64Data);
        setMessage('New photo selected! Click "Save Changes" to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await api.updateProfile({
        name: name.trim(),
        profilePictureUrl: avatar,
      });
      onUpdateUser(updated);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const level = user?.level || 1;
  const levelTitle = user?.levelTitle || 'Novice Grinder';
  const xp = user?.xp || 0;
  const nextLevelXp = level * 60;
  const currentLevelBaseXp = (level - 1) * 60;
  const xpInCurrentLevel = Math.max(0, xp - currentLevelBaseXp);
  const xpToNext = 60;
  const progressPercent = Math.min(100, Math.max(5, Math.round((xpInCurrentLevel / xpToNext) * 100)));

  const focusMinutes = Math.round((user?.totalFocusSeconds || 0) / 60);
  const focusHours = (focusMinutes / 60).toFixed(1);

  const activeStatus = user?.activeStatus || (user?.online ? 'ACTIVE' : 'OFFLINE');

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2.5 rounded-2xl border-2 border-black bg-white hover:bg-zinc-100 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1 font-black text-xs"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back</span>
        </button>
        <h2 className="text-xl font-black text-black">User Profile</h2>
        <button
          onClick={onLogout}
          className="p-2.5 rounded-2xl border-2 border-black bg-[#FBCFE8] hover:bg-rose-300 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1 font-black text-xs text-black"
        >
          <LogOut className="w-4 h-4 stroke-[2.5]" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Profile & Avatar Card */}
      <div className="neo-box p-6 bg-white space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative group mb-3">
            <div className="w-28 h-28 rounded-3xl border-3 border-black bg-[#FFE2CA] shadow-neo overflow-hidden flex items-center justify-center">
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/avatars/avatar-1.svg';
                }}
              />
            </div>
            {/* Custom Photo Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 bg-[#FEF08A] hover:bg-amber-300 text-black rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition"
              title="Upload photo from Gallery or Camera"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#DDD6FE] rounded-full border border-black text-[11px] font-black mb-1 shadow-[1px_1px_0px_#000]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lv. {level} {levelTitle}</span>
          </div>

          <h3 className="text-2xl font-black text-black">{user?.name}</h3>
          <p className="text-xs font-bold text-black/60">@{user?.username}</p>
          <p className="text-xs font-semibold text-black/40 mt-0.5">{user?.email}</p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Upload Photo (Gallery / Camera)</span>
          </button>
        </div>

        {/* Level Progression & XP Card */}
        <div className="p-4 bg-[#E2D9FC] border-2 border-black rounded-2xl shadow-[2.5px_2.5px_0px_#000] space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current text-purple-700" />
              <span>Level {level} Progression</span>
            </div>
            <span className="text-purple-900">{xp} / {nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-white h-4 rounded-full border-2 border-black overflow-hidden relative shadow-[1px_1px_0px_#000]">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-[#A855F7] border-r-2 border-black transition-all duration-500"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-extrabold text-black/70">
            <span>Next: Level {level + 1}</span>
            <span>{nextLevelXp - xp} XP needed</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-[#FEF08A] border-2 border-black rounded-2xl text-center shadow-[2.5px_2.5px_0px_#000]">
            <Flame className="w-5 h-5 mx-auto mb-1 stroke-[2.5] text-orange-500 fill-current" />
            <div className="text-xl font-black text-black">{user?.currentStreak || 0}</div>
            <div className="text-[10px] font-extrabold text-black/70 uppercase">Streak Days</div>
          </div>

          <div className="p-3 bg-[#BBF7D0] border-2 border-black rounded-2xl text-center shadow-[2.5px_2.5px_0px_#000]">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 stroke-[2.5] text-emerald-700" />
            <div className="text-xl font-black text-black">{user?.totalCompletedTasks || 0}</div>
            <div className="text-[10px] font-extrabold text-black/70 uppercase">Tasks Done</div>
          </div>

          <div className="p-3 bg-[#BAE6FD] border-2 border-black rounded-2xl text-center shadow-[2.5px_2.5px_0px_#000]">
            <Clock className="w-5 h-5 mx-auto mb-1 stroke-[2.5] text-blue-600" />
            <div className="text-xl font-black text-black">{focusHours}h</div>
            <div className="text-[10px] font-extrabold text-black/70 uppercase">Focus Time</div>
          </div>
        </div>

        {/* Dynamic Activity Status Indicator */}
        <div className="p-3 bg-zinc-50 border-2 border-black rounded-2xl flex items-center justify-between shadow-[2px_2px_0px_#000]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {activeStatus === 'ACTIVE' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-3 w-3 border border-black ${
                  activeStatus === 'ACTIVE'
                    ? 'bg-emerald-500'
                    : activeStatus === 'AWAY'
                    ? 'bg-amber-400'
                    : 'bg-zinc-400'
                }`}
              ></span>
            </span>
            <div>
              <p className="text-xs font-black text-black">
                {activeStatus === 'ACTIVE' ? 'Active Now' : activeStatus === 'AWAY' ? 'Away' : 'Offline'}
              </p>
              <p className="text-[10px] font-bold text-black/60">
                {activeStatus === 'ACTIVE' ? 'Online & tracking today’s goals' : 'Recent activity recorded'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 bg-white rounded-md border border-black shadow-[1px_1px_0px_#000]">
            Lv.{level}
          </span>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t-2 border-black">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1 text-black">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm font-bold bg-zinc-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
            />
          </div>

          {message && (
            <p className="text-xs font-bold text-black bg-[#BBF7D0] p-2 rounded-xl border border-black shadow-[1px_1px_0px_#000]">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-black text-white font-black text-sm border-2 border-black rounded-xl shadow-neo hover:bg-zinc-800 active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}