import { describe, it, expect } from 'vitest';
import { MockRailwayProvider } from '../railway/mockProvider.js';

describe('MockRailwayProvider', () => {
  const provider = new MockRailwayProvider();

  it('getProviderName returns "mock"', () => {
    expect(provider.getProviderName()).toBe('mock');
  });

  it('isLiveProvider returns false', () => {
    expect(provider.isLiveProvider()).toBe(false);
  });

  it('searchTrains with valid from/to returns trains array', async () => {
    const result = await provider.searchTrains({ from: 'CSMT', to: 'NDLS', date: '2026-09-15' });
    expect(result).toHaveProperty('trains');
    expect(Array.isArray(result.trains)).toBe(true);
    expect(result.trains.length).toBeGreaterThan(0);
  });

  it('searchTrains CSMT to NDLS returns trains', async () => {
    const result = await provider.searchTrains({ from: 'CSMT', to: 'NDLS', date: '2026-09-15' });
    expect(result.trains.some(t => t.trainName && t.trainName.includes('RAJDHANI'))).toBe(true);
  });

  it('searchTrains with unknown stations returns empty array', async () => {
    const result = await provider.searchTrains({ from: 'UNKNOWN1', to: 'UNKNOWN2', date: '2026-09-15' });
    expect(Array.isArray(result.trains)).toBe(true);
    expect(result.trains).toHaveLength(0);
  });

  it('getSeatAvailability returns availability array with availablityStatus field', async () => {
    const result = await provider.getSeatAvailability({ trainNumber: '12952', from: 'BCT', to: 'NDLS', date: '2026-09-15', classType: '3A' });
    expect(Array.isArray(result.availability)).toBe(true);
    expect(result.availability.length).toBeGreaterThan(0);
    expect(result.availability[0]).toHaveProperty('availablityStatus'); // Typo matches API
  });

  it('getSeatAvailability returns status strings matching expected patterns', async () => {
    const result = await provider.getSeatAvailability({ trainNumber: '12952', from: 'BCT', to: 'NDLS', date: '2026-09-15', classType: '3A' });
    const validPatterns = [/^AVAILABLE-\d+$/, /^RAC \d+$/, /^WL#\d+$/, /^GNWL\d+\/WL\d+$/, /^PQWL\d+\/WL\d+$/, /^REGRET\/WL$/];
    const status = result.availability[0].availablityStatus;
    const isValid = validPatterns.some(pattern => pattern.test(status));
    expect(isValid).toBe(true);
  });

  it('getTrainRoute returns route with route array', async () => {
    const result = await provider.getTrainRoute({ trainNumber: '12952' });
    expect(result).toHaveProperty('route');
    expect(Array.isArray(result.route)).toBe(true);
    expect(result.route.length).toBeGreaterThan(0);
  });

  it('getLiveStatus returns status object with delayMinutes', async () => {
    const status = await provider.getLiveStatus({ trainNumber: '12952', date: '2026-09-15' });
    expect(status).toHaveProperty('delayMinutes');
    expect(typeof status.delayMinutes).toBe('number');
  });

  it('getFare returns fare object with totalFare > 0', async () => {
    const fare = await provider.getFare({ trainNumber: '12952', from: 'BCT', to: 'NDLS', classType: '3A' });
    expect(fare).toHaveProperty('totalFare');
    expect(fare.totalFare).toBeGreaterThan(0);
  });

  it('searchStations("Mumbai") returns stations matching Mumbai', async () => {
    const stations = await provider.searchStations({ query: 'Mumbai' });
    expect(Array.isArray(stations)).toBe(true);
    expect(stations.some(s => s.name.toLowerCase().includes('mumbai'))).toBe(true);
  });

  it('searchStations("NDLS") returns New Delhi', async () => {
    const stations = await provider.searchStations({ query: 'NDLS' });
    expect(stations.some(s => s.code === 'NDLS')).toBe(true);
  });

  it('All methods return without throwing', async () => {
    await expect(provider.searchTrains({ from: 'CSMT', to: 'NDLS', date: '2026-09-15' })).resolves.toBeDefined();
    await expect(provider.getSeatAvailability({ trainNumber: '12952', from: 'BCT', to: 'NDLS', date: '2026-09-15', classType: '3A' })).resolves.toBeDefined();
    await expect(provider.getTrainRoute({ trainNumber: '12952' })).resolves.toBeDefined();
    await expect(provider.getLiveStatus({ trainNumber: '12952', date: '2026-09-15' })).resolves.toBeDefined();
    await expect(provider.getFare({ trainNumber: '12952', from: 'BCT', to: 'NDLS', classType: '3A' })).resolves.toBeDefined();
    await expect(provider.searchStations({ query: 'PUNE' })).resolves.toBeDefined();
  });
});
