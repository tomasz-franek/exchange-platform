package org.exchange.app.backend.external.services;

import jakarta.transaction.Transactional;
import jakarta.transaction.Transactional.TxType;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.exceptions.InsufficientFundsException;
import org.exchange.app.backend.common.exceptions.ObjectAlreadyExistsException;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.exceptions.UserAccountException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.common.validators.SystemValidator;
import org.exchange.app.backend.db.caches.UserAccountCache;
import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.SnapshotDataEntity;
import org.exchange.app.backend.db.entities.SystemSnapshotEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.entities.UserBankAccountEntity;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.backend.db.mappers.UserAccountMapper;
import org.exchange.app.backend.db.mappers.UserBankAccountMapper;
import org.exchange.app.backend.db.repositories.CurrencyRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.SnapshotDataRepository;
import org.exchange.app.backend.db.repositories.SystemSnapshotRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.repositories.UserBankAccountRepository;
import org.exchange.app.backend.db.repositories.UserRepository;
import org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification;
import org.exchange.app.backend.db.specifications.UserBankAccountSpecification;
import org.exchange.app.backend.db.utils.BankAccountMaskedUtil;
import org.exchange.app.backend.db.validators.EntityValidator;
import org.exchange.app.backend.external.producers.WithdrawProducer;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.exchange.app.common.api.model.UserBankAccount;
import org.exchange.app.common.api.model.UserOperation;
import org.exchange.app.external.api.model.AccountBalance;
import org.exchange.app.external.api.model.AccountOperationsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class AccountsServiceImpl implements AccountsService {

  private final UserAccountRepository userAccountRepository;
  private final UserRepository userRepository;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final AuthenticationFacade authenticationFacade;
  private final CurrencyRepository currencyRepository;
  private final WithdrawProducer withdrawProducer;
  private final UserAccountCache userAccountCache;
  private final SystemSnapshotRepository systemSnapshotRepository;
  private final SnapshotDataRepository snapshotDataRepository;
  private final UserBankAccountRepository userBankAccountRepository;


  @Autowired
  public AccountsServiceImpl(
      UserAccountRepository userAccountRepository,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      AuthenticationFacade authenticationFacade,
      UserRepository userRepository,
      CurrencyRepository currencyRepository,
      WithdrawProducer withdrawProducer,
      SystemSnapshotRepository systemSnapshotRepository,
      SnapshotDataRepository snapshotDataRepository,
      UserAccountCache userAccountCache, UserBankAccountRepository userBankAccountRepository) {
    this.userAccountRepository = userAccountRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.authenticationFacade = authenticationFacade;
    this.userRepository = userRepository;
    this.currencyRepository = currencyRepository;
    this.withdrawProducer = withdrawProducer;
    this.userAccountCache = userAccountCache;
    this.systemSnapshotRepository = systemSnapshotRepository;
    this.snapshotDataRepository = snapshotDataRepository;
    this.userBankAccountRepository = userBankAccountRepository;
  }

  @Override
  public List<AccountBalance> loadAccountBalanceList() {
    UUID userId = authenticationFacade.getUserUuid();
    return userAccountRepository.getAccountBalances(userId);
  }

  @Override
  public UserAccount updateUserAccount(UserAccount userAccount) {
    UUID userId = authenticationFacade.getUserUuid();
    UserAccountEntity userAccountEntity = userAccountCache.getUserAccount(userId,
            userAccount.getCurrency())
        .orElseThrow(() -> new UserAccountException(UserAccount.class,
            String.format("Not found account with currency %s for current user",
                userAccount.getCurrency().toString())));
    if (!userAccountEntity.getId().equals(userAccount.getId())) {
      throw new UserAccountException(UserAccount.class,
          String.format("Currency %s is not correct currency for account %s",
              userAccount.getCurrency(), userAccount.getId()));
    }
    userAccountRepository.validateVersion(userAccountEntity, userAccount.getVersion());
    UserAccountMapper.INSTANCE.updateWithDto(userAccountEntity, userAccount);
    return UserAccountMapper.INSTANCE.toDto(userAccountRepository.save(userAccountEntity));
  }

  @Override
  @Transactional(TxType.REQUIRED)
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
    UserAccountEntity userAccountEntity = userAccountCache.getUserAccount(userId,
        userAccount.getCurrency()).orElse(null);
    if (userAccountEntity != null) {
      throw new ObjectAlreadyExistsException(UserAccount.class,
          String.format("currency: %s", userAccount.getCurrency().toString()));
    }
    userAccountEntity = UserAccountMapper.INSTANCE.toEntity(userAccount);
    userAccountEntity.setUser(userEntity);
    userAccountEntity.setCurrency(currencyEntity);
    UserAccountEntity createdAccount = userAccountRepository.save(userAccountEntity);
    Optional<SystemSnapshotEntity> optionalSystemSnapshotEntity = systemSnapshotRepository.getLastSnapshotObject();
    SystemSnapshotEntity systemSnapshotEntity;
    if (optionalSystemSnapshotEntity.isEmpty()) {
      SystemSnapshotEntity newEntity = new SystemSnapshotEntity();
      newEntity.setDateUtc(ExchangeDateUtils.currentLocalDate().minusDays(1));
      newEntity.setLastEventSourceId(0L);
      systemSnapshotEntity = systemSnapshotRepository.save(newEntity);
    } else {
      systemSnapshotEntity = optionalSystemSnapshotEntity.get();
    }
    SnapshotDataEntity snapshotDataEntity = new SnapshotDataEntity();
    snapshotDataEntity.setAmount(0L);
    snapshotDataEntity.setSystemSnapshotId(systemSnapshotEntity.getId());
    snapshotDataEntity.setUserAccountId(createdAccount.getId());
    snapshotDataRepository.save(snapshotDataEntity);

    return UserAccountMapper.INSTANCE.toDto(createdAccount);
  }

  @Override
  public List<UserOperation> loadUserOperationList(
      AccountOperationsRequest accountOperationsRequest) {
    UUID userId = authenticationFacade.getUserUuid();
    Specification<ExchangeEventSourceEntity> specification = ExchangeEventSourceSpecification.fromDateUtc(
        accountOperationsRequest.getDateFrom());
    if (accountOperationsRequest.getDateTo() != null) {
      specification.and(
          ExchangeEventSourceSpecification.toDateUtc(accountOperationsRequest.getDateTo()));
    }
    if (accountOperationsRequest.getCurrency() != null) {
      UserAccountEntity account = userAccountCache.getUserAccount(
              userId, accountOperationsRequest.getCurrency())
          .orElseThrow(() -> new ObjectWithIdNotFoundException("UserAccount.currency",
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
          userId,
          null,
          entity.getAmount(),
          entity.getDateUtc(),
          entity.getEventType());
      operations.add(userOperation);
    });
    return operations;
  }

  @Override
  public void saveWithdrawRequest(UserAccountOperation userAccountOperation) {
    UUID userId = authenticationFacade.getUserUuid();
    AccountBalance accountBalance = userAccountRepository.getAccountBalance(
        userAccountOperation.getUserAccountId());
    if (accountBalance.getAmount() >= userAccountOperation.getAmount()) {
      userAccountOperation.setUserId(userId);
      userAccountOperation.setAmount(-userAccountOperation.getAmount());
      try {
        withdrawProducer.sendMessage(EventType.WITHDRAW.toString(), userAccountOperation);
      } catch (Exception e) {
        log.error(e.getMessage());
      }
    } else {
      throw new InsufficientFundsException(CurrencyEntity.class,
          userAccountOperation.getCurrency().getValue());
    }
  }

  @Override
  public UserBankAccount saveBankAccount(UserBankAccount userBankAccount) {
    UUID userId = authenticationFacade.getUserUuid();
    UserBankAccountEntity userBankAccountEntity;
    if (userAccountRepository.existsUserIdAndUserAccountId(userId,
            userBankAccount.getUserAccountId())
        .isEmpty()) {
      throw new ObjectWithIdNotFoundException("userAccountId",
          userBankAccount.getUserAccountId().toString());
    }
    userBankAccountEntity = UserBankAccountMapper.INSTANCE.toEntity(userBankAccount);
    userBankAccountEntity.setCreatedDateUtc(LocalDateTime.now());
    userBankAccountEntity.setCreatedBy(userId.toString());
    userBankAccountEntity.setVersion(0);
    userBankAccountEntity.setId(UUID.randomUUID());

    SystemValidator.validate(
            EntityValidator.haveCorrectFieldTextValues(userBankAccountEntity),
            EntityValidator.haveEmptyField(userBankAccountEntity, "countryCode"),
            EntityValidator.haveEmptyField(userBankAccountEntity, "accountNumber"))
        .throwValidationExceptionWhenErrors();

    userBankAccountEntity = userBankAccountRepository.save(userBankAccountEntity);
    UserBankAccount createdUserBankAccount = UserBankAccountMapper.INSTANCE.toDto(
        userBankAccountEntity);
    //todo move masking operation to database level
    createdUserBankAccount.setAccountNumber(
        BankAccountMaskedUtil.maskBankAccount(createdUserBankAccount.getAccountNumber()));
    return createdUserBankAccount;

  }

  @Override
  public List<UserBankAccount> loadBankAccountList(String currency) {
    UUID userId = authenticationFacade.getUserUuid();
    UserAccountEntity userAccountEntity = userAccountRepository.findByUserId(userId).stream()
        .filter(e -> e.getCurrency().getCode().getValue().equals(currency)).findFirst()
        .orElseThrow(() -> new ObjectWithIdNotFoundException("userAccount", "currency", currency));

    Specification<UserBankAccountEntity> specification = UserBankAccountSpecification.userAccountId(
        userAccountEntity.getId());
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
}
