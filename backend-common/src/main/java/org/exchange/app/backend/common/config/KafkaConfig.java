package org.exchange.app.backend.common.config;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.stream.IntStream;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.common.api.model.Pair;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.KafkaHeaders;

public class KafkaConfig {

  //topics
  public static final String EXTERNAL_TICKET_TOPIC = "external-ticket-topic";
  public static final String EXTERNAL_ACCOUNT_TOPIC = "external-account-topic";
  public static final String EXTERNAL_ACCOUNT_LIST_TOPIC = "external-account-list-topic";
  public static final String EXTERNAL_ORDER_BOOK_TOPIC = "external-order-book-topic";

  public static final String INTERNAL_ACCOUNT_LIST_TOPIC = "internal-account-list-topic";
  public static final String INTERNAL_ACCOUNT_TOPIC = "internal-account-topic";
  public static final String INTERNAL_EXCHANGE_TOPIC = "internal-exchanges-topic";

  //groups
  public static final String EXTERNAL_TICKET_GROUP = "internal-ticket-group";
  public static final String EXTERNAL_ACCOUNT_GROUP = "external-account-group";
  public static final String INTERNAL_EXCHANGE_GROUP = "internal-exchanges-group";
  public static final String EXTERNAL_ORDER_BOOK_GROUP = "external-order-book-group";
  public static final String INTERNAL_ACCOUNT_GROUP = "internal-account-group";

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

  public static <K extends Serializer<?>, V extends Serializer<?>> Map<String, Object> producerConfigMap(
      String bootstrapServers,
      String topic,
      Class<K> keySerializerClass,
      Class<V> valueSerializerClass) {

    Map<String, Object> producerProperties = new HashMap<>();

    producerProperties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, valueSerializerClass);
    producerProperties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, keySerializerClass);
    producerProperties.put(KafkaHeaders.TOPIC, topic);
    producerProperties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);

    return producerProperties;
  }

  public static <K extends Serializer<?>, V extends Serializer<?>> Properties producerConfigProperties(
      String bootstrapServers,
      Class<K> keySerializerClass,
      Class<V> valueSerializerClass) {

    Properties producerProperties = new Properties();

    producerProperties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, valueSerializerClass);
    producerProperties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, keySerializerClass);
    producerProperties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);

    return producerProperties;
  }

  public static <K, V, KS extends Serializer<?>, VS extends Serializer<?>> KafkaTemplate<K, V> kafkaTemplateProducer(
      String topic,
      String bootstrapServers,
      Class<KS> keySerializerClass,
      Class<VS> valueSerializerClass) {
    Map<String, Object> producerProperties = producerConfigMap(bootstrapServers, topic,
        keySerializerClass, valueSerializerClass);

    ProducerFactory<K, V> producerFactory = new DefaultKafkaProducerFactory<>(
        producerProperties);
    return new KafkaTemplate<>(producerFactory);
  }
}
