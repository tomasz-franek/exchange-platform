package org.exchange.app.backend.common.kafka;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Properties;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.Headers;
import org.apache.kafka.common.header.internals.RecordHeaders;

public class KafkaSynchronizedClient<K, V> implements AutoCloseable {

  private final Producer<K, V> producer;
  private final ReplyConsumer<K, V> replyConsumer;
  private final String requestTopic;
  private final String replyTopic;

  public KafkaSynchronizedClient(Properties producerProps, Properties consumerProps,
      String requestTopic, String replyTopic) {
    this.producer = new KafkaProducer<>(producerProps);
    this.replyConsumer = new ReplyConsumer<>(consumerProps, replyTopic);
    this.requestTopic = requestTopic;
    this.replyTopic = replyTopic;
  }

  public V sendAndWait(K key, V request, Duration timeout) throws Exception {
    String correlationId = UUID.randomUUID().toString();
    Headers headers = new RecordHeaders()
        .add("CORRELATION_ID", correlationId.getBytes(StandardCharsets.UTF_8))
        .add("REPLY_TOPIC", replyTopic.getBytes(StandardCharsets.UTF_8));

    ProducerRecord<K, V> record = new ProducerRecord<>(requestTopic, 0, key, request, headers);
    ResponseFuture<V> future = replyConsumer.registerCallback(correlationId);
    producer.send(record);
    return future.get(timeout.toMillis(), TimeUnit.MILLISECONDS);
  }

  public void close() {
    producer.close();
    replyConsumer.close();
  }
}
