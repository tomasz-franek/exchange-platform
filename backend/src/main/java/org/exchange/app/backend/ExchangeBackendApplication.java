package org.exchange.app.backend;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("org.exchange.app")
@RequiredArgsConstructor
public class ExchangeBackendApplication {

  public static void main(String[] args) {
    SpringApplication.run(ExchangeBackendApplication.class, args);
  }

}
