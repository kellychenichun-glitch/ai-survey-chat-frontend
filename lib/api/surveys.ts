const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';
function authHeaders(): Record<string,string> {
  const h: Record<string,string> = {'Content-Type':'application/json'};
  if (typeof window!=='undefined') { const t=localStorage.getItem('auth_token'); if(t) h['Authorization']=`Bearer ${t}`; }
  return h;
}
async function handle<T>(res:Response):Promise<T> {
  if (!res.ok) { const t=await res.text().catch(()=>''); throw new Error(`API ${res.status}: ${t||res.statusText}`); }
  return res.json();
}
import type { Survey } from '@/types/survey';
export async function listSurveys():Promise<Survey[]> {
  const res=await fetch(`${API}/api/v1/surveys`,{headers:authHeaders()});
  const d=await handle<any>(res); return d.surveys||[];
}
export async function getSurvey(id:string):Promise<Survey> {
  const res=await fetch(`${API}/api/v1/surveys/${id}`,{headers:authHeaders()});
  const d=await handle<any>(res); return d.survey;
}
export async function createSurvey(survey:Survey):Promise<Survey> {
  const res=await fetch(`${API}/api/v1/surveys`,{method:'POST',headers:authHeaders(),body:JSON.stringify(survey)});
  const d=await handle<any>(res); return d.survey;
}
export async function updateSurvey(id:string,survey:Partial<Survey>):Promise<Survey> {
  const res=await fetch(`${API}/api/v1/surveys/${id}`,{method:'PUT',headers:authHeaders(),body:JSON.stringify(survey)});
  const d=await handle<any>(res); return d.survey;
}
export async function publishSurvey(id:string):Promise<Survey> {
  const res=await fetch(`${API}/api/v1/surveys/${id}/publish`,{method:'POST',headers:authHeaders()});
  const d=await handle<any>(res); return d.survey;
}
export async function deleteSurvey(id:string):Promise<void> {
  const res=await fetch(`${API}/api/v1/surveys/${id}`,{method:'DELETE',headers:authHeaders()});
  if(!res.ok) throw new Error(`Delete failed: ${res.status}`);
}
export async function aiGenerateSurvey(req:{topic:string;targetCount?:number;language?:string;context?:string;preferredTypes?:string[]}):Promise<any> {
  const res=await fetch(`${API}/api/v1/surveys/ai-generate`,{method:'POST',headers:authHeaders(),body:JSON.stringify(req)});
  return handle<any>(res);
}
