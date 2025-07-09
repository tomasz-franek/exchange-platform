import { FormControl } from '@angular/forms';
import { Direction } from '../../api/model/direction';
import { directionValidator } from './direction.validator';

describe('DirectionValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  it('should return null for valid direction', () => {
    control.setValue(Direction.Sell);
    const result = directionValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for valid direction (BUY)', () => {
    control.setValue(Direction.Buy);
    const result = directionValidator()(control);
    expect(result).toBeNull();
  });

  it('should return error for invalid direction', () => {
    control.setValue('Invalid_Direction');
    const result = directionValidator()(control);
    expect(result).toEqual({ invalidDirection: true });
  });

  it('should return error for empty string', () => {
    control.setValue('');
    const result = directionValidator()(control);
    expect(result).toEqual({ invalidDirection: true });
  });

  it('should return error for null value', () => {
    control.setValue(null);
    const result = directionValidator()(control);
    expect(result).toEqual({ invalidDirection: true });
  });

  it('should return error for undefined value', () => {
    control.setValue(undefined);
    const result = directionValidator()(control);
    expect(result).toEqual({ invalidDirection: true });
  });

  it('should return null for all valid directions', () => {
    Object.values(Direction).forEach((direction) => {
      control.setValue(direction);
      const result = directionValidator()(control);
      expect(result).toBeNull();
    });
  });
});
