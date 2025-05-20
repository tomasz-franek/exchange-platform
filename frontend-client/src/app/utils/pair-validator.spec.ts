import { FormControl } from '@angular/forms';
import { pairValidator } from './pair-validator';
import { Pair } from '../api/model/pair';

describe('PairValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  it('should return null for valid pair', () => {
    control.setValue(Pair.EurPln);
    const result = pairValidator()(control);
    expect(result).toBeNull();
  });

  it('should return error for invalid pair', () => {
    control.setValue('Invalid_Pair');
    const result = pairValidator()(control);
    expect(result).toEqual({ invalidPair: true });
  });

  it('should return error for empty string', () => {
    control.setValue('');
    const result = pairValidator()(control);
    expect(result).toEqual({ invalidPair: true });
  });

  it('should return error for null value', () => {
    control.setValue(null);
    const result = pairValidator()(control);
    expect(result).toEqual({ invalidPair: true });
  });

  it('should return error for undefined value', () => {
    control.setValue(undefined);
    const result = pairValidator()(control);
    expect(result).toEqual({ invalidPair: true });
  });

  it('should return null for all valid pairs', () => {
    Object.values(Pair).forEach((pair) => {
      control.setValue(pair);
      const result = pairValidator()(control);
      expect(result).toBeNull();
    });
  });
});
