package org.exchange.app.backend.listeners;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.ExternalTopics;
import org.exchange.app.backend.common.config.KafkaConfig.InternalGroups;
import org.exchange.app.backend.common.config.KafkaConfig.InternalTopics;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.mappers.UserAccountMapper;
import org.exchange.app.external.api.model.AccountBalance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "account-list-exchange-listener",
    topics = ExternalTopics.ACCOUNT_LIST,
    groupId = InternalGroups.ACCOUNT_LIST,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=org.apache.kafka.common.serialization.StringDeserializer",
        "value.deserializer=org.apache.kafka.common.serialization.StringDeserializer"
    },
    concurrency = "1")
public class AccountListListener {

  private final UserAccountRepository userAccountRepository;
  private final KafkaTemplate<String, String> kafkaOrderBookTemplate;
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Autowired
  AccountListListener(@Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      UserAccountRepository userAccountRepository) {
    this.kafkaOrderBookTemplate = KafkaConfig.kafkaTemplateProducer(
        InternalTopics.ACCOUNT_LIST, bootstrapServers, StringSerializer.class,
        StringSerializer.class);
    this.userAccountRepository = userAccountRepository;
  }

  @KafkaHandler
  public void listen(Object object) {
    if (object instanceof ConsumerRecord<?, ?> record) {
      log.info("*** Received AccountListListener message");
      log.info(record.value());
      log.info(record.headers().toString());

      List<AccountBalance> records = new ArrayList<>();
      userAccountRepository.findByUserId(
          UUID.fromString(record.value().toString())).forEach(userAccountEntity -> {
        records.add(UserAccountMapper.INSTANCE.toAccountBalanceDto(userAccountEntity));
      });

      String stringResponse = null;
      try {
        stringResponse = objectMapper.writeValueAsString(records);
      } catch (JsonProcessingException e) {
        log.error(e);
      }

      ProducerRecord<String, String> responseRecord = new ProducerRecord<>(
          InternalTopics.ACCOUNT_LIST, 0, record.key().toString(), stringResponse,
          record.headers());
      CompletableFuture<SendResult<String, String>> future = this.kafkaOrderBookTemplate.send(
          responseRecord);
      future.whenComplete((result, ex) -> {
        if (ex != null) {
          log.error("{}", ex.getMessage());
        } else {
          log.info("Sent OK correlation={} topic={}",
              record.headers().lastHeader("CORRELATION_ID").value(),
              InternalTopics.ACCOUNT_LIST);
        }
      });
    }
  }

}
