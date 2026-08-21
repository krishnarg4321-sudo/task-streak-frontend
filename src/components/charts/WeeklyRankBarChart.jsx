import React from 'react';
import { Award, Flame, CheckCircle2 } from 'lucide-react';

export default function WeeklyRankBarChart({ ranking = [] }) {
  if (!ranking || ranking.length === 0) {
    return (
      <div className="neo-box p-6 bg-white text-center">
        <p className="text-xs font-bold text-black/60">No weekly rankings recorded yet.</p>
      </div>
    );
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return { bg: 'bg-[#FEF08A]', label: '#1 GOLD' };
    if (rank === 2) return { bg: 'bg-zinc-200', label: '#2 SILVER' };
    if (rank === 3) return { bg: 'bg-[#FED7AA]', label: '#3 BRONZE' };
    return { bg: 'bg-white', label: `#${rank}` };
  };

  return (
    <div className="neo-box p-5 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 stroke-[2.5]" />
          <h3 className="font-black text-sm uppercase tracking-wider text-black">
            Weekly Friend Streak Leaderboard
          </h3>
        </div>
        <span className="text-[11px] font-extrabold bg-[#FBCFE8] px-2.5 py-0.5 rounded-full border border-black shadow-[1.5px_1.5px_0px_#000]">
          Weekly Reset
        </span>
      </div>

      <div className="space-y-3">
        {ranking.map((entry) => {
          const badge = getRankBadge(entry.rank);
          const barWidth = Math.max(15, Math.min(100, entry.completionRate || (entry.score * 1.5)));

          return (
            <div
              key={entry.userId}
              className="p-3 rounded-2xl border-2 border-black bg-zinc-50 hover:bg-white transition shadow-[3px_3px_0px_#000]"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 text-xs font-black rounded-lg border-2 border-black ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <div className="w-8 h-8 rounded-full border-2 border-black overflow-hidden bg-[#FFE2CA] flex items-center justify-center">
                    <img
                      src={entry.profilePictureUrl || '/avatars/avatar-1.svg'}
                      alt={entry.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-black leading-tight">
                      {entry.name || entry.username}
                    </h4>
                    <span className="text-[11px] font-semibold text-black/60">@{entry.username}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <div className="flex items-center gap-1 bg-[#FEF08A] px-2 py-0.5 rounded-lg border border-black text-xs font-black shadow-[1px_1px_0px_#000]">
                    <Flame className="w-3.5 h-3.5 stroke-[2.5] fill-current text-orange-500" />
                    <span>{entry.currentStreakDays}d Streak</span>
                  </div>
                  <div className="font-black text-sm text-black">
                    {entry.score} pts
                  </div>
                </div>
              </div>

              {/* Horizontal Ranked Completion Bar */}
              <div className="w-full bg-zinc-200 h-4 rounded-full border border-black overflow-hidden relative">
                <div
                  style={{ width: `${barWidth}%` }}
                  className={`h-full border-r border-black transition-all duration-500 ${
                    entry.rank === 1
                      ? 'bg-[#A855F7]'
                      : entry.rank === 2
                      ? 'bg-[#38BDF8]'
                      : 'bg-[#4ADE80]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-extrabold text-black/70 mt-1 px-1">
                <span>{entry.tasksCompleted} / {entry.totalTasks} Tasks Done</span>
                <span>{entry.completionRate}% Rate</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}