package org.exchange.app.backend.db.utils;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

public class ExchangeDateUtils {

  public static long toEpochUtc(LocalDateTime localDateTime) {
    return localDateTime.toEpochSecond(ZoneOffset.UTC);
  }
}
