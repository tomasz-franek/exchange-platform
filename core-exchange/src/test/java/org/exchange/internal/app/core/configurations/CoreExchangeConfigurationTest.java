package org.exchange.internal.app.core.configurations;

import org.exchange.internal.app.core.strategies.fee.FeeCalculationStrategy;
import org.exchange.internal.app.core.strategies.ratio.RatioStrategy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CoreExchangeConfigurationTest {


  @Test
  void ratioStrategy_should_createRatioStrategyInstance_when_correctRatioStrategyClassName()
      throws Exception {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.strategies.fee.ZeroFeeStrategy", "0");
    RatioStrategy ratioStrategy = coreExchangeConfiguration.ratioStrategy();
		assertThat(ratioStrategy).isNotNull();
  }

  @Test
  void ratioStrategy_should_createFeeCalculationStrategyInstance_when_correctFeeStrategyClassName()
      throws Exception {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.internal.app.core.strategies.fee.ZeroFeeStrategy", "0");
    FeeCalculationStrategy feeCalculationStrategy = coreExchangeConfiguration.feeCalculationStrategy();
		assertThat(feeCalculationStrategy).isNotNull();
  }

  @Test
  void ratioStrategy_should_throwClassNotFoundException_whenNotExistentClassName() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "non.existent.ClassName", "org.exchange.internal.app.core.strategies.fee.ZeroFeeStrategy",
        "0");

    IllegalArgumentException illegalArgumentException = assertThrows(IllegalArgumentException.class,
        coreExchangeConfiguration::ratioStrategy);
    assertThat(illegalArgumentException.getMessage()).isEqualTo(
        "Strategy class not found: non.existent.ClassName");
  }

  @Test
  void feeCalculationStrategy_should_throwClassNotFoundException_whenNotExistentClassName() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "non.existent.ClassName", "0");

    IllegalArgumentException illegalArgumentException = assertThrows(IllegalArgumentException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(illegalArgumentException.getMessage()).isEqualTo(
        "Strategy class not found: non.existent.ClassName");
  }

  @ParameterizedTest
  @CsvSource(value = {
      "org.exchange.strategies.ratio.InvalidRatioStrategy;Strategy class not found: org.exchange.strategies.ratio.InvalidRatioStrategy",
      ";Ratio Strategy class name is empty",
      "java.util.UUID;Unable to create Ratio Strategy class for configured class name java.util.UUID",
  }, delimiter = ';')
  void ratioStrategy_should_throwInstantiationException_whenInvalidClassName(
      String ratioStrategyClassName, String exceptionMessage) {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        ratioStrategyClassName,
        "org.exchange.strategies.fee.ZeroFeeStrategy", "0");

    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::ratioStrategy);
    assertThat(exception.getMessage()).isEqualTo(
        exceptionMessage);
  }

  @Test
  void feeCalculationStrategy_should_throwInstantiationException_whenInvalidClassName() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.strategies.fee.InvalidFeeStrategy", "0");

    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(exception.getMessage()).isEqualTo(
        "Strategy class not found: org.exchange.strategies.fee.InvalidFeeStrategy");
  }

  @Test
  void feeCalculationStrategy_should_throwRuntimeException_whenEmptyClassName() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.strategies.ratio.MinimumRatioStrategy", ""
        , "0");

    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(exception.getMessage()).isEqualTo("Fee Strategy class name is empty");
  }

  @Test
  void feeCalculationStrategy_should_throwRuntimeException_whenClassNameNotFeeStrategy() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.strategies.ratio.MinimumRatioStrategy", "java.util.UUID"
        , "0");

    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(exception.getMessage()).isEqualTo(
        "Unable to create Fee Strategy class for configured class name java.util.UUID");
  }

  @Test
  void feeCalculationStrategy_should_returnException_when_PercentageStrategyWithNullPercentageValue() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.internal.app.core.strategies.fee.PercentageFeeStrategy", null);
    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(exception.getMessage()).isEqualTo(
        "Percentage Fee value is null or empty");
  }

  @Test
  void feeCalculationStrategy_should_returnException_when_PercentageStrategyWithEmptyStringPercentageValue() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.internal.app.core.strategies.fee.PercentageFeeStrategy", "");
    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(exception.getMessage()).isEqualTo(
        "Percentage Fee value is null or empty");
  }

  @Test
  void feeCalculationStrategy_should_returnException_when_PercentageStrategyWithStringPercentageValueNotNumber() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.internal.app.core.strategies.fee.PercentageFeeStrategy", "xx");
    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(exception.getMessage()).isEqualTo(
        "Wrong Percentage Fee value : For input string: \"xx\"");
  }

  @Test
  void feeCalculationStrategy_should_returnException_when_PercentageStrategyWithStringPercentageValueLowerThanZero() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.internal.app.core.strategies.fee.PercentageFeeStrategy", "-1.2");
    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(exception.getMessage()).isEqualTo(
        "Wrong Percentage Fee value : Percentage cannot be negative");
  }

  @Test
  void feeCalculationStrategy_should_returnException_when_PercentageStrategyWithStringPercentageValueGreaterThan100() {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.internal.app.core.strategies.fee.PercentageFeeStrategy", "100.002");
    RuntimeException exception = assertThrows(RuntimeException.class,
        coreExchangeConfiguration::feeCalculationStrategy);
    assertThat(exception.getMessage()).isEqualTo(
        "Wrong Percentage Fee value : Percentage cannot exceed 100%");
  }

  @Test
  void feeCalculationStrategy_should_calculateCorrectPercentageValue_when_PercentageStrategyWithCorrectStringPercentageValue()
      throws Exception {
    CoreExchangeConfiguration coreExchangeConfiguration = new CoreExchangeConfiguration(
        "org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy",
        "org.exchange.internal.app.core.strategies.fee.PercentageFeeStrategy", "0.2");
    FeeCalculationStrategy strategy = coreExchangeConfiguration.feeCalculationStrategy();
    assertThat(strategy.calculateFee(100_0000)).isEqualTo(2000L);
  }
}