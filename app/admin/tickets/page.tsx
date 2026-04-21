'use client';
import { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';

interface Ticket {
  id: number; title: string; description: string; status: string;
  priority: string; created_at: string; linear_issue_id?: string;
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    const url = filter === 'all' ? `${API}/api/tickets` : `${API}/api/tickets?status=${filter}`;
    fetch(url).then(r => r.json())
      .then(d => { setTickets(Array.isArray(d) ? d : d.tickets || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API}/api/tickets/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <div className="flex gap-2">
          {['all', 'open', 'in_progress', 'resolved'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded text-sm ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      {loading ? <p>Loading...</p> : tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map(t => (
            <div key={t.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[t.status] || 'bg-gray-100'}`}>{t.status}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[t.priority] || 'bg-gray-100'}`}>{t.priority}</span>
                    {t.linear_issue_id && <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">Linear</span>}
                  </div>
                  <h3 className="font-medium">{t.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{t.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(t.created_at).toLocaleString()}</p>
                </div>
                <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
                  className="ml-4 border rounded px-2 py-1 text-sm">
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
