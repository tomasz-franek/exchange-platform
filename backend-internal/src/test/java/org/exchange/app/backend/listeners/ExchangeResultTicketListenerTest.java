package org.exchange.app.backend.listeners;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventId;
import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventType;
import static org.mockito.ArgumentMatchers.any;

import java.time.ZoneOffset;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.builders.ExchangeResult;
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
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.exchange.internal.app.core.services.ExchangeService;
import org.exchange.internal.app.core.strategies.ratio.FirstTicketRatioStrategy;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedKafka(partitions = 1)
class ExchangeResultTicketListenerTest {

  public static final UUID REAL_USER_1 = UUID.fromString("00000000-0000-0000-0002-000000000001");
  public static final UUID REAL_USER_ACCOUNT_EUR = UUID.fromString(
      "72aa8932-8798-4d1b-aaf0-590a3e6ffa22");
  public static final UUID REAL_USER_ACCOUNT_PLN = UUID.fromString(
      "72aa8932-8798-4d1b-aaf0-590a3e6ffa11");
  public static final UUID EXCHANGE_ACCOUNT_EUR = UUID.fromString(
      "921467e9-6fde-46e7-a329-000000000002");
  public static final UUID EXCHANGE_ACCOUNT_PLN = UUID.fromString(
      "921467e9-6fde-46e7-a329-000000000001");
  public static final UUID SYSTEM_ACCOUNT_EUR = UUID.fromString(
      "8d8a228a-19a4-4f71-9f69-000000000002"
  );
  public static final Pair PAIR = Pair.EUR_PLN;
  public static final Sort SORT = Sort.by("id");

  @Autowired
  private ExchangeResultTicketListener exchangeResultTicketListener;

  @MockitoSpyBean
  private ExchangeTicketListener exchangeTicketListener;

  private final ExchangeService exchangeService = new ExchangeService(PAIR,
      new FirstTicketRatioStrategy());

  @Autowired
  private ExchangeEventRepository exchangeEventRepository;

  @Autowired
  private ExchangeEventSourceRepository exchangeEventSourceRepository;

