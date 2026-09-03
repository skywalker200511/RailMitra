import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import { createProvider } from './railway/providerFactory.js';
import { RailwayAgent } from './agent/agent.js';
import { createAgentRoutes } from './routes/agentRoutes.js';
import { createTrainRoutes } from './routes/trainRoutes.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// ─── Initialize ──────────────────────────────────────────────

const app = express();

// Create railway data provider
const provider = createProvider();
console.log(`[INIT] Railway provider: ${provider.getProviderName()} (${provider.isLiveProvider() ? 'LIVE' : 'MOCK'} data)`);

// Create AI agent
const agent = new RailwayAgent(provider);
console.log(`[INIT] AI model: ${config.gemini.model}`);

// ─── Middleware ───────────────────────────────────────────────

// CORS — allow frontend origin
app.use(cors({
  origin: config.frontendUrl,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Parse JSON bodies (limit size to prevent abuse)
app.use(express.json({ limit: '10kb' }));

// Rate limiting
app.use(generalLimiter);

// Request timeout (30 seconds)
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    res.status(408).json({
      success: false,
      error: {
        code: 'REQUEST_TIMEOUT',
        message: 'Request timed out. Please try again.',
      },
    });
  });
  next();
});

// ─── Routes ──────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      provider: provider.getProviderName(),
      isLive: provider.isLiveProvider(),
      aiModel: config.gemini.model,
      timestamp: new Date().toISOString(),
    },
  });
});

// AI Agent chat
app.use('/api/agent', createAgentRoutes(agent));

// Direct train data API
app.use('/api/trains', createTrainRoutes(provider));

// ─── Error Handling ──────────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────

const PORT = config.port;

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║       🚂 RailMitra — AI Railway Agent        ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Server:    http://localhost:${PORT}             ║`);
  console.log(`║  Provider:  ${(provider.getProviderName()).padEnd(32)}║`);
  console.log(`║  Data:      ${(provider.isLiveProvider() ? '🟢 LIVE' : '🟠 DEMO / MOCK').padEnd(32)}║`);
  console.log(`║  AI Model:  ${config.gemini.model.padEnd(32)}║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  if (!provider.isLiveProvider()) {
    console.log('⚠️  Running with MOCK data. Set RAILRADAR_API_KEY in .env for live data.');
  }
  if (!config.gemini.apiKey || config.gemini.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    console.log('⚠️  No Gemini API key configured. Set GEMINI_API_KEY in .env for AI features.');
  }
  console.log('');
});

export default app;
