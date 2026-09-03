import { describe, it, expect, beforeAll } from 'vitest';
import { RailwayAgent } from '../agent/agent.js';
import { ToolExecutor } from '../agent/toolExecutor.js';
import { MockRailwayProvider } from '../railway/mockProvider.js';

describe('Agent and ToolExecutor', () => {
  const provider = new MockRailwayProvider();

  describe('Group 1: Unit tests (no API key needed)', () => {
    const executor = new ToolExecutor(provider);

    it('executor.execute("searchTrains") returns data', async () => {
      const data = await executor.execute('searchTrains', { from: 'CSMT', to: 'NDLS', date: '2026-09-15' });
      expect(data).toHaveProperty('trains');
      expect(Array.isArray(data.trains)).toBe(true);
    });

    it('executor.execute("getSeatAvailability") returns data', async () => {
      const data = await executor.execute('getSeatAvailability', {
        trainNumber: '12952',
        from: 'BCT',
        to: 'NDLS',
        date: '2026-09-15',
        classType: '3A'
      });
      expect(data).toHaveProperty('availability');
      expect(Array.isArray(data.availability)).toBe(true);
      expect(data.availability.length).toBeGreaterThan(0);
      expect(data.availability[0]).toHaveProperty('availablityStatus'); // Typo matches API
    });

    it('executor.execute("unknownTool") returns error object', async () => {
      const data = await executor.execute('unknownTool', {});
      expect(data).toHaveProperty('error');
    });

    it('executor.execute("searchTrains", {}) handles missing params gracefully', async () => {
      const data = await executor.execute('searchTrains', {});
      expect(data).toBeDefined();
    });

    // CRITICAL tests
    it('verifies that ToolExecutor returns raw data from provider without modification', async () => {
      // Mock the provider method temporarily to return a specific payload
      const originalSearch = provider.searchTrains;
      const dummyData = { fromStation: 'CSMT', toStation: 'NDLS', trains: [{ trainNumber: '99999', trainName: 'TEST EXPRESS' }] };
      provider.searchTrains = async () => dummyData;
      
      const data = await executor.execute('searchTrains', { from: 'CSMT', to: 'NDLS', date: '2026-09-15' });
      expect(data).toEqual(dummyData); // Exact match, no modification
      
      // Restore
      provider.searchTrains = originalSearch;
    });

    it('verifies that availability strings are preserved exactly as returned by provider', async () => {
      const originalAvail = provider.getSeatAvailability;
      const dummyAvail = {
        trainNumber: '12952',
        availability: [{ availablityDate: '2026-09-15', availablityStatus: 'AVAILABLE-0002' }]
      };
      provider.getSeatAvailability = async () => dummyAvail;

      const data = await executor.execute('getSeatAvailability', {
        trainNumber: '12952',
        from: 'BCT',
        to: 'NDLS',
        date: '2026-09-15',
        classType: '3A'
      });
      
      expect(data.availability[0].availablityStatus).toBe('AVAILABLE-0002');
      expect(data).toEqual(dummyAvail);

      provider.getSeatAvailability = originalAvail;
    });
  });

  describe.skipIf(!process.env.GEMINI_API_KEY)('Group 2: Integration tests (skipped without API key)', () => {
    let agent;
    beforeAll(() => {
      agent = new RailwayAgent(provider);
    });

    it('agent.chat("Find trains from Mumbai to Delhi tomorrow") reply should mention trains', async () => {
      const response = await agent.chat('Find trains from Mumbai to Delhi tomorrow');
      expect(response).toHaveProperty('reply');
      expect(response.reply.toLowerCase()).toContain('train');
    });

    it('agent.chat("Find trains from Mumbai to Delhi tomorrow") trainResults should be array', async () => {
      const response = await agent.chat('Find trains from Mumbai to Delhi tomorrow');
      expect(Array.isArray(response.trainResults)).toBe(true);
    });

    it('agent.chat("Find trains from Mumbai to Delhi tomorrow") dataSource should be "mock"', async () => {
      const response = await agent.chat('Find trains from Mumbai to Delhi tomorrow');
      expect(response.dataSource).toBe('mock');
    });
  });
});
