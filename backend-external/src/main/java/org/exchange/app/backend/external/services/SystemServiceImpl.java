package org.exchange.app.backend.external.services;

import static org.exchange.app.backend.db.specifications.SystemMessageSpecification.active;

import java.util.ArrayList;
import java.util.List;
import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.SystemMessageEntity;
import org.exchange.app.backend.db.mappers.CurrencyMapper;
import org.exchange.app.backend.db.mappers.SystemMessageMapper;
import org.exchange.app.backend.db.repositories.CurrencyRepository;
import org.exchange.app.backend.db.repositories.SystemMessageRepository;
import org.exchange.app.common.api.model.SystemCurrency;
import org.exchange.app.common.api.model.SystemMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SystemServiceImpl implements SystemService {

  private final SystemMessageRepository systemMessageRepository;
  private final CurrencyRepository currencyRepository;

  @Autowired
  public SystemServiceImpl(SystemMessageRepository systemMessageRepository,
      CurrencyRepository currencyRepository) {
    this.systemMessageRepository = systemMessageRepository;
    this.currencyRepository = currencyRepository;
  }

  @Override
  public List<SystemMessage> loadSystemMessageList() {
    List<SystemMessage> messages = new ArrayList<>();
    List<SystemMessageEntity> entities = systemMessageRepository.findAll(active(true));
    entities.forEach(entity -> messages.add(SystemMessageMapper.INSTANCE.toDto(entity)));
    return messages;
  }

  @Override
  public List<SystemCurrency> loadSystemCurrencyList() {
    List<SystemCurrency> systemCurrencyList = new ArrayList<>();
    List<CurrencyEntity> entities = currencyRepository.findAll();
    entities.forEach(entity -> systemCurrencyList.add(CurrencyMapper.INSTANCE.toDto(entity)));
    return systemCurrencyList;
  }
}
