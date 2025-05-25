package org.exchange.app.backend.external.services;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.external.producers.UserAccountOperationProducer;
import org.exchange.app.backend.external.producers.UserAccountSyncProducer;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.external.api.model.AccountBalance;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@AllArgsConstructor
public class AccountsServiceImpl implements AccountsService {

  private final UserAccountOperationProducer userAccountOperationProducer;
  private final UserAccountSyncProducer userAccountSyncProducer;

  @Override
  public void saveAccountDeposit(UserAccountOperation userAccountOperation) {
    log.info(userAccountOperation);
    try {
      userAccountOperationProducer.sendMessage(EventType.DEPOSIT.toString(), userAccountOperation);
    } catch (Exception e) {
      e.printStackTrace();
      log.error(e.getMessage());
    }
  }

  @Override
  public void saveWithdrawRequest(UserAccountOperation userAccountOperation) {
    log.info(userAccountOperation);
    userAccountOperation.value(-userAccountOperation.getValue());
    try {
      userAccountOperationProducer.sendMessage(EventType.WITHDRAW.toString(), userAccountOperation);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  @Override
  public List<AccountBalance> loadUserAccountList(UUID userId) {
    return List.of(
        new AccountBalance("EUR", 100L),
        new AccountBalance("PLN", 200L)
    );
  }

  @Override
  public UserAccount updateUserAccount(UUID id, UserAccount userAccount)
      throws ExecutionException, InterruptedException {
    return userAccountSyncProducer.saveUserAccount(userAccount);
  }

  @Override
  public UserAccount createUserAccount(UserAccount userAccount)
      throws ExecutionException, InterruptedException {
    return userAccountSyncProducer.saveUserAccount(userAccount);
  }
}
