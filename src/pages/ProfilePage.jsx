import React, { useState } from 'react';
import { ArrowLeft, Save, LogOut, Flame, CheckCircle, Calendar, Award } from 'lucide-react';
import { api, setToken } from '../api/client';

const AVATARS = [
  '/avatars/avatar-1.svg',
  '/avatars/avatar-2.svg',
  '/avatars/avatar-3.svg',
  '/avatars/avatar-4.svg',
];

export default function ProfilePage({ user, onBack, onUpdateUser, onLogout }) {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.profilePictureUrl || AVATARS[0]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await api.updateProfile({
        name,
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

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2.5 rounded-2xl border-2 border-black bg-white hover:bg-zinc-100 shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center gap-1 font-bold text-xs"
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

      {/* Main Profile Card */}
      <div className="neo-box p-6 bg-white">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-3xl border-3 border-black bg-[#FFE2CA] shadow-neo overflow-hidden mb-3">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-2xl font-black text-black">{user?.name}</h3>
          <p className="text-xs font-bold text-black/60">@{user?.username}</p>
          <p className="text-xs font-semibold text-black/40 mt-0.5">{user?.email}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 bg-[#FEF08A] border-2 border-black rounded-2xl text-center shadow-[2.5px_2.5px_0px_#000]">
            <Flame className="w-5 h-5 mx-auto mb-1 stroke-[2.5] text-orange-500 fill-current" />
            <div className="text-xl font-black text-black">{user?.currentStreak || 0}</div>
            <div className="text-[10px] font-extrabold text-black/70 uppercase">Streak Days</div>
          </div>
          <div className="p-3 bg-[#BBF7D0] border-2 border-black rounded-2xl text-center shadow-[2.5px_2.5px_0px_#000]">
            <CheckCircle className="w-5 h-5 mx-auto mb-1 stroke-[2.5] text-emerald-700" />
            <div className="text-xl font-black text-black">Active</div>
            <div className="text-[10px] font-extrabold text-black/70 uppercase">Status</div>
          </div>
          <div className="p-3 bg-[#BAE6FD] border-2 border-black rounded-2xl text-center shadow-[2.5px_2.5px_0px_#000]">
            <Award className="w-5 h-5 mx-auto mb-1 stroke-[2.5] text-blue-600" />
            <div className="text-xl font-black text-black">Level 1</div>
            <div className="text-[10px] font-extrabold text-black/70 uppercase">Rank</div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-2 text-black/70">
              Change Avatar
            </label>
            <div className="flex items-center justify-around gap-2">
              {AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`w-12 h-12 rounded-2xl border-2 border-black overflow-hidden bg-[#FED7AA] transition-all ${
                    avatar === av ? 'scale-110 shadow-[3px_3px_0px_#000] ring-2 ring-black' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm font-bold bg-zinc-50 border-2 border-black rounded-xl focus:outline-none focus:bg-white shadow-[2px_2px_0px_#000]"
            />
          </div>

          {message && (
            <p className="text-xs font-bold text-black bg-[#BBF7D0] p-2 rounded-xl border border-black">
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