package org.exchange.app.backend.common;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {"org.exchange.*"})
@EntityScan(value = {"org.exchange.*"})
public class CoreTestConfiguration {

}
