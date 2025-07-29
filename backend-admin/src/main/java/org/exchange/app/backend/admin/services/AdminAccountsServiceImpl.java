package org.exchange.app.backend.admin.services;

import java.util.ArrayList;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.admin.api.model.UserAccountRequest;
import org.exchange.app.backend.admin.producers.CashTransactionProducer;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.mappers.UserAccountMapper;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class AdminAccountsServiceImpl implements AdminAccountsService {

  private final CashTransactionProducer cashTransactionProducer;
  private final UserAccountRepository userAccountRepository;
  private final AuthenticationFacade authenticationFacade;

  @Autowired
  public AdminAccountsServiceImpl(UserAccountRepository userAccountRepository,
      CashTransactionProducer cashTransactionProducer,
      AuthenticationFacade authenticationFacade) {
    this.userAccountRepository = userAccountRepository;
    this.cashTransactionProducer = cashTransactionProducer;
    this.authenticationFacade = authenticationFacade;
  }

  @Override
  public List<UserAccount> loadAccounts(UserAccountRequest userAccountRequest) {
    List<UserAccountEntity> accountEntityList = userAccountRepository.findByUserId(
        userAccountRequest.getUserId());
    List<UserAccount> accounts = new ArrayList<>();
    accountEntityList.forEach(account -> accounts.add(UserAccountMapper.INSTANCE.toDto(account)));
    return accounts;
  }

  @Override
  public void saveAccountDeposit(UserAccountOperation userAccountOperation) {
    authenticationFacade.getUserUuid();
    try {
      cashTransactionProducer.sendMessage(EventType.DEPOSIT.toString(), userAccountOperation);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  @Override
  public void saveWithdrawRequest(UserAccountOperation userAccountOperation) {
    log.info(userAccountOperation);
    authenticationFacade.getUserUuid();
    userAccountOperation.setAmount(-userAccountOperation.getAmount());
    try {
      cashTransactionProducer.sendMessage(EventType.WITHDRAW.toString(), userAccountOperation);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

}
