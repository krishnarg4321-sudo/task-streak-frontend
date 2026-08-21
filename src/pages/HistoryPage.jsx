import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, Flame, BarChart3, TrendingUp, Timer } from 'lucide-react';
import { api } from '../api/client';
import TrendLineChart from '../components/charts/TrendLineChart';

export default function HistoryPage() {
  const [range, setRange] = useState('week'); // 'week' or 'month'
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [range]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory(range);
      setHistory(res);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (secs) => {
    if (!secs || secs === 0) return '0m';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m > 0 && s > 0) return `${m}m ${s}s`;
    if (m > 0) return `${m}m`;
    return `${s}s`;
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Title & Range Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-black tracking-tight">Productivity History</h2>
          <p className="text-xs font-bold text-black/60">Per-task duration & trend metrics</p>
        </div>

        <div className="flex border-2 border-black rounded-2xl p-1 bg-white shadow-[2.5px_2.5px_0px_#000]">
          <button
            onClick={() => setRange('week')}
            className={`px-3 py-1 text-xs font-black rounded-xl transition ${
              range === 'week' ? 'bg-black text-white' : 'text-black hover:bg-zinc-100'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setRange('month')}
            className={`px-3 py-1 text-xs font-black rounded-xl transition ${
              range === 'month' ? 'bg-black text-white' : 'text-black hover:bg-zinc-100'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* TOP SECTION: Today's Progression Summary */}
      <div className="neo-box p-5 bg-[#FFE2CA] border-3 border-black">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-black">
            Today's Quick Summary
          </span>
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white border border-black shadow-[1px_1px_0px_#000]">
            {history?.todaySummary?.completionRate || 0}% Completion
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white border-2 border-black rounded-xl text-center shadow-[2px_2px_0px_#000]">
            <div className="text-xl font-black text-black">{history?.todaySummary?.total || 0}</div>
            <div className="text-[10px] font-extrabold text-black/60 uppercase">Total Tasks</div>
          </div>
          <div className="p-3 bg-[#BBF7D0] border-2 border-black rounded-xl text-center shadow-[2px_2px_0px_#000]">
            <div className="text-xl font-black text-black">{history?.todaySummary?.completed || 0}</div>
            <div className="text-[10px] font-extrabold text-black/60 uppercase">Completed</div>
          </div>
          <div className="p-3 bg-[#FEF08A] border-2 border-black rounded-xl text-center shadow-[2px_2px_0px_#000]">
            <div className="text-xl font-black text-black">
              {formatDuration(history?.todaySummary?.timeSpentSeconds)}
            </div>
            <div className="text-[10px] font-extrabold text-black/60 uppercase">Time Spent</div>
          </div>
          <div className="p-3 bg-[#BAE6FD] border-2 border-black rounded-xl text-center shadow-[2px_2px_0px_#000]">
            <div className="text-xl font-black text-black">
              {formatDuration(history?.averageTimeSpentSeconds)}
            </div>
            <div className="text-[10px] font-extrabold text-black/60 uppercase">Avg / Task</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Weekly & Monthly Progression Chart */}
      <div>
        <TrendLineChart
          data={history?.trend || []}
          title={range === 'week' ? '7-Day Completion Progression' : '30-Day Completion Progression'}
        />
      </div>

      {/* SECTION 3: Per-Task Time-Taken Data Table */}
      <div className="neo-box p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 stroke-[2.5]" />
            <h3 className="font-black text-sm uppercase tracking-wider text-black">
              Per-Task Recorded Pomodoro Time
            </h3>
          </div>
          <span className="text-[11px] font-extrabold text-black/60">
            {history?.tasks?.length || 0} Records
          </span>
        </div>

        {(!history?.tasks || history.tasks.length === 0) ? (
          <p className="text-xs font-bold text-black/50 py-4 text-center">No tasks recorded in this period.</p>
        ) : (
          <div className="space-y-2.5">
            {history.tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl border-2 border-black bg-zinc-50 flex items-center justify-between gap-3 hover:bg-white transition shadow-[2px_2px_0px_#000]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border-2 border-black bg-[#FED7AA] flex items-center justify-center font-black text-xs">
                    {task.color ? task.color.substring(0, 1).toUpperCase() : 'T'}
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-black">{task.name}</h4>
                    <span className="text-[10px] font-bold text-black/50">{task.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-lg border border-black text-[10px] font-black ${
                    task.status === 'COMPLETED' ? 'bg-[#BBF7D0]' : 'bg-[#FED7AA]'
                  }`}>
                    {task.status}
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-black text-black">
                      {formatDuration(task.timeSpentSeconds)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}