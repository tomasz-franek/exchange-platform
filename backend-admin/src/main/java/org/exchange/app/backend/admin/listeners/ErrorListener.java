package org.exchange.app.backend.admin.listeners;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.admin.api.model.ErrorMessage;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.InternalGroups;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class ErrorListener {

  private final KafkaConsumer<String, String> kafkaConsumer;
  private final KafkaTemplate<String, String> kafkaProducer;

  private final TopicPartition topicPartition;

  @Autowired
  ErrorListener(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    Map<String, Object> props = new HashMap<>();
    props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
    props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
    props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 20);
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
    props.put(ConsumerConfig.GROUP_ID_CONFIG, InternalGroups.ERROR);
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, Deserializers.STRING);
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, Deserializers.STRING);
    kafkaConsumer = new KafkaConsumer<>(props);
    topicPartition = new TopicPartition(TopicToInternalBackend.ERROR, 0);
    kafkaProducer = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.ERROR, bootstrapServers, StringSerializer.class,
        StringSerializer.class);
    this.kafkaConsumer.assign(List.of(topicPartition));
  }

  public List<ErrorMessage> loadErrorList(int offset) {
    this.kafkaConsumer.seek(topicPartition, offset);
    ConsumerRecords<String, String> consumerRecords = kafkaConsumer.poll(Duration.ofMillis(300));
    List<ErrorMessage> response = new ArrayList<>();
    for (ConsumerRecord<String, String> record : consumerRecords.records(
        TopicToInternalBackend.ERROR)) {
      response.add(
          new ErrorMessage(record.key(), record.value(), record.timestamp(), record.offset()));
    }
    return response;
  }

  public void deleteErrorById(long offset) {
//    this.kafkaConsumer.seek(topicPartition, offset);
//    OffsetAndMetadata offsetAndMetadata = new OffsetAndMetadata(offset + 1);
//    Map<TopicPartition, OffsetAndMetadata> offsets = new HashMap<>();
//    offsets.put(topicPartition, offsetAndMetadata);
//    kafkaConsumer.commitSync(offsets);

    ProducerRecord<String, String> record = new ProducerRecord<>(TopicToInternalBackend.ERROR,
        String.valueOf(offset), null);
    kafkaProducer.send(record);
  }
}
