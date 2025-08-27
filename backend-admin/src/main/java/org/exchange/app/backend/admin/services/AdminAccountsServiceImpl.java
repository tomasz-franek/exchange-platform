package org.exchange.app.backend.admin.services;

import java.util.ArrayList;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.admin.api.model.AccountOperation;
import org.exchange.app.admin.api.model.AccountOperationsRequest;
import org.exchange.app.admin.api.model.UserAccountRequest;
import org.exchange.app.backend.admin.producers.CashTransactionProducer;
import org.exchange.app.backend.common.config.SystemConfig;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.mappers.ExchangeEventSourceMapper;
import org.exchange.app.backend.db.mappers.UserAccountMapper;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class AdminAccountsServiceImpl implements AdminAccountsService {

  private final CashTransactionProducer cashTransactionProducer;
  private final UserAccountRepository userAccountRepository;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final AuthenticationFacade authenticationFacade;

  @Autowired
  public AdminAccountsServiceImpl(UserAccountRepository userAccountRepository,
      CashTransactionProducer cashTransactionProducer,
      AuthenticationFacade authenticationFacade,
      ExchangeEventSourceRepository exchangeEventSourceRepository) {
    this.userAccountRepository = userAccountRepository;
    this.cashTransactionProducer = cashTransactionProducer;
    this.authenticationFacade = authenticationFacade;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
  }

  @Override
  public List<UserAccount> loadAccounts(UserAccountRequest userAccountRequest) {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    List<UserAccountEntity> accountEntityList = userAccountRepository.findByUserId(
        userAccountRequest.getUserId());
    List<UserAccount> accounts = new ArrayList<>();
    accountEntityList.forEach(account -> accounts.add(UserAccountMapper.INSTANCE.toDto(account)));
    return accounts;
  }

  @Override
  public List<UserAccount> loadSystemAccountList() {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    List<UserAccountEntity> accountEntityList = userAccountRepository.findByUserId(
        SystemConfig.systemAccountId);
    List<UserAccount> accounts = new ArrayList<>();
    accountEntityList.forEach(account -> accounts.add(UserAccountMapper.INSTANCE.toDto(account)));
    return accounts;
  }

  @Override
  public List<UserAccount> loadExchangeAccountList() {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    List<UserAccountEntity> accountEntityList = userAccountRepository.findByUserId(
        SystemConfig.exchangeAccountId);
    List<UserAccount> accounts = new ArrayList<>();
    accountEntityList.forEach(account -> accounts.add(UserAccountMapper.INSTANCE.toDto(account)));
    return accounts;
  }

  @Override
  public void saveAccountDeposit(UserAccountOperation userAccountOperation) {
    try {
      //authenticationFacade.checkIsAdmin(UserAccount.class);
      cashTransactionProducer.sendMessage(EventType.DEPOSIT.toString(), userAccountOperation);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  @Override
  public void saveWithdrawRequest(UserAccountOperation userAccountOperation) {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    userAccountOperation.setAmount(-userAccountOperation.getAmount());
    try {
      cashTransactionProducer.sendMessage(EventType.WITHDRAW.toString(), userAccountOperation);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  @Override
  public List<AccountOperation> loadAccountOperationList(
      AccountOperationsRequest systemAccountOperationsRequest) {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    UserAccountEntity userAccountEntity = userAccountRepository.findById(
        systemAccountOperationsRequest.getSystemAccountId()).orElseThrow(
        () -> new ObjectWithIdNotFoundException("SystemAccount",
            systemAccountOperationsRequest.getSystemAccountId().toString()));
    Specification<ExchangeEventSourceEntity> specification =
        ExchangeEventSourceSpecification.userAccountID(userAccountEntity.getId()).and(
            ExchangeEventSourceSpecification.fromDateUtc(
                systemAccountOperationsRequest.getDateFromUtc().atStartOfDay())
        );
    if (systemAccountOperationsRequest.getDateToUtc() != null) {
      specification = specification.and(ExchangeEventSourceSpecification.toDateUtc(
          systemAccountOperationsRequest.getDateToUtc().plusDays(1).atStartOfDay()));
    }
    List<ExchangeEventSourceEntity> operationEntityList = exchangeEventSourceRepository.findAll(
        specification, Sort.by(Order.asc("dateUtc")));
    List<AccountOperation> list = new ArrayList<>();

    operationEntityList.forEach(e -> list.add(ExchangeEventSourceMapper.INSTANCE.toDto(e)));

    return list;
  }

}
