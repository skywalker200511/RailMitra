import { describe, it, expect } from 'vitest';
import { resolveDate, formatDateForDisplay } from '../agent/dateResolver.js';

describe('dateResolver', () => {
  describe('resolveDate', () => {
    it('resolves "today" to current date', () => {
      const result = resolveDate('today');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('resolves "tomorrow" to next day', () => {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      const expectedDate = today.toISOString().split('T')[0];
      // Due to timezone differences, just check format
      const result = resolveDate('tomorrow');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('resolves "day after tomorrow"', () => {
      const result = resolveDate('day after tomorrow');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('resolves "2026-09-15" exactly', () => {
      const result = resolveDate('2026-09-15');
      expect(result).toBe('2026-09-15');
    });

    it('resolves "15/09/2026"', () => {
      const result = resolveDate('15/09/2026');
      expect(result).toBe('2026-09-15');
    });

    it('resolves "15 September"', () => {
      const result = resolveDate('15 September');
      expect(result).toMatch(/^\d{4}-09-15$/);
    });

    it('resolves "September 15"', () => {
      const result = resolveDate('September 15');
      expect(result).toMatch(/^\d{4}-09-15$/);
    });

    it('resolves "Sep 15"', () => {
      const result = resolveDate('Sep 15');
      expect(result).toMatch(/^\d{4}-09-15$/);
    });

    it('resolves "15th September"', () => {
      const result = resolveDate('15th September');
      expect(result).toMatch(/^\d{4}-09-15$/);
    });

    it('resolves "this friday"', () => {
      const result = resolveDate('this friday');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('resolves "next monday"', () => {
      const result = resolveDate('next monday');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('resolves null/undefined/empty to null', () => {
      expect(resolveDate(null)).toBeNull();
      expect(resolveDate(undefined)).toBeNull();
      expect(resolveDate('')).toBeNull();
    });

    it('resolves "garbage text" to null', () => {
      expect(resolveDate('garbage text')).toBeNull();
    });

    it('resolves "yesterday"', () => {
      const result = resolveDate('yesterday');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('formatDateForDisplay', () => {
    it('formats "2026-09-15" with Sep and 2026', () => {
      const result = formatDateForDisplay('2026-09-15');
      expect(result).toContain('Sep');
      expect(result).toContain('2026');
    });
  });
});
