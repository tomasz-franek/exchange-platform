package org.exchange.app.backend.common.kafka;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.deserializers.UserTicketDeserializer;
import org.exchange.app.backend.common.deserializers.UserTicketDeserializerTest;
import org.exchange.app.backend.common.serializers.UserTicketSerializer;
import org.exchange.app.common.api.model.UserTicket;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.kafka.test.context.EmbeddedKafka;

@Log4j2
@EmbeddedKafka(partitions = 1)
public class UserTicketFlowTest {

  public static final String TEST_TOPIC = "test-user-ticket";
  public static final String TEST_GROUP = "group-user-ticket";
  public static final String BROKER = "localhost:9092";

  @Test
  @Disabled
  public void testFlow_should_serializeAndDeserializeUserTicketCorrectly_when_sendTicketWithFilledAllFields() {
    UserTicket userTicket = UserTicketDeserializerTest.generateRandomTicket();
    produceMessage(userTicket);

    UserTicket consumedMessage = getConsumedMessage();
    UserTicketDeserializerTest.validateConsumedMessage(userTicket, consumedMessage);
  }

  @Test
  @Disabled
  public void testFlow_should_serializeAndDeserializeUserTicketCorrectly_when_sendTicketWithEmptyFields() {
    UserTicket userTicket = new UserTicket();

    produceMessage(userTicket);

    UserTicket consumedMessage = getConsumedMessage();

    UserTicketDeserializerTest.validateConsumedMessage(userTicket, consumedMessage);
  }

  private static UserTicket getConsumedMessage() {
    UserTicket consumedMessage = null;
    KafkaConsumer<String, UserTicket> consumer = getKafkaConsumer();
    consumer.subscribe(Collections.singletonList(TEST_TOPIC));

    ConsumerRecords<String, UserTicket> records = consumer.poll(Duration.ofMillis(50000));
    log.error("Records {}", records);
    for (ConsumerRecord<String, UserTicket> record : records) {
      consumedMessage = record.value();
    }
    consumer.close();
    return consumedMessage;
  }


  private static void produceMessage(UserTicket userTicket) {
    Properties producerProps = new Properties();
    producerProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, BROKER);
    producerProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
        StringSerializer.class.getName());
    producerProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
        UserTicketSerializer.class.getName());

    KafkaProducer<String, UserTicket> producer = new KafkaProducer<>(producerProps);

    producer.send(new ProducerRecord<>(UserTicketFlowTest.TEST_TOPIC, userTicket));
    producer.close();
  }

  private static KafkaConsumer<String, UserTicket> getKafkaConsumer() {
    Properties consumerProps = new Properties();
    consumerProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BROKER);
    consumerProps.put(ConsumerConfig.GROUP_ID_CONFIG, TEST_GROUP);
    consumerProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
        StringDeserializer.class.getName());
    consumerProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
        UserTicketDeserializer.class.getName());

    return new KafkaConsumer<>(consumerProps);
  }
}
