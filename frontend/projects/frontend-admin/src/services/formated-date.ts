import { formatDate } from '@angular/common';

export class FormatedDate {
  public static getFormatedDate(
    date: string | number | Date | undefined | null,
  ): string | undefined {
    if (date != null && date != '' && date != undefined) {
      try {
        return formatDate(date, 'yyyy-MM-dd', 'en-US', 'UTC');
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}
