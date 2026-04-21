'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';

interface Response { id: number; survey_id: number; answers: Record<string, unknown>; submitted_at: string; }

export default function ResponsesPage() {
  const { id } = useParams();
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/surveys/${id}/responses`)
      .then(r => r.json())
      .then(d => { setResponses(Array.isArray(d) ? d : d.responses || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const exportCSV = () => {
    if (!responses.length) return;
    const keys = Object.keys(responses[0].answers || {});
    const rows = [['ID', 'Submitted At', ...keys]];
    responses.forEach(r => rows.push([String(r.id), r.submitted_at, ...keys.map(k => String(r.answers[k] ?? ''))]));
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `responses_${id}.csv`; a.click();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline">← Back</button>
          <h1 className="text-2xl font-bold">Responses</h1>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">Export CSV</button>
      </div>
      {loading ? <p>Loading...</p> : responses.length === 0 ? <p className="text-gray-500">No responses yet.</p> : (
        <div className="space-y-3">
          {responses.map(r => (
            <div key={r.id} className="border rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Response #{r.id}</span>
                <span>{new Date(r.submitted_at).toLocaleString()}</span>
              </div>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(r.answers, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
