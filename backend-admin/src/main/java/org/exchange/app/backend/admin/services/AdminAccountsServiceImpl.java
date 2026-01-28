package org.exchange.app.backend.admin.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.admin.api.model.AccountAmountRequest;
import org.exchange.app.admin.api.model.AccountAmountResponse;
import org.exchange.app.admin.api.model.AccountOperation;
import org.exchange.app.admin.api.model.AccountOperationsRequest;
import org.exchange.app.admin.api.model.TransactionsPdfRequest;
import org.exchange.app.admin.api.model.UserAccountRequest;
import org.exchange.app.admin.api.model.UserBankAccountRequest;
import org.exchange.app.backend.admin.producers.CashTransactionProducer;
import org.exchange.app.backend.common.exceptions.MinimalWithdrawException;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.entities.UserBankAccountEntity;
import org.exchange.app.backend.db.mappers.ExchangeEventSourceMapper;
import org.exchange.app.backend.db.mappers.UserAccountMapper;
import org.exchange.app.backend.db.mappers.UserBankAccountMapper;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.repositories.UserBankAccountRepository;
import org.exchange.app.backend.db.services.WithdrawService;
import org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification;
import org.exchange.app.backend.db.specifications.UserBankAccountSpecification;
import org.exchange.app.backend.db.utils.BankAccountMaskedUtil;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.exchange.app.common.api.model.UserBankAccount;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@AllArgsConstructor
public class AdminAccountsServiceImpl implements AdminAccountsService {

  private final CashTransactionProducer cashTransactionProducer;
  private final UserAccountRepository userAccountRepository;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final AuthenticationFacade authenticationFacade;
  private final UserBankAccountRepository userBankAccountRepository;
  private final WithdrawService withdrawService;


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
  public List<UserAccount> loadAccountList(UUID userId) {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    List<UserAccountEntity> accountEntityList = userAccountRepository.findByUserId(userId);
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
    Long minimalWithdrawAmount = withdrawService.getMinimalAmountForCurrency(
        userAccountOperation.getCurrency());
    if (userAccountOperation.getAmount() < minimalWithdrawAmount) {
      throw new MinimalWithdrawException(CurrencyEntity.class,
          userAccountOperation.getCurrency().getValue(), userAccountOperation.getAmount(),
          minimalWithdrawAmount);
    }
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

  public List<UUID> loadUserAccountIds(UUID userId) {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    return userAccountRepository.findByUserId(userId)
        .stream().map(UserAccountEntity::getId).toList();
  }

  @Override
  public AccountAmountResponse loadAccountAmount(AccountAmountRequest amountRequest) {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    return userAccountRepository.loadAccountAmount(amountRequest.getAccountId());
  }

  @Override
  public List<UserBankAccount> loadBankAccountList(UserBankAccountRequest userBankAccountRequest) {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    if (userAccountRepository.existsUserIdAndUserAccountId(userBankAccountRequest.getUserId(),
        userBankAccountRequest.getUserAccountId()).isEmpty()) {
      throw new ObjectWithIdNotFoundException("userAccountId",
          userBankAccountRequest.getUserAccountId().toString());
    }
    Specification<UserBankAccountEntity> specification = UserBankAccountSpecification.userAccountId(
        userBankAccountRequest.getUserAccountId());
    List<UserBankAccountEntity> userBankAccountEntityList = userBankAccountRepository.findAll(
        specification);
    List<UserBankAccount> bankAccountList = new ArrayList<>();
    userBankAccountEntityList.forEach(
        e -> {
          UserBankAccount userBankAccount = UserBankAccountMapper.INSTANCE.toDto(e);
          //todo move masking operation to database level
          userBankAccount.setAccountNumber(
              BankAccountMaskedUtil.maskBankAccount(e.getAccountNumber()));
          bankAccountList.add(userBankAccount);
        });
    return bankAccountList;
  }

  @Override
  public void validateBankAccount(UserBankAccount userBankAccountRequest) {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    Specification<UserBankAccountEntity> specification = UserBankAccountSpecification.userAccountId(
            userBankAccountRequest.getUserAccountId())
        .and(UserBankAccountSpecification.id(userBankAccountRequest.getId()));
    List<UserBankAccountEntity> userBankAccountEntityList = userBankAccountRepository.findAll(
        specification);
    if (userBankAccountEntityList.isEmpty()) {
      throw new ObjectWithIdNotFoundException("userAccountId",
          userBankAccountRequest.getUserAccountId().toString());
    }
    UserBankAccountEntity userBankAccountEntity = userBankAccountEntityList.getFirst();
    if (!userBankAccountEntity.getUserAccountId()
        .equals(userBankAccountRequest.getUserAccountId())) {
      throw new ObjectWithIdNotFoundException("userAccountId",
          userBankAccountRequest.getUserAccountId().toString());
    }
    userBankAccountEntity.setVerifiedDateUtc(LocalDateTime.now());
    userBankAccountEntity.setVerifiedBy(authenticationFacade.getUserUuid().toString());

    userBankAccountRepository.validateVersionAndSave(userBankAccountEntity,
        userBankAccountRequest.getVersion());
  }

  @Override
  public List<AccountOperation> loadTransactionList(TransactionsPdfRequest transactionsPdfRequest) {
    //authenticationFacade.checkIsAdmin(UserAccount.class);
    Specification<ExchangeEventSourceEntity> specification =
        ExchangeEventSourceSpecification.currency(transactionsPdfRequest.getCurrency().getValue())
            .and(
                ExchangeEventSourceSpecification.fromDateUtc(
                    transactionsPdfRequest.getDateFromUtc().atStartOfDay())
            );
    if (transactionsPdfRequest.getDateToUtc() != null) {
      specification = specification.and(ExchangeEventSourceSpecification.toDateUtc(
          transactionsPdfRequest.getDateToUtc().plusDays(1).atStartOfDay()));
    }
    List<ExchangeEventSourceEntity> operationEntityList = exchangeEventSourceRepository.findAll(
        specification, Sort.by(Order.asc("dateUtc")));
    List<AccountOperation> list = new ArrayList<>();

    operationEntityList.forEach(e -> list.add(ExchangeEventSourceMapper.INSTANCE.toDto(e)));

    return list;
  }
}
