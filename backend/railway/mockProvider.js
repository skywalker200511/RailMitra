import { RailwayProvider } from './railwayProvider.js';

/**
 * Mock Railway Provider for development and demo mode.
 * Returns realistic Indian Railways data without needing an API key.
 * isLiveProvider() returns false — UI shows "DEMO DATA" badge.
 */

// ─── Station Database ────────────────────────────────────────

const STATIONS = [
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus' },
  { code: 'BCT', name: 'Mumbai Central' },
  { code: 'BDTS', name: 'Bandra Terminus' },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus' },
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'DLI', name: 'Old Delhi' },
  { code: 'NZM', name: 'Hazrat Nizamuddin' },
  { code: 'ANVT', name: 'Anand Vihar Terminal' },
  { code: 'DEE', name: 'Delhi Sarai Rohilla' },
  { code: 'MAO', name: 'Madgaon Junction' },
  { code: 'KRMI', name: 'Karmali' },
  { code: 'PUNE', name: 'Pune Junction' },
  { code: 'HWH', name: 'Howrah Junction' },
  { code: 'SDAH', name: 'Sealdah' },
  { code: 'KOAA', name: 'Kolkata Chitpur' },
  { code: 'MAS', name: 'Chennai Central' },
  { code: 'MS', name: 'Chennai Egmore' },
  { code: 'ADI', name: 'Ahmedabad Junction' },
  { code: 'JP', name: 'Jaipur Junction' },
  { code: 'SBC', name: 'KSR Bengaluru' },
  { code: 'SC', name: 'Secunderabad Junction' },
  { code: 'BPL', name: 'Bhopal Junction' },
  { code: 'LKO', name: 'Lucknow Charbagh' },
  { code: 'PNBE', name: 'Patna Junction' },
  { code: 'BSB', name: 'Varanasi Junction' },
  { code: 'BRC', name: 'Vadodara Junction' },
  { code: 'ST', name: 'Surat' },
  { code: 'NGP', name: 'Nagpur Junction' },
];

// ─── Train Database ──────────────────────────────────────────

