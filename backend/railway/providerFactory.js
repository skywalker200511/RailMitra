import config from '../config/index.js';
import { RailRadarProvider } from './railRadarProvider.js';
import { MockRailwayProvider } from './mockProvider.js';

/**
 * Factory to create the appropriate railway provider instance.
 * @returns {import('./railwayProvider.js').RailwayProvider}
 */
export function createProvider() {
  switch (config.railwayProvider) {
    case 'railradar':
      return new RailRadarProvider();
    case 'mock':
    default:
      return new MockRailwayProvider();
  }
}
