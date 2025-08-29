package org.exchange.app.backend.db.services;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.exchange.app.backend.common.config.SystemConfig;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlatformAccountServiceImpl implements PlatformAccountService {

  private final Map<String, UUID> exchangeAccountMap;
  private final Map<String, UUID> systemAccountMap;


  @Autowired
  public PlatformAccountServiceImpl(UserAccountRepository userAccountRepository) {
    this.exchangeAccountMap = new HashMap<>();
    userAccountRepository.findByUserId(SystemConfig.exchangeAccountId).forEach(
        e -> this.exchangeAccountMap.put(e.getCurrency().getCode().toString(), e.getId()));
    this.systemAccountMap = new HashMap<>();
    userAccountRepository.findByUserId(SystemConfig.systemAccountId).forEach(
        e -> this.systemAccountMap.put(e.getCurrency().getCode().toString(), e.getId()));
  }

  @Override
  public UUID getExchangeAccountId(String currency) {

    UUID exchangeAccountId = this.exchangeAccountMap.getOrDefault(currency, null);
    if (exchangeAccountId == null) {
      throw new ObjectWithIdNotFoundException("Currency", currency);
    }
    return exchangeAccountId;
  }

  @Override
  public UUID getSystemAccountId(String currency) {

    UUID systemAccountId = this.systemAccountMap.getOrDefault(currency, null);
    if (systemAccountId == null) {
      throw new ObjectWithIdNotFoundException("Currency", currency);
    }
    return systemAccountId;
  }

}
