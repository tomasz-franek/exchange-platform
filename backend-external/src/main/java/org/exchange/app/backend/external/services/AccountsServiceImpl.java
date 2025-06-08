package org.exchange.app.backend.external.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.InternalGroups;
import org.exchange.app.backend.common.exceptions.ObjectAlreadyExistsException;
import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.backend.db.entities.UserPropertyEntity;
import org.exchange.app.backend.db.mappers.UserAccountMapper;
import org.exchange.app.backend.db.mappers.UserPropertyMapper;
import org.exchange.app.backend.db.repositories.CurrencyRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.repositories.UserPropertyRepository;
import org.exchange.app.backend.db.repositories.UserRepository;
import org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification;
import org.exchange.app.backend.external.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.external.keycloak.AuthenticationFacade;
import org.exchange.app.backend.external.producers.UserAccountOperationProducer;
import org.exchange.app.backend.external.producers.UserAccountSyncProducer;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserOperation;
import org.exchange.app.external.api.model.AccountBalance;
import org.exchange.app.external.api.model.AccountOperationsRequest;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.exchange.app.external.api.model.UserProperty;
import org.hibernate.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class AccountsServiceImpl implements AccountsService {

  private final UserAccountOperationProducer userAccountOperationProducer;
  private final UserAccountSyncProducer userAccountSyncProducer;
  private final Properties consumerProps;
  private final Properties producerProps;
  private final UserAccountRepository userAccountRepository;
  private final UserPropertyRepository userPropertyRepository;
  private final UserRepository userRepository;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final AuthenticationFacade authenticationFacade;
  private final CurrencyRepository currencyRepository;


  @Autowired
  public AccountsServiceImpl(UserAccountOperationProducer userAccountOperationProducer,
      UserAccountSyncProducer userAccountSyncProducer,
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      UserAccountRepository userAccountRepository,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      UserPropertyRepository userPropertyRepository,
      AuthenticationFacade authenticationFacade,
      UserRepository userRepository,
      CurrencyRepository currencyRepository) {
    this.userAccountOperationProducer = userAccountOperationProducer;
    this.userAccountSyncProducer = userAccountSyncProducer;
    this.userAccountRepository = userAccountRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.userPropertyRepository = userPropertyRepository;
    this.authenticationFacade = authenticationFacade;
    this.userRepository = userRepository;
    this.currencyRepository = currencyRepository;
    this.producerProps = KafkaConfig.producerConfigProperties(bootstrapServers,
        StringSerializer.class, StringSerializer.class);

    this.consumerProps = KafkaConfig.consumerConfigProperties(bootstrapServers,
        InternalGroups.ACCOUNT, StringDeserializer.class, StringDeserializer.class);
  }

  @Override
  public void saveAccountDeposit(UserAccountOperation userAccountOperation) {
    log.info(userAccountOperation);
    try {
      userAccountOperationProducer.sendMessage(EventType.DEPOSIT.toString(), userAccountOperation);
    } catch (Exception e) {
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
  public List<AccountBalance> loadAccountBalanceList() {
    List<AccountBalance> accountBalances = new ArrayList<>();
    UUID userId = authenticationFacade.getUserUuid();
    userAccountRepository.findByUserId(userId).forEach(userAccountEntity -> {
      accountBalances.add(
          new AccountBalance(userAccountEntity.getCurrency().getCode().toString(), 0L));

    });
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
          entity.getDateUtc(),
          entity.getEventType());
      operations.add(userOperation);
    });
    return operations;
  }

  @Override
  public UserProperty getUserProperty() {
    UUID userId = authenticationFacade.getUserUuid();
    UserPropertyEntity userPropertyEntity = userPropertyRepository.findById(userId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("UserProperty", userId.toString())
    );
    return UserPropertyMapper.INSTANCE.toDto(userPropertyEntity);
  }

  @Override
  public void saveUserProperty(UserProperty userProperty) {
    UUID userId = authenticationFacade.getUserUuid();
    UserPropertyEntity userPropertyEntity = userPropertyRepository.findById(userId).orElse(
        null);
    if (userPropertyEntity != null) {
      UserPropertyMapper.INSTANCE.updateWithDto(userPropertyEntity, userProperty);
    } else {
      userPropertyEntity = UserPropertyMapper.INSTANCE.toEntity(userProperty);
      userPropertyEntity.setUserId(userId);
    }
    userPropertyRepository.save(userPropertyEntity);
  }
}
