package org.exchange.app.backend;

import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EntityScan(basePackages = {"org.exchange.app.backend.db.entities"})
@ComponentScan(basePackages = {
    "org.exchange.configurations",
    "org.exchange.strategies.ratio",
    "org.exchange.app.backend.listeners",
    "org.exchange.app.backend.services"
})
@RequiredArgsConstructor
public class InternalBackendApplication {

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(InternalBackendApplication.class);
    app.setDefaultProperties(Collections
        .singletonMap("server.port", "8002"));
    app.run(args);
  }


}
