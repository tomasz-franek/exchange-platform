package org.exchange.app.backend.producers;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import java.time.Duration;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.configs.KafkaOrderTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class BulkEventProducer implements Runnable {

  private final ApplicationContext appContext;
  private final InputRecordProducer producer;

  public BulkEventProducer(@Autowired InputRecordProducer producer,
      ApplicationContext applicationContext) {
    this.producer = producer;
    this.appContext = applicationContext;
  }

  @Override
  public void run() {
    try {
      longBackground();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
  }

  protected void longBackground() throws InterruptedException {
    if (true) {
      long counter = 1_000_000;
      long id = System.currentTimeMillis();
      while (counter > 0) {
        KafkaOrderTicket kafkaOrderTicket = new KafkaOrderTicket();
        kafkaOrderTicket.setId(id);
        kafkaOrderTicket.setDirection(Direction.BUY);
        kafkaOrderTicket.setRatio(1L);
        kafkaOrderTicket.setValue(1L);
        kafkaOrderTicket.setEpochUTC(id);
        kafkaOrderTicket.setIdUser(id);
        producer.sendMessage(kafkaOrderTicket, Pair.EUR_GBP);
        counter--;
        id++;
      }
      Thread.sleep(Duration.ofSeconds(10));
      SpringApplication.exit(appContext, () -> 0);
    }
  }
}
