import config from '../config/index.js';
import { logApiRequest } from '../utils/apiLogger.js';
import { RailwayProvider } from './railwayProvider.js';

/**
 * RailRadar API Implementation.
 */
export class RailRadarProvider extends RailwayProvider {
  constructor() {
    super();
    this.baseUrl = config.railradar.baseUrl || 'https://api.railradar.in/v1';
    this.apiKey = config.railradar.apiKey;
  }

  async _fetch(endpoint, params = {}) {
    const startTime = Date.now();
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) url.searchParams.append(key, params[key]);
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let status = 0;
    let success = false;
    let errorMsg = '';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      status = response.status;
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${status}`);
      }

      const json = await response.json();
      
      if (!json.success) {
        throw new Error(json.meta?.message || 'API error');
      }

      success = true;
      return json.data;
    } catch (error) {
      errorMsg = error.message;
      if (error.name === 'AbortError') {
        errorMsg = 'Request timed out after 15s';
        status = 408; // Timeout
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      // Basic extraction for logging
      const trainNumberMatch = endpoint.match(/\/trains\/([A-Za-z0-9]+)/);
      const trainNumber = trainNumberMatch ? trainNumberMatch[1] : undefined;
      
      logApiRequest({
        endpoint,
        trainNumber,
        from: params.source || params.from || (endpoint.includes('between') ? url.pathname.split('/')[4] : undefined),
        to: params.destination || params.to || (endpoint.includes('between') ? url.pathname.split('/')[5] : undefined),
        date: params.date || params.journeyDate,
        status,
        responseTime,
        success,
        error: errorMsg
      });
    }
  }

  async searchTrains({ from, to, date }) {
    return this._fetch(`/trains/between/${from}/${to}`, { date, byCity: 'true' });
  }

  async getSeatAvailability({ trainNumber, from, to, date, classType, quota }) {
    return this._fetch(`/trains/${trainNumber}/seats`, {
      source: from,
      destination: to,
      journeyDate: date,
      classCode: classType,
      quotaCode: quota
    });
  }

  async getTrainRoute({ trainNumber }) {
    return this._fetch(`/trains/${trainNumber}`, { haltsOnly: 'true' });
  }

  async getLiveStatus({ trainNumber, date }) {
    return this._fetch(`/trains/${trainNumber}/live`, { date });
  }

  async getFare({ trainNumber, from, to, date, classType, quota }) {
    return this._fetch(`/trains/${trainNumber}/fare`, {
      source: from,
      destination: to,
      journeyDate: date,
      classCode: classType,
      quotaCode: quota
    });
  }

  async searchStations({ query }) {
    return this._fetch(`/lookup/search/stations`, { q: query, limit: 10 });
  }

  getProviderName() {
    return 'RailRadar';
  }

  isLiveProvider() {
    return true;
  }
}
