package org.exchange.app.backend.services;

import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.stereotype.Component;

@Component
@Endpoint(id = "strategies")
public class StrategiesEndpoint {

  private Map<String, String> strategies = new ConcurrentHashMap<>();

  @Autowired
  public StrategiesEndpoint(
      @Value("${exchange.strategy.ratio:org.exchange.internal.app.core.strategies.ratio.MinimumRatioStrategy}")
      String ratioStrategyClassName,
      @Value("${exchange.strategy.fee:org.exchange.internal.app.core.strategies.fee.ZeroFeeStrategy}")
      String feeStrategyClassName,
      @Value("${exchange.strategy.percentage-value:0}")
      String percentageValue
  ) {
    this.strategies.put("ratioStrategy",
        Arrays.stream(ratioStrategyClassName.split("\\.")).toList().getLast());
    this.strategies.put("feeStrategy",
        Arrays.stream(feeStrategyClassName.split("\\.")).toList().getLast());
    this.strategies.put("feePercentage", percentageValue);
  }

  @ReadOperation
  public Map<String, String> strategies() {
    return strategies;
  }

}
