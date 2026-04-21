'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SurveyBuilder from '@/components/survey-builder/SurveyBuilder';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';

export default function EditSurveyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/surveys/${id}`)
      .then(r => r.json())
      .then(d => { setSurvey(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!survey) return <div className="p-6">Survey not found.</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline">← Back</button>
        <h1 className="text-2xl font-bold">Edit Survey</h1>
      </div>
      <SurveyBuilder initialSurvey={survey} onSave={() => router.push('/admin/surveys')} />
    </div>
  );
}
