package org.exchange.app.backend.db;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(value = {"org.exchange",
    "org.exchange.app.common",
    "org.exchange.app.backend.common",
    "org.exchange.app.backend.db",
    "org.exchange.app.backend.db.entities",
    "org.exchange.app.backend.db.services",
})
@EnableJpaRepositories(basePackages = "org.exchange.app.backend.db.repositories")
@EnableAutoConfiguration
@ComponentScan(basePackages = {
    "org.exchange.app.backend.common",
    "org.exchange.app.backend.db",
    "org.exchange.app.backend.db.services"
})
@RequiredArgsConstructor
public class DbStorageConfig {

}
