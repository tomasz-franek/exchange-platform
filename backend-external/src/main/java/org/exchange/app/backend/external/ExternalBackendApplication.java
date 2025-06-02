package org.exchange.app.backend.external;

import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("org.exchange")
@ComponentScan(basePackages = {
    "org.exchange.app.backend.db",
    "org.exchange.strategies.ratio",
    "org.exchange.app.backend.listeners"
})
@EnableJpaRepositories(basePackages = "org.exchange.app.backend.db.repositories")
@RequiredArgsConstructor
public class ExternalBackendApplication {

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(ExternalBackendApplication.class);
    app.setDefaultProperties(Collections
        .singletonMap("server.port", "8080"));
    app.run(args);
  }
}
