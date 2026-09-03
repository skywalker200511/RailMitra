import { getToolNames } from './tools.js';

/**
 * Executes AI agent tool calls against the railway provider.
 * Maps tool names to provider methods and handles errors gracefully.
 */
export class ToolExecutor {
  /**
   * @param {import('../railway/railwayProvider.js').RailwayProvider} provider
   */
  constructor(provider) {
    this.provider = provider;
  }

  /**
   * Executes a named tool with the given arguments.
   * @param {string} toolName - Name of the tool to execute
   * @param {object} args - Arguments from the LLM function call
   * @returns {Promise<object>} Result data or { error: string }
   */
  async execute(toolName, args) {
    const validTools = getToolNames();

    if (!validTools.includes(toolName)) {
      return { error: `Unknown tool: "${toolName}". Available tools: ${validTools.join(', ')}` };
    }

    if (!this.provider) {
      return { error: 'Railway data provider is not configured.' };
    }

    try {
      switch (toolName) {
        case 'searchTrains':
          return await this.provider.searchTrains({
            from: args.from,
            to: args.to,
            date: args.date,
          });

        case 'getSeatAvailability':
          return await this.provider.getSeatAvailability({
            trainNumber: args.trainNumber,
            from: args.from,
            to: args.to,
            date: args.date,
            classType: args.classType,
            quota: args.quota || 'GN',
          });

        case 'getTrainRoute':
          return await this.provider.getTrainRoute({
            trainNumber: args.trainNumber,
          });

        case 'getLiveStatus':
          return await this.provider.getLiveStatus({
            trainNumber: args.trainNumber,
            date: args.date,
          });

        case 'getFare':
          return await this.provider.getFare({
            trainNumber: args.trainNumber,
            from: args.from,
            to: args.to,
            date: args.date,
            classType: args.classType,
            quota: args.quota || 'GN',
          });

        case 'searchStations':
          return await this.provider.searchStations({
            query: args.query,
          });

        default:
          return { error: `Tool "${toolName}" is recognized but execution is not implemented.` };
      }
    } catch (error) {
      console.error(`[TOOL_EXECUTOR] Error executing ${toolName}:`, error.message);
      return {
        error: `Failed to execute ${toolName}: ${error.message || 'Unknown error communicating with the railway data provider.'}`,
      };
    }
  }
}
