# Quick Start Guide - Gemini Webhook Workflow

## 🚀 5-Minute Setup

### 1. Import Workflow (1 min)
- Open n8n → Workflows → Import from File
- Select `mindcraft-ai-workflow-gemini-webhook.json`

### 2. Get Gemini API Key (2 min)
- Go to https://makersuite.google.com/app/apikey
- Click "Create API Key"
- Copy the key (starts with `AIza...`)

### 3. Configure Credentials (1 min)
- Click "Google Gemini Chat Model" node
- Add credential → Google Gemini (PaLM) API
- Paste your API key → Save

### 4. Activate & Test (1 min)
- Toggle "Active" switch (top right)
- Click "Execute Workflow" to test
- Or use the test script:
  ```bash
  # Linux/Mac
  chmod +x test-webhook.sh
  ./test-webhook.sh
  
  # Windows PowerShell
  .\test-webhook.ps1
  ```

### 5. Get Webhook URL
- Click "Webhook" node
- Copy the webhook URL
- Use it for daily automation

## 📋 Daily Automation Options

### Option 1: n8n Schedule (Easiest)
Add a Schedule Trigger node that calls the webhook internally.

### Option 2: System Cron
```bash
# Add to crontab (crontab -e)
0 2 * * * curl -X POST http://localhost:5678/webhook/generate-challenge -H "Content-Type: application/json" -d '{}'
```

### Option 3: Backend Cron
```typescript
import cron from 'node-cron';
cron.schedule('0 2 * * *', async () => {
  await fetch('http://localhost:5678/webhook/generate-challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
});
```

## 🧪 Testing

### Test All Skill Paths
```bash
curl -X POST http://localhost:5678/webhook/generate-challenge \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Test Specific Skill Path
```bash
curl -X POST http://localhost:5678/webhook/generate-challenge \
  -H "Content-Type: application/json" \
  -d '{"skillPathId": "your-skill-path-id"}'
```

## ✅ Checklist

- [ ] Workflow imported
- [ ] Gemini API key obtained
- [ ] Credentials configured
- [ ] Workflow activated
- [ ] Test execution successful
- [ ] Daily automation set up
- [ ] First challenge generated successfully

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "No credentials" | Add Google Gemini API key in node settings |
| "No active skill paths" | Create skill paths in your database with `isActive: true` |
| "Webhook 404" | Make sure workflow is activated |
| "Backend error" | Check backend is running and URL is correct |

## 📚 Full Documentation

See `GEMINI_WEBHOOK_SETUP.md` for detailed instructions.

