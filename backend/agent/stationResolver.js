/**
 * Built-in mapping of major cities to their primary railway station codes
 */
const CITY_STATION_MAP = {
  mumbai: [
    { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus' },
    { code: 'BCT', name: 'Mumbai Central' },
    { code: 'BDTS', name: 'Bandra Terminus' },
    { code: 'LTT', name: 'Lokmanya Tilak Terminus' }
  ],
  delhi: [
    { code: 'NDLS', name: 'New Delhi' },
    { code: 'DLI', name: 'Old Delhi' },
    { code: 'ANVT', name: 'Anand Vihar Terminal' },
    { code: 'NZM', name: 'Hazrat Nizamuddin' }
  ],
  kolkata: [
    { code: 'HWH', name: 'Howrah Junction' },
    { code: 'SDAH', name: 'Sealdah' },
    { code: 'KOAA', name: 'Kolkata Chitpur' }
  ],
  chennai: [
    { code: 'MAS', name: 'Chennai Central' },
    { code: 'MS', name: 'Chennai Egmore' }
  ],
  bangalore: [
    { code: 'SBC', name: 'KSR Bengaluru' },
    { code: 'YPR', name: 'Yesvantpur Junction' }
  ],
  bengaluru: [
    { code: 'SBC', name: 'KSR Bengaluru' },
    { code: 'YPR', name: 'Yesvantpur Junction' }
  ],
  hyderabad: [
    { code: 'SC', name: 'Secunderabad Junction' },
    { code: 'HYB', name: 'Hyderabad Deccan' }
  ],
  pune: [{ code: 'PUNE', name: 'Pune Junction' }],
  ahmedabad: [{ code: 'ADI', name: 'Ahmedabad Junction' }],
  goa: [
    { code: 'MAO', name: 'Madgaon Junction' },
    { code: 'KRMI', name: 'Karmali' }
  ],
  jaipur: [{ code: 'JP', name: 'Jaipur Junction' }],
  lucknow: [
    { code: 'LKO', name: 'Lucknow Charbagh' },
    { code: 'LJN', name: 'Lucknow Junction' }
  ],
  patna: [{ code: 'PNBE', name: 'Patna Junction' }],
  bhopal: [{ code: 'BPL', name: 'Bhopal Junction' }],
  varanasi: [{ code: 'BSB', name: 'Varanasi Junction' }],
  'new delhi': [{ code: 'NDLS', name: 'New Delhi' }],
  bandra: [{ code: 'BDTS', name: 'Bandra Terminus' }]
};

const AIRPORT_CODE_MAP = {
  BOM: { target: 'CSMT', city: 'Mumbai' },
  DEL: { target: 'NDLS', city: 'Delhi' }
};

/**
 * Resolves a city name or station code to its railway station details.
 * @param {string} input - City name or station code
 * @param {object} [provider] - Optional railway provider to search stations if not in built-in map
 * @returns {Promise<{ stations: Array<{code: string, name: string}>, isCity: boolean, warning?: string }>}
 */
export const resolveStation = async (input, provider = null) => {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  
  // Check if it's an airport code mapping
  const upper = trimmed.toUpperCase();
  if (AIRPORT_CODE_MAP[upper]) {
    const { target, city } = AIRPORT_CODE_MAP[upper];
    return {
      stations: CITY_STATION_MAP[city.toLowerCase()].filter(s => s.code === target),
      isCity: true,
      warning: `Airport code ${upper} detected. Mapping to primary railway station ${target} in ${city}.`
    };
  }

  // Check built-in city map
  if (CITY_STATION_MAP[lower]) {
    return {
      stations: CITY_STATION_MAP[lower],
      isCity: true
    };
  }

  // If uppercase and 2-5 characters, assume it's a direct station code
  if (/^[A-Z]{2,5}$/.test(trimmed)) {
    return {
      stations: [{ code: upper, name: upper }],
      isCity: false
    };
  }

  // Fallback to provider search if available
  if (provider && typeof provider.searchStations === 'function') {
    try {
      const results = await provider.searchStations({ query: trimmed });
      if (results && results.length > 0) {
        // Assuming provider returns an array of objects with code and name
        return {
          stations: results.map(r => ({ code: r.code, name: r.name })),
          isCity: false
        };
      }
    } catch (err) {
      console.error(`Provider station search failed for ${trimmed}:`, err);
    }
  }

  // Default fallback (returns whatever was inputted assuming it's the closest representation)
  return {
    stations: [{ code: upper, name: trimmed }],
    isCity: false
  };
};
