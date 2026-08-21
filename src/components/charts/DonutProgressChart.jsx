import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function DonutProgressChart({ completed = 0, partial = 0, notCompleted = 0 }) {
  const total = completed + partial + notCompleted;
  
  const data = [
    { name: 'Completed', value: completed, color: '#BBF7D0' },
    { name: 'Partial', value: partial, color: '#FED7AA' },
    { name: 'Not Started', value: notCompleted, color: '#E2E8F0' },
  ].filter(d => d.value > 0);

  const percentage = total > 0 ? Math.round(((completed + 0.5 * partial) / total) * 100) : 0;

  if (total === 0) {
    return (
      <div className="neo-box p-6 bg-white flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-neo-yellow border-2 border-black flex items-center justify-center mb-3 shadow-neo-sm">
          <AlertCircle className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h4 className="font-black text-base text-black mb-1">No Tasks Logged Today</h4>
        <p className="text-xs font-semibold text-black/60 max-w-xs">
          Create a sticky task to kickstart your daily streak and attendance!
        </p>
      </div>
    );
  }

  return (
    <div className="neo-box p-5 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-sm uppercase tracking-wider text-black">
          Today's Progress Summary
        </h3>
        <span className="text-xs font-extrabold bg-[#BBF7D0] px-2.5 py-0.5 rounded-full border border-black shadow-[1.5px_1.5px_0px_#000]">
          {percentage}% Done
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Chart Container with percentage in center */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
                stroke="#000000"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #000000',
                  borderRadius: '12px',
                  boxShadow: '3px 3px 0px #000000',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-black leading-none">{percentage}%</span>
            <span className="text-[10px] font-bold text-black/60 uppercase">Completed</span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl border-2 border-black bg-[#BBF7D0] shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span className="text-xs font-black">Completed</span>
            </div>
            <span className="text-xs font-black">{completed} / {total}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl border-2 border-black bg-[#FED7AA] shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 stroke-[2.5]" />
              <span className="text-xs font-black">Partially Done</span>
            </div>
            <span className="text-xs font-black">{partial} / {total}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl border-2 border-black bg-zinc-100 shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="text-xs font-black">Remaining</span>
            </div>
            <span className="text-xs font-black">{notCompleted} / {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}