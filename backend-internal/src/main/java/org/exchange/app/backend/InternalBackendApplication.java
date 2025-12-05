package org.exchange.app.backend;

import lombok.RequiredArgsConstructor;
import org.exchange.app.backend.common.utils.BuildInfoUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(value = {"org.exchange.*"})
@ComponentScan(basePackages = {"org.exchange.*"})
@EnableAutoConfiguration
@EnableJpaRepositories(basePackages = "org.exchange.app.backend.db.repositories")
@RequiredArgsConstructor
public class InternalBackendApplication {

  static void main(String[] args) {
    BuildInfoUtils.showVersion();
    SpringApplication app = new SpringApplication(InternalBackendApplication.class);
    app.run(args);
  }
}
