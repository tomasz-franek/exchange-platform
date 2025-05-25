package org.exchange.app.backend.common.config;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.serializers.UserAccountOperationSerializer;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.KafkaHeaders;

public class KafkaConfig {

  //topics
  public static final String EXTERNAL_TICKET_TOPIC = "external-ticket-topic";
  public static final String EXTERNAL_ACCOUNT_TOPIC = "external-account-topic";
  public static final String INTERNAL_ACCOUNT_TOPIC = "internal-account-topic";
  public static final String INTERNAL_EXCHANGE_TOPIC = "internal-exchanges-topic";

  //groups
  public static final String EXTERNAL_TICKET_GROUP = "internal-ticket-group";
  public static final String EXTERNAL_ACCOUNT_GROUP = "internal-account-group";
  public static final String INTERNAL_EXCHANGE_GROUP = "internal-exchanges-group";

  public static final String PAIR_SERIALIZER = "org.exchange.app.backend.common.serializers.PairSerializer";
  public static final String PAIR_DESERIALIZER = "org.exchange.app.backend.common.deserializers.PairDeserializer";
  public static final String USER_TICKET_SERIALIZER = "org.exchange.app.backend.common.serializers.UserTicketSerializer";
  public static final String USER_TICKET_DESERIALIZER = "org.exchange.app.backend.common.deserializers.UserTicketDeserializer";
  public static final String USER_ACCOUNT_OPERATION_SERIALIZER = "org.exchange.app.backend.common.serializers.UserAccountOperationSerializer";
  public static final String USER_ACCOUNT_OPERATION_DESERIALIZER = "org.exchange.app.backend.common.deserializers.UserAccountOperationDeserializer";


  public static Pair pairFromPartitionNumber(int partition) {
    assert partition >= 0;
    assert partition < Pair.values().length;
    return Pair.values()[partition];
  }

  public static int toPartitionNumber(Pair pair) {
    return IntStream.range(0, Pair.values().length)
        .filter(i -> pair.equals(Pair.values()[i]))
        .findFirst().orElse(-1);
  }

  public static KafkaTemplate<Pair, UserTicket> pairUserTicketKafkaProducerTemplate(String topic,
      String bootstrapServers) {
    Map<String, Object> producerProperties = new HashMap<>();

    producerProperties.put(
        ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, KafkaConfig.PAIR_SERIALIZER
    );
    producerProperties.put(
        ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaConfig.USER_TICKET_SERIALIZER
    );
    producerProperties.put(KafkaHeaders.TOPIC, topic);
    producerProperties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
    ProducerFactory<Pair, UserTicket> producerFactory = new DefaultKafkaProducerFactory<>(
        producerProperties);
    return new KafkaTemplate<>(producerFactory);
  }

  public static KafkaTemplate<String, UserAccountOperation> stringUserAccountOperationKafkaProducerTemplate(
      String topic,
      String bootstrapServers) {
    Map<String, Object> producerProperties = producerConfig(bootstrapServers, topic);
    ProducerFactory<String, UserAccountOperation> producerFactory = new DefaultKafkaProducerFactory<>(
        producerProperties);
    return new KafkaTemplate<>(producerFactory);
  }

  public static Map<String, Object> producerConfig(String bootstrapServers, String topic) {
    Map<String, Object> producerProperties = new HashMap<>();

    producerProperties.put(
        ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, UserAccountOperationSerializer.class);
    producerProperties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    producerProperties.put(KafkaHeaders.TOPIC, topic);
    producerProperties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);

    return producerProperties;
  }
}
