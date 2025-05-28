package org.exchange.app.backend.common.config;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.stream.IntStream;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.common.api.model.Pair;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.KafkaHeaders;

public class KafkaConfig {

  public static final String AUTO_STARTUP_TRUE = "${listen.auto.start:true}";

  public static class ExternalTopics {

    //topics
    public static final String TICKET = "external-ticket-topic";
    public static final String ACCOUNT = "external-account-topic";
    public static final String ACCOUNT_LIST = "external-account-list-topic";
    public static final String ORDER_BOOK = "external-order-book-topic";
  }

  public static class InternalTopics {

    public static final String ACCOUNT_LIST = "internal-account-list-topic";
    public static final String ACCOUNT = "internal-account-topic";
    public static final String EXCHANGE = "internal-exchanges-topic";
  }

  public static class ExternalGroups {

    public static final String TICKET = "internal-ticket-group";
    public static final String ACCOUNT = "external-account-group";
    public static final String ORDER_BOOK = "external-order-book-group";
  }

  public static class InternalGroups {

    public static final String EXCHANGE = "internal-exchanges-group";
    public static final String ACCOUNT = "internal-account-group";
  }

  public static class Deserializers {

    public static final String PAIR = "org.exchange.app.backend.common.deserializers.PairDeserializer";
    public static final String USER_TICKET = "org.exchange.app.backend.common.deserializers.UserTicketDeserializer";
    public static final String USER_ACCOUNT_OPERATION = "org.exchange.app.backend.common.deserializers.UserAccountOperationDeserializer";
  }

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

  public static <K extends Deserializer<?>, V extends Deserializer<?>> Properties consumerConfigProperties(
      String bootstrapServers,
      String groupIdConfig,
      Class<K> keyDeserializerClass,
      Class<V> valueSerializerClass) {

    Properties consumerProperties = new Properties();
    consumerProperties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
    consumerProperties.put(ConsumerConfig.GROUP_ID_CONFIG, groupIdConfig);
    consumerProperties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, keyDeserializerClass);
    consumerProperties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, valueSerializerClass);

    return consumerProperties;
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
