package org.exchange.app.backend.listeners;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventId;
import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventType;

import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.exchange.internal.app.core.data.ExchangeResult;
import org.exchange.internal.app.core.services.ExchangeService;
import org.exchange.internal.app.core.strategies.ratio.FirstTicketRatioStrategy;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.kafka.test.context.EmbeddedKafka;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedKafka(partitions = 1, brokerProperties = {"listeners=PLAINTEXT://localhost:8882",
    "port=8882"})
class ExchangeResultTicketListenerTest {

  public static final String REAL_USER_1 = "00000000-0000-0000-0002-000000000001";
  public static final String REAL_USER_ACCOUNT_1 = "72aa8932-8798-4d1b-aaf0-590a3e6ffa11";
  public static final String REAL_USER_ACCOUNT_2 = "72aa8932-8798-4d1b-aaf0-590a3e6ffa22";
  public static final Pair PAIR = Pair.EUR_PLN;
  public static final Sort SORT = Sort.by("id");

  @Autowired
  private ExchangeResultTicketListener exchangeResultTicketListener;

  private final ExchangeService exchangeService = new ExchangeService(PAIR,
      new FirstTicketRatioStrategy());

  @Autowired
  private ExchangeEventRepository exchangeEventRepository;

  @Autowired
  private ExchangeEventSourceRepository exchangeEventSourceRepository;

