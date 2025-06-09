package org.exchange.app.backend.external.producers;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.common.api.model.UserAccount;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class InternalAccountSyncProducer {

  private final AuthenticationFacade authenticationFacade;
  //private final ReplyingKafkaTemplate<UUID, UserAccount, UserAccount> replyingKafkaTemplate;

  public InternalAccountSyncProducer(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      AuthenticationFacade authenticationFacade) {
    this.authenticationFacade = authenticationFacade;
    Map<String, Object> producerProperties = KafkaConfig.producerConfigMap(bootstrapServers,
        TopicToInternalBackend.ACCOUNT,
        StringSerializer.class, StringSerializer.class);
    ProducerFactory<UUID, UserAccount> producerFactory = new DefaultKafkaProducerFactory<>(
        producerProperties);
//    GenericMessageListenerContainer<UUID, UserAccount> genericMessageListenerContainer = null;
//    this.replyingKafkaTemplate = new ReplyingKafkaTemplate<>(producerFactory,
//        genericMessageListenerContainer);
  }

  public UserAccount saveUserAccount(UserAccount userAccount)
      throws ExecutionException, InterruptedException {
    ProducerRecord<UUID, UserAccount> record = new ProducerRecord<>(
        TopicToInternalBackend.ACCOUNT, 0,
        authenticationFacade.getUserUuid(), userAccount);
//    RequestReplyFuture<UUID, UserAccount, UserAccount> future = replyingKafkaTemplate.sendAndReceive(
//        record);
    //ConsumerRecord<UUID, UserAccount> response = future.get();
    return userAccount;
  }
}
