'use client';
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { User } from '@/lib/db/schema';

type ChartDay = { date: string; chats: number; tasks: number; ops: number };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ fontSize: 10, color: '#7a7068', marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsClient({ user, stats, chartData }: {
  user: User;
  stats: {
    totalTasks: number; doneTasks: number; pendingTasks: number; inProgressTasks: number;
    totalMessages: number; recentMessages: number; weekMessages: number;
    opsUsed: number; opsLimit: number;
  };
  chartData: ChartDay[];
}) {
  const [chartView, setChartView] = useState<'ops' | 'chats' | 'tasks'>('ops');
  const opsPct = Math.min(100, Math.round((stats.opsUsed / stats.opsLimit) * 100));
  const completionRate = stats.totalTasks > 0 ? Math.round((stats.doneTasks / stats.totalTasks) * 100) : 0;

  const taskPieData = [
    { name: 'Done', value: stats.doneTasks, color: '#4ade80' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#c9a96e' },
    { name: 'Pending', value: stats.pendingTasks, color: '#374151' },
  ].filter(d => d.value > 0);

  // Format date labels
  const formattedChart = chartData.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  }));

  return (
    <div style={{ padding: '40px', maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#f2ede6', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 13, color: '#7a7068' }}>30-day operational performance.</p>
      </div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Operations Used', value: stats.opsUsed, sub: `of ${stats.opsLimit === 999999 ? '∞' : stats.opsLimit}`, color: opsPct > 80 ? '#ef4444' : '#c9a96e' },
          { label: 'AI Messages (30d)', value: stats.recentMessages, sub: `${stats.weekMessages} this week`, color: '#818cf8' },
          { label: 'Tasks Total', value: stats.totalTasks, sub: `${completionRate}% complete`, color: '#4ade80' },
          { label: 'Completion Rate', value: `${completionRate}%`, sub: `${stats.doneTasks} done`, color: '#c9a96e' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 20px' }}>
            <p style={{ fontSize: 10, color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</p>
            <p style={{ fontSize: 11, color: '#7a7068' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Activity timeline chart */}
      <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6' }}>Activity Timeline — Last 30 Days</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['ops', 'chats', 'tasks'] as const).map(v => (
              <button key={v} onClick={() => setChartView(v)} style={{
                padding: '4px 12px', borderRadius: 99, fontSize: 10, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
                border: `1px solid ${chartView === v ? 'rgba(201,169,110,0.4)' : 'rgba(255,255,255,0.08)'}`,
                background: chartView === v ? 'rgba(201,169,110,0.1)' : 'transparent',
                color: chartView === v ? '#c9a96e' : '#7a7068',
              }}>{v}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={formattedChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fill: '#7a7068', fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fill: '#7a7068', fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={chartView}
              stroke="#c9a96e"
              strokeWidth={2}
              fill="url(#grad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row — task breakdown + ops bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Task status breakdown */}
        <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6', marginBottom: 20 }}>Task Breakdown</p>
          {stats.totalTasks === 0 ? (
            <p style={{ fontSize: 12, color: '#7a7068', textAlign: 'center', padding: '20px 0' }}>No tasks yet.</p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={taskPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                    {taskPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {taskPieData.map(d => (
                  <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                      <span style={{ fontSize: 12, color: '#7a7068' }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#f2ede6' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Operations usage */}
        <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6', marginBottom: 20 }}>Operations Usage</p>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#7a7068' }}>Used this month</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: opsPct > 80 ? '#ef4444' : '#c9a96e' }}>{opsPct}%</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${opsPct}%`, background: opsPct > 80 ? '#ef4444' : opsPct > 60 ? '#f97316' : '#c9a96e', borderRadius: 4, transition: 'width 1s ease' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: 12, color: '#7a7068' }}>Used</span>
            <span style={{ fontSize: 12, color: '#f2ede6', fontWeight: 600 }}>{stats.opsUsed}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: 12, color: '#7a7068' }}>Remaining</span>
            <span style={{ fontSize: 12, color: '#f2ede6', fontWeight: 600 }}>
              {stats.opsLimit === 999999 ? '∞' : stats.opsLimit - stats.opsUsed}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: 12, color: '#7a7068' }}>Plan</span>
            <span style={{ fontSize: 12, color: '#c9a96e', fontWeight: 600, textTransform: 'capitalize' }}>{user.plan}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
