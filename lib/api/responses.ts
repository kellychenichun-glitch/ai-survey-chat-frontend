const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';
function authH(): Record<string,string> {
  const h: Record<string,string> = {'Content-Type':'application/json'};
  if (typeof window!=='undefined'){const t=localStorage.getItem('auth_token');if(t)h['Authorization']=`Bearer ${t}`;}
  return h;
}
async function handle<T>(res:Response):Promise<T>{
  if(!res.ok){const t=await res.text().catch(()=>'');throw new Error(`API ${res.status}: ${t||res.statusText}`);}
  return res.json();
}
import type { Survey, Question } from '@/types/survey';
export type AnswerValue = {optionId:string}|{optionIds:string[];other?:string}|{text:string}|{value:number}|{rows:Record<string,string|string[]>}|{orderedItemIds:string[]}|{audioUrl:string;duration:number;transcript?:string};
export interface AnswerPayload { questionId:string; value:AnswerValue; }
export interface SubmitResponseRequest { answers:AnswerPayload[]; respondentEmail?:string; durationSeconds?:number; }
export interface SubmitResponseResult { id:string; thankYouMessage?:string; }
export async function getPublicSurvey(id:string):Promise<Survey> {
  const res=await fetch(`${API}/api/v1/surveys/public/${id}`,{cache:'no-store'});
  const d=await handle<any>(res); return d.survey;
}
export async function submitResponse(surveyId:string,payload:SubmitResponseRequest):Promise<SubmitResponseResult> {
  const res=await fetch(`${API}/api/v1/surveys/${surveyId}/responses`,{method:'POST',headers:authH(),body:JSON.stringify(payload)});
  return handle<SubmitResponseResult>(res);
}
export async function uploadVoiceAnswer(surveyId:string,questionId:string,audioBlob:Blob,durationSec:number):Promise<{audioUrl:string;transcript?:string}> {
  const fd=new FormData();fd.append('audio',audioBlob,'recording.webm');fd.append('surveyId',surveyId);fd.append('questionId',questionId);fd.append('durationSec',String(durationSec));
  const h:Record<string,string>={};if(typeof window!=='undefined'){const t=localStorage.getItem('auth_token');if(t)h['Authorization']=`Bearer ${t}`;}
  const res=await fetch(`${API}/api/v1/surveys/voice-answer`,{method:'POST',headers:h,body:fd});
  return handle(res);
}
export interface SurveyStats {
  surveyId:string; totalResponses:number; completionRate:number; avgDurationSeconds:number;
  questions:{questionId:string;question:Question;stats:any}[];
}
export async function getSurveyStats(id:string):Promise<SurveyStats> {
  const res=await fetch(`${API}/api/v1/surveys/${id}/stats`,{headers:authH(),cache:'no-store'});
  return handle<SurveyStats>(res);
}
export async function exportResponsesCSV(surveyId:string):Promise<Blob> {
  const res=await fetch(`${API}/api/v1/surveys/${surveyId}/responses/export?format=csv`,{headers:authH()});
  if(!res.ok) throw new Error(`Export failed: ${res.status}`);
  return res.blob();
}
