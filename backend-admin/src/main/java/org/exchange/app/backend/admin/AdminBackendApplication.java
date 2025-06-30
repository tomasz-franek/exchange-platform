package org.exchange.app.backend.admin;

import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.exchange.app.backend.admin.services.AdminUserServiceImpl;
import org.exchange.app.backend.common.keycloak.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
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

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(AdminBackendApplication.class);
    app.setDefaultProperties(Collections
        .singletonMap("server.port", "8090"));
    app.run(args);
  }

  @Bean
  public UserService adminUserService() {
    return new AdminUserServiceImpl();
  }
}
