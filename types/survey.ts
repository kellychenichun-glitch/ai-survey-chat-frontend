/**
 * AI Survey Chat System — Survey Types
 * 支援題型:單選 / 多選 / 短文字 / 長文字 / 評分 / 矩陣 / 排序 / 語音
 */

export type QuestionType =
  | 'single_choice'
  | 'multi_choice'
  | 'text_short'
  | 'text_long'
  | 'rating'
  | 'matrix'
  | 'ranking'
  | 'voice';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  order: number;
}
export interface ChoiceOption { id: string; text: string; }
export interface ChoiceQuestion extends BaseQuestion {
  type: 'single_choice' | 'multi_choice';
  options: ChoiceOption[];
  allowOther?: boolean;
  randomize?: boolean;
  minSelect?: number;
  maxSelect?: number;
}
export interface TextQuestion extends BaseQuestion {
  type: 'text_short' | 'text_long';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}
export interface RatingQuestion extends BaseQuestion {
  type: 'rating';
  scale: 5 | 10;
  style: 'stars' | 'numbers' | 'nps';
  minLabel?: string;
  maxLabel?: string;
}
export interface MatrixQuestion extends BaseQuestion {
  type: 'matrix';
  rows: ChoiceOption[];
  columns: ChoiceOption[];
  inputType: 'radio' | 'checkbox';
}
export interface RankingQuestion extends BaseQuestion { type: 'ranking'; items: ChoiceOption[]; }
export interface VoiceQuestion extends BaseQuestion {
  type: 'voice';
  maxDurationSec: number;
  language: 'zh-TW' | 'en-US' | 'ja-JP' | 'zh-CN';
  transcribe: boolean;
  aiAnalyze: boolean;
}
export type Question = ChoiceQuestion | TextQuestion | RatingQuestion | MatrixQuestion | RankingQuestion | VoiceQuestion;
export interface SurveySettings {
  allowAnonymous: boolean;
  showProgressBar: boolean;
  randomizeQuestions: boolean;
  estimatedMinutes?: number;
  closingAt?: string | null;
  thankYouMessage?: string;
}
export interface Survey {
  id?: string | number;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'closed';
  questions: Question[];
  settings: SurveySettings;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single_choice:'單選題', multi_choice:'多選題', text_short:'簡答題',
  text_long:'長回答題', rating:'評分題', matrix:'矩陣題',
  ranking:'排序題', voice:'語音題'
};
export const QUESTION_TYPE_DESCRIPTIONS: Record<QuestionType, string> = {
  single_choice:'從多個選項中選一個', multi_choice:'可勾選多個選項',
  text_short:'單行文字輸入', text_long:'多行文字、意見回饵',
  rating:'星等、分數、NPS 推薦指數', matrix:'多個題目共用同一組答案',
  ranking:'拖曳排序項目', voice:'錄音回答(可自動轉文字)'
};
function randId() { return crypto.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2,9)}`; }
export function createQuestion(type: QuestionType, order: number): Question {
  const base = { id: randId(), title: '', required: false, order };
  switch (type) {
    case 'single_choice': case 'multi_choice':
      return { ...base, type, options: [{ id: randId(), text: '選项1' }, { id: randId(), text: '選项2' }], allowOther: false, randomize: false };
    case 'text_short': return { ...base, type, placeholder: '請輸入回答', maxLength: 200 };
    case 'text_long': return { ...base, type, placeholder: '請詳細描述', maxLength: 2000 };
    case 'rating': return { ...base, type, scale: 5 as 5|10, style: 'stars' as const, minLabel: '很不満意', maxLabel: '非常満意' };
    case 'matrix': return { ...base, type, rows: [{ id: randId(), text: '項目1' },{ id: randId(), text: '項目2' }], columns: [{ id: randId(), text: '差' },{ id: randId(), text: '普通' },{ id: randId(), text: '好' }], inputType: 'radio' as const };
    case 'ranking': return { ...base, type, items: [{ id: randId(), text: '項目A' },{ id: randId(), text: '項目B' },{ id: randId(), text: '項目C' }] };
    case 'voice': return { ...base, type, maxDurationSec: 60, language: 'zh-TW' as const, transcribe: true, aiAnalyze: true };
  }
}
export function createEmptySurvey(): Survey {
  return {
    title: '未命名問卷', description: '', status: 'draft', questions: [],
    settings: { allowAnonymous: true, showProgressBar: true, randomizeQuestions: false, thankYouMessage: '謝謝你的填答！' }
  };
}
