'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SurveyTaker from '@/components/survey-taking/SurveyTaker';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';

export default function SurveyTakePage() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/surveys/${id}/public`)
      .then(r => r.json())
      .then(d => { setSurvey(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading survey...</p>
    </div>
  );

  if (!survey) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Survey not found.</p>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
        <p className="text-gray-500">Your response has been submitted.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <SurveyTaker survey={survey} onSubmit={() => setSubmitted(true)} />
      </div>
    </div>
  );
}