  @Test
  void saveExchangeResult_should_createCorrectExchangeDataWithoutLeftOvers_when_dataStoredInDatabase() {
    ExchangeEventEntity eur10 = new ExchangeEventEntity();
    eur10.setUserAccountId(REAL_USER_ACCOUNT_PLN);
    eur10.setUserId(REAL_USER_1);
    eur10.setRatio(4_0000L);
    eur10.setAmount(10_0000L);
    eur10.setDirection("S");
    eur10.setPair(PAIR);
    eur10.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
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
    sourceEntityEur10.setCurrency(
        CurrencyUtils.pairToCurrency(eur10.getPair(), Direction.SELL));
    sourceEntityEur10.setCreatedBy(REAL_USER_1);
    sourceEntityEur10.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourceEntityEur10.setChecksum(ChecksumUtil.checksum(sourceEntityEur10));
    sourceEntityEur10 = exchangeEventSourceRepository.save(sourceEntityEur10);

    ExchangeEventEntity pln23 = new ExchangeEventEntity();
    pln23.setUserAccountId(REAL_USER_ACCOUNT_EUR);
    pln23.setUserId(REAL_USER_1);
    pln23.setRatio(4_0000L);
    pln23.setAmount(23_0000L);
    pln23.setDirection("B");
    pln23.setPair(PAIR);
    pln23.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    pln23.setTicketStatus(UserTicketStatus.NEW);
    pln23.setEventType(EventType.ORDER);
    pln23.setAmountRealized(0L);
    pln23 = exchangeEventRepository.save(pln23);

    ExchangeEventSourceEntity sourceEntityPln23 = new ExchangeEventSourceEntity();
    sourceEntityPln23.setUserAccountId(pln23.getUserAccountId());
    sourceEntityPln23.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourceEntityPln23.setEventType(pln23.getEventType());
    sourceEntityPln23.setAmount(-pln23.getAmount());
    sourceEntityPln23.setEventId(pln23.getId());
    sourceEntityPln23.setCurrency(
        CurrencyUtils.pairToCurrency(pln23.getPair(), Direction.BUY));
    sourceEntityPln23.setCreatedBy(REAL_USER_1);
    sourceEntityPln23.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourceEntityPln23.setChecksum(ChecksumUtil.checksum(sourceEntityPln23));
    sourceEntityPln23 = exchangeEventSourceRepository.save(sourceEntityPln23);

    ExchangeEventEntity pln17 = new ExchangeEventEntity();
    pln17.setUserAccountId(REAL_USER_ACCOUNT_EUR);
    pln17.setUserId(REAL_USER_1);
    pln17.setRatio(4_0000L);
    pln17.setAmount(17_0000L);
    pln17.setDirection("B");
    pln17.setPair(PAIR);
    pln17.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
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
    sourceEntityPln17.setCurrency(
        CurrencyUtils.pairToCurrency(pln17.getPair(), Direction.BUY));
    sourceEntityPln17.setCreatedBy(REAL_USER_1);
    sourceEntityPln17.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourceEntityPln17.setChecksum(ChecksumUtil.checksum(sourceEntityPln17));
    sourceEntityPln17 = exchangeEventSourceRepository.save(sourceEntityPln17);

    CoreTicket coreTicketEur10 = CoreTicketBuilder.createBuilder()
        .withId(eur10.getId())
        .withAmount(eur10.getAmount())
        .withDirection(eur10.getDirection())
        .withPair(eur10.getPair())
        .withRatio(eur10.getRatio())
        .withEpochUTC(eur10.getDateUtc().toEpochSecond(ZoneOffset.UTC))
        .withUserId(eur10.getUserId())
        .build();

    CoreTicket coreTicketPln17 = CoreTicketBuilder.createBuilder()
        .withId(pln17.getId())
        .withAmount(pln17.getAmount())
        .withDirection(pln17.getDirection())
        .withPair(pln17.getPair())
        .withRatio(pln17.getRatio())
        .withEpochUTC(pln17.getDateUtc().toEpochSecond(ZoneOffset.UTC))
        .withUserId(pln17.getUserId())
        .build();

    CoreTicket coreTicketPln23 = CoreTicketBuilder.createBuilder()
        .withId(pln23.getId())
        .withAmount(pln23.getAmount())
        .withDirection(pln23.getDirection())
        .withPair(pln23.getPair())
        .withRatio(pln23.getRatio())
        .withEpochUTC(pln23.getDateUtc().toEpochSecond(ZoneOffset.UTC))
        .withUserId(pln23.getUserId())
        .build();

    exchangeService.addCoreTicket(coreTicketEur10);
    exchangeService.addCoreTicket(coreTicketPln17);
    exchangeService.addCoreTicket(coreTicketPln23);
    ExchangeResult result = exchangeService.doExchange()
        .orElseThrow(() -> new RuntimeException("exchange not finished"));

    List<ExchangeEventSourceEntity> exchangeEventSourceEntityList = exchangeResultTicketListener.createExchangeEventSourceEntityList(
        result);
    if (!exchangeEventSourceEntityList.isEmpty()) {
      exchangeEventSourceRepository.saveAll(exchangeEventSourceEntityList);
    }
    result = exchangeService.doExchange()
        .orElseThrow(() -> new RuntimeException("exchange not finished"));

    exchangeEventSourceEntityList = exchangeResultTicketListener.createExchangeEventSourceEntityList(
        result);
    if (!exchangeEventSourceEntityList.isEmpty()) {
      exchangeEventSourceRepository.saveAll(exchangeEventSourceEntityList);
    }

    assertThat(exchangeService.getFirstBookTicket(Direction.BUY)).isEmpty();
    assertThat(exchangeService.getFirstBookTicket(Direction.SELL)).isEmpty();

    List<ExchangeEventSourceEntity> entities = exchangeEventSourceRepository.findAll(
        Specification.allOf(eventId(eur10.getId()), eventType(EventType.EXCHANGE)), SORT);
    assertThat(entities.size()).isEqualTo(4);
    assertThat(entities.getFirst().getAmount()).isEqualTo(17_0000L);
    assertThat(entities.getFirst().getCurrency()).isEqualTo("PLN");
    assertThat(entities.getFirst().getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.getFirst().getReverseEventId()).isEqualTo(pln17.getId());
    assertThat(entities.getFirst().getEventId()).isEqualTo(eur10.getId());
    assertThat(entities.get(1).getAmount()).isEqualTo(-17_0000L);
    assertThat(entities.get(1).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(1).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(1).getReverseEventId()).isNull();
    assertThat(entities.get(1).getEventId()).isEqualTo(eur10.getId());
    assertThat(entities.get(1).getUserAccountId()).isEqualTo(
        UUID.fromString("921467e9-6fde-46e7-a329-000000000001"));
    assertThat(entities.get(2).getAmount()).isEqualTo(23_0000L);
    assertThat(entities.get(2).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(2).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(2).getReverseEventId()).isEqualTo(pln23.getId());
    assertThat(entities.get(2).getEventId()).isEqualTo(eur10.getId());
    assertThat(entities.get(2).getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_PLN);
    assertThat(entities.get(3).getAmount()).isEqualTo(-23_0000L);
    assertThat(entities.get(3).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(3).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(3).getReverseEventId()).isNull();
    assertThat(entities.get(3).getEventId()).isEqualTo(eur10.getId());
    assertThat(entities.get(3).getUserAccountId()).isEqualTo(
        UUID.fromString("921467e9-6fde-46e7-a329-000000000001"));
    exchangeEventSourceRepository.deleteAll(entities);

    entities = exchangeEventSourceRepository.findAll(
        Specification.allOf(
            eventId(pln17.getId()),
            eventType(EventType.EXCHANGE)),
        SORT
    );
    assertThat(entities.size()).isEqualTo(2);
    assertThat(entities.getFirst().getAmount()).isEqualTo(4_2500L);
    assertThat(entities.getFirst().getCurrency()).isEqualTo("EUR");
    assertThat(entities.getFirst().getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.getFirst().getReverseEventId()).isEqualTo(eur10.getId());
    assertThat(entities.getFirst().getEventId()).isEqualTo(pln17.getId());
    assertThat(entities.getFirst().getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_EUR);
    assertThat(entities.getLast().getAmount()).isEqualTo(-4_2500L);
    assertThat(entities.getLast().getCurrency()).isEqualTo("EUR");
    assertThat(entities.getLast().getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.getLast().getReverseEventId()).isNull();
    assertThat(entities.getLast().getEventId()).isEqualTo(pln17.getId());
    assertThat(entities.getLast().getUserAccountId()).isEqualTo(EXCHANGE_ACCOUNT_EUR);
    exchangeEventSourceRepository.deleteAll(entities);

    entities = exchangeEventSourceRepository.findAll(
        Specification.allOf(
            eventId(pln23.getId()),
            eventType(EventType.EXCHANGE)),
        SORT
    );
    assertThat(entities.size()).isEqualTo(2);
    assertThat(entities.getFirst().getAmount()).isEqualTo(5_7500L);
    assertThat(entities.getFirst().getCurrency()).isEqualTo("EUR");
    assertThat(entities.getFirst().getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.getFirst().getReverseEventId()).isEqualTo(eur10.getId());
    assertThat(entities.getFirst().getEventId()).isEqualTo(pln23.getId());
    assertThat(entities.getFirst().getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_EUR);
    assertThat(entities.getLast().getAmount()).isEqualTo(-5_7500L);
    assertThat(entities.getLast().getCurrency()).isEqualTo("EUR");
    assertThat(entities.getLast().getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.getLast().getReverseEventId()).isNull();
    assertThat(entities.getLast().getEventId()).isEqualTo(pln23.getId());
    assertThat(entities.getLast().getUserAccountId()).isEqualTo(EXCHANGE_ACCOUNT_EUR);
    exchangeEventSourceRepository.deleteAll(entities);

    exchangeEventSourceRepository.delete(sourceEntityEur10);
    exchangeEventSourceRepository.delete(sourceEntityPln23);
    exchangeEventSourceRepository.delete(sourceEntityPln17);
    exchangeEventRepository.delete(eur10);
    exchangeEventRepository.delete(pln23);
    exchangeEventRepository.delete(pln17);
  }

