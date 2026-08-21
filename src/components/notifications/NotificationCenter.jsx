import React from 'react';
import { Bell, CheckCheck, X, Sparkles, CheckCircle2, Clock, Users, Flame } from 'lucide-react';

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
}) {
  if (!isOpen) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'TASK_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 stroke-[2.5] text-green-600" />;
      case 'DAILY_REMINDER':
        return <Clock className="w-4 h-4 stroke-[2.5] text-amber-600" />;
      case 'FRIEND_TASK_COMPLETED':
      case 'FRIEND_REQUEST':
        return <Users className="w-4 h-4 stroke-[2.5] text-purple-600" />;
      case 'STREAK_MILESTONE':
        return <Flame className="w-4 h-4 stroke-[2.5] text-rose-600" />;
      default:
        return <Sparkles className="w-4 h-4 stroke-[2.5] text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border-3 border-black rounded-neo-xl shadow-neo-xl w-full max-w-md mt-16 sm:mt-12 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 bg-[#FFE2CA] border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 stroke-[2.5]" />
            <h3 className="font-black text-base text-black">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={onMarkAllRead}
                className="text-xs font-bold px-2 py-1 bg-white border border-black rounded-lg shadow-[1px_1px_0px_#000] hover:bg-zinc-100 flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Read all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg border border-black bg-white hover:bg-zinc-100"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs font-bold text-black/50">No notifications right now.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`p-3 rounded-xl border-2 border-black transition cursor-pointer ${
                  n.read ? 'bg-zinc-50 opacity-75' : 'bg-[#FEF08A] shadow-[2px_2px_0px_#000]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-white rounded-lg border border-black mt-0.5">
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-xs text-black">{n.title}</h4>
                      <span className="text-[10px] font-bold text-black/50">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-black/80 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}