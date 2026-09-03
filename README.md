# RailMitra — AI Railway Search Agent

An AI-powered Indian Railway search agent that understands natural language queries about trains, seat availability, fares, routes, and live running status.

**Ask questions like:**
> "Find me trains from Mumbai to Delhi tomorrow after 6 PM with confirmed 3AC seats."

The AI agent understands the request, searches railway data via the RailRadar API, checks seat availability, filters results, and returns the most relevant trains.

## Architecture

```
User → React Frontend → Node.js Backend → AI Agent (Gemini)
                                              ↓
                                         Agent Tools
                                    ├── searchTrains()
                                    ├── getSeatAvailability()
                                    ├── getTrainRoute()
                                    ├── getLiveStatus()
                                    └── getFare()
                                              ↓
                                     Railway Provider
                                    ├── RailRadarProvider (live)
                                    └── MockProvider (demo)
                                              ↓
                                      Railway Data
```

## Key Features

- **Natural Language Understanding** — Ask about trains in plain English/Hindi
- **Smart API Optimization** — ~4 API calls per query instead of 150+
- **Accurate Availability** — Never fabricates seat counts; preserves exact API data
- **Passenger Count Validation** — Checks if enough seats are available for your group
- **Multi-Station Resolution** — "Mumbai" searches CSMT, BCT, BDTS, LTT automatically
- **Natural Date Parsing** — Understands "tomorrow", "next Friday", "15 September"
- **Provider Abstraction** — Swap railway data providers without rewriting the agent
- **Mock Mode** — Works without API keys for development/demo

## AI Agent Architecture

The agent uses Google Gemini with native function/tool calling:
1. User sends a natural language query
2. Gemini extracts intent: origin, destination, date, class, passengers, preferences
3. Agent calls `searchTrains()` to find candidate trains
4. Filters results client-side (departure time, train type) — zero API calls
5. Calls `getSeatAvailability()` only for top candidates (max 3-5)
6. Validates passenger count against available seats
7. Ranks results by: confirmed availability → departure time → duration → fare
8. Returns structured results with explanation

## Railway API Architecture

Providers implement a common interface:
```
RailwayProvider (abstract)
├── searchTrains({ from, to, date })
├── getSeatAvailability({ trainNumber, from, to, date, classType, quota })
├── getTrainRoute({ trainNumber })
├── getLiveStatus({ trainNumber, date })
├── getFare({ trainNumber, from, to, date, classType, quota })
└── searchStations({ query })
```

Current providers:
- **RailRadarProvider** — Live data from RailRadar API (https://api.railradar.in/v1)
- **MockRailwayProvider** — Realistic demo data for development

### How to Add a New Provider
1. Create `newProvider.js` implementing the RailwayProvider interface
2. Add it to `providerFactory.js`
3. Set `RAILWAY_PROVIDER=newprovider` in .env

## API Request Optimization

The agent minimizes API calls:
```
User: "Mumbai to Delhi tomorrow after 6 PM, confirmed 3AC"

1. searchTrains(CSMT→NDLS)          → 1 API call
2. Filter by departure ≥ 18:00      → 0 calls (client-side)
3. getSeatAvailability(top 3, 3AC)  → 3 calls
4. Filter AVAILABLE only            → 0 calls (client-side)

Total: 4 API calls (vs. 150+ naively)
```

Every API call is logged to console + `api_requests.log` with timestamp, endpoint, response time.

## Availability Interpretation

| API Returns | Meaning | Display |
|-------------|---------|--------|
| AVAILABLE-0025 | ~25 seats available | ✅ Available (~25 seats) |
| RAC 12 | Reservation Against Cancellation | ⚠️ RAC 12 |
| GNWL24/WL11 | Waitlisted | ❌ GNWL24/WL11 |
| REGRET/WL | No availability | ❌ Not Available |
| AVAILABLE | Available (count unknown) | ✅ Available |

The agent **never** invents seat counts. If the API doesn't provide a number, it says "seats are available" without guessing.

## Limitations

- RailRadar is a third-party API — data may not always match official IRCTC
- Free tier: 1,000 requests/month (mock provider available for development)
- Live status may have slight delays vs. real-time NTES data
- No booking capability — search and information only
- AI responses depend on Gemini API availability

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express |
| AI | Google Gemini (gemini-2.0-flash) |
| Railway API | RailRadar |
| Frontend | React + Vite |
| Testing | Vitest |

## Quick Start

See [SETUP.md](SETUP.md) for detailed instructions.

```bash
# Demo mode (no API keys needed)
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
# Visit http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| GEMINI_API_KEY | Yes (for AI) | Google AI Studio API key |
| RAILRADAR_API_KEY | No (mock works) | RailRadar API key for live data |
| RAILWAY_PROVIDER | No | 'mock' (default) or 'railradar' |
| AI_MODEL | No | Gemini model name (default: gemini-2.0-flash) |
| PORT | No | Backend port (default: 3001) |
| FRONTEND_URL | No | Frontend URL for CORS (default: http://localhost:3000) |

## License
MIT
