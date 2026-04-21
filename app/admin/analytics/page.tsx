'use client';
import { useEffect, useState } from 'react';

interface AnalyticsSummary {
  totalSurveys: number;
  totalResponses: number;
  avgCompletionRate: number;
  avgResponseTime: number;
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSummary({
      totalSurveys: 0,
      totalResponses: 0,
      avgCompletionRate: 0,
      avgResponseTime: 0,
    });
    setLoading(false);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Surveys</p>
            <p className="text-3xl font-bold">{summary?.totalSurveys ?? 0}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Total Responses</p>
            <p className="text-3xl font-bold">{summary?.totalResponses ?? 0}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Avg Completion Rate</p>
            <p className="text-3xl font-bold">{summary?.avgCompletionRate ?? 0}%</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">Avg Response Time</p>
            <p className="text-3xl font-bold">{summary?.avgResponseTime ?? 0}s</p>
          </div>
        </div>
      )}
      <p className="mt-6 text-sm text-gray-400">
        Full PostHog analytics will appear here once NEXT_PUBLIC_POSTHOG_KEY is configured.
      </p>
    </div>
  );
}
