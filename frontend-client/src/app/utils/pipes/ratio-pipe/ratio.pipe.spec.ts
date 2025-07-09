import { RatioPipe } from './ratio.pipe';

describe('RatioPipe', () => {
  let pipe: RatioPipe;

  beforeEach(() => {
    pipe = new RatioPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert numbers correctly to 4 digital places', () => {
    expect(pipe.transform(123456789)).toBe('12345.6789');
    expect(pipe.transform(12345)).toBe('1.2345');
    expect(pipe.transform(1234)).toBe('0.1234');
    expect(pipe.transform(123)).toBe('0.0123');
    expect(pipe.transform(12)).toBe('0.0012');
    expect(pipe.transform(1)).toBe('0.0001');
    expect(pipe.transform(0)).toBe('0.0000');
  });

  it('should convert numbers correctly to 4 digital places for negative values', () => {
    expect(pipe.transform(-123456789)).toBe('-12345.6789');
    expect(pipe.transform(-12345)).toBe('-1.2345');
    expect(pipe.transform(-1234)).toBe('-0.1234');
    expect(pipe.transform(-123)).toBe('-0.0123');
    expect(pipe.transform(-12)).toBe('-0.0012');
    expect(pipe.transform(-1)).toBe('-0.0001');
    expect(pipe.transform(-0)).toBe('0.0000');
  });

  it('should return an empty string for null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return an empty string for invalid numbers', () => {
    expect(pipe.transform(NaN)).toBe('');
    expect(pipe.transform(Infinity)).toBe('');
    expect(pipe.transform(-Infinity)).toBe('');
  });
});
