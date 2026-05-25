'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';

type Task = {
  id: string; title: string; description?: string;
  status: 'pending' | 'in_progress' | 'done' | 'archived';
  priority: number; dueAt?: string; tags?: string[];
  createdAt: string;
};

const STATUS_LABELS = { pending: 'Pending', in_progress: 'In Progress', done: 'Done', archived: 'Archived' };
const STATUS_COLORS = { pending: '#7a7068', in_progress: '#c9a96e', done: '#4ade80', archived: '#374151' };
const PRIORITY_LABELS = ['Low', 'Medium', 'High', 'Critical'];
const PRIORITY_COLORS = ['#7a7068', '#c9a96e', '#f97316', '#ef4444'];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [form, setForm] = useState({ title: '', description: '', priority: 0, dueAt: '', tags: '' });

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    setLoading(true);
    const res = await fetch('/api/tasks');
    if (res.ok) setTasks(await res.json());
    setLoading(false);
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
        dueAt: form.dueAt || null,
      }),
    });
    if (res.ok) { setCreating(false); setForm({ title: '', description: '', priority: 0, dueAt: '', tags: '' }); fetchTasks(); }
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchTasks();
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, color: '#f2ede6', marginBottom: 4 }}>
            Tasks
          </h1>
          <p style={{ fontSize: 13, color: '#7a7068' }}>{tasks.length} operations in queue</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          style={{
            padding: '10px 20px', borderRadius: 10, background: '#c9a96e',
            color: '#09090b', fontSize: 12, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', cursor: 'pointer',
          }}
        >
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'pending', 'in_progress', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 99, fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
            border: `1px solid ${filter === f ? 'rgba(201,169,110,0.5)' : 'rgba(255,255,255,0.08)'}`,
            background: filter === f ? 'rgba(201,169,110,0.1)' : 'transparent',
            color: filter === f ? '#c9a96e' : '#7a7068',
          }}>
            {f === 'all' ? 'All' : STATUS_LABELS[f as keyof typeof STATUS_LABELS]}
          </button>
        ))}
      </div>

      {/* Create form */}
      {creating && (
        <form onSubmit={createTask} style={{
          background: '#111115', border: '1px solid rgba(201,169,110,0.2)',
          borderRadius: 16, padding: 24, marginBottom: 24,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#f2ede6', marginBottom: 16 }}>New Task</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input
              required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Task title *"
              style={{ gridColumn: 'span 2', padding: '10px 14px', borderRadius: 10, background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', color: '#f2ede6', fontSize: 13, outline: 'none' }}
            />
            <textarea
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Description (optional)"
              rows={2}
              style={{ gridColumn: 'span 2', padding: '10px 14px', borderRadius: 10, background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', color: '#f2ede6', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'inherit' }}
            />
            <select
              value={form.priority} onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) }))}
              style={{ padding: '10px 14px', borderRadius: 10, background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', color: '#f2ede6', fontSize: 13, outline: 'none' }}
            >
              {PRIORITY_LABELS.map((l, i) => <option key={i} value={i}>{l} Priority</option>)}
            </select>
            <input
              type="date" value={form.dueAt} onChange={e => setForm(f => ({ ...f, dueAt: e.target.value }))}
              style={{ padding: '10px 14px', borderRadius: 10, background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', color: '#f2ede6', fontSize: 13, outline: 'none' }}
            />
            <input
              value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="Tags (comma separated)"
              style={{ gridColumn: 'span 2', padding: '10px 14px', borderRadius: 10, background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.08)', color: '#f2ede6', fontSize: 13, outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ padding: '9px 20px', borderRadius: 10, background: '#c9a96e', color: '#09090b', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Create Task
            </button>
            <button type="button" onClick={() => setCreating(false)} style={{ padding: '9px 20px', borderRadius: 10, background: 'transparent', color: '#7a7068', fontSize: 12, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Task list */}
      {loading ? (
        <p style={{ color: '#7a7068', fontSize: 13 }}>Loading tasks...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: 20, color: '#f2ede6', fontWeight: 300, marginBottom: 8 }}>
            No tasks yet
          </p>
          <p style={{ fontSize: 13, color: '#7a7068' }}>Create your first task to begin building operational momentum.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(task => (
            <div key={task.id} style={{
              background: '#111115', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
              opacity: task.status === 'archived' ? 0.5 : 1,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: PRIORITY_COLORS[task.priority] || '#7a7068',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 600, color: '#f2ede6', marginBottom: 2,
                  textDecoration: task.status === 'done' ? 'line-through' : 'none',
                }}>
                  {task.title}
                </p>
                {task.description && (
                  <p style={{ fontSize: 11, color: '#7a7068', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                  {task.tags?.map(tag => (
                    <span key={tag} style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: '#7a7068', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {tag}
                    </span>
                  ))}
                  {task.dueAt && (
                    <span style={{ fontSize: 10, color: new Date(task.dueAt) < new Date() ? '#ef4444' : '#7a7068' }}>
                      Due {new Date(task.dueAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <select
                value={task.status}
                onChange={e => updateStatus(task.id, e.target.value)}
                style={{
                  padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${STATUS_COLORS[task.status]}44`,
                  color: STATUS_COLORS[task.status], cursor: 'pointer', outline: 'none',
                }}
              >
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <button
                onClick={() => deleteTask(task.id)}
                style={{ background: 'none', border: 'none', color: '#7a7068', cursor: 'pointer', fontSize: 16, padding: 4 }}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
