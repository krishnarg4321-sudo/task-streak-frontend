import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Users } from 'lucide-react';

const MEMBER_COLORS = [
  '#000000', // Ink Black
  '#9333EA', // Purple
  '#F43F5E', // Pink
  '#059669', // Emerald
  '#2563EB', // Blue
  '#D97706', // Amber
];

export default function GroupDivergingChart({ data = [], members = [] }) {
  if (!data || data.length === 0 || !members || members.length === 0) {
    return (
      <div className="neo-box p-6 bg-white text-center">
        <p className="text-xs font-bold text-black/60">No member data to compare yet.</p>
      </div>
    );
  }

  return (
    <div className="neo-box p-5 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 stroke-[2.5]" />
          <h3 className="font-black text-sm uppercase tracking-wider text-black">
            Group Multi-Member Progress Lines
          </h3>
        </div>
        <span className="text-[11px] font-extrabold bg-[#BAE6FD] px-2.5 py-0.5 rounded-full border border-black shadow-[1.5px_1.5px_0px_#000]">
          7-Day Trajectory
        </span>
      </div>

      <div className="w-full h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#000000"
              fontSize={11}
              fontWeight="bold"
              tickLine={false}
            />
            <YAxis
              stroke="#000000"
              fontSize={11}
              fontWeight="bold"
              tickLine={false}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '12px',
                boxShadow: '3px 3px 0px #000000',
                fontWeight: 'bold',
                fontSize: '12px',
              }}
              formatter={(val, name) => [`${val}%`, name]}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 'bold' }}
            />
            {members.map((member, idx) => (
              <Line
                key={member.userId || member.username}
                type="monotone"
                dataKey={member.username}
                name={member.name || member.username}
                stroke={MEMBER_COLORS[idx % MEMBER_COLORS.length]}
                strokeWidth={idx === 0 ? 3.5 : 2.5}
                dot={{ r: 4, stroke: '#000000', strokeWidth: 1.5, fill: MEMBER_COLORS[idx % MEMBER_COLORS.length] }}
                activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}