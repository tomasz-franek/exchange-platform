package org.exchange.app.backend.external;

import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.exchange.app.backend.common.utils.BuildInfoUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(value = {"org.exchange",
    "org.exchange.app.common",
    "org.exchange.app.external",
    "org.exchange.app.backend.common",
    "org.exchange.app.backend.db",
})
@ComponentScan(basePackages = {
    "org.exchange.app.backend.common",
    "org.exchange.app.backend.db",
    "org.exchange.strategies.ratio",
    "org.exchange.app.backend.listeners",
    "org.exchange.app.backend.external",
    "org.exchange.app.common"
})
@EnableAutoConfiguration
@EnableJpaRepositories(basePackages = "org.exchange.app.backend.db.repositories")
@RequiredArgsConstructor
public class ExternalBackendApplication {

  public static void main(String[] args) {
    BuildInfoUtils.showVersion();
    SpringApplication app = new SpringApplication(ExternalBackendApplication.class);
    app.setDefaultProperties(Collections
        .singletonMap("server.port", "8080"));
    app.run(args);
  }
}
