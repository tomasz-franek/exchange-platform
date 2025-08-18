package org.exchange.app.backend;

import lombok.RequiredArgsConstructor;
import org.exchange.app.backend.common.utils.BuildInfoUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"org.exchange.app.backend.db.entities"})
@ComponentScan(basePackages = {
    "org.exchange.configurations",
    "org.exchange.strategies.ratio",
    "org.exchange.app.backend.listeners",
    "org.exchange.app.backend.services",
    "org.exchange.app.backend.keycloak",
    "org.exchange.app.backend.producers",
    "org.exchange.app.backend.common",
    "org.exchange.internal.app.core.strategies.ratio",
    "org.exchange.internal.app.core.strategies.fee",
    "org.exchange.internal.app.core.configurations"
})
@EnableAutoConfiguration
@EnableJpaRepositories(basePackages = "org.exchange.app.backend.db.repositories")
@RequiredArgsConstructor
public class InternalBackendApplication {

  public static void main(String[] args) {
    BuildInfoUtils.showVersion();
    SpringApplication app = new SpringApplication(InternalBackendApplication.class);
    app.run(args);
  }
}