  @Test
  void saveExchangeResult_should_createCorrectRecords_when_cancelledPartiallyRealizedTicket() {
    Long eur10Id;
    Long pln10Id;
    ExchangeEventEntity eur10 = new ExchangeEventEntity();
    eur10.setUserAccountId(REAL_USER_ACCOUNT_PLN);
    eur10.setUserId(REAL_USER_1);
    eur10.setRatio(4_0000L);
    eur10.setAmount(10_0000L);
    eur10.setDirection("S");
    eur10.setPair(PAIR);
    eur10.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    eur10.setTicketStatus(UserTicketStatus.NEW);
    eur10.setEventType(EventType.ORDER);
    eur10.setAmountRealized(0L);
    eur10 = exchangeEventRepository.save(eur10);
    eur10Id = eur10.getId();

    ExchangeEventSourceEntity sourceEntityEur10 = new ExchangeEventSourceEntity();
    sourceEntityEur10.setUserAccountId(eur10.getUserAccountId());
    sourceEntityEur10.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourceEntityEur10.setEventType(EventType.EXCHANGE);
    sourceEntityEur10.setAmount(-eur10.getAmount());
    sourceEntityEur10.setEventId(eur10.getId());
    sourceEntityEur10.setCurrency(
        CurrencyUtils.pairToCurrency(eur10.getPair(), Direction.SELL));
    sourceEntityEur10.setCreatedBy(REAL_USER_1);
    sourceEntityEur10.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourceEntityEur10.setChecksum(ChecksumUtil.checksum(sourceEntityEur10));
    exchangeEventSourceRepository.save(sourceEntityEur10);

    ExchangeEventEntity pln10 = new ExchangeEventEntity();
    pln10.setUserAccountId(REAL_USER_ACCOUNT_EUR);
    pln10.setUserId(REAL_USER_1);
    pln10.setRatio(4_0000L);
    pln10.setAmount(10_0000L);
    pln10.setDirection("B");
    pln10.setPair(PAIR);
    pln10.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    pln10.setTicketStatus(UserTicketStatus.NEW);
    pln10.setEventType(EventType.ORDER);
    pln10.setAmountRealized(0L);
    pln10 = exchangeEventRepository.save(pln10);
    pln10Id = pln10.getId();

    ExchangeEventSourceEntity sourcePln10 = new ExchangeEventSourceEntity();
    sourcePln10.setUserAccountId(pln10.getUserAccountId());
    sourcePln10.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourcePln10.setEventType(pln10.getEventType());
    sourcePln10.setAmount(-pln10.getAmount());
    sourcePln10.setEventId(pln10.getId());
    sourcePln10.setCurrency(
        CurrencyUtils.pairToCurrency(pln10.getPair(), Direction.BUY));
    sourcePln10.setCreatedBy(REAL_USER_1);
    sourcePln10.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    sourcePln10.setChecksum(ChecksumUtil.checksum(sourcePln10));
    exchangeEventSourceRepository.save(sourcePln10);

    CoreTicket coreTicketEur10 = CoreTicketBuilder.createBuilder()
        .withId(eur10.getId())
        .withAmount(eur10.getAmount())
        .withDirection(eur10.getDirection())
        .withPair(eur10.getPair())
        .withRatio(eur10.getRatio())
        .withEpochUTC(eur10.getDateUtc().toEpochSecond(ZoneOffset.UTC))
        .withUserId(eur10.getUserId())
        .build();

    CoreTicket coreTicketPln10 = CoreTicketBuilder.createBuilder()
        .withId(pln10.getId())
        .withAmount(pln10.getAmount())
        .withDirection(pln10.getDirection())
        .withPair(pln10.getPair())
        .withRatio(pln10.getRatio())
        .withEpochUTC(pln10.getDateUtc().toEpochSecond(ZoneOffset.UTC))
        .withUserId(pln10.getUserId())
        .build();

    exchangeService.addCoreTicket(coreTicketEur10);
    exchangeService.addCoreTicket(coreTicketPln10);
    ExchangeResult result = exchangeService.doExchange()
        .orElseThrow(() -> new RuntimeException("exchange not finished"));

    List<ExchangeEventSourceEntity> exchangeEventSourceEntityList = exchangeResultTicketListener.createExchangeEventSourceEntityList(
        result);
    if (!exchangeEventSourceEntityList.isEmpty()) {
      exchangeEventSourceRepository.saveAll(exchangeEventSourceEntityList);
    }

    UserTicket userTicketEur10 = new UserTicket();
    userTicketEur10.setId(coreTicketEur10.getId());
    userTicketEur10.setPair(coreTicketEur10.getPair());
    userTicketEur10.setDirection(coreTicketEur10.getDirection());
    userTicketEur10.setUserId(eur10.getUserId());

    Mockito.doCallRealMethod().when(exchangeTicketListener).loadOrderBook();
    Mockito.doCallRealMethod().when(exchangeTicketListener).doCancelTicket(userTicketEur10);
    Mockito.doNothing().when(exchangeTicketListener).sendExchangeResult(any());
    exchangeTicketListener.loadOrderBook();
    exchangeTicketListener.doCancelTicket(userTicketEur10);

    List<ExchangeEventSourceEntity> entities = exchangeEventSourceRepository.findAll(
        eventId(eur10.getId()), SORT);
    assertThat(entities.size()).isEqualTo(3);
    assertThat(entities.getFirst().getAmount()).isEqualTo(-10_0000L);
    assertThat(entities.getFirst().getCurrency()).isEqualTo("EUR");
    assertThat(entities.getFirst().getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.getFirst().getEventId()).isEqualTo(eur10.getId());
    assertThat(entities.getFirst().getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_PLN);
    assertThat(entities.get(1).getAmount()).isEqualTo(10_0000L);
    assertThat(entities.get(1).getCurrency()).isEqualTo("PLN");
    assertThat(entities.getFirst().getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(1).getReverseEventId()).isEqualTo(pln10.getId());
    assertThat(entities.get(1).getEventId()).isEqualTo(eur10.getId());
    assertThat(entities.get(1).getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_PLN);
    assertThat(entities.get(2).getAmount()).isEqualTo(-10_0000L);
    assertThat(entities.get(2).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(2).getReverseEventId()).isNull();
    assertThat(entities.get(2).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(2).getEventId()).isEqualTo(eur10.getId());
    assertThat(entities.get(2).getUserAccountId()).isEqualTo(EXCHANGE_ACCOUNT_PLN);

    exchangeEventSourceRepository.flush();
    //cleanup
    exchangeEventSourceRepository.findAll().forEach(e -> {
      if (Objects.equals(e.getEventId(), eur10Id) || Objects.equals(e.getEventId(), pln10Id)) {
        exchangeEventSourceRepository.delete(e);
      }
    });
    exchangeEventRepository.findAll().forEach(e -> {
      if (Objects.equals(e.getId(), eur10Id) || Objects.equals(e.getId(), pln10Id)) {
        exchangeEventRepository.delete(e);
      }
    });
  }

