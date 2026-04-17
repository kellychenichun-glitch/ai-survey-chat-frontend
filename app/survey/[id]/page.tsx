import SurveyTaker from '@/components/survey-taking/SurveyTaker'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'
interface Props { params: { id: string } }
export default async function SurveyFillPage({ params }: Props) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'
  const res = await fetch(`${API}/api/v1/surveys/public/${params.id}`, { cache: 'no-store' })
  if (!res.ok) notFound()
  const data = await res.json()
  if (!data.survey) notFound()
  return <SurveyTaker survey={data.survey} />
}
