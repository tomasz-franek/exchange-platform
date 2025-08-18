package org.exchange.app.backend.listeners;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.UserTicketStatus.PARTIAL_REALIZED;
import static org.exchange.app.common.api.model.UserTicketStatus.REALIZED;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.exchange.internal.app.core.data.ExchangeResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedKafka(partitions = 1)
class ExchangeTicketListenerTest {

  @Autowired
  private ExchangeEventRepository exchangeEventRepository;

  @Autowired
  private ExchangeTicketListener exchangeTicketListener;


  private static ExchangeResult prepareExchangeResult(CoreTicket buyTicket, CoreTicket sellTicket,
      CoreTicket buyTicketAfterExchange, CoreTicket sellTicketAfterExchange,
      ExchangeEventEntity sellEntity, ExchangeEventEntity buyEntity) {
    ExchangeResult exchangeResult = new ExchangeResult(buyTicket, sellTicket,
        ExchangeDateUtils.currentLocalDateTime());
    exchangeResult.setBuyTicketAfterExchange(buyTicketAfterExchange);
    exchangeResult.setSellTicketAfterExchange(sellTicketAfterExchange);
    exchangeResult.setSellExchange(
        CoreTicketBuilder.createBuilder().withId(sellEntity.getId())
            .withRatio(sellEntity.getRatio()).withEpochUTC(sellEntity.getDateUtc().getTime())
            .withUserId(sellTicketAfterExchange.getUserId()).withPair(sellEntity.getPair())
            .withDirection(sellTicket.getDirection()).build());
    exchangeResult.setBuyExchange(
        CoreTicketBuilder.createBuilder().withId(buyEntity.getId()).withRatio(buyEntity.getRatio())
            .withEpochUTC(buyEntity.getDateUtc().getTime())
            .withUserId(buyTicketAfterExchange.getUserId()).withPair(buyEntity.getPair())
            .withDirection(buyTicket.getDirection()).build());
    return exchangeResult;
  }

  @Test
  void loadOrderBook_should_reduceTicketAmountByPartiallyRealizedAmount_when_ticketsAreReadFromDatabase() {
    ExchangeEventEntity exchangeEventEntity = createExchangeEventEntity(100_0000L, 12_5000L, "S");

    exchangeEventEntity = exchangeEventRepository.save(exchangeEventEntity);

    exchangeTicketListener.loadOrderBook();

    Optional<CoreTicket> coreTicketOptional = exchangeTicketListener.exchangeServiceConcurrentHashMap.get(
        Pair.EUR_PLN).removeOrder(exchangeEventEntity.getId(), SELL);
    assertThat(coreTicketOptional).isNotEmpty();
    assertThat(coreTicketOptional.get().getAmount()).isEqualTo(
        exchangeEventEntity.getAmount() - exchangeEventEntity.getAmountRealized());
    exchangeEventRepository.delete(exchangeEventEntity);
  }

  @Test
  void loadOrderBook_should_readTotalAmount_when_ticketNotPartiallyRealized() {
    ExchangeEventEntity exchangeEventEntity = createExchangeEventEntity(30_0000L, 0L, "S");

    exchangeEventEntity = exchangeEventRepository.save(exchangeEventEntity);

    exchangeTicketListener.loadOrderBook();

    Optional<CoreTicket> coreTicketOptional = exchangeTicketListener.exchangeServiceConcurrentHashMap.get(
        Pair.EUR_PLN).getFirstBookTicket(SELL);
    assertThat(coreTicketOptional).isNotEmpty();
    assertThat(coreTicketOptional.get().getAmount()).isEqualTo(
        exchangeEventEntity.getAmount());
    exchangeEventRepository.delete(exchangeEventEntity);
  }

  @Test
  void updateTicketStatus_should_savePartialExchange_when_ticketBuyPartiallyRealized() {
    ExchangeEventEntity buyEntity = createExchangeEventEntity(100_0000L, 0L, "B");

    buyEntity = exchangeEventRepository.save(buyEntity);

    ExchangeEventEntity sellEntity = createExchangeEventEntity(30_0000L, 0L, "S");

    sellEntity = exchangeEventRepository.save(sellEntity);

    CoreTicket buyTicket = createCoreTicket(buyEntity);
    CoreTicket sellTicket = createCoreTicket(sellEntity);

    CoreTicket buyTicketAfterExchange = prepareTicketAfterExchange(buyEntity,
        sellEntity.getAmount() / 2);
    CoreTicket sellTicketAfterExchange = prepareTicketAfterExchange(sellEntity, 0L);
    ExchangeResult exchangeResult = prepareExchangeResult(buyTicket,
        sellTicket, buyTicketAfterExchange, sellTicketAfterExchange, sellEntity, buyEntity);

    exchangeTicketListener.updateTicketStatus(exchangeResult);

    validateExchangeTickets(buyEntity, PARTIAL_REALIZED, sellEntity, REALIZED);
  }

  @Test
  void updateTicketStatus_should_saveFullExchange_when_ticketBuyFullRealized() {
    ExchangeEventEntity buyEntity = createExchangeEventEntity(100_0000L, 0L, "B");

    buyEntity = exchangeEventRepository.save(buyEntity);

    ExchangeEventEntity sellEntity = createExchangeEventEntity(30_0000L, 0L, "S");

    sellEntity = exchangeEventRepository.save(sellEntity);

    CoreTicket buyTicket = createCoreTicket(buyEntity);
    CoreTicket sellTicket = createCoreTicket(sellEntity);

    CoreTicket buyTicketAfterExchange = prepareTicketAfterExchange(buyEntity, 0L);
    CoreTicket sellTicketAfterExchange = prepareTicketAfterExchange(sellEntity, 0L);
    ExchangeResult exchangeResult = prepareExchangeResult(buyTicket,
        sellTicket, buyTicketAfterExchange, sellTicketAfterExchange, sellEntity, buyEntity);

    exchangeTicketListener.updateTicketStatus(exchangeResult);

    validateExchangeTickets(buyEntity, REALIZED, sellEntity, REALIZED);
  }

