# AI Survey Chat Frontend

智能問卷客服系統 - 文字客服 MVP

## 🚀 本週五 Demo 功能

### ✅ 已完成
- **文字客服** - 即時 AI 對話
- **問卷系統** - 問卷填寫界面
- **管理後台** - 數據展示儀表板

### 🎯 核心功能
1. **AI 智能對話** - 整合 Claude API
2. **即時回應** - 流暢的對話體驗
3. **問卷填寫** - 多種題型支援
4. **數據展示** - 簡潔的後台界面

## 📦 技術棧

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **Icons**: Lucide React

## 🛠️ 安裝與啟動

### 1. 安裝依賴
```bash
npm install
```

### 2. 設定環境變數
複製 `.env.example` 為 `.env.local`:
```bash
cp .env.example .env.local
```

編輯 `.env.local`,填入:
```env
CLAUDE_API_KEY=your_claude_api_key_here
NEXT_PUBLIC_API_URL=https://ai-survey-api.onrender.com
```

### 3. 啟動開發伺服器
```bash
npm run dev
```

開啟瀏覽器訪問: http://localhost:3000

## 📁 專案結構

```
ai-survey-chat-frontend/
├── app/
│   ├── api/
│   │   └── chat/          # Claude API 路由
│   ├── chat/              # 文字客服頁面
│   ├── survey/            # 問卷頁面
│   ├── admin/             # 管理後台
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首頁
│   └── globals.css        # 全局樣式
├── components/            # 共用組件
├── lib/                   # 工具函數
├── public/                # 靜態資源
└── package.json
```

## 🚀 部署到 Vercel

### 方法一:透過 GitHub
1. 推送代碼到 GitHub
2. 連接 Vercel 帳號
3. Import Repository
4. 設定環境變數
5. Deploy

### 方法二:透過 CLI
```bash
npm install -g vercel
vercel login
vercel
```

## 🔑 環境變數說明

| 變數名稱 | 說明 | 必填 |
|---------|------|-----|
| `CLAUDE_API_KEY` | Claude API 密鑰 | ✅ |
| `NEXT_PUBLIC_API_URL` | 後端 API 地址 | ✅ |

## 📝 使用說明

### 文字客服
1. 點擊首頁的「文字客服」卡片
2. 在輸入框輸入問題
3. AI 會即時回覆
4. 支援多輪對話

### 問卷填寫
1. 點擊首頁的「問卷系統」卡片
2. 依序回答問題
3. 點擊「提交問卷」完成

### 管理後台
1. 點擊首頁的「管理後台」卡片
2. 查看統計數據
3. 瀏覽最近活動

## 🔄 下週計劃 (語音客服)

- [ ] Twilio 語音整合
- [ ] 實時語音對話
- [ ] 語音轉文字 (STT)
- [ ] 文字轉語音 (TTS)
- [ ] WebSocket 實時通訊

## 📞 聯絡方式

如有問題,請聯繫開發團隊。

---

**Demo 交付時間**: 本週五
**版本**: 1.0.0 (文字客服 MVP)
