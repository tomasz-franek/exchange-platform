package org.exchange.app.backend.admin.services;

import java.util.ArrayList;
import java.util.List;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.mappers.CurrencyMapper;
import org.exchange.app.backend.db.repositories.CurrencyRepository;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.SystemCurrency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminPropertiesServiceImpl implements AdminPropertiesService {

  private final CurrencyRepository currencyRepository;

  @Autowired
  public AdminPropertiesServiceImpl(CurrencyRepository currencyRepository) {
    this.currencyRepository = currencyRepository;
  }

  @Override
  public void updateSystemCurrency(SystemCurrency systemCurrency) {
    CurrencyEntity entity = currencyRepository.findByCode(
        Currency.valueOf(systemCurrency.getCurrency())).orElseThrow(
        () -> new ObjectWithIdNotFoundException("Currency", systemCurrency.getCurrency()));
    CurrencyMapper.INSTANCE.updateWithDto(entity, systemCurrency);
    currencyRepository.save(entity);
  }

  @Override
  public List<SystemCurrency> loadSystemCurrencyList() {
    List<CurrencyEntity> currencyEntities = currencyRepository.findAll();
    List<SystemCurrency> currencies = new ArrayList<>();
    currencyEntities.forEach(e -> currencies.add(CurrencyMapper.INSTANCE.toDto(e)));
    return currencies;
  }
}
