package org.exchange.app.backend;

import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("org.exchange.app")
@RequiredArgsConstructor
public class ExchangeConsumerBackendApplication {

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(ExchangeConsumerBackendApplication.class);
    app.setDefaultProperties(Collections
        .singletonMap("server.port", "8002"));
    app.run(args);
  }


}
