import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Direction } from '../../app/api/model/direction';

export function directionValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const validDirections = Object.values(Direction);
    if (!validDirections.includes(control.value)) {
      return { invalidDirection: true };
    }
    return null;
  };
}