const TRAINS = [
  {
    trainNumber: '12951', trainName: 'MUMBAI RAJDHANI', type: 'Rajdhani', category: 'Premium',
    from: 'BCT', to: 'NDLS', departureTime: '17:00', arrivalTime: '08:35',
    duration: '15h 35m', distance: 1384, halts: 5,
    classes: ['1A', '2A', '3A'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    trainNumber: '12952', trainName: 'MUMBAI RAJDHANI', type: 'Rajdhani', category: 'Premium',
    from: 'NDLS', to: 'BCT', departureTime: '16:55', arrivalTime: '08:30',
    duration: '15h 35m', distance: 1384, halts: 5,
    classes: ['1A', '2A', '3A'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    trainNumber: '22221', trainName: 'CSMT RAJDHANI', type: 'Rajdhani', category: 'Premium',
    from: 'CSMT', to: 'NZM', departureTime: '15:40', arrivalTime: '10:55',
    duration: '19h 15m', distance: 1531, halts: 7,
    classes: ['1A', '2A', '3A'], runDays: ['mon', 'wed', 'fri', 'sat'],
  },
  {
    trainNumber: '12903', trainName: 'GOLDEN TEMPLE MAIL', type: 'Superfast', category: 'Superfast',
    from: 'BCT', to: 'NZM', departureTime: '21:30', arrivalTime: '19:05',
    duration: '21h 35m', distance: 1415, halts: 12,
    classes: ['1A', '2A', '3A', 'SL'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    trainNumber: '12009', trainName: 'AHMEDABAD SHATABDI', type: 'Shatabdi', category: 'Premium',
    from: 'BCT', to: 'ADI', departureTime: '06:25', arrivalTime: '12:50',
    duration: '6h 25m', distance: 493, halts: 4,
    classes: ['CC', 'EC'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  },
  {
    trainNumber: '20111', trainName: 'KONKAN KANYA EXPRESS', type: 'Superfast', category: 'Superfast',
    from: 'CSMT', to: 'MAO', departureTime: '23:00', arrivalTime: '11:15',
    duration: '12h 15m', distance: 575, halts: 8,
    classes: ['2A', '3A', 'SL', '2S'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    trainNumber: '12123', trainName: 'DECCAN QUEEN', type: 'Superfast', category: 'Superfast',
    from: 'CSMT', to: 'PUNE', departureTime: '17:10', arrivalTime: '20:25',
    duration: '3h 15m', distance: 192, halts: 4,
    classes: ['CC', '2S'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    trainNumber: '11007', trainName: 'DECCAN EXPRESS', type: 'Express', category: 'Express',
    from: 'CSMT', to: 'PUNE', departureTime: '07:15', arrivalTime: '10:45',
    duration: '3h 30m', distance: 192, halts: 6,
    classes: ['2A', '3A', 'SL', '2S'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    trainNumber: '12302', trainName: 'HOWRAH RAJDHANI', type: 'Rajdhani', category: 'Premium',
    from: 'NDLS', to: 'HWH', departureTime: '16:50', arrivalTime: '09:55',
    duration: '17h 05m', distance: 1447, halts: 4,
    classes: ['1A', '2A', '3A'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  },
  {
    trainNumber: '12616', trainName: 'GRAND TRUNK EXPRESS', type: 'Superfast', category: 'Superfast',
    from: 'NDLS', to: 'MAS', departureTime: '18:55', arrivalTime: '05:05',
    duration: '34h 10m', distance: 2188, halts: 16,
    classes: ['1A', '2A', '3A', 'SL'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    trainNumber: '22436', trainName: 'VANDE BHARAT EXPRESS', type: 'Vande Bharat', category: 'Premium',
    from: 'NDLS', to: 'BSB', departureTime: '06:00', arrivalTime: '14:00',
    duration: '8h 00m', distance: 764, halts: 2,
    classes: ['CC', 'EC'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  },
  {
    trainNumber: '12216', trainName: 'GARIB RATH EXPRESS', type: 'Garib Rath', category: 'Superfast',
    from: 'BDTS', to: 'DEE', departureTime: '16:05', arrivalTime: '10:55',
    duration: '18h 50m', distance: 1384, halts: 8,
    classes: ['3A', '3E'], runDays: ['tue', 'wed', 'fri', 'sat'],
  },
  {
    trainNumber: '11057', trainName: 'AMRITSAR EXPRESS', type: 'Express', category: 'Express',
    from: 'CSMT', to: 'NDLS', departureTime: '00:10', arrivalTime: '04:25',
    duration: '28h 15m', distance: 1530, halts: 18,
    classes: ['2A', '3A', 'SL', '2S'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    trainNumber: '12985', trainName: 'JAIPUR DOUBLE DECKER', type: 'Superfast', category: 'Superfast',
    from: 'DEE', to: 'JP', departureTime: '06:05', arrivalTime: '11:40',
    duration: '5h 35m', distance: 307, halts: 3,
    classes: ['CC', '2S'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    trainNumber: '12840', trainName: 'HOWRAH MAIL', type: 'Superfast', category: 'Superfast',
    from: 'MAS', to: 'HWH', departureTime: '23:00', arrivalTime: '04:30',
    duration: '29h 30m', distance: 1662, halts: 14,
    classes: ['1A', '2A', '3A', 'SL'], runDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    trainNumber: '12259', trainName: 'SEALDAH DURONTO', type: 'Duronto', category: 'Premium',
    from: 'NDLS', to: 'SDAH', departureTime: '20:20', arrivalTime: '10:50',
    duration: '14h 30m', distance: 1454, halts: 0,
    classes: ['1A', '2A', '3A', 'SL'], runDays: ['mon', 'thu', 'fri'],
  },
];

// City station groups for matching
const CITY_GROUPS = {
  mumbai: ['CSMT', 'BCT', 'BDTS', 'LTT'],
  delhi: ['NDLS', 'DLI', 'NZM', 'ANVT', 'DEE'],
  kolkata: ['HWH', 'SDAH', 'KOAA'],
  chennai: ['MAS', 'MS'],
  goa: ['MAO', 'KRMI'],
};

/** Simple hash for deterministic pseudo-random mock data */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

/** Simulated API delay */
const delay = (ms) => new Promise(res => setTimeout(res, ms));

function matchesStation(trainStation, queryStation) {
  if (trainStation === queryStation) return true;
  // Check if both are in the same city group
  for (const stations of Object.values(CITY_GROUPS)) {
    if (stations.includes(trainStation) && stations.includes(queryStation)) return true;
  }
  return false;
}

export class MockRailwayProvider extends RailwayProvider {

  /** @override */
  async searchTrains({ from, to, date }) {
    await delay(80);

    const results = TRAINS.filter(t =>
      matchesStation(t.from, from) && matchesStation(t.to, to)
    );

    return {
      fromStation: { code: from, name: STATIONS.find(s => s.code === from)?.name || from },
      toStation: { code: to, name: STATIONS.find(s => s.code === to)?.name || to },
      trains: results.map(t => ({
        trainNumber: t.trainNumber,
        trainName: t.trainName,
        type: t.type,
        category: t.category,
        departureTime: t.departureTime,
        arrivalTime: t.arrivalTime,
        duration: t.duration,
        distance: t.distance,
        halts: t.halts,
        classes: t.classes,
        runDays: t.runDays,
      })),
    };
  }

  /** @override */
  async getSeatAvailability({ trainNumber, from, to, date, classType, quota = 'GN' }) {
    await delay(80);

    const train = TRAINS.find(t => t.trainNumber === trainNumber);
    const trainName = train?.trainName || 'UNKNOWN TRAIN';

    // Deterministic availability based on input hash
    const availabilityStatuses = [
      'AVAILABLE-0045', 'AVAILABLE-0025', 'AVAILABLE-0012', 'AVAILABLE-0002',
      'RAC 8', 'RAC 15', 'RAC 3',
      'WL#35', 'GNWL24/WL11', 'PQWL5/WL3',
      'REGRET/WL',
    ];

    const predictions = ['CONFIRMED', 'HIGH', 'MEDIUM', 'LOW', 'NOT_AVAILABLE'];
    const predictionPcts = [100, 85, 55, 25, 0];

    const hash = simpleHash(trainNumber + date + classType + quota);
    const baseDate = new Date(date);
    const availability = [];

    for (let i = 0; i < 14; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      const idx = (hash + i * 7) % availabilityStatuses.length;
      const predIdx = Math.min(Math.floor(idx / 2.5), predictions.length - 1);

      availability.push({
        availablityDate: d.toISOString().split('T')[0],
        availablityStatus: availabilityStatuses[idx],
        prediction: predictions[predIdx],
        predictionPercentage: predictionPcts[predIdx],
      });
    }

    return {
      trainNumber,
      trainName,
      source: from,
      destination: to,
      classCode: classType,
      quotaCode: quota,
      availability,
    };
  }

  /** @override */
  async getTrainRoute({ trainNumber }) {
    await delay(80);

    const train = TRAINS.find(t => t.trainNumber === trainNumber);
    if (!train) {
      return {
        trainNumber,
        trainName: 'UNKNOWN',
        type: 'Unknown',
        runsOn: [],
        totalDistance: 0,
        totalDuration: '0h',
        totalHalts: 0,
        route: [],
      };
    }

    // Generate a realistic route
    const fromStation = STATIONS.find(s => s.code === train.from) || { code: train.from, name: train.from };
    const toStation = STATIONS.find(s => s.code === train.to) || { code: train.to, name: train.to };

    const route = [
      { sequence: 1, stationCode: fromStation.code, stationName: fromStation.name, arrivalTime: null, departureTime: train.departureTime, distance: 0, day: 1, isHalt: true, platform: '1' },
    ];

    // Add intermediate stops
    const intermediates = ['BRC', 'ST', 'NGP', 'BPL'].filter(
      s => s !== train.from && s !== train.to
    ).slice(0, Math.min(train.halts, 4));

    intermediates.forEach((code, i) => {
      const st = STATIONS.find(s => s.code === code) || { code, name: code };
      route.push({
        sequence: i + 2,
        stationCode: st.code,
        stationName: st.name,
        arrivalTime: `${String((parseInt(train.departureTime) + 3 + i * 4) % 24).padStart(2, '0')}:${String(15 + i * 10).padStart(2, '0').slice(0, 2)}`,
        departureTime: `${String((parseInt(train.departureTime) + 3 + i * 4) % 24).padStart(2, '0')}:${String(17 + i * 10).padStart(2, '0').slice(0, 2)}`,
        distance: Math.round((train.distance / (intermediates.length + 1)) * (i + 1)),
        day: 1,
        isHalt: true,
        platform: String(i + 1),
      });
    });

    route.push({
      sequence: route.length + 1,
      stationCode: toStation.code,
      stationName: toStation.name,
      arrivalTime: train.arrivalTime,
      departureTime: null,
      distance: train.distance,
      day: train.duration.includes('h') && parseInt(train.duration) > 12 ? 2 : 1,
      isHalt: true,
      platform: '3',
    });

    return {
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      type: train.type,
      runsOn: train.runDays,
      totalDistance: train.distance,
      totalDuration: train.duration,
      totalHalts: train.halts,
      route,
    };
  }

  /** @override */
  async getLiveStatus({ trainNumber, date }) {
    await delay(80);

    const train = TRAINS.find(t => t.trainNumber === trainNumber);
    if (!train) {
      return { error: `Train ${trainNumber} not found in mock database.` };
    }

    const delayMinutes = simpleHash(trainNumber + (date || '')) % 45;

    return {
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      startDate: date || new Date().toISOString().split('T')[0],
      status: delayMinutes > 30 ? 'delayed' : 'running',
      delayMinutes,
      currentStation: { code: 'BRC', name: 'Vadodara Junction' },
      nextStation: {
        code: 'ST', name: 'Surat',
        distanceRemainingKm: 129,
        eta: new Date(Date.now() + 90 * 60000).toISOString(),
        platform: '1',
      },
      isDiverted: false,
      isCancelled: false,
      lastUpdated: new Date().toISOString(),
      route: [],
    };
  }

  /** @override */
  async getFare({ trainNumber, from, to, date, classType, quota = 'GN' }) {
    await delay(80);

    const train = TRAINS.find(t => t.trainNumber === trainNumber);
    const distance = train?.distance || 500;

    // Realistic fare calculation based on class and distance
    const ratePerKm = {
      '1A': 4.25, '2A': 2.55, '3A': 1.75, '3E': 1.45,
      'SL': 0.75, 'CC': 2.0, 'EC': 3.5, '2S': 0.45, 'FC': 5.5,
    };
    const rate = ratePerKm[classType] || 1.5;
    const baseFare = Math.round(distance * rate);
    const reservationCharge = classType === 'SL' || classType === '2S' ? 20 : 40;
    const superfastCharge = train?.type === 'Superfast' || train?.category === 'Premium' ? 45 : 0;
    const cateringCharge = ['Rajdhani', 'Shatabdi', 'Vande Bharat'].includes(train?.type) ? 250 : 0;
    const gst = Math.round((baseFare + reservationCharge + superfastCharge) * 0.05);
    const totalFare = baseFare + reservationCharge + superfastCharge + cateringCharge + gst;

    return {
      trainNumber,
      trainName: train?.trainName || 'UNKNOWN',
      source: from,
      destination: to,
      classCode: classType,
      quotaCode: quota,
      totalFare,
      breakdown: {
        baseFare,
        reservationCharge,
        superfastCharge,
        otherCharge: 0,
        tatkalFare: quota === 'TQ' ? Math.round(baseFare * 0.3) : 0,
        goodsServiceTax: gst,
        cateringCharge,
        dynamicFare: 0,
      },
    };
  }

  /** @override */
  async searchStations({ query }) {
    await delay(30);
    const q = query.toLowerCase();
    return STATIONS.filter(
      s => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    ).slice(0, 10);
  }

  /** @override */
  getProviderName() {
    return 'mock';
  }

  /** @override */
  isLiveProvider() {
    return false;
  }
}
