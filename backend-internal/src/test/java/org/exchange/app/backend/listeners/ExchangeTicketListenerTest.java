package org.exchange.app.backend.listeners;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedKafka(partitions = 1, brokerProperties = {"listeners=PLAINTEXT://localhost:9092",
    "port=9092"})
class ExchangeTicketListenerTest {

  @Autowired
  private ExchangeEventRepository exchangeEventRepository;

  @Autowired
  private ExchangeTicketListener exchangeTicketListener;

  @Test
  void loadOrderBook_should_reduceTicketAmountByPartiallyRealizedAmount_when_ticketsAreReadFromDatabase() {
    ExchangeEventEntity exchangeEventEntity = new ExchangeEventEntity();
    exchangeEventEntity.setAmount(100_0000L);
    exchangeEventEntity.setAmountRealized(12_5000L);
    exchangeEventEntity.setPair(Pair.EUR_PLN);
    exchangeEventEntity.setDirection("S");
    exchangeEventEntity.setEventType(EventType.EXCHANGE);
    exchangeEventEntity.setTicketStatus(UserTicketStatus.PARTIAL_REALIZED);
    exchangeEventEntity.setDateUtc(ExchangeDateUtils.currentTimestamp());
    exchangeEventEntity.setRatio(1_0100L);
    exchangeEventEntity.setUserAccountId(UUID.fromString("72aa8932-8798-4d1b-aaf0-590a3e6ffa22"));

    exchangeEventEntity = exchangeEventRepository.save(exchangeEventEntity);

    exchangeTicketListener.loadOrderBook();

    Optional<CoreTicket> coreTicketOptional = exchangeTicketListener.exchangeServiceConcurrentHashMap.get(
        Pair.EUR_PLN).removeOrder(exchangeEventEntity.getId(), Direction.SELL);
    assertThat(coreTicketOptional).isNotEmpty();
    assertThat(coreTicketOptional.get().getAmount()).isEqualTo(
        exchangeEventEntity.getAmount() - exchangeEventEntity.getAmountRealized());
    exchangeEventRepository.delete(exchangeEventEntity);
  }

  @Test
  void loadOrderBook_should_readTotalAmount_when_ticketNotPartiallyRealized() {
    ExchangeEventEntity exchangeEventEntity = new ExchangeEventEntity();
    exchangeEventEntity.setAmount(30_0000L);
    exchangeEventEntity.setAmountRealized(0L);
    exchangeEventEntity.setPair(Pair.EUR_PLN);
    exchangeEventEntity.setDirection("S");
    exchangeEventEntity.setEventType(EventType.EXCHANGE);
    exchangeEventEntity.setTicketStatus(UserTicketStatus.PARTIAL_REALIZED);
    exchangeEventEntity.setDateUtc(ExchangeDateUtils.currentTimestamp());
    exchangeEventEntity.setRatio(1_0100L);
    exchangeEventEntity.setUserAccountId(UUID.fromString("72aa8932-8798-4d1b-aaf0-590a3e6ffa22"));

    exchangeEventEntity = exchangeEventRepository.save(exchangeEventEntity);

    exchangeTicketListener.loadOrderBook();

    Optional<CoreTicket> coreTicketOptional = exchangeTicketListener.exchangeServiceConcurrentHashMap.get(
        Pair.EUR_PLN).getFirstBookTicket(Direction.SELL);
    assertThat(coreTicketOptional).isNotEmpty();
    assertThat(coreTicketOptional.get().getAmount()).isEqualTo(
        exchangeEventEntity.getAmount());
    exchangeEventRepository.delete(exchangeEventEntity);
  }
}