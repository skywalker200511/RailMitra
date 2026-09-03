import { describe, it, expect } from 'vitest';
import { resolveStation } from '../agent/stationResolver.js';

describe('stationResolver', () => {
  it('resolves "Mumbai" to multiple stations and isCity=true', async () => {
    const result = await resolveStation('Mumbai');
    expect(result.isCity).toBe(true);
    expect(result.stations.map(s => s.code)).toEqual(expect.arrayContaining(['CSMT', 'BCT', 'BDTS', 'LTT']));
  });

  it('resolves "Delhi" to multiple stations and isCity=true', async () => {
    const result = await resolveStation('Delhi');
    expect(result.isCity).toBe(true);
    expect(result.stations.map(s => s.code)).toEqual(expect.arrayContaining(['NDLS', 'DLI', 'ANVT', 'NZM']));
  });

  it('is case-insensitive for "mumbai"', async () => {
    const result1 = await resolveStation('Mumbai');
    const result2 = await resolveStation('mumbai');
    expect(result2).toEqual(result1);
  });

  it('resolves "NDLS" directly to New Delhi with isCity=false', async () => {
    const result = await resolveStation('NDLS');
    expect(result.isCity).toBe(false);
    expect(result.stations).toHaveLength(1);
    expect(result.stations[0].code).toBe('NDLS');
  });

  it('resolves "BCT" to direct station code', async () => {
    const result = await resolveStation('BCT');
    expect(result.isCity).toBe(false);
    expect(result.stations[0].code).toBe('BCT');
  });

  it('resolves "Pune" to Pune Junction', async () => {
    const result = await resolveStation('Pune');
    expect(result.stations[0].code).toBe('PUNE');
    expect(result.stations[0].name).toContain('Pune');
  });

  it('resolves "New Delhi" directly', async () => {
    const result = await resolveStation('New Delhi');
    expect(result.stations.map(s => s.code)).toContain('NDLS');
  });

  it('handles airport code warning for "BOM"', async () => {
    const result = await resolveStation('BOM');
    expect(result.warning).toBeDefined();
    expect(result.stations[0].code).toBe('CSMT');
  });

  it('handles airport code warning for "DEL"', async () => {
    const result = await resolveStation('DEL');
    expect(result.warning).toBeDefined();
    expect(result.stations[0].code).toBe('NDLS');
  });

  it('returns empty or fallback for empty string', async () => {
    const result = await resolveStation('');
    expect(result.stations).toHaveLength(1);
    expect(result.stations[0].code).toBe('');
  });
});
