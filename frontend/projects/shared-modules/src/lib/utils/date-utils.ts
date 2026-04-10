export class DateUtils {
  public static convertEpochToDate(epochUtc: number) {
    if (epochUtc > 0) {
      return DateUtils.getDateAndTimeString(
        new Date(epochUtc * 1000).toISOString(),
      );
    } else {
      return '';
    }
  }

  public static convertEpochToDateWithUtc(epochUtc: number) {
    if (epochUtc > 0) {
      return DateUtils.convertEpochToDate(epochUtc) + ' ( UTC )';
    } else {
      return '';
    }
  }

  public static convertEpochAndOffsetToDate(
    epochUtc: number,
    offsetHours: number,
  ) {
    if (epochUtc > 0) {
      return DateUtils.convertEpochToDate(epochUtc + offsetHours * 60 * 60);
    } else {
      return '';
    }
  }

  public static getDateAndTimeString(date: string) {
    if (date.length < 19) {
      return date || '';
    }
    return date.substring(0, 19).replace('T', ' ');
  }
}
