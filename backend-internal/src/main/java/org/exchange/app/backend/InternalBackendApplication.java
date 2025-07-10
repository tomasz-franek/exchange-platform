package org.exchange.app.backend;

import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.exchange.app.backend.common.utils.BuildInfoUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EntityScan(basePackages = {"org.exchange.app.backend.db.entities"})
@ComponentScan(basePackages = {
    "org.exchange.configurations",
    "org.exchange.strategies.ratio",
    "org.exchange.app.backend.listeners",
    "org.exchange.app.backend.services",
    "org.exchange.internal.app.core.strategies.ratio",
    "org.exchange.internal.app.core.strategies.fee",
    "org.exchange.internal.app.core.configurations"
})
@EnableAutoConfiguration
@RequiredArgsConstructor
public class InternalBackendApplication {

  public static void main(String[] args) {
    BuildInfoUtils.showVersion();
    SpringApplication app = new SpringApplication(InternalBackendApplication.class);
    app.setDefaultProperties(Collections
        .singletonMap("server.port", "8002"));
    app.run(args);
  }


}
