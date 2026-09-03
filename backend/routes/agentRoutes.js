import { Router } from 'express';
import { validateChatRequest } from '../middleware/validator.js';
import { agentChatLimiter } from '../middleware/rateLimiter.js';

/**
 * Creates the agent chat routes.
 * @param {import('../agent/agent.js').RailwayAgent} agent
 */
export function createAgentRoutes(agent) {
  const router = Router();

  /**
   * POST /api/agent/chat
   * Main AI agent endpoint. Accepts natural language queries about trains.
   *
   * Body: { message: string, sessionId?: string }
   * Response: { success, reply, trainResults[], dataSource, toolsUsed[] }
   */
  router.post('/chat', agentChatLimiter, validateChatRequest, async (req, res, next) => {
    try {
      const { message, sessionId } = req.body;

      console.log(`[AGENT] Chat request — session: ${sessionId || 'new'}, message: "${message.substring(0, 80)}..."`);

      const result = await agent.chat(message, sessionId);

      res.json({
        success: true,
        reply: result.reply,
        trainResults: result.trainResults || [],
        dataSource: result.dataSource,
        toolsUsed: result.toolsUsed || [],
        sessionId: result.sessionId || sessionId,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
