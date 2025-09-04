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
@EntityScan(basePackages = {"org.exchange.*"})
@ComponentScan(basePackages = {"org.exchange.*"})
@EnableAutoConfiguration
@EnableJpaRepositories(basePackages = "org.exchange*")
@RequiredArgsConstructor
public class InternalBackendApplication {

  public static void main(String[] args) {
    BuildInfoUtils.showVersion();
    SpringApplication app = new SpringApplication(InternalBackendApplication.class);
    app.run(args);
  }
}
