package org.exchange.configurations;

import ch.qos.logback.core.util.StringUtil;
import lombok.extern.log4j.Log4j2;
import org.exchange.strategies.ratio.RatioStrategy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Log4j2
@Configuration
public class CoreExchangeConfiguration {


  private final String strategyClassName;

  public CoreExchangeConfiguration(
      @Value("${exchange.strategy.ratio:org.exchange.strategies.ratio.MinimumRatioStrategy}")
      String strategyClassName) {
    this.strategyClassName = strategyClassName;
  }

  @Bean
  public RatioStrategy ratioStrategy() throws Exception {
    if (!StringUtil.isNullOrEmpty(this.strategyClassName)) {
      try {
        Class<?> clazz = Class.forName(strategyClassName);
        if (RatioStrategy.class.isAssignableFrom(clazz)) {
          RatioStrategy ratioStrategy = (RatioStrategy) clazz.getDeclaredConstructor()
              .newInstance();
          log.info("Created Ratio Strategy instance of class:{}", strategyClassName);
          return ratioStrategy;
        }
      } catch (ClassNotFoundException e) {
        throw new IllegalArgumentException("Strategy class not found: " + strategyClassName, e);
      } catch (InstantiationException | IllegalAccessException | NoSuchMethodException e) {
        throw new RuntimeException(
            "Failed to instantiate Ratio Strategy class: " + strategyClassName, e);
      }
      throw new RuntimeException(
          "Unable to create Ratio Strategy class for configured class name " + strategyClassName);
    } else {
      throw new RuntimeException("Ratio Strategy class name is empty ");
    }
  }
}