  @Test
  void saveExchangeResult_should_createCorrectExchangeData_when_dataStoredInDatabase() {
    ExchangeEventEntity eur10 = new ExchangeEventEntity();
    eur10.setUserAccountId(UUID.fromString(REAL_USER_ACCOUNT_1));
    eur10.setUserId(UUID.fromString(REAL_USER_1));
    eur10.setRatio(4_0000L);
    eur10.setAmount(10_0000L);
    eur10.setDirection("S");
    eur10.setPair(PAIR);
    eur10.setDateUtc(ExchangeDateUtils.currentTimestamp());
    eur10.setTicketStatus(UserTicketStatus.NEW);
    eur10.setEventType(EventType.ORDER);
    eur10.setAmountRealized(0L);
    eur10 = exchangeEventRepository.save(eur10);

    ExchangeEventSourceEntity sourceEntityEur10 = new ExchangeEventSourceEntity();
    sourceEntityEur10.setUserAccountId(eur10.getUserAccountId());
    sourceEntityEur10.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourceEntityEur10.setEventType(eur10.getEventType());
    sourceEntityEur10.setAmount(-eur10.getAmount());
    sourceEntityEur10.setEventId(eur10.getId());
    sourceEntityEur10.setChecksum(ChecksumUtil.checksum(sourceEntityEur10));
    sourceEntityEur10.setCurrency(
        CurrencyUtils.pairToCurrency(eur10.getPair(), Direction.SELL));
    sourceEntityEur10 = exchangeEventSourceRepository.save(sourceEntityEur10);

    ExchangeEventEntity pln23 = new ExchangeEventEntity();
    pln23.setUserAccountId(UUID.fromString(REAL_USER_ACCOUNT_2));
    pln23.setUserId(UUID.fromString(REAL_USER_1));
    pln23.setRatio(4_0000L);
    pln23.setAmount(23_0000L);
    pln23.setDirection("B");
    pln23.setPair(PAIR);
    pln23.setDateUtc(ExchangeDateUtils.currentTimestamp());
    pln23.setTicketStatus(UserTicketStatus.NEW);
    pln23.setEventType(EventType.ORDER);
    pln23.setAmountRealized(0L);
    pln23 = exchangeEventRepository.save(pln23);

    ExchangeEventSourceEntity sourceEntityPln23 = new ExchangeEventSourceEntity();
    sourceEntityPln23.setUserAccountId(pln23.getUserAccountId());
    sourceEntityPln23.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourceEntityPln23.setEventType(pln23.getEventType());
    sourceEntityPln23.setAmount(-pln23.getAmount());
    sourceEntityPln23.setChecksum(ChecksumUtil.checksum(sourceEntityPln23));
    sourceEntityPln23.setEventId(pln23.getId());
    sourceEntityPln23.setCurrency(
        CurrencyUtils.pairToCurrency(pln23.getPair(), Direction.BUY));
    sourceEntityPln23 = exchangeEventSourceRepository.save(sourceEntityPln23);

    ExchangeEventEntity pln17 = new ExchangeEventEntity();
    pln17.setUserAccountId(UUID.fromString(REAL_USER_ACCOUNT_2));
    pln17.setUserId(UUID.fromString(REAL_USER_1));
    pln17.setRatio(4_0000L);
    pln17.setAmount(17_0000L);
    pln17.setDirection("B");
    pln17.setPair(PAIR);
    pln17.setDateUtc(ExchangeDateUtils.currentTimestamp());
    pln17.setTicketStatus(UserTicketStatus.NEW);
    pln17.setEventType(EventType.ORDER);
    pln17.setAmountRealized(0L);
    pln17 = exchangeEventRepository.save(pln17);

    ExchangeEventSourceEntity sourceEntityPln17 = new ExchangeEventSourceEntity();
    sourceEntityPln17.setUserAccountId(pln17.getUserAccountId());
    sourceEntityPln17.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourceEntityPln17.setEventType(pln17.getEventType());
    sourceEntityPln17.setAmount(-pln17.getAmount());
    sourceEntityPln17.setEventId(pln17.getId());
    sourceEntityPln17.setChecksum(ChecksumUtil.checksum(sourceEntityPln17));
    sourceEntityPln17.setCurrency(
        CurrencyUtils.pairToCurrency(pln17.getPair(), Direction.BUY));
    sourceEntityPln17 = exchangeEventSourceRepository.save(sourceEntityPln17);

    CoreTicket coreTicketEur10 = CoreTicketBuilder.createBuilder()
        .withId(eur10.getId())
        .withAmount(eur10.getAmount())
        .withDirection(eur10.getDirection())
        .withPair(eur10.getPair())
        .withRatio(eur10.getRatio())
        .withEpochUTC(eur10.getDateUtc().getTime())
        .withUserId(eur10.getUserId())
        .build();

    CoreTicket coreTicketPln17 = CoreTicketBuilder.createBuilder()
        .withId(pln17.getId())
        .withAmount(pln17.getAmount())
        .withDirection(pln17.getDirection())
        .withPair(pln17.getPair())
        .withRatio(pln17.getRatio())
        .withEpochUTC(pln17.getDateUtc().getTime())
        .withUserId(pln17.getUserId())
        .build();

    CoreTicket coreTicketPln23 = CoreTicketBuilder.createBuilder()
        .withId(pln23.getId())
        .withAmount(pln23.getAmount())
        .withDirection(pln23.getDirection())
        .withPair(pln23.getPair())
        .withRatio(pln23.getRatio())
        .withEpochUTC(pln23.getDateUtc().getTime())
        .withUserId(pln23.getUserId())
        .build();

    exchangeService.addCoreTicket(coreTicketEur10);
    exchangeService.addCoreTicket(coreTicketPln17);
    exchangeService.addCoreTicket(coreTicketPln23);
    ExchangeResult result = exchangeService.doExchange()
        .orElseThrow(() -> new RuntimeException("exchange not finished"));

    exchangeResultTicketListener.saveExchangeResult(result);

    result = exchangeService.doExchange()
        .orElseThrow(() -> new RuntimeException("exchange not finished"));

    exchangeResultTicketListener.saveExchangeResult(result);

    assertThat(exchangeService.getFirstBookTicket(Direction.BUY)).isEmpty();
    assertThat(exchangeService.getFirstBookTicket(Direction.SELL)).isEmpty();

    List<ExchangeEventSourceEntity> entities = exchangeEventSourceRepository.findAll(
        Specification.allOf(
            eventId(eur10.getId()),
            eventType(EventType.EXCHANGE)),
        SORT
    );
    assertThat(entities.size()).isEqualTo(2);
    assertThat(entities.getFirst().getAmount()).isEqualTo(17_0000L);
    assertThat(entities.getFirst().getCurrency()).isEqualTo("PLN");
    assertThat(entities.getFirst().getReverseEventId()).isEqualTo(pln17.getId());
    assertThat(entities.getFirst().getEventId()).isEqualTo(eur10.getId());
    assertThat(entities.getLast().getAmount()).isEqualTo(23_0000L);
    assertThat(entities.getLast().getCurrency()).isEqualTo("PLN");
    assertThat(entities.getLast().getReverseEventId()).isEqualTo(pln23.getId());
    assertThat(entities.getLast().getEventId()).isEqualTo(eur10.getId());
    exchangeEventSourceRepository.deleteAll(entities);

    entities = exchangeEventSourceRepository.findAll(
        Specification.allOf(
            eventId(pln17.getId()),
            eventType(EventType.EXCHANGE)),
        SORT
    );
    assertThat(entities.size()).isEqualTo(1);
    assertThat(entities.getFirst().getAmount()).isEqualTo(4_2500L);
    assertThat(entities.getFirst().getCurrency()).isEqualTo("EUR");
    assertThat(entities.getFirst().getReverseEventId()).isEqualTo(eur10.getId());
    assertThat(entities.getFirst().getEventId()).isEqualTo(pln17.getId());
    exchangeEventSourceRepository.deleteAll(entities);

    entities = exchangeEventSourceRepository.findAll(
        Specification.allOf(
            eventId(pln23.getId()),
            eventType(EventType.EXCHANGE)),
        SORT
    );
    assertThat(entities.size()).isEqualTo(1);
    assertThat(entities.getFirst().getAmount()).isEqualTo(5_7500L);
    assertThat(entities.getFirst().getCurrency()).isEqualTo("EUR");
    assertThat(entities.getFirst().getReverseEventId()).isEqualTo(eur10.getId());
    assertThat(entities.getFirst().getEventId()).isEqualTo(pln23.getId());
    exchangeEventSourceRepository.deleteAll(entities);

    exchangeEventSourceRepository.delete(sourceEntityEur10);
    exchangeEventSourceRepository.delete(sourceEntityPln23);
    exchangeEventSourceRepository.delete(sourceEntityPln17);
    exchangeEventRepository.delete(eur10);
    exchangeEventRepository.delete(eur10);
    exchangeEventRepository.delete(pln23);
    exchangeEventRepository.delete(pln17);
  }
}