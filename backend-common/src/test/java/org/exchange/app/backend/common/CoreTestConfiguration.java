package org.exchange.app.backend.common;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {
    "org.exchange.internal.app.core",
    "org.exchange.app.backend.common.pdfs",
    "org.exchange.app.common.api.model"
})
@EntityScan(value = {"org.exchange",
    "org.exchange.app.common",
    "org.exchange.app.admin",
    "org.exchange.app.backend.common",
    "org.exchange.app.backend.db",
})
public class CoreTestConfiguration {

}
