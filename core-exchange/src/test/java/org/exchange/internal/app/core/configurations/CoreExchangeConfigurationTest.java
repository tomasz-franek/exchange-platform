package org.exchange.internal.app.core.configurations;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.exchange.internal.app.core.strategies.fee.FeeCalculationStrategy;
import org.exchange.internal.app.core.strategies.ratio.RatioStrategy;
import org.junit.jupiter.api.Test;

class CoreExchangeConfigurationTest {


  @Test
  public void ratioStrategy_should_createRatioStrategyInstance_when_correctRatioStrategyClassName()
      throws Exception {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.strategies.fee.ZeroFeeStrategy", "0");
    RatioStrategy ratioStrategy = coreExchangeConfiguration.ratioStrategy();
		assertThat(ratioStrategy).isNotNull();
  }

  @Test
  public void ratioStrategy_should_createFeeCalculationStrategyInstance_when_correctFeeStrategyClassName()
      throws Exception {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.internal.app.core.strategies.fee.ZeroFeeStrategy", "0");
    FeeCalculationStrategy feeCalculationStrategy = coreExchangeConfiguration.feeCalculationStrategy();
		assertThat(feeCalculationStrategy).isNotNull();
  }

  @Test
  public void ratioStrategy_should_throwClassNotFoundException_whenNotExistentClassName() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "non.existent.ClassName", "org.exchange.internal.app.core.strategies.fee.ZeroFeeStrategy",
        "0");

    IllegalArgumentException illegalArgumentException = assertThrows(IllegalArgumentException.class,
        coreExchangeConfiguration::ratioStrategy);
    assertThat(illegalArgumentException.getMessage()).isEqualTo(
        "Strategy class not found: non.existent.ClassName");
  }

  @Test
  public void feeCalculationStrategy_should_throwClassNotFoundException_whenNotExistentClassName() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "non.existent.ClassName", "0");

    IllegalArgumentException illegalArgumentException = assertThrows(IllegalArgumentException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(illegalArgumentException.getMessage()).isEqualTo(
        "Strategy class not found: non.existent.ClassName");
  }

  @Test
  public void ratioStrategy_should_throwInstantiationException_whenInvalidClassName() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.strategies.ratio.InvalidRatioStrategy",
        "org.exchange.strategies.fee.ZeroFeeStrategy", "0");

    assertThrows(RuntimeException.class, coreExchangeConfiguration::ratioStrategy);
  }

  @Test
  public void feeCalculationStrategy_should_throwInstantiationException_whenInvalidClassName() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.strategies.fee.InvalidFeeStrategy", "0");

    assertThrows(RuntimeException.class, coreExchangeConfiguration::feeCalculationStrategy);
  }

  @Test
  public void ratioStrategy_should_throwRuntimeException_whenEmptyClassName() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration("",
        "org.exchange.strategies.fee.ZeroFeeStrategy", "0");

    assertThrows(RuntimeException.class, coreExchangeConfiguration::ratioStrategy);
  }

  @Test
  public void feeCalculationStrategy_should_throwRuntimeException_whenEmptyClassName() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.strategies.ratio.MinimumRatioStrategy", ""
        , "0");

    assertThrows(RuntimeException.class, coreExchangeConfiguration::feeCalculationStrategy);
  }

  @Test
  public void feeCalculationStrategy_should_throwRuntimeException_whenClassNameNotFeeStrategy() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.strategies.ratio.MinimumRatioStrategy", "java.util.UUID"
        , "0");

    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(exception.getMessage()).isEqualTo(
        "Unable to create Fee Strategy class for configured class name java.util.UUID");
  }

  @Test
  public void ratioStrategy_should_throwRuntimeException_whenClassNameNotRatioStrategy() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "java.util.UUID", "org.exchange.strategies.fee.ZeroFeeStrategy", "0"
    );

    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::ratioStrategy);
    assertThat(exception.getMessage()).isEqualTo(
        "Unable to create Ratio Strategy class for configured class name java.util.UUID");
  }

}