package org.exchange.app.backend.external;

import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("org.exchange.app")
@RequiredArgsConstructor
public class ExchangeExternalBackendApplication {

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(ExchangeExternalBackendApplication.class);
    app.setDefaultProperties(Collections
        .singletonMap("server.port", "8080"));
    app.run(args);
  }
}
