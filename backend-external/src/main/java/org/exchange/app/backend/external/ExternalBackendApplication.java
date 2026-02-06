package org.exchange.app.backend.external;

import org.exchange.app.backend.common.utils.BuildInfoUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(value = {"org.exchange.*"})
@ComponentScan(basePackages = {"org.exchange.*"})
@EnableJpaRepositories(basePackages = "org.exchange.app.backend.db.repositories")
public class ExternalBackendApplication {

  private ExternalBackendApplication() {
  }
  static void main(String[] args) {
    BuildInfoUtils.showVersion();
    SpringApplication app = new SpringApplication(ExternalBackendApplication.class);
    app.run(args);
  }
}
