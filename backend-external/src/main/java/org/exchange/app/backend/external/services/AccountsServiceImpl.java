package org.exchange.app.backend.external.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.exceptions.ObjectAlreadyExistsException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.backend.db.mappers.UserAccountMapper;
import org.exchange.app.backend.db.repositories.CurrencyRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.repositories.UserRepository;
import org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification;
import org.exchange.app.backend.external.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.external.producers.CashTransactionProducer;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserOperation;
import org.exchange.app.external.api.model.AccountBalance;
import org.exchange.app.external.api.model.AccountOperationsRequest;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.hibernate.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class AccountsServiceImpl implements AccountsService {

  private final CashTransactionProducer cashTransactionProducer;
  private final UserAccountRepository userAccountRepository;
  private final UserRepository userRepository;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final AuthenticationFacade authenticationFacade;
  private final CurrencyRepository currencyRepository;


  @Autowired
  public AccountsServiceImpl(CashTransactionProducer cashTransactionProducer,
      UserAccountRepository userAccountRepository,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      AuthenticationFacade authenticationFacade,
      UserRepository userRepository,
      CurrencyRepository currencyRepository) {
    this.cashTransactionProducer = cashTransactionProducer;
    this.userAccountRepository = userAccountRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.authenticationFacade = authenticationFacade;
    this.userRepository = userRepository;
    this.currencyRepository = currencyRepository;
  }

  @Override
  public void saveAccountDeposit(UserAccountOperation userAccountOperation) {
    log.info(userAccountOperation);
    UUID userId = authenticationFacade.getUserUuid();
    userAccountOperation.setUserId(userId);
    try {
      cashTransactionProducer.sendMessage(EventType.DEPOSIT.toString(), userAccountOperation);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  @Override
  public void saveWithdrawRequest(UserAccountOperation userAccountOperation) {
    log.info(userAccountOperation);
    UUID userId = authenticationFacade.getUserUuid();
    userAccountOperation.setUserId(userId);
    userAccountOperation.setAmount(-userAccountOperation.getAmount());
    try {
      cashTransactionProducer.sendMessage(EventType.WITHDRAW.toString(), userAccountOperation);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  @Override
  public List<AccountBalance> loadAccountBalanceList() {
    List<AccountBalance> accountBalances = new ArrayList<>();
    UUID userId = authenticationFacade.getUserUuid();
    userAccountRepository.findByUserId(userId).forEach(userAccountEntity ->
        accountBalances.add(
            new AccountBalance(
                userAccountEntity.getCurrency().getCode().toString(),
                0L,
                userAccountEntity.getId())));
    return accountBalances;
  }

  @Override
  public UserAccount updateUserAccount(UUID id, UserAccount userAccount) {

    UserAccountEntity userAccountEntity = userAccountRepository
        .findById(authenticationFacade.getUserUuid())
        .orElseThrow(() ->
            new ObjectWithIdNotFoundException("userAccount",
                authenticationFacade.getUserUuid().toString()));
    UserAccountMapper.INSTANCE.updateWithDto(userAccountEntity, userAccount);
    return UserAccountMapper.INSTANCE.toDto(userAccountRepository.save(userAccountEntity));
  }

  @Override
  public UserAccount createUserAccount(UserAccount userAccount) {
    UUID userId = authenticationFacade.getUserUuid();
    UserEntity userEntity = userRepository.findById(userId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("User", userId.toString())
    );
    CurrencyEntity currencyEntity = currencyRepository.findByCode(userAccount.getCurrency())
        .orElseThrow(
            () -> new ObjectWithIdNotFoundException("Currency",
                userAccount.getCurrency().toString())
        );
    UserAccountEntity userAccountEntity = userAccountRepository.findByUserIdAndCurrency(userId,
        userAccount.getCurrency()).orElse(null);
    if (userAccountEntity != null) {
      throw new ObjectAlreadyExistsException(UserAccount.class,
          String.format("currency: %s", userAccount.getCurrency().toString()));
    }
    userAccountEntity = UserAccountMapper.INSTANCE.toEntity(userAccount);
    userAccountEntity.setUser(userEntity);
    userAccountEntity.setCurrency(currencyEntity);
    return UserAccountMapper.INSTANCE.toDto(userAccountRepository.save(userAccountEntity));
  }

  @Override
  public List<UserOperation> loadUserOperationList(
      AccountOperationsRequest accountOperationsRequest) {
    Specification<ExchangeEventSourceEntity> specification = ExchangeEventSourceSpecification.fromDate(
        accountOperationsRequest.getDateFrom());
    if (accountOperationsRequest.getDateTo() != null) {
      specification.and(
          ExchangeEventSourceSpecification.toDate(
              accountOperationsRequest.getDateTo()));
    }
    if (accountOperationsRequest.getCurrency() != null) {
      UserAccountEntity account = userAccountRepository.findByUserIdAndCurrency(
              accountOperationsRequest.getUserId(), accountOperationsRequest.getCurrency())
          .orElseThrow(() -> new ObjectNotFoundException(UserAccount.class,
              accountOperationsRequest.getCurrency().toString()));
      specification.and(
          ExchangeEventSourceSpecification.userAccountID(account.getId()));
    }
    PageRequest pageable = PageRequest.of(
        accountOperationsRequest.getPage() != null ? accountOperationsRequest.getPage() : 0,
        accountOperationsRequest.getSize() != null ? accountOperationsRequest.getSize() : 10,
        Sort.by(Direction.DESC, "dateUtc"));

    List<UserOperation> operations = new ArrayList<>();
    exchangeEventSourceRepository.findAll(specification, pageable).forEach(entity -> {
      UserOperation userOperation = new UserOperation(
          accountOperationsRequest.getUserId(),
          null,
          entity.getAmount(),
          entity.getDateUtc().toLocalDateTime(),
          entity.getEventType());
      operations.add(userOperation);
    });
    return operations;
  }


}
