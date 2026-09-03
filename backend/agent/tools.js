/**
 * Tool definitions for Google Gemini Function Calling format.
 */
export const toolDefinitions = [
  {
    functionDeclarations: [
      {
        name: 'searchTrains',
        description: 'Search for trains between two railway stations on a specific date',
        parameters: {
          type: 'OBJECT',
          properties: {
            from: { type: 'STRING', description: 'Origin station code (e.g. NDLS)' },
            to: { type: 'STRING', description: 'Destination station code (e.g. CSMT)' },
            date: { type: 'STRING', description: 'Date of journey in YYYY-MM-DD format' }
          },
          required: ['from', 'to', 'date']
        }
      },
      {
        name: 'getSeatAvailability',
        description: 'Check seat availability for a specific train, class, and date',
        parameters: {
          type: 'OBJECT',
          properties: {
            trainNumber: { type: 'STRING', description: '5-digit train number' },
            from: { type: 'STRING', description: 'Origin station code' },
            to: { type: 'STRING', description: 'Destination station code' },
            date: { type: 'STRING', description: 'Date of journey in YYYY-MM-DD format' },
            classType: { type: 'STRING', description: 'Travel class (e.g., 1A, 2A, 3A, SL, CC, 2S)' },
            quota: { type: 'STRING', description: 'Quota (e.g., GN, TQ). Defaults to GN.' }
          },
          required: ['trainNumber', 'from', 'to', 'date', 'classType']
        }
      },
      {
        name: 'getTrainRoute',
        description: 'Get the full schedule and route of a train',
        parameters: {
          type: 'OBJECT',
          properties: {
            trainNumber: { type: 'STRING', description: '5-digit train number' }
          },
          required: ['trainNumber']
        }
      },
      {
        name: 'getLiveStatus',
        description: 'Get the real-time running status of a train',
        parameters: {
          type: 'OBJECT',
          properties: {
            trainNumber: { type: 'STRING', description: '5-digit train number' },
            date: { type: 'STRING', description: 'Optional date in YYYY-MM-DD format' }
          },
          required: ['trainNumber']
        }
      },
      {
        name: 'getFare',
        description: 'Calculate ticket fare for a journey',
        parameters: {
          type: 'OBJECT',
          properties: {
            trainNumber: { type: 'STRING', description: '5-digit train number' },
            from: { type: 'STRING', description: 'Origin station code' },
            to: { type: 'STRING', description: 'Destination station code' },
            date: { type: 'STRING', description: 'Date in YYYY-MM-DD format (optional but recommended)' },
            classType: { type: 'STRING', description: 'Travel class (e.g., 1A, 2A, 3A, SL, CC, 2S)' },
            quota: { type: 'STRING', description: 'Quota (e.g., GN). Defaults to GN.' }
          },
          required: ['trainNumber', 'from', 'to', 'classType']
        }
      },
      {
        name: 'searchStations',
        description: 'Search for railway stations by name or code',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: { type: 'STRING', description: 'Search query for station name or code' }
          },
          required: ['query']
        }
      }
    ]
  }
];

/**
 * Returns an array of available tool names
 * @returns {string[]}
 */
export const getToolNames = () => {
  return toolDefinitions[0].functionDeclarations.map(fn => fn.name);
};
