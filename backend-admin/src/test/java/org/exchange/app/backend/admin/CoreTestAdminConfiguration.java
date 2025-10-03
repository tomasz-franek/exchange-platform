package org.exchange.app.backend.admin;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {"org.exchange.*"})
@EntityScan(value = {"org.exchange.*"})
public class CoreTestAdminConfiguration {

  public static final LocalDateTime localDateTime = LocalDateTime.of(
      2025, Month.SEPTEMBER, 2,
      16, 35, 24, 2357432);
  public static final Instant TEST_NOW_UTC = ZonedDateTime.of(localDateTime,
      ZoneOffset.UTC).toInstant();

  @Bean
  public Clock clock() {
    return Clock.fixed(TEST_NOW_UTC, ZoneOffset.UTC);
  }

}
