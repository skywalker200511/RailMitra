# RailMitra — Setup Guide

## Prerequisites
- Node.js v18+ (check with `node --version`)
- npm (comes with Node.js, check with `npm --version`)
- A text editor (VS Code recommended)

## Step 1: Install Dependencies
```bash
# Clone or download the project, then:

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

## Step 2: Quick Start (Demo Mode)
You can run immediately with mock data — no API keys needed!
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```
Visit http://localhost:3000 — look for the orange 'DEMO DATA' badge.

## Step 3: Set Up Google AI (Gemini) API Key
1. Go to https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click 'Create API Key'
4. Copy the key

## Step 4: Set Up RailRadar API Key (for Live Railway Data)
1. Go to https://railradar.in/developers
2. Create a free account (no credit card required)
3. Generate an API key from the dashboard
4. Your key will start with 'rr_live_'
5. Free tier: 1,000 requests/month

## Step 5: Configure Environment Variables
1. In the project root (RailMitra/), copy the example:
   ```bash
   cp .env.example .env
   ```
   On Windows: `copy .env.example .env`

2. Open `.env` in your text editor and fill in:
   ```
   RAILWAY_PROVIDER=railradar
   RAILRADAR_API_KEY=rr_live_YOUR_ACTUAL_KEY
   GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_KEY
   AI_MODEL=gemini-2.0-flash
   ```

## Step 6: Start with Live Data
```bash
# Terminal 1
cd backend
npm run dev
# Should show: Provider: railradar, Data: 🟢 LIVE

# Terminal 2
cd frontend
npm run dev
```

## Step 7: Test the Agent
Try these prompts:
1. "Find trains from Mumbai to Delhi tomorrow"
2. "Search for trains from Pune to Goa on 15 September with 3AC"
3. "I need 3 confirmed seats from Mumbai to Delhi in sleeper class"
4. "What is the fastest train from Delhi to Kolkata?"
5. "Show me the route of train 12952"
6. "What is the live status of Rajdhani Express?"
7. "Find alternatives if there are no confirmed seats from Mumbai to Pune this weekend"

## Step 8: Troubleshooting

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid API key" | Wrong or missing API key | Check .env file values |
| "API quota exceeded" | Hit RailRadar free limit | Wait for monthly reset or upgrade plan |
| "No trains found" | Invalid station or no service | Check station names/codes |
| "Station not recognized" | Typo or unknown station | Try full city name (e.g., "Mumbai" not "MUM") |
| "AI API error" | Gemini key issue | Verify GEMINI_API_KEY in .env |
| "RailRadar unavailable" | API server down | Use RAILWAY_PROVIDER=mock temporarily |
| "Cannot find module" | Dependencies not installed | Run `npm install` in both backend/ and frontend/ |
| Port already in use | Another app on port 3001/3000 | Change PORT in .env or stop the other app |

### Changing the AI Model
Edit AI_MODEL in .env:
- `gemini-2.0-flash` — Fast, recommended (default)
- `gemini-1.5-pro` — More capable, slower
- `gemini-1.5-flash` — Balanced

### Switching Railway Providers
Set RAILWAY_PROVIDER in .env:
- `mock` — Demo data, no API key needed
- `railradar` — Live data, requires RAILRADAR_API_KEY
