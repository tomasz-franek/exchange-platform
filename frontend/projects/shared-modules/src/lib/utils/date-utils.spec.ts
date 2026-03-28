import {DateUtils} from './date-utils';

describe('DateUtils', () => {
  describe('convertEpochToDate', () => {
    it('should properly convert epoch value to a string', () => {
      const result = DateUtils.convertEpochToDate(1774370532);
      expect(result).toBe('2026-03-24 16:42:12');
    });

    it('should properly convert epoch zero to a string', () => {
      const result = DateUtils.convertEpochToDate(0);
      expect(result).toBe('');
    });

    it('should properly convert epoch negative to a string', () => {
      const result = DateUtils.convertEpochToDate(-4);
      expect(result).toBe('');
    });
  });

  describe('convertEpochToDateWithUtc', () => {
    it('should properly convert epoch value to a string', () => {
      const result = DateUtils.convertEpochToDateWithUtc(1744340532);
      expect(result).toBe('2025-04-11 03:02:12 ( UTC )');
    });

    it('should properly convert epoch zero to a string', () => {
      const result = DateUtils.convertEpochToDateWithUtc(0);
      expect(result).toBe('');
    });

    it('should properly convert epoch negative to a string', () => {
      const result = DateUtils.convertEpochToDateWithUtc(-4);
      expect(result).toBe('');
    });
  });

  describe('convertEpochAndAddedHoursToDate', () => {
    it('should properly convert epoch value with added positive hours to a string', () => {
      const result = DateUtils.convertEpochAndAddedHoursToDate(1774370532, 2);
      expect(result).toBe('2026-03-24 18:42:12');
    });

    it('should properly convert epoch value with added negative hours to a string', () => {
      const result = DateUtils.convertEpochAndAddedHoursToDate(1774370532, -2);
      expect(result).toBe('2026-03-24 14:42:12');
    });

    it('should properly convert epoch value with added zero hours to a string', () => {
      const result = DateUtils.convertEpochAndAddedHoursToDate(1774370532, 0);
      expect(result).toBe('2026-03-24 16:42:12');
    });

    it('should properly convert epoch value with added hours with decimal places to a string', () => {
      //Kathmandu timezone UTC +05:45
      const result = DateUtils.convertEpochAndAddedHoursToDate(
        1774370532,
        5.75,
      );
      expect(result).toBe('2026-03-24 22:27:12');
    });

    it('should properly convert epoch zero to a string', () => {
      const result = DateUtils.convertEpochAndAddedHoursToDate(0, 0);
      expect(result).toBe('');
    });

    it('should properly convert epoch negative to a string', () => {
      const result = DateUtils.convertEpochAndAddedHoursToDate(-4, 0);
      expect(result).toBe('');
    });
  });
});
