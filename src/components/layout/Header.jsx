import React from 'react';
import { Bell, Menu, Flame } from 'lucide-react';

export default function Header({
  user,
  onOpenProfile,
  onOpenNotifications,
  unreadCount = 0,
}) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  return (
    <header className="sticky top-0 z-30 w-full px-4 pt-3 pb-2 bg-[#E2D9FC]/90 backdrop-blur-md">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Left Side: Profile Avatar with Neo-Brutalist Border */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfile}
            className="relative w-12 h-12 rounded-2xl border-2 border-black bg-[#FFE2CA] shadow-[3px_3px_0px_#000] overflow-hidden flex items-center justify-center hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            aria-label="Open User Profile"
            title="Profile"
          >
            <img
              src={user?.profilePictureUrl || '/avatars/avatar-1.svg'}
              alt={user?.name || 'User'}
              className="w-full h-full object-cover"
            />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-xl sm:text-2xl text-black tracking-tight leading-tight">
                Hi {user?.name?.split(' ')[0] || 'Adomin'}
              </h1>
            </div>
            <p className="text-xs font-bold text-black/60">{getGreeting()}</p>
          </div>
        </div>

        {/* Right Side: Streak Badge & Notification Bell */}
        <div className="flex items-center gap-2.5">
          {/* Current Streak Badge */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-2xl border-2 border-black bg-[#FEF08A] shadow-[2.5px_2.5px_0px_#000]">
            <Flame className="w-4 h-4 stroke-[2.5] fill-current text-orange-500" />
            <span className="text-xs font-black text-black">
              {user?.currentStreak || 0}d Streak
            </span>
          </div>

          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-2xl border-2 border-black bg-[#FFE2CA] shadow-[3px_3px_0px_#000] hover:bg-[#FED7AA] active:translate-x-0.5 active:translate-y-0.5 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[2.5] text-black" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] border border-black flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}