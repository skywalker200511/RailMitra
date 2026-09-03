/**
 * Abstract base class for Railway Providers.
 * Defines the contract that all concrete railway provider implementations must fulfill.
 */
export class RailwayProvider {
  /**
   * Search for trains between two stations on a specific date.
   * @param {Object} params
   * @param {string} params.from - Source station code
   * @param {string} params.to - Destination station code
   * @param {string} params.date - Journey date (YYYY-MM-DD)
   * @returns {Promise<Array>} List of trains
   */
  async searchTrains({ from, to, date }) {
    throw new Error('Not implemented');
  }

  /**
   * Get seat availability for a specific train.
   * @param {Object} params
   * @param {string} params.trainNumber - Train number
   * @param {string} params.from - Source station code
   * @param {string} params.to - Destination station code
   * @param {string} params.date - Journey date (YYYY-MM-DD)
   * @param {string} params.classType - Class code (e.g., 3A, SL)
   * @param {string} params.quota - Quota code (e.g., GN, TQ)
   * @returns {Promise<Array>} Availability forecast
   */
  async getSeatAvailability({ trainNumber, from, to, date, classType, quota }) {
    throw new Error('Not implemented');
  }

  /**
   * Get the route/schedule for a specific train.
   * @param {Object} params
   * @param {string} params.trainNumber - Train number
   * @returns {Promise<Object>} Train route details
   */
  async getTrainRoute({ trainNumber }) {
    throw new Error('Not implemented');
  }

  /**
   * Get live running status for a train.
   * @param {Object} params
   * @param {string} params.trainNumber - Train number
   * @param {string} params.date - Journey start date (YYYY-MM-DD)
   * @returns {Promise<Object>} Live status details
   */
  async getLiveStatus({ trainNumber, date }) {
    throw new Error('Not implemented');
  }

  /**
   * Get fare details for a specific journey.
   * @param {Object} params
   * @param {string} params.trainNumber - Train number
   * @param {string} params.from - Source station code
   * @param {string} params.to - Destination station code
   * @param {string} params.date - Journey date (YYYY-MM-DD)
   * @param {string} params.classType - Class code
   * @param {string} params.quota - Quota code
   * @returns {Promise<Object>} Fare breakdown
   */
  async getFare({ trainNumber, from, to, date, classType, quota }) {
    throw new Error('Not implemented');
  }

  /**
   * Search for station codes by name or code.
   * @param {Object} params
   * @param {string} params.query - Search query string
   * @returns {Promise<Array>} List of matching stations
   */
  async searchStations({ query }) {
    throw new Error('Not implemented');
  }

  /**
   * Get the name of this provider.
   * @returns {string} Provider name
   */
  getProviderName() {
    throw new Error('Not implemented');
  }

  /**
   * Check if this is a live data provider or a mock.
   * @returns {boolean} True if live provider
   */
  isLiveProvider() {
    throw new Error('Not implemented');
  }
}
