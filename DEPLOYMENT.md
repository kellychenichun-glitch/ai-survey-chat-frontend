# 🚀 部署指南 - AI Survey Chat Frontend

## 本週五 Demo 部署流程

### 📋 前置準備

1. **取得 Claude API Key**
   - 訪問 https://console.anthropic.com/
   - 建立 API Key
   - 複製保存

2. **準備 GitHub 帳號**
   - 註冊/登入 GitHub
   - 準備推送代碼

3. **準備 Vercel 帳號**
   - 訪問 https://vercel.com
   - 使用 GitHub 登入

---

## 🎯 方案一:快速部署 (推薦)

### Step 1: 推送到 GitHub

```bash
# 初始化 Git
cd ai-survey-chat-frontend
git init
git add .
git commit -m "Initial commit: 文字客服 MVP"

# 建立 GitHub Repository 並推送
# (在 GitHub 網站建立新 repository)
git remote add origin https://github.com/你的用戶名/ai-survey-chat.git
git branch -M main
git push -u origin main
```

### Step 2: 連接 Vercel

1. 登入 https://vercel.com
2. 點擊 "Add New Project"
3. Import 你的 GitHub repository
4. 設定環境變數:
   - `CLAUDE_API_KEY`: 你的 Claude API Key
   - `NEXT_PUBLIC_API_URL`: `https://ai-survey-api.onrender.com`
5. 點擊 "Deploy"
6. 等待 2-3 分鐘完成部署

### Step 3: 測試

部署完成後,Vercel 會提供網址,例如:
```
https://ai-survey-chat-xxx.vercel.app
```

訪問並測試:
- ✅ 首頁載入
- ✅ 文字客服功能
- ✅ 問卷系統
- ✅ 管理後台

---

## 🛠️ 方案二:本地測試

### Step 1: 安裝依賴
```bash
cd ai-survey-chat-frontend
npm install
```

### Step 2: 設定環境變數
```bash
cp .env.example .env.local
```

編輯 `.env.local`:
```env
CLAUDE_API_KEY=sk-ant-xxx...
NEXT_PUBLIC_API_URL=https://ai-survey-api.onrender.com
```

### Step 3: 啟動開發環境
```bash
npm run dev
```

訪問 http://localhost:3000

### Step 4: 建立生產版本
```bash
npm run build
npm start
```

---

## 🔧 常見問題排除

### Q1: Claude API 調用失敗
**症狀**: 聊天無法回應,顯示錯誤訊息

**解決方案**:
1. 檢查 `CLAUDE_API_KEY` 是否正確
2. 確認 API Key 有效且未過期
3. 檢查 API 用量配額

### Q2: 無法連接後端 API
**症狀**: 問卷無法載入

**解決方案**:
1. 確認 `NEXT_PUBLIC_API_URL` 正確
2. 確認後端 API 正常運行
3. 檢查 CORS 設定

### Q3: 部署後樣式錯誤
**症狀**: Tailwind CSS 未載入

**解決方案**:
```bash
# 重新建立
npm run build
```

確保 `tailwind.config.js` 和 `postcss.config.js` 存在

### Q4: 環境變數未生效
**症狀**: Vercel 部署後環境變數讀不到

**解決方案**:
1. 前往 Vercel Dashboard
2. Project Settings → Environment Variables
3. 重新設定變數
4. Redeploy

---

## 📊 Demo 檢查清單

### 部署前
- [ ] 代碼已推送到 GitHub
- [ ] 環境變數已設定
- [ ] 本地測試通過

### 部署中
- [ ] Vercel 連接成功
- [ ] 建置無錯誤
- [ ] 部署完成

### Demo 測試
- [ ] 首頁正常載入
- [ ] 文字客服可以對話
- [ ] AI 回應正常
- [ ] 問卷可以填寫
- [ ] 問卷可以提交
- [ ] 管理後台顯示正常

---

## 🎨 自訂調整

### 修改品牌顏色
編輯 `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#你的顏色',
        100: '#你的顏色',
        // ...
      },
    },
  },
}
```

### 修改 AI 系統提示
編輯 `app/api/chat/route.ts`:
```typescript
system: '你的系統提示文字...'
```

### 修改首頁文案
編輯 `app/page.tsx` 中的文字內容

---

## 📞 Demo 演示腳本

### 1. 開場 (30 秒)
"這是我們的 AI 智能問卷客服系統,整合了文字客服和問卷功能"

### 2. 文字客服展示 (2 分鐘)
1. 點擊「文字客服」
2. 輸入問題: "你們的營業時間?"
3. 展示 AI 即時回應
4. 多輪對話展示

### 3. 問卷系統展示 (1 分鐘)
1. 點擊「問卷系統」
2. 展示問卷填寫界面
3. 填寫並提交問卷

### 4. 管理後台展示 (1 分鐘)
1. 點擊「管理後台」
2. 展示統計數據
3. 展示活動記錄

### 5. 總結 (30 秒)
"這是第一週的文字客服 MVP,下週我們會加入語音客服功能"

---

## 🔜 下週計劃

- [ ] Twilio 語音整合
- [ ] 實時語音對話
- [ ] 完整的對話記錄
- [ ] 進階分析功能

---

**準備時間**: 2-3 小時
**Demo 時間**: 本週五
**聯絡方式**: 如有問題請隨時聯繫
