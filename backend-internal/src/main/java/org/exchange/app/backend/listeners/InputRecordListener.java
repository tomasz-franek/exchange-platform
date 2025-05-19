package org.exchange.app.backend.listeners;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "input-record-idw",
    topics = "#{__listener.topic}", groupId = "#{__listener.groupId}",
    autoStartup = "${listen.auto.start:true}",
    concurrency = "1")
public class InputRecordListener {

  @Value("${spring.kafka.consumer.topic}")
  public String topic;

  @Value("${spring.kafka.consumer.group}")
  public String groupId;

  private final ExchangeEventRepository exchangeEventRepository;

  InputRecordListener(@Autowired ExchangeEventRepository exchangeEventRepository) {
    this.exchangeEventRepository = exchangeEventRepository;
  }

  @KafkaHandler
  public void listen(String ticketString) {
    ObjectMapper objectMapper = new ObjectMapper();
    log.info(ticketString);
    UserTicket ticket = objectMapper.convertValue(ticketString, UserTicket.class);
    ExchangeEventEntity entity = new ExchangeEventEntity();
    entity.setUserAccountId(ticket.getIdUserAccount());
    entity.setPair(ticket.getPair());
    entity.setDirection(ticket.getDirection().equals(Direction.BUY) ? "B" : "S");
    entity.setDateUtc(Timestamp.valueOf(
        LocalDateTime.now().atZone(ZoneOffset.UTC).toLocalDateTime()));
    entity.setEventType("A");
    entity.setValue(ticket.getValue());
    entity.setRatio(ticket.getRatio());
    exchangeEventRepository.save(entity);
    log.info("*** Pair {} saved messages '{}'", entity.getPair(), ticketString);

  }
}