  @Test
  void updateTicketStatus_should_savePartialExchange_when_ticketSellPartiallyRealized() {
    ExchangeEventEntity buyEntity = createExchangeEventEntity(100_0000L, 0L, "B");

    buyEntity = exchangeEventRepository.save(buyEntity);

    ExchangeEventEntity sellEntity = createExchangeEventEntity(30_0000L, 0L, "S");

    sellEntity = exchangeEventRepository.save(sellEntity);

    CoreTicket buyTicket = createCoreTicket(buyEntity);
    CoreTicket sellTicket = createCoreTicket(sellEntity);

    CoreTicket buyTicketAfterExchange = prepareTicketAfterExchange(buyEntity, 0L);
    CoreTicket sellTicketAfterExchange = prepareTicketAfterExchange(sellEntity, 20_0000L);
    ExchangeResult exchangeResult = prepareExchangeResult(buyTicket,
        sellTicket, buyTicketAfterExchange, sellTicketAfterExchange, sellEntity, buyEntity);

    exchangeTicketListener.updateTicketStatus(exchangeResult);

    validateExchangeTickets(buyEntity, REALIZED, sellEntity, PARTIAL_REALIZED);
  }

  @Test
  void updateTicketStatus_should_saveFullExchange_when_ticketSellFullRealized() {
    ExchangeEventEntity buyEntity = createExchangeEventEntity(100_0000L, 0L, "B");

    buyEntity = exchangeEventRepository.save(buyEntity);

    ExchangeEventEntity sellEntity = createExchangeEventEntity(30_0000L, 0L, "S");

    sellEntity = exchangeEventRepository.save(sellEntity);

    CoreTicket buyTicket = createCoreTicket(buyEntity);
    CoreTicket sellTicket = createCoreTicket(sellEntity);

    CoreTicket buyTicketAfterExchange = prepareTicketAfterExchange(buyEntity, 0L);
    CoreTicket sellTicketAfterExchange = prepareTicketAfterExchange(sellEntity, 0L);
    ExchangeResult exchangeResult = prepareExchangeResult(buyTicket,
        sellTicket, buyTicketAfterExchange, sellTicketAfterExchange, sellEntity, buyEntity);

    exchangeTicketListener.updateTicketStatus(exchangeResult);

    validateExchangeTickets(buyEntity, REALIZED, sellEntity, REALIZED);
  }

  private void validateExchangeTickets(ExchangeEventEntity buyEntity,
      UserTicketStatus buyTicketStatus, ExchangeEventEntity sellEntity,
      UserTicketStatus sellTicketStatus) {
    ExchangeEventEntity buyEntityAfterUpdate = exchangeEventRepository.getReferenceById(
        buyEntity.getId());
    ExchangeEventEntity sellEntityAfterUpdate = exchangeEventRepository.getReferenceById(
        sellEntity.getId());
    assertThat(buyEntityAfterUpdate).isNotNull();
    assertThat(sellEntityAfterUpdate).isNotNull();
    assertThat(buyEntityAfterUpdate.getTicketStatus()).isEqualTo(buyTicketStatus);
    assertThat(sellEntityAfterUpdate.getTicketStatus()).isEqualTo(sellTicketStatus);

    exchangeEventRepository.delete(buyEntityAfterUpdate);
    exchangeEventRepository.delete(sellEntityAfterUpdate);
  }

  CoreTicket prepareTicketAfterExchange(ExchangeEventEntity entity, Long amount) {
    return CoreTicketBuilder
        .createBuilder()
        .withAmount(amount)
        .withDirection(entity.getDirection())
        .withRatio(entity.getRatio())
        .withPair(entity.getPair())
        .withEpochUTC(ExchangeDateUtils.currentEpochUtc())
        .withId(entity.getId())
        .withUserId(UUID.fromString("00000000-0000-0000-0002-000000000001"))
        .build();
  }


  private static CoreTicket createCoreTicket(ExchangeEventEntity entity) {
    return CoreTicketBuilder
        .createBuilder()
        .withAmount(entity.getAmount())
        .withRatio(entity.getRatio())
        .withDirection(entity.getDirection())
        .withPair(entity.getPair())
        .withEpochUTC(entity.getDateUtc().getTime())
        .withId(entity.getId())
        .withUserId(UUID.fromString("00000000-0000-0000-0002-000000000001"))
        .build();
  }

  private static ExchangeEventEntity createExchangeEventEntity(long amount, long amountRealized,
      String direction) {
    ExchangeEventEntity buyEntity = new ExchangeEventEntity();
    buyEntity.setAmount(amount);
    buyEntity.setAmountRealized(amountRealized);
    buyEntity.setPair(Pair.EUR_PLN);
    buyEntity.setDirection(direction);
    buyEntity.setEventType(EventType.ORDER);
    buyEntity.setTicketStatus(UserTicketStatus.NEW);
    buyEntity.setDateUtc(ExchangeDateUtils.currentTimestamp());
    buyEntity.setRatio(1_0100L);
    buyEntity.setUserAccountId(UUID.fromString("72aa8932-8798-4d1b-aaf0-590a3e6ffa22"));
    buyEntity.setUserId(UUID.fromString("00000000-0000-0000-0002-000000000001"));
    return buyEntity;
  }
}