package org.exchange.app.backend.external.producers;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class UserAccountSyncProducer {
//
//  private KafkaProducer<String, String> kafkaProducer = null;
//
//  public UserAccountSyncProducer() {
//  }
//
//  @PostConstruct
//  private void createKafkaProducer() {
//    Properties props = new Properties();
//    props.put("bootstrap.servers", "localhost:9092");
//    props.put("key.serializer", StringSerializer.class.getName());
//    props.put("value.serializer", StringSerializer.class.getName());
//
//    this.kafkaProducer = new KafkaProducer<>(props);
//  }
//
//  public void sendSynchronicKafkaRequest(String request) {
//    try {
//      // Create a record
//      ProducerRecord<String, String> record = new ProducerRecord<>("your-topic", "key", "value");
//
//      // Send the record synchronously
//      RecordMetadata metadata = kafkaProducer.send(record)
//          .get(2000, TimeUnit.MILLISECONDS);
//
//    } catch (ExecutionException | InterruptedException | TimeoutException e) {
//      throw new RuntimeException(e);
//    }
//  }
//
//  @PreDestroy
//  private void destroyKafkaProducer() {
//    if (this.kafkaProducer != null) {
//      kafkaProducer.close(Duration.ofMillis(100));
//    }
//  }

}
