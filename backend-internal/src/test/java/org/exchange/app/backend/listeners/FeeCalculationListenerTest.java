package org.exchange.app.backend.listeners;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventId;
import static org.exchange.app.backend.listeners.ExchangeResultTicketListenerTest.REAL_USER_1;
import static org.exchange.app.backend.listeners.ExchangeResultTicketListenerTest.REAL_USER_1_ACCOUNT_EUR;
import static org.exchange.app.backend.listeners.ExchangeResultTicketListenerTest.REAL_USER_1_ACCOUNT_PLN;
import static org.exchange.app.backend.listeners.ExchangeResultTicketListenerTest.SYSTEM_ACCOUNT_EUR;

import java.util.List;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.kafka.test.context.EmbeddedKafka;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedKafka(partitions = 1)
class FeeCalculationListenerTest {

  @Autowired
  private FeeCalculationListener feeCalculationListener;
  @Autowired
  private ExchangeEventSourceRepository exchangeEventSourceRepository;
  @Autowired
  private ExchangeEventRepository exchangeEventRepository;

  @Test
  void listen_should_saveFeeToSystemAccount_when_feeIsCalculated() {
    ExchangeEventEntity eventEntity = new ExchangeEventEntity();
    eventEntity.setUserAccountId(REAL_USER_1_ACCOUNT_PLN);
    eventEntity.setUserId(REAL_USER_1);
    eventEntity.setRatio(4_0000L);
    eventEntity.setAmount(10_0000L);
    eventEntity.setDirection("B");
    eventEntity.setPair(Pair.EUR_PLN);
    eventEntity.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    eventEntity.setTicketStatus(UserTicketStatus.NEW);
    eventEntity.setEventType(EventType.ORDER);
    eventEntity.setAmountRealized(0L);
    eventEntity = exchangeEventRepository.save(eventEntity);
    ExchangeEventSourceEntity entity = new ExchangeEventSourceEntity();
    entity.setAmount(100_0000L);
    entity.setCurrency("EUR");
    entity.setEventType(EventType.EXCHANGE);
    entity.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    entity.setUserAccountId(REAL_USER_1_ACCOUNT_EUR);
    entity.setEventId(eventEntity.getId());
    entity.setCreatedBy(REAL_USER_1);
    entity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    entity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    entity.setChecksum(ChecksumUtil.checksum(entity));
    exchangeEventSourceRepository.save(entity);
    feeCalculationListener.listen(eventEntity.getId().toString());

    List<ExchangeEventSourceEntity> list = exchangeEventSourceRepository.findAll(
        eventId(eventEntity.getId()), Sort.by(Order.asc("id")));

    List<ExchangeEventSourceEntity> fees = list.stream()
        .filter(e -> e.getEventType().equals(EventType.FEE)).toList();
    assertThat(fees).isNotNull();

    assertThat(fees.size()).isEqualTo(2);
    assertThat(fees.get(0).getAmount()).isEqualTo(-1000L);
    assertThat(fees.get(0).getUserAccountId()).isEqualTo(REAL_USER_1_ACCOUNT_EUR);
    assertThat(fees.get(1).getAmount()).isEqualTo(1000L);
    assertThat(fees.get(1).getUserAccountId()).isEqualTo(SYSTEM_ACCOUNT_EUR);
    exchangeEventSourceRepository.deleteAll(list);
    exchangeEventRepository.delete(eventEntity);
  }
}