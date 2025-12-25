package org.exchange.app.backend.common.utils;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

public class ExchangeDateUtils {

  private static final ZoneId ZONE_UTC = ZoneOffset.UTC;
  private static final Clock clock = Clock.systemUTC();

  public static long toEpochUtc(LocalDateTime localDateTime) {
    return localDateTime.toEpochSecond(ZoneOffset.UTC);
  }

  public static LocalDateTime toLocalDateTime(long epochUtc) {
    return Instant.ofEpochSecond(epochUtc).atZone(ZONE_UTC).toLocalDateTime();
  }

  public static String toStringDateTime(long epochUtc) {
    return Instant.ofEpochSecond(epochUtc).atZone(ZONE_UTC).toString();
  }

  public static LocalDateTime currentLocalDateTime() {
    return Instant.now(clock).atZone(ZONE_UTC).toLocalDateTime();
  }

  public static LocalDate currentLocalDate() {
    return Instant.now(clock).atZone(ZONE_UTC).toLocalDate();
  }

  public static String currentLocalDateTimeString() {
    return Instant.now(clock).atZone(ZONE_UTC).toString();
  }

  public static long currentEpochUtc() {
    return Instant.now(clock).toEpochMilli();
  }

  public static LocalDateTime currentMinus(int ammountToAdd, ChronoUnit temporalUnit) {
    return currentLocalDateTime().minus(ammountToAdd, temporalUnit);

  }

}
