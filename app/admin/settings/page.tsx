'use client';
import { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com';

interface SystemSettings { ai_model: string; max_tokens: number; temperature: number; system_prompt: string; welcome_message: string; }

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`${API}/api/settings`).then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true); setMsg('');
    try {
      await fetch(`${API}/api/settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      setMsg('Saved!');
    } catch { setMsg('Error saving.'); }
    setSaving(false);
  };

  if (!settings) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">AI Model</label>
          <input value={settings.ai_model} onChange={e => setSettings({...settings, ai_model: e.target.value})}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Tokens</label>
          <input type="number" value={settings.max_tokens} onChange={e => setSettings({...settings, max_tokens: +e.target.value})}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Temperature</label>
          <input type="number" step="0.1" min="0" max="2" value={settings.temperature} onChange={e => setSettings({...settings, temperature: +e.target.value})}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">System Prompt</label>
          <textarea rows={4} value={settings.system_prompt} onChange={e => setSettings({...settings, system_prompt: e.target.value})}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Welcome Message</label>
          <textarea rows={2} value={settings.welcome_message} onChange={e => setSettings({...settings, welcome_message: e.target.value})}
            className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {msg && <span className="text-sm text-green-600">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
