import { AmountPipe } from './amount.pipe';

describe('AmountPipe', () => {
  let pipe: AmountPipe;

  beforeEach(() => {
    pipe = new AmountPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should convert numbers correctly to 2 digital places', () => {
    expect(pipe.transform(123456789)).toBe('12345.67');
    expect(pipe.transform(123456)).toBe('12.34');
    expect(pipe.transform(12345)).toBe('1.23');
    expect(pipe.transform(1234)).toBe('0.12');
    expect(pipe.transform(123)).toBe('0.01');
    expect(pipe.transform(12)).toBe('0.00');
    expect(pipe.transform(1)).toBe('0.00');
    expect(pipe.transform(0)).toBe('0.00');
  });

  it('should convert numbers correctly to 2 digital places for negative numbers', () => {
    expect(pipe.transform(-123456789)).toBe('-12345.67');
    expect(pipe.transform(-123456)).toBe('-12.34');
    expect(pipe.transform(-12345)).toBe('-1.23');
    expect(pipe.transform(-1234)).toBe('-0.12');
    expect(pipe.transform(-123)).toBe('-0.01');
    expect(pipe.transform(-12)).toBe('-0.00');
    expect(pipe.transform(-1)).toBe('-0.00');
    expect(pipe.transform(-0)).toBe('0.00');
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
