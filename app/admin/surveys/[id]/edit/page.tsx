import SurveyBuilder from '@/components/survey-builder/SurveyBuilder'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'
interface Props { params: { id: string } }
async function getSurvey(id: string) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'
  const res = await fetch(`${API}/api/v1/surveys/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  const data = await res.json()
  return data.survey
}
export default async function EditPage({ params }: Props) {
  const survey = await getSurvey(params.id)
  if (!survey) notFound()
  return <SurveyBuilder mode="edit" initialSurvey={survey} />
}
