package org.exchange.internal.app.core.configurations;

import ch.qos.logback.core.util.StringUtil;
import lombok.extern.log4j.Log4j2;
import org.exchange.internal.app.core.strategies.fee.FeeCalculationStrategy;
import org.exchange.internal.app.core.strategies.ratio.RatioStrategy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Log4j2
@Configuration
public class CoreExchangeConfiguration {


  private final String ratioStrategyClassName;
  private final String feeStrategyClassName;

  public CoreExchangeConfiguration(
      @Value("${exchange.strategy.ratio:org.exchange.strategies.ratio.MinimumRatioStrategy}")
      String ratioStrategyClassName,
      @Value("${exchange.strategy.fee:org.exchange.strategies.fee.ZeroFeeStrategy}")
      String feeStrategyClassName) {
    this.ratioStrategyClassName = ratioStrategyClassName;
    this.feeStrategyClassName = feeStrategyClassName;
  }

  @Bean
  public RatioStrategy ratioStrategy() throws Exception {
    if (!StringUtil.isNullOrEmpty(this.ratioStrategyClassName)) {
      try {
        Class<?> clazz = Class.forName(ratioStrategyClassName);
        if (RatioStrategy.class.isAssignableFrom(clazz)) {
          RatioStrategy ratioStrategy = (RatioStrategy) clazz.getDeclaredConstructor()
              .newInstance();
          log.info("Created Ratio Strategy instance of class:{}", ratioStrategyClassName);
          return ratioStrategy;
        }
      } catch (ClassNotFoundException e) {
        throw new IllegalArgumentException("Strategy class not found: " + ratioStrategyClassName,
            e);
      } catch (InstantiationException | IllegalAccessException | NoSuchMethodException e) {
        throw new RuntimeException(
            "Failed to instantiate Ratio Strategy class: " + ratioStrategyClassName, e);
      }
      throw new RuntimeException(
          "Unable to create Ratio Strategy class for configured class name "
              + ratioStrategyClassName);
    } else {
      throw new RuntimeException("Ratio Strategy class name is empty ");
    }
  }

  @Bean
  public FeeCalculationStrategy feeCalculationStrategy() throws Exception {
    if (!StringUtil.isNullOrEmpty(this.feeStrategyClassName)) {
      try {
        Class<?> clazz = Class.forName(feeStrategyClassName);
        if (FeeCalculationStrategy.class.isAssignableFrom(clazz)) {
          FeeCalculationStrategy feeCalculationStrategy = (FeeCalculationStrategy) clazz.getDeclaredConstructor()
              .newInstance();
          log.info("Created Fee Strategy instance of class:{}", feeStrategyClassName);
          return feeCalculationStrategy;
        }
      } catch (ClassNotFoundException e) {
        throw new IllegalArgumentException("Strategy class not found: " + feeStrategyClassName, e);
      } catch (InstantiationException | IllegalAccessException | NoSuchMethodException e) {
        throw new RuntimeException(
            "Failed to instantiate Fee Strategy class: " + feeStrategyClassName, e);
      }
      throw new RuntimeException(
          "Unable to create Fee Strategy class for configured class name " + feeStrategyClassName);
    } else {
      throw new RuntimeException("Fee Strategy class name is empty ");
    }
  }
}
