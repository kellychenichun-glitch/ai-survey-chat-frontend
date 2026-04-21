'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import StatsDashboard from '@/components/survey-stats/StatsDashboard';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';

export default function SurveyStatsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/surveys/${id}/stats`)
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline">← Back</button>
        <h1 className="text-2xl font-bold">Survey Statistics</h1>
      </div>
      {loading ? <p>Loading...</p> : !stats ? <p className="text-gray-500">No stats available.</p> : <StatsDashboard stats={stats} />}
    </div>
  );
}
