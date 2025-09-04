package org.exchange.app.backend.db.caches;

import static org.exchange.app.backend.common.cache.CacheConfiguration.USER_ACCOUNT_CURRENCY_CACHE;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.cache.CacheConfiguration;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.specifications.AccountSpecification;
import org.exchange.app.common.api.model.Currency;
import org.springframework.cache.Cache;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class UserAccountCache {

  private final Cache userAccountCurrencyCache;
  private final UserAccountRepository userAccountRepository;

  public UserAccountCache(UserAccountRepository userAccountRepository) {
    this.userAccountRepository = userAccountRepository;
    CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.registerCustomCache(CacheConfiguration.USER_ACCOUNT_CURRENCY_CACHE,
        Caffeine.newBuilder().maximumSize(1000).build());
    this.userAccountCurrencyCache = cacheManager.getCache(USER_ACCOUNT_CURRENCY_CACHE);
  }

  public Optional<UserAccountEntity> getUserAccount(CoreTicket coreTicket) {
    if (coreTicket == null) {
      return Optional.empty();
    }
    return getUserAccount(coreTicket.getUserId(), coreTicket.getIdCurrency());
  }

  public Optional<UserAccountEntity> getUserAccount(UUID userId, String currency) {
    return userAccountCurrencyCache.get(userId + currency,
        () -> userAccountRepository.findOne(Specification.allOf(
                AccountSpecification.userId(userId),
                AccountSpecification.currency(Currency.valueOf(currency))
            )
        )
    );
  }

  public Optional<UserAccountEntity> getUserAccount(UUID userId, Currency currency) {
    return userAccountCurrencyCache.get(userId + currency.getValue(),
        () -> userAccountRepository.findOne(Specification.allOf(
                AccountSpecification.userId(userId),
                AccountSpecification.currency(currency)
            )
        )
    );
  }
}
