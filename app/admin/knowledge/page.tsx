'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';

interface KnowledgeItem { id: number; question: string; answer: string; category: string; tags: string[]; }

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    const url = search ? `${API}/api/knowledge?q=${encodeURIComponent(search)}` : `${API}/api/knowledge`;
    fetch(url).then(r => r.json()).then(d => { setItems(d); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <Link href="/admin/knowledge/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">+ New Item</Link>
      </div>
      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()}
          placeholder="Search knowledge base..." className="flex-1 border rounded px-3 py-2 text-sm" />
        <button onClick={load} className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200">Search</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="space-y-3">
          {items.length === 0 ? <p className="text-gray-500">No items found.</p> : items.map(item => (
            <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <Link href={`/admin/knowledge/${item.id}`} className="font-medium text-blue-600 hover:underline">{item.question}</Link>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.answer}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>
                {item.tags?.map(t => <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
