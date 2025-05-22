package org.exchange.app.backend.external.services;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.external.producers.UserAccountOperationProducer;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@AllArgsConstructor
public class AccountsServiceImpl implements AccountsService {

  private final UserAccountOperationProducer userAccountOperationProducer;

  @Override
  public void addAccountDeposit(UserAccountOperation userAccountOperation) {
    log.info(userAccountOperation);
    try {
      userAccountOperationProducer.sendMessage(EventType.DEPOSIT.toString(), userAccountOperation);
    } catch (Exception e) {
      e.printStackTrace();
      log.error(e.getMessage());
    }
  }

  @Override
  public void addWithdrawRequest(UserAccountOperation userAccountOperation) {
    log.info(userAccountOperation);
    userAccountOperation.value(-userAccountOperation.getValue());
    try {
      userAccountOperationProducer.sendMessage(EventType.WITHDRAW.toString(), userAccountOperation);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }
}
