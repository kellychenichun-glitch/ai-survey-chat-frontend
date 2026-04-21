'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';

interface KnowledgeItem { id: number; question: string; answer: string; category: string; tags: string[]; }

export default function KnowledgeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<KnowledgeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/knowledge/${id}`)
      .then(r => r.json())
      .then(d => { setItem(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!item) return <div className="p-6">Item not found.</div>;

  return (
    <div className="p-6 max-w-2xl">
      <button onClick={() => router.back()} className="mb-4 text-sm text-blue-600 hover:underline">← Back</button>
      <h1 className="text-2xl font-bold mb-2">{item.question}</h1>
      <p className="text-sm text-gray-500 mb-4">Category: {item.category}</p>
      <div className="rounded-lg border p-4 bg-gray-50">
        <p className="whitespace-pre-wrap">{item.answer}</p>
      </div>
      {item.tags?.length > 0 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {item.tags.map(t => <span key={t} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{t}</span>)}
        </div>
      )}
    </div>
  );
}