  @Test
  public void createExchangeEventSourceEntityList_should_createListWithCorrectAmountValues_when_calledWithPartialRealizedExchange() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setUserTicketStatus(UserTicketStatus.PARTIAL_REALIZED);
    exchangeResult.setBuyTicket(
        CoreTicketBuilder.createBuilder()
            .withId(12002L)
            .withAmount(20_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setSellTicket(
        CoreTicketBuilder.createBuilder()
            .withId(11502L)
            .withAmount(20_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setSellExchange(
        CoreTicketBuilder.createBuilder()
            .withId(11502L)
            .withAmount(20_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setBuyExchange(
        CoreTicketBuilder.createBuilder()
            .withId(12002L)
            .withAmount(5_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setBuyTicketAfterExchange(
        CoreTicketBuilder.createBuilder()
            .withId(11502L)
            .withAmount(0)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setSellTicketAfterExchange(
        CoreTicketBuilder.createBuilder()
            .withId(12002L)
            .withAmount(15_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    List<ExchangeEventSourceEntity> entities = exchangeResultTicketListener.createExchangeEventSourceEntityList(
        exchangeResult);
    assertThat(entities.size()).isEqualTo(4);
    assertThat(entities.get(0).getAmount()).isEqualTo(5_0000L);
    assertThat(entities.get(0).getCurrency()).isEqualTo("EUR");
    assertThat(entities.get(0).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(0).getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_EUR);
    assertThat(entities.get(1).getAmount()).isEqualTo(-5_0000L);
    assertThat(entities.get(1).getCurrency()).isEqualTo("EUR");
    assertThat(entities.get(1).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(1).getUserAccountId()).isEqualTo(EXCHANGE_ACCOUNT_EUR);
    assertThat(entities.get(2).getAmount()).isEqualTo(20_0000L);
    assertThat(entities.get(2).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(2).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(2).getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_PLN);
    assertThat(entities.get(3).getAmount()).isEqualTo(-20_0000L);
    assertThat(entities.get(3).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(3).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(3).getUserAccountId()).isEqualTo(EXCHANGE_ACCOUNT_PLN);
  }

  @Test
  public void createExchangeEventSourceEntityList_should_createListWithCorrectAmountValues_when_calledWithFullExchange() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setUserTicketStatus(UserTicketStatus.REALIZED);
    exchangeResult.setBuyTicket(
        CoreTicketBuilder.createBuilder()
            .withId(12002L)
            .withAmount(20_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setSellTicket(
        CoreTicketBuilder.createBuilder()
            .withId(11502L)
            .withAmount(5_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setSellExchange(
        CoreTicketBuilder.createBuilder()
            .withId(11502L)
            .withAmount(20_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setBuyExchange(
        CoreTicketBuilder.createBuilder()
            .withId(12002L)
            .withAmount(5_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setBuyTicketAfterExchange(
        CoreTicketBuilder.createBuilder()
            .withId(11502L)
            .withAmount(0)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setSellTicketAfterExchange(
        CoreTicketBuilder.createBuilder()
            .withId(12002L)
            .withAmount(0)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.SELL)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    List<ExchangeEventSourceEntity> entities = exchangeResultTicketListener.createExchangeEventSourceEntityList(
        exchangeResult);
    assertThat(entities.size()).isEqualTo(4);
    assertThat(entities.get(0).getAmount()).isEqualTo(5_0000L);
    assertThat(entities.get(0).getCurrency()).isEqualTo("EUR");
    assertThat(entities.get(0).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(0).getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_EUR);
    assertThat(entities.get(1).getAmount()).isEqualTo(-5_0000L);
    assertThat(entities.get(1).getCurrency()).isEqualTo("EUR");
    assertThat(entities.get(1).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(1).getUserAccountId()).isEqualTo(EXCHANGE_ACCOUNT_EUR);
    assertThat(entities.get(2).getAmount()).isEqualTo(20_0000L);
    assertThat(entities.get(2).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(2).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(2).getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_PLN);
    assertThat(entities.get(3).getAmount()).isEqualTo(-20_0000L);
    assertThat(entities.get(3).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(3).getEventType()).isEqualTo(EventType.EXCHANGE);
    assertThat(entities.get(3).getUserAccountId()).isEqualTo(EXCHANGE_ACCOUNT_PLN);
  }

  @Test
  public void createExchangeEventSourceEntityList_should_createListWithCorrectAmountValues_when_calledWithCancelledTicket() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setCancelledTicket(
        CoreTicketBuilder.createBuilder()
            .withId(12002L)
            .withAmount(20_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setUserTicketStatus(UserTicketStatus.CANCELLED);
    List<ExchangeEventSourceEntity> entities = exchangeResultTicketListener.createExchangeEventSourceEntityList(
        exchangeResult);
    assertThat(entities.size()).isEqualTo(2);
    assertThat(entities.get(0).getAmount()).isEqualTo(20_0000L);
    assertThat(entities.get(0).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(0).getEventType()).isEqualTo(EventType.CANCEL);
    assertThat(entities.get(0).getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_PLN);
    assertThat(entities.get(1).getAmount()).isEqualTo(-20_0000L);
    assertThat(entities.get(1).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(1).getEventType()).isEqualTo(EventType.CANCEL);
    assertThat(entities.get(1).getUserAccountId()).isEqualTo(EXCHANGE_ACCOUNT_PLN);
  }

  @Test
  public void createExchangeEventSourceEntityList_should_createListWithCorrectAmountValues_when_calledWithPartialCancelledTicket() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setCancelledTicket(
        CoreTicketBuilder.createBuilder()
            .withId(12002L)
            .withAmount(20_0000)
            .withRatio(4_0000)
            .withPair(Pair.EUR_PLN)
            .withDirection(Direction.BUY)
            .withUserId(REAL_USER_1)
            .withEpochUTC(100)
            .build());
    exchangeResult.setUserTicketStatus(UserTicketStatus.PARTIAL_CANCELED);
    List<ExchangeEventSourceEntity> entities = exchangeResultTicketListener.createExchangeEventSourceEntityList(
        exchangeResult);
    assertThat(entities.size()).isEqualTo(2);
    assertThat(entities.get(0).getAmount()).isEqualTo(20_0000L);
    assertThat(entities.get(0).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(0).getEventType()).isEqualTo(EventType.CANCEL);
    assertThat(entities.get(0).getUserAccountId()).isEqualTo(REAL_USER_ACCOUNT_PLN);
    assertThat(entities.get(1).getAmount()).isEqualTo(-20_0000L);
    assertThat(entities.get(1).getCurrency()).isEqualTo("PLN");
    assertThat(entities.get(1).getEventType()).isEqualTo(EventType.CANCEL);
    assertThat(entities.get(1).getUserAccountId()).isEqualTo(EXCHANGE_ACCOUNT_PLN);
  }
}