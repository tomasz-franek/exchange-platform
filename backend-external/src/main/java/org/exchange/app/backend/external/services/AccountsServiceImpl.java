package org.exchange.app.backend.external.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.util.List;
import java.util.Properties;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.ExternalTopics;
import org.exchange.app.backend.common.config.KafkaConfig.InternalGroups;
import org.exchange.app.backend.common.kafka.KafkaSynchronizedClient;
import org.exchange.app.backend.external.producers.UserAccountOperationProducer;
import org.exchange.app.backend.external.producers.UserAccountSyncProducer;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.external.api.model.AccountBalance;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@AllArgsConstructor
public class AccountsServiceImpl implements AccountsService {

  public static final String REQUEST_TOPIC = ExternalTopics.ACCOUNT_LIST;
  public static final String REPLY_TOPIC = ExternalTopics.ACCOUNT_LIST;
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final UserAccountOperationProducer userAccountOperationProducer;
  private final UserAccountSyncProducer userAccountSyncProducer;
  private final Properties consumerProps;
  private final Properties producerProps;

  @Autowired
  public AccountsServiceImpl(UserAccountOperationProducer userAccountOperationProducer,
      UserAccountSyncProducer userAccountSyncProducer,
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.userAccountOperationProducer = userAccountOperationProducer;
    this.userAccountSyncProducer = userAccountSyncProducer;
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
  public List<AccountBalance> loadUserAccountList(UUID userId) {
    try (KafkaSynchronizedClient<String, String> client = new KafkaSynchronizedClient<>(
        producerProps, consumerProps, REQUEST_TOPIC, REPLY_TOPIC)) {
      log.info("********* loadUserAccountList {}", userId);
      String response = client.sendAndWait("loadUserAccountList", userId.toString(),
          Duration.ofSeconds(30));
      log.info("********* Response {}", response);
      return List.of(objectMapper.readValue(response, AccountBalance[].class));
    } catch (Exception e) {
      log.error("Problem with synchronized communication", e);
    }
    return List.of();
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
