import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function TrendLineChart({ data = [], title = 'Last 7 Days Progress Trend' }) {
  if (!data || data.length === 0) {
    return (
      <div className="neo-box p-6 bg-white text-center">
        <p className="text-xs font-bold text-black/60">No historical activity to plot yet.</p>
      </div>
    );
  }

  const isMonthly = data.length > 7;

  return (
    <div className="neo-box p-5 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 stroke-[2.5]" />
          <h3 className="font-black text-sm uppercase tracking-wider text-black">
            {title}
          </h3>
        </div>
        <span className="text-[11px] font-extrabold bg-[#DDD6FE] px-2.5 py-0.5 rounded-full border border-black shadow-[1.5px_1.5px_0px_#000]">
          {isMonthly ? '30-Day Curve' : '7-Day Curve'}
        </span>
      </div>

      <div className="w-full h-48 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey={isMonthly ? "date" : "dayOfWeek"}
              stroke="#000000"
              fontSize={10}
              fontWeight="bold"
              tickLine={false}
              interval={isMonthly ? Math.ceil(data.length / 6) : 0}
              tickFormatter={(val) => {
                if (isMonthly && val && val.length >= 10) {
                  return val.substring(5); // MM-DD
                }
                return val;
              }}
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
              formatter={(val) => [`${val}%`, 'Completion']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="completionRate"
              stroke="#000000"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRate)"
              dot={{ r: isMonthly ? 2 : 4, stroke: '#000000', strokeWidth: 1.5, fill: '#FEF08A' }}
              activeDot={{ r: 6, stroke: '#000000', strokeWidth: 2, fill: '#BBF7D0' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}