package org.exchange.app.backend.listeners;

import exchange.app.common.api.model.Direction;
import exchange.app.common.api.model.Pair;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.configs.KafkaConfig;
import org.exchange.app.backend.configs.KafkaOrderTicket;
import org.exchange.app.backend.entities.ExchangeEventEntity;
import org.exchange.app.backend.repositories.ExchangeEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "input-record-idw",
    topics = KafkaConfig.INPUT_RECORD_TOPIC_NAME,
    autoStartup = "${listen.auto.start:true}",
    concurrency = KafkaConfig.NUMBER_OF_PAIRS,
    containerFactory = "")
public class InputRecordListener {

  private final ExchangeEventRepository exchangeEventRepository;

  InputRecordListener(@Autowired ExchangeEventRepository exchangeEventRepository) {
    this.exchangeEventRepository = exchangeEventRepository;
  }

  @KafkaHandler
  public void listen(
      @Payload List<KafkaOrderTicket> ticketList,
      @Header(KafkaHeaders.RECEIVED_KEY) Pair pair) {
    List<ExchangeEventEntity> events = new ArrayList<>(ticketList.size());
    for (KafkaOrderTicket ticket : ticketList) {
      assert pair.equals(ticket.getPair());
      ExchangeEventEntity entity = new ExchangeEventEntity();
      entity.setUserAccountId(ticket.getIdUserAccount());
      entity.setPair(ticket.getPair());
      entity.setDirection(ticket.getDirection().equals(Direction.BUY) ? "B" : "S");
      entity.setDateUtc(Timestamp.valueOf(
          LocalDateTime.now().atZone(ZoneOffset.UTC).toLocalDateTime()));
      entity.setEventType("A");
      entity.setValue(ticket.getValue());
      entity.setRatio(ticket.getRatio());
      events.add(entity);
    }
    exchangeEventRepository.saveAll(events);
    log.info("*** Pair {} saved messages '{}'", pair, ticketList.size());

  }
}
