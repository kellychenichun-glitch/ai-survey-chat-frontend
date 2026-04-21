'use client';
import Link from 'next/link';
import SurveyList from '@/components/survey-list/SurveyList';

export default function SurveysPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Surveys</h1>
        <Link href="/admin/surveys/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">+ New Survey</Link>
      </div>
      <SurveyList />
    </div>
  );
}
