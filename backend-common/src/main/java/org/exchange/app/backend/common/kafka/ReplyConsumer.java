package org.exchange.app.backend.common.kafka;

import java.time.Duration;
import java.util.Collections;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.header.Header;

public class ReplyConsumer<K, V> {

  private final KafkaConsumer<K, V> consumer;
  private final Map<String, ResponseFuture<V>> pendingRequests = new ConcurrentHashMap<>();
  private volatile boolean running = true;

  public ReplyConsumer(Properties props, String replyTopic) {
    this.consumer = new KafkaConsumer<>(props);
    consumer.subscribe(Collections.singletonList(replyTopic));
    new Thread(this::pollLoop).start();
  }

  public ResponseFuture<V> registerCallback(String correlationId) {
    ResponseFuture<V> future = new ResponseFuture<>();
    pendingRequests.put(correlationId, future);
    return future;
  }

  private void pollLoop() {
    while (running) {
      ConsumerRecords<K, V> records = consumer.poll(Duration.ofMillis(100));
      for (ConsumerRecord<K, V> record : records) {
        Header correlationHeader = record.headers().lastHeader("CORRELATION_ID");
        if (correlationHeader != null) {
          String correlationId = new String(correlationHeader.value());
          ResponseFuture<V> future = pendingRequests.remove(correlationId);
          if (future != null) {
            future.complete(record.value());
          }
        }
      }
    }
    consumer.close();
  }

  public void close() {
    running = false;
  }
}
