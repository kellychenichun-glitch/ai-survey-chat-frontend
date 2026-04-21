'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';

interface Survey { id: number; title: string; description: string; status: string; created_at: string; }

export default function SurveyPublicListPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/surveys?status=published`)
      .then(r => r.json())
      .then(d => { setSurveys(Array.isArray(d) ? d : d.surveys || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Available Surveys</h1>
        <p className="text-center text-gray-500 mb-8">Share your feedback with us</p>
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : surveys.length === 0 ? (
          <p className="text-center text-gray-400">No surveys available at the moment.</p>
        ) : (
          <div className="space-y-4">
            {surveys.map(s => (
              <Link key={s.id} href={`/survey/${s.id}`}
                className="block bg-white rounded-xl border p-6 hover:shadow-md transition hover:border-blue-300">
                <h2 className="text-lg font-semibold mb-1">{s.title}</h2>
                {s.description && <p className="text-sm text-gray-500 line-clamp-2">{s.description}</p>}
                <p className="text-xs text-blue-600 mt-3 font-medium">Take Survey →</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
