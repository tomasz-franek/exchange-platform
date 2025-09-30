package org.exchange.app.backend.external.services;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.cache.CacheConfiguration;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.external.api.model.CurrencyRate;
import org.springframework.cache.Cache;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class RatesServiceImpl implements RatesService {

  private final Cache ratesCache;

  public RatesServiceImpl() {
    CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.registerCustomCache(CacheConfiguration.RATES_CACHE,
        Caffeine.newBuilder().expireAfterAccess(Duration.ofSeconds(5)).build());
    this.ratesCache = cacheManager.getCache(CacheConfiguration.RATES_CACHE);
  }

  // todo implement
  @Override
  public List<CurrencyRate> loadCurrencyRates() {
    return this.ratesCache.get(CacheConfiguration.RATES_CACHE, () -> {
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
    });
  }
}
