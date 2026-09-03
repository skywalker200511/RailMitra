import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';
import { toolDefinitions } from './tools.js';
import { ToolExecutor } from './toolExecutor.js';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * AI Railway Agent — orchestrates conversation with Google Gemini
 * and executes railway tool calls against the provider.
 */
export class RailwayAgent {
  /**
   * @param {import('../railway/railwayProvider.js').RailwayProvider} provider
   */
  constructor(provider) {
    this.provider = provider;
    this.toolExecutor = new ToolExecutor(provider);
    this.sessions = new Map();

    // Initialize Gemini
    if (config.gemini.apiKey && config.gemini.apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: config.gemini.model,
        tools: toolDefinitions,
      });
      console.log(`[AGENT] Gemini initialized with model: ${config.gemini.model}`);
    } else {
      this.genAI = null;
      this.model = null;
      console.warn('[AGENT] Gemini API key not configured. AI features disabled.');
    }
  }

  /**
   * Generates the system prompt with current date/time in IST.
   * @returns {string}
   */
  _getSystemPrompt() {
    const currentIST = formatInTimeZone(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss zzz');
    const providerName = this.provider.getProviderName();
    const isLive = this.provider.isLiveProvider();

    return `You are RailMitra, an AI-powered Indian Railway search assistant.

CURRENT DATE/TIME: ${currentIST} (Asia/Kolkata timezone)
DATA SOURCE: ${isLive ? 'LIVE railway data via ' + providerName : 'DEMO/MOCK data (not real-time)'}

YOUR CAPABILITIES:
You have access to these tools to query railway data:
- searchTrains: Find trains between two stations on a date
- getSeatAvailability: Check seat availability for a specific train, class, and date
- getTrainRoute: Get the full route/schedule of a train
- getLiveStatus: Get real-time running status of a train
- getFare: Calculate ticket fare
- searchStations: Look up station codes

CRITICAL RULES:
1. NEVER invent or fabricate train information. ALL data must come from tool calls.
2. When showing availability:
   - "AVAILABLE-XXXX" means approximately XXXX seats/berths available
   - "RAC N" means Reservation Against Cancellation, position N
   - "WL#N", "GNWL", "PQWL" = waitlisted — NEVER say this is confirmed
   - "REGRET/WL" = no seats available at all
   - If API says "AVAILABLE" without a number, say "seats are available" — do NOT invent a count
3. PASSENGER COUNT: If user needs N seats and availability shows fewer, clearly state insufficient.
4. Station codes must be uppercase Indian Railways codes (e.g., NDLS, CSMT, BCT).
   Common mappings: Mumbai=CSMT/BCT/BDTS/LTT, Delhi=NDLS/DLI/NZM/ANVT
5. Dates must be YYYY-MM-DD format when calling tools.

SEARCH STRATEGY (minimize API calls):
1. Call searchTrains() first to find candidate trains
2. Filter results by departure time, train type client-side (no API call needed)
3. Call getSeatAvailability() ONLY for the top 3-5 relevant candidates
4. Call getFare() only if user specifically asks about pricing
5. DO NOT check availability for every class on every train

CONVERSATION RULES:
- Ask clarifying questions ONLY when essential info (origin or destination) is missing
- If class is not specified, search availability for common classes (3A, SL) and present options
- Explain which stations you searched and your reasoning
- Rank results: confirmed availability > matching departure time > shorter duration > lower fare${!isLive ? '\n- IMPORTANT: Remind the user that this is DEMO data, not live railway information.' : ''}`;
  }

  /**
   * Main chat method — processes user message through Gemini with tool calling.
   * @param {string} message - User's natural language query
   * @param {string} [sessionId] - Session identifier for conversation continuity
   * @returns {Promise<{reply: string, trainResults: any[], toolsUsed: string[], dataSource: string, sessionId: string}>}
   */
  async chat(message, sessionId) {
    // Generate session ID if not provided
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    // If Gemini is not configured, return helpful error
    if (!this.model) {
      return {
        reply: '⚠️ AI engine is not configured. Please set your GEMINI_API_KEY in the .env file. See SETUP.md for instructions.\n\nIn the meantime, you can use the direct API endpoints (GET /api/trains/between/:from/:to) to search for trains.',
        trainResults: [],
        toolsUsed: [],
        dataSource: this.provider.isLiveProvider() ? 'live' : 'mock',
        sessionId,
      };
    }

    try {
      // Initialize or retrieve session
      if (!this.sessions.has(sessionId)) {
        this.sessions.set(sessionId, {
          history: [
            { role: 'user', parts: [{ text: this._getSystemPrompt() }] },
            { role: 'model', parts: [{ text: 'Understood. I am RailMitra, your AI Indian Railway assistant. I will use the available tools to search for real railway data and never fabricate information. How can I help you with your train journey?' }] },
          ],
        });
      }

      const session = this.sessions.get(sessionId);

      // Trim history to prevent context window overflow (keep ~20 turns)
      if (session.history.length > 42) {
        session.history = [
          ...session.history.slice(0, 2),  // Keep system prompt exchange
          ...session.history.slice(-40),    // Keep recent conversation
        ];
      }

      // Start chat with history
      const chat = this.model.startChat({ history: session.history });

      let chatResult = await chat.sendMessage(message);
      let response = chatResult.response;
      let responseText = '';
      const toolsUsed = [];
      const trainResults = [];
      let iterations = 0;
      const MAX_ITERATIONS = 5;

      // Tool calling loop — Gemini may request multiple rounds of tool calls
      while (iterations < MAX_ITERATIONS) {
        iterations++;

        const functionCalls = response.functionCalls();

        if (!functionCalls || functionCalls.length === 0) {
          // No more tool calls — get the text response
          responseText = response.text();
          break;
        }

        console.log(`[AGENT] Tool calls (iteration ${iterations}):`, functionCalls.map(c => c.name));

        let toolResultsText = 'Here are the results of the tool calls you requested:\n\n';

        const toolPromises = functionCalls.map(async (call) => {
          toolsUsed.push(call.name);
          const result = await this.toolExecutor.execute(call.name, call.args);
          return { call, result };
        });

        const completedTools = await Promise.all(toolPromises);

        for (const { call, result } of completedTools) {
          let optimizedResult = result;
          
          if (call.name === 'searchTrains' && !result.error) {
            const trains = result.trains || result;
            if (Array.isArray(trains)) {
              trainResults.push(...trains);
              // Massively reduce payload to AI to prevent 30-second timeouts
              optimizedResult = trains.map(t => ({
                number: t.trainNumber,
                name: t.trainName,
                dep: t.departureTime,
                arr: t.arrivalTime
              })).slice(0, 15);
            }
          }

          toolResultsText += `Tool Name: ${call.name}\nResult: ${JSON.stringify(optimizedResult)}\n\n`;
        }

        // Send tool results back to Gemini as a standard text message to avoid API role errors
        chatResult = await chat.sendMessage(toolResultsText);
        response = chatResult.response;
      }

      if (iterations >= MAX_ITERATIONS && !responseText) {
        responseText = 'I completed my search but reached the maximum number of tool calls. Here is what I found based on the data retrieved so far.';
      }

      // Update session history
      session.history = await chat.getHistory();

      return {
        reply: responseText || 'I processed your request but have no additional information to share.',
        trainResults,
        toolsUsed: [...new Set(toolsUsed)],
        dataSource: this.provider.isLiveProvider() ? 'live' : 'mock',
        sessionId,
      };

    } catch (error) {
      console.error('[AGENT] Chat error:', error.message);

      // Provide specific error messages
      let errorMessage = 'I encountered an error while processing your request.';

      if (error.message?.includes('API key')) {
        errorMessage = '⚠️ Invalid Gemini API key. Please check your GEMINI_API_KEY in the .env file.';
      } else if (error.message?.includes('quota') || error.message?.includes('rate')) {
        errorMessage = '⚠️ AI API rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message?.includes('fetch') || error.message?.includes('network')) {
        errorMessage = '⚠️ Network error connecting to the AI service. Please check your internet connection.';
      } else {
        errorMessage += ` Error: ${error.message}`;
      }

      return {
        reply: errorMessage,
        trainResults: [],
        toolsUsed: [],
        dataSource: this.provider.isLiveProvider() ? 'live' : 'mock',
        sessionId,
      };
    }
  }

  /**
   * Clears a session's conversation history.
   * @param {string} sessionId
   */
  clearSession(sessionId) {
    this.sessions.delete(sessionId);
  }
}
