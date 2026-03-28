export class DateUtils {
  public static convertEpochToDate(epochUtc: number) {
    if (epochUtc > 0) {
      return new Date(epochUtc * 1000)
        .toISOString()
        .substring(0, 19)
        .replace('T', ' ');
    } else {
      return '';
    }
  }

  public static convertEpochToDateWithUtc(epochUtc: number) {
    if (epochUtc > 0) {
      return (
        new Date(epochUtc * 1000)
          .toISOString()
          .substring(0, 19)
          .replace('T', ' ') + ' ( UTC )'
      );
    } else {
      return '';
    }
  }

  public static convertEpochAndAddedHoursToDate(
    epochUtc: number,
    hours: number,
  ) {
    if (epochUtc > 0) {
      return new Date(epochUtc * 1000 + hours * 60 * 60 * 1000)
        .toISOString()
        .substring(0, 19)
        .replace('T', ' ');
    } else {
      return '';
    }
  }
}
