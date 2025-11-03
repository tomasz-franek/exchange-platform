import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Pair } from '../../app/api/model/pair';

export function pairValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const validPairs = Object.values(Pair);
    if (!validPairs.includes(control.value)) {
      return { invalidPair: true };
    }
    return null;
  };
}
