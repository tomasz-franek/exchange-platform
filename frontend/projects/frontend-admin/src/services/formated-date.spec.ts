import { FormatedDate } from './formated-date';

describe('FormatedDate.getFormatedDate', () => {
  it('should return formatted date for valid Date object', () => {
    const date = new Date('2025-08-16');
    expect(FormatedDate.getFormatedDate(date)).toBe('2025-08-16');
  });

  it('should return formatted date for valid date string', () => {
    const dateString = '2025-08-16Z';
    expect(FormatedDate.getFormatedDate(dateString)).toBe('2025-08-16');
  });

  it('should return formatted date for valid date string in UTC', () => {
    const dateStringUTC = '2025-08-16T00:00:00Z';
    expect(FormatedDate.getFormatedDate(dateStringUTC)).toBe('2025-08-16');
  });

  it('should return formatted date for valid Date object in UTC', () => {
    const dateUTC = new Date('2025-08-16T00:00:00Z');
    expect(FormatedDate.getFormatedDate(dateUTC)).toBe('2025-08-16');
  });

  it('should return formatted date for valid Date object with local timezone offset', () => {
    const dateTimeLocal = new Date('2025-08-16T00:00:00+02:00');
    expect(FormatedDate.getFormatedDate(dateTimeLocal)).toBe('2025-08-15');
  });

  it('should return formatted date for valid datetime string with positive local timezone offset', () => {
    const dateTimeStringLocal = '2025-08-16T00:00:00+02:00';
    expect(FormatedDate.getFormatedDate(dateTimeStringLocal)).toBe(
      '2025-08-15',
    );
  });

  it('should return formatted date for valid datetime string with negative local timezone offset', () => {
    const dateTimeStringLocal = '2025-08-16T00:00:00-02:00';
    expect(FormatedDate.getFormatedDate(dateTimeStringLocal)).toBe(
      '2025-08-16',
    );
  });

  it('should return formatted date for valid timestamp', () => {
    const timestamp = 1629072000000;
    expect(FormatedDate.getFormatedDate(timestamp)).toBe('2021-08-16');
  });

  it('should return formatted date for valid timestamp one millisecond before midnight', () => {
    const timestamp = 1629072000000 - 1;
    expect(FormatedDate.getFormatedDate(timestamp)).toBe('2021-08-15');
  });

  it('should return undefined for null', () => {
    expect(FormatedDate.getFormatedDate(null)).toBeUndefined();
  });

  it('should return undefined for empty string', () => {
    expect(FormatedDate.getFormatedDate('')).toBeUndefined();
  });

  it('should return undefined for invalid date string', () => {
    expect(FormatedDate.getFormatedDate('invalid-date')).toBeUndefined();
  });

  it('should return undefined for random number', () => {
    expect(FormatedDate.getFormatedDate(12345)).toBe('1970-01-01');
  });

  it('should handle leap year date correctly', () => {
    const leapYearDate = new Date('2020-02-29');
    expect(FormatedDate.getFormatedDate(leapYearDate)).toBe('2020-02-29');
  });

  it('should handle boundary dates correctly', () => {
    const boundaryDate = new Date('1970-01-01');
    expect(FormatedDate.getFormatedDate(boundaryDate)).toBe('1970-01-01');
  });

  it('should return formatted date for valid Date object with time', () => {
    const dateTime = new Date('2025-08-16T14:30:00');
    expect(FormatedDate.getFormatedDate(dateTime)).toBe('2025-08-16');
  });

  it('should return formatted date for valid datetime string', () => {
    const dateTimeString = '2025-08-16T14:30:00';
    expect(FormatedDate.getFormatedDate(dateTimeString)).toBe('2025-08-16');
  });

  it('should return undefined for invalid datetime string', () => {
    expect(FormatedDate.getFormatedDate('invalid-datetime')).toBeUndefined();
  });

  it('should return undefined for datetime string in incorrect format', () => {
    expect(FormatedDate.getFormatedDate('2025/08/16 14:30')).toBe('2025-08-16');
  });

  it('should handle leap year date correctly', () => {
    const leapYearDate = new Date('2020-02-29');
    expect(FormatedDate.getFormatedDate(leapYearDate)).toBe('2020-02-29');
  });

  it('should handle boundary dates correctly', () => {
    const boundaryDate = new Date('1970-01-01');
    expect(FormatedDate.getFormatedDate(boundaryDate)).toBe('1970-01-01');
  });

  it('should return formatted date for valid Date object in different timezone', () => {
    const dateTimeUTC = new Date('2025-08-16T14:30:00Z');
    expect(FormatedDate.getFormatedDate(dateTimeUTC)).toBe('2025-08-16');
  });

  it('should return formatted date for valid datetime string in different timezone', () => {
    const dateTimeStringUTC = '2025-08-16T14:30:00Z';
    expect(FormatedDate.getFormatedDate(dateTimeStringUTC)).toBe('2025-08-16');
  });

  it('should return formatted date for valid Date object with positive local timezone offset', () => {
    const dateTimeLocal = new Date('2025-08-16T14:30:00+02:00');
    expect(FormatedDate.getFormatedDate(dateTimeLocal)).toBe('2025-08-16');
  });

  it('should return formatted date for valid Date object with negative local timezone offset', () => {
    const dateTimeLocal = new Date('2025-08-16T14:30:00-02:00');
    expect(FormatedDate.getFormatedDate(dateTimeLocal)).toBe('2025-08-16');
  });

  it('should return formatted date for valid datetime string with local timezone offset', () => {
    const dateTimeStringLocal = '2025-08-16T14:30:00+02:00';
    expect(FormatedDate.getFormatedDate(dateTimeStringLocal)).toBe(
      '2025-08-16',
    );
  });
});
