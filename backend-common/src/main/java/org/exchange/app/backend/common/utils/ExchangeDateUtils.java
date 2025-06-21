package org.exchange.app.backend.common.utils;

import java.sql.Timestamp;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

public class ExchangeDateUtils {

  private static final ZoneId ZONE_UTC = ZoneOffset.UTC;
  private static final Clock clock = Clock.systemUTC();

  public static long toEpochUtc(LocalDateTime localDateTime) {
    return localDateTime.toEpochSecond(ZoneOffset.UTC);
  }

  public static long toEpochUtc(Timestamp timestamp) {
    return timestamp.toLocalDateTime().toEpochSecond(ZoneOffset.UTC);
  }

  public static LocalDateTime toLocalDateTime(long epochUtc) {
    return Instant.now(clock).atZone(ZONE_UTC).toLocalDateTime();
  }

  public static Timestamp toTimestamp(long epochUtc) {
    return Timestamp.valueOf(toLocalDateTime(epochUtc));
  }

  public static Timestamp currentTimestamp() {
    return Timestamp.valueOf(
        Instant.now().atZone(ZONE_UTC).toLocalDateTime());
  }

  public static LocalDateTime currentLocalDateTime() {
    return Instant.now().atZone(ZONE_UTC).toLocalDateTime();
  }

  public static long currentEpochUtc() {
    return clock.millis();
  }

}
