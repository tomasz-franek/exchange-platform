package org.exchange.app.backend.db.utils;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.ZoneOffset;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;

@Log4j2
public final class ChecksumUtil {

  private ChecksumUtil() {
  }

  public static long checksum(ExchangeEventSourceEntity exchangeEventSource) {
    String value =
        exchangeEventSource.getUserAccountId().toString() +
            exchangeEventSource.getEventType() +
            exchangeEventSource.getAmount() +
            exchangeEventSource.getCreatedBy() +
            exchangeEventSource.getCreatedDateUtc().toEpochSecond(ZoneOffset.UTC);
    try {
      MessageDigest m = MessageDigest.getInstance("MD5");
      m.reset();
      m.update(value.getBytes(StandardCharsets.UTF_8));
      byte[] digest = m.digest();
      BigInteger bigInt = new BigInteger(1, digest);
      return bigInt.longValue();
    } catch (Exception e) {
      log.error("Unable to calculate checksum", e);
    }
    return Long.MIN_VALUE;
  }
}
