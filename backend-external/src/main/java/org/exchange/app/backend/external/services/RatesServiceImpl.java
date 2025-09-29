package org.exchange.app.backend.external.services;

import java.util.List;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.external.api.model.CurrencyRate;
import org.springframework.stereotype.Service;

@Service
public class RatesServiceImpl implements RatesService {


  // todo implement
  @Override
  public List<CurrencyRate> loadCurrencyRates() {
    CurrencyRate currencyRateEurUsd = new CurrencyRate();
    currencyRateEurUsd.setPair(Pair.EUR_USD);
    currencyRateEurUsd.sellAmount(100L);
    currencyRateEurUsd.buyAmount(200L);
    currencyRateEurUsd.setBuyRate(1_0000L);
    currencyRateEurUsd.setSellRate(1_1000L);
    CurrencyRate currencyRateEurGbp = new CurrencyRate();
    currencyRateEurGbp.setPair(Pair.EUR_GBP);
    currencyRateEurGbp.sellAmount(500L);
    currencyRateEurGbp.buyAmount(800L);
    currencyRateEurGbp.setBuyRate(1_0800L);
    currencyRateEurGbp.setSellRate(1_0920L);
    return List.of(currencyRateEurUsd, currencyRateEurGbp);
  }
}
