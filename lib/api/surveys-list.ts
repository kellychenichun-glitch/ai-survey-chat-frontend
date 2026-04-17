const API=process.env.NEXT_PUBLIC_API_URL||'https://ai-survey-api.onrender.com';
function authH():Record<string,string>{const h:Record<string,string>={'Content-Type':'application/json'};if(typeof window!=='undefined'){const t=localStorage.getItem('auth_token');if(t)h['Authorization']=`Bearer ${t}`;}return h;}
async function handle<T>(res:Response):Promise<T>{if(!res.ok){const t=await res.text().catch(()=>'');throw new Error(`API ${res.status}: ${t||res.statusText}`);}return res.json();}
export interface SurveySummary{id:string;title:string;description:string;status:'draft'|'published'|'closed';questionCount:number;responseCount:number;createdAt:string;updatedAt:string;publishedAt?:string|null;closedAt?:string|null;}
export async function listSurveysSummary(params?:{status?:'all'|'draft'|'published'|'closed';search?:string;sortBy?:string;sortDir?:'asc'|'desc'}):Promise<SurveySummary[]>{
  const q=new URLSearchParams();
  if(params?.status&&params.status!=='all')q.set('status',params.status);
  if(params?.search)q.set('search',params.search);
  if(params?.sortBy)q.set('sortBy',params.sortBy);
  if(params?.sortDir)q.set('sortDir',params.sortDir);
  const qs=q.toString();
  const res=await fetch(`${API}/api/v1/surveys/summary${qs?`?${qs}`:''}`,{headers:authH(),cache:'no-store'});
  const d=await handle<any>(res);return d.surveys||[];
}
export async function closeSurvey(id:string):Promise<any>{const res=await fetch(`${API}/api/v1/surveys/${id}/close`,{method:'POST',headers:authH()});return handle<any>(res);}
export async function reopenSurvey(id:string):Promise<any>{const res=await fetch(`${API}/api/v1/surveys/${id}/reopen`,{method:'POST',headers:authH()});return handle<any>(res);}
export async function duplicateSurvey(id:string):Promise<any>{const res=await fetch(`${API}/api/v1/surveys/${id}/duplicate`,{method:'POST',headers:authH()});return handle<any>(res);}
