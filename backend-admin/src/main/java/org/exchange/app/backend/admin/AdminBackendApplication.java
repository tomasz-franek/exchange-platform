package org.exchange.app.backend.admin;

import lombok.RequiredArgsConstructor;
import org.exchange.app.backend.common.utils.BuildInfoUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@EntityScan(value = {"org.exchange",
    "org.exchange.app.common",
    "org.exchange.app.admin",
    "org.exchange.app.backend.common",
    "org.exchange.app.backend.db",
})
@ComponentScan(basePackages = {
    "org.exchange.app.backend.common",
    "org.exchange.app.backend.db",
    "org.exchange.strategies.ratio",
    "org.exchange.app.backend.listeners",
    "org.exchange.app.backend.admin",
    "org.exchange.app.common"
})
@EnableAutoConfiguration
@EnableJpaRepositories(basePackages = "org.exchange.app.backend.db.repositories")
@RequiredArgsConstructor
public class AdminBackendApplication {

  static void main() {
    BuildInfoUtils.showVersion();
    SpringApplication app = new SpringApplication(AdminBackendApplication.class);
    app.run();
  }
}
