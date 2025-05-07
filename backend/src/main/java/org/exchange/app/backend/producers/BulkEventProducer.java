package org.exchange.app.backend.producers;

import exchange.app.api.model.Direction;
import exchange.app.api.model.OrderTicket;
import exchange.app.api.model.Pair;
import java.math.BigDecimal;
import lombok.extern.log4j.Log4j2;
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
    if (false) {
      long counter = 1_000_000;
      long id = System.currentTimeMillis();
      while (counter > 0) {
        OrderTicket orderTicket = new OrderTicket();
        orderTicket.setId(id);
        orderTicket.setDirection(Direction.BUY);
        orderTicket.setPair(Pair.EUR_GBP);
        orderTicket.setIdUser(1L);
        orderTicket.setValueAmount(BigDecimal.TEN);
        orderTicket.setRatio(BigDecimal.TEN);
        producer.sendMessage(orderTicket, Pair.EUR_GBP);
        counter--;
        id++;
      }
      SpringApplication.exit(appContext, () -> 0);
    }
  }
}
