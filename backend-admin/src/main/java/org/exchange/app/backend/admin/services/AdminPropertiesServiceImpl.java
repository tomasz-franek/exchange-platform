package org.exchange.app.backend.admin.services;

import java.util.ArrayList;
import java.util.List;
import org.exchange.app.backend.common.exceptions.ObjectAlreadyExistsException;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.exceptions.SystemValidationException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.WithdrawEntity;
import org.exchange.app.backend.db.mappers.CurrencyMapper;
import org.exchange.app.backend.db.mappers.WithdrawMapper;
import org.exchange.app.backend.db.repositories.CurrencyRepository;
import org.exchange.app.backend.db.repositories.WithdrawRepository;
import org.exchange.app.backend.db.specifications.WithdrawSpecification;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.SystemCurrency;
import org.exchange.app.common.api.model.Withdraw;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminPropertiesServiceImpl implements AdminPropertiesService {

  private final CurrencyRepository currencyRepository;
  private final WithdrawRepository withdrawRepository;
  private final AuthenticationFacade authenticationFacade;

  @Autowired
  public AdminPropertiesServiceImpl(CurrencyRepository currencyRepository,
      WithdrawRepository withdrawRepository, AuthenticationFacade authenticationFacade) {
    this.currencyRepository = currencyRepository;
    this.withdrawRepository = withdrawRepository;
    this.authenticationFacade = authenticationFacade;
  }

  @Override
  public void updateSystemCurrency(SystemCurrency systemCurrency) {
    //authenticationFacade.checkIsAdmin(AdminStatisticsServiceImpl.class);
    CurrencyEntity entity = currencyRepository.findByCode(
        Currency.valueOf(systemCurrency.getCurrency().name())).orElseThrow(
        () -> new ObjectWithIdNotFoundException("Currency",
            systemCurrency.getCurrency().getValue()));
    CurrencyMapper.INSTANCE.updateWithDto(entity, systemCurrency);
    currencyRepository.save(entity);
  }

  @Override
  public List<SystemCurrency> loadSystemCurrencyList() {
    //authenticationFacade.checkIsAdmin(AdminStatisticsServiceImpl.class);
    List<CurrencyEntity> currencyEntities = currencyRepository.findAll();
    List<SystemCurrency> currencies = new ArrayList<>();
    currencyEntities.forEach(e -> currencies.add(CurrencyMapper.INSTANCE.toDto(e)));
    return currencies;
  }

  @Override
  public void saveWithdrawLimit(Withdraw withdraw) {
    //authenticationFacade.checkIsAdmin(AdminStatisticsServiceImpl.class);
    CurrencyEntity currency = currencyRepository.findByCode(withdraw.getCurrency())
        .orElseThrow(
            () -> new ObjectWithIdNotFoundException("Currency", withdraw.getCurrency().toString()));
    List<WithdrawEntity> withdrawEntities = withdrawRepository.findAll(
        WithdrawSpecification.currency(withdraw.getCurrency()));
    if (withdrawEntities.isEmpty()) {
      WithdrawEntity entity = WithdrawMapper.INSTANCE.toEntity(withdraw);
      entity.setCurrency(currency);
      entity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
      entity.setCreatedBy(authenticationFacade.getUserUuid());
      withdrawRepository.save(entity);
    } else {
      throw new ObjectAlreadyExistsException(Withdraw.class, withdraw.getCurrency().toString());
    }
  }

  @Override
  public void updateWithdrawLimit(Withdraw withdraw) {
    //authenticationFacade.checkIsAdmin(AdminStatisticsServiceImpl.class);
    WithdrawEntity withdrawEntity = withdrawRepository.findById(withdraw.getId()).orElseThrow(
        () -> new ObjectWithIdNotFoundException("Withdraw", withdraw.getId().toString()));
    if (!withdrawEntity.getCurrency().getCode().equals(withdraw.getCurrency())) {
      throw new SystemValidationException(Withdraw.class, List.of("Wrong currency for entity"));
    }
    WithdrawMapper.INSTANCE.updateWithDto(withdrawEntity, withdraw);
    withdrawEntity.setModifiedBy(authenticationFacade.getUserUuid());
    withdrawEntity.setModifiedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    withdrawRepository.validateVersion(withdrawEntity, withdraw.getVersion());
    withdrawRepository.save(withdrawEntity);

  }
}
