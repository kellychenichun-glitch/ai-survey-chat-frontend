'use client';
import { useRouter } from 'next/navigation';
import SurveyBuilder from '@/components/survey-builder/SurveyBuilder';

export default function NewSurveyPage() {
  const router = useRouter();
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-sm text-blue-600 hover:underline">← Back</button>
        <h1 className="text-2xl font-bold">Create New Survey</h1>
      </div>
      <SurveyBuilder onSave={() => router.push('/admin/surveys')} />
    </div>
  );
}
