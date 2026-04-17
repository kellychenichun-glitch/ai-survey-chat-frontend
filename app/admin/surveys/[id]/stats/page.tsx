import StatsDashboard from '@/components/survey-stats/StatsDashboard'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'
interface Props { params: { id: string } }
async function fetchBoth(id: string) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'
  const [sv, st] = await Promise.all([
    fetch(`${API}/api/v1/surveys/${id}`, { cache: 'no-store' }).then(r => r.json()),
    fetch(`${API}/api/v1/surveys/${id}/stats`, { cache: 'no-store' }).then(r => r.json()),
  ])
  return { survey: sv.survey, stats: st }
}
export default async function StatsPage({ params }: Props) {
  try {
    const { survey, stats } = await fetchBoth(params.id)
    if (!survey) notFound()
    return <StatsDashboard survey={survey} stats={stats} />
  } catch { notFound() }
}
