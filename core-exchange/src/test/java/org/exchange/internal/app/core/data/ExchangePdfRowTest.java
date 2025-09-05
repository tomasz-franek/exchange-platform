package org.exchange.internal.app.core.data;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.Pair.EUR_CHF;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;
import static org.exchange.app.common.api.model.Pair.USD_CHF;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.exceptions.ExchangeException;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.services.ExchangeService;
import org.exchange.internal.app.core.strategies.ratio.FirstTicketRatioStrategy;
import org.junit.jupiter.api.Test;

class ExchangePdfRowTest {

  public static final String USER_ID = "00000000-0000-0000-0002-000000000001";

  @Test
  public void validate_should_validateCorrectly_when_sellTicketAfterExchangeContainsCorrectResult() {
    ExchangeResult exchangeResult = new ExchangeResult(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withAmount("100.0")
            .build(),
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withAmount("200.0")
            .build()
    );
    exchangeResult.setSellTicketAfterExchange(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withAmount("220.0")
            .build()
    );
    exchangeResult.validate();
  }

  @Test
  public final void validate_should_validateCorrectly_when_sellTicketAfterExchangeInExchangeResult() {

    ExchangeResult exchangeResult = new ExchangeResult(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withAmount("420.0")
            .build(),
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withAmount("50.0")
            .build()
    );
    exchangeResult.setSellTicketAfterExchange(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("4.2")
            .withAmount("50.0")
            .build()
    );
    exchangeResult.validate();
  }

  @Test
  public final void validate_should_returnFalse_when_noBuyTicket() {
    ExchangeResult exchangeResult = new ExchangeResult(null,
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withAmount("420.0")
            .build()
    );
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_wrongExchangeRatio() {
    ExchangeResult exchangeResult = new ExchangeResult(
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(BUY)
            .withRatio("3.0")
            .withAmount("100.0")
            .build(),
        CoreTicketBuilder.createBuilder()
            .withId(1L)
            .withUserId(UUID.randomUUID())
            .withPair(EUR_PLN)
            .withDirection(SELL)
            .withRatio("4.2")
            .withAmount("200.0")
            .build());
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 100_0000, 4_2000, UUID.randomUUID(),
            EUR_PLN, SELL));
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_missingBuyTicketAfterExchange() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 300_0000, 3_0000, UUID.randomUUID(), EUR_PLN, SELL),
        new CoreTicket(2L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 100_0000, 4_20000, UUID.randomUUID(), EUR_PLN, BUY));
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_wrongAmountAfterExchange() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 300_0000, 3_0000, UUID.randomUUID(), EUR_PLN, SELL),
        new CoreTicket(2L, 10_3448, 2_9000, UUID.randomUUID(), EUR_PLN, BUY));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 90_0000, 3_0000, UUID.randomUUID(),
            EUR_PLN, SELL));
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_noBuyTicketAfterExchange() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 100_0000, 3_0000, UUID.randomUUID(), EUR_PLN,
            BUY),
        new CoreTicket(2L, 10_3448, 2_9000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 90_0000, 3_0000, UUID.randomUUID(),
            EUR_PLN, SELL));
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_noBuyAndSellTicketsInExchangeResult() {
    ExchangeResult exchangeResult = new ExchangeResult(null, null);
    assertThat(exchangeResult).isNotNull();
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_noExchangeResult() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 100_0000, 3_0000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(2L, 1_0000, 3_0000, UUID.randomUUID(), EUR_PLN, SELL));
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_wrongAmountAfterExchangeForBuyTicket() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(4L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_wrongAmountForSellTicketAfterExchange() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(4L, 101_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    assertThat(exchangeResult.validate()).isEqualTo(false);

    exchangeResult = new ExchangeResult(
        new CoreTicket(5L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(5L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(7L, 220_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(8L, 99_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_wrongSumOfExchangedCurrencies() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(4L, 100_0000, 4_2000, UUID.randomUUID(), EUR_CHF, BUY));

    exchangeResult.setBuyExchange(
        new CoreTicket(5L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    exchangeResult.setBuyExchange(
        new CoreTicket(6L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_invalidRatioForBuyTicketAfterExchange() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(4L, 100_0000, 4_1400, UUID.randomUUID(), EUR_PLN, BUY));

    exchangeResult.setBuyExchange(
        new CoreTicket(5L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    exchangeResult.setBuyExchange(
        new CoreTicket(6L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    assertThat(exchangeResult.validate()).isEqualTo(false);

  }

  @Test
  public final void validate_should_returnFalse_when_amountAfterExchangeIsGreaterThanAmountOriginalTicket() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, UUID.randomUUID(), EUR_CHF, SELL));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(4L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));

    exchangeResult.setBuyExchange(
        new CoreTicket(5L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    exchangeResult.setBuyExchange(
        new CoreTicket(6L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    assertThat(exchangeResult.validate()).isEqualTo(false);

  }

  @Test
  public final void validate_should_returnFalse_when_wrongDirectionsForTicketsAfterExchange() {

    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(4L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));

    exchangeResult.setBuyExchange(
        new CoreTicket(5L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    exchangeResult.setBuyExchange(
        new CoreTicket(6L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    assertThat(exchangeResult.validate()).isEqualTo(false);

  }

  @Test
  public final void validate_should_returnFalse_when_wrongDirectionsForTicketsAfterExchangeAndBuyExchange() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(2L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    exchangeResult.setSellTicketAfterExchange(
        new CoreTicket(3L, 220_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    exchangeResult.setBuyTicketAfterExchange(
        new CoreTicket(4L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));

    exchangeResult.setBuyExchange(
        new CoreTicket(5L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    exchangeResult.setBuyExchange(
        new CoreTicket(6L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY));
    assertThat(exchangeResult.validate()).isEqualTo(false);
  }

  @Test
  public final void validate_should_returnFalse_when_sellTicketAfterExchangeIsNull() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY), null);
    exchangeResult.setSellTicketAfterExchange(null);
    assertThat(exchangeResult.validate()).isEqualTo(false);

  }

  @Test
  public final void toString_should_returnCorrectResultInfo_when_fullExchange() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 200_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(2L, 480_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    assertThat(exchangeResult.toString().substring(0, 60)).isEqualTo(
        "EUR_PLN amount : '200.00' PLN ratio : '4.2000' -> 480.00 EUR");

  }

  @Test
  public final void toString_should_returnCorrectResultInfo_when_partialExchange() {
    ExchangeResult exchangeResult = new ExchangeResult(
        new CoreTicket(1L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY),
        new CoreTicket(2L, 420_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL));
    assertThat(exchangeResult.toString().substring(0, 60)).isEqualTo(
        "EUR_PLN amount : '100.00' PLN ratio : '4.2000' -> 420.00 EUR");

  }

  @Test
  public final void validate_should_returnFalse_when_bothOrderTicketHaveDirectionSell() {
    CoreTicket order1 = new CoreTicket(1L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL);
    CoreTicket order2 = new CoreTicket(2L, 420_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL);
    ExchangeResult exchangeResult = new ExchangeResult(order1, order2);
    CoreTicket ex = new CoreTicket(3L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY);

    exchangeResult.setBuyExchange(ex);
    exchangeResult.setSellExchange(ex);
    assertThat(exchangeResult.validate()).isEqualTo(false);

  }

  @Test
  public final void validate_should_returnFalse_when_bothOrderTicketHaveDirectionBuy() {
    CoreTicket order1 = new CoreTicket(1L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY);
    CoreTicket order2 = new CoreTicket(2L, 420_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY);
    ExchangeResult exchangeResult = new ExchangeResult(order1, order2);
    CoreTicket ex = new CoreTicket(3L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY);

    exchangeResult.setBuyExchange(ex);
    exchangeResult.setSellExchange(ex);
    assertThat(exchangeResult.validate()).isEqualTo(false);

  }

  @Test
  public final void validate_should_generateException_when_wrongDirectionForOrderTicketAfterExchange() {
    CoreTicket order1 = new CoreTicket(1L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY);
    CoreTicket order2 = new CoreTicket(2L, 420_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL);
    ExchangeResult exchangeResult = new ExchangeResult(order1, order2);
    CoreTicket ex = new CoreTicket(3L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY);

    exchangeResult.setBuyExchange(ex);
    exchangeResult.setSellExchange(ex);
    exchangeResult.setBuyTicketAfterExchange(order2);
    ExchangeException exception = assertThrows(ExchangeException.class, exchangeResult::validate);
    assertThat(exception.getMessage()).isEqualTo(
        "Invalid orderTicketAfterExchange exchange A->B : 'BUY' should be 'SELL'");
  }

  @Test
  public final void validate_should_generateException_when_wrongCurrencyForOrderTicketAfterExchange() {
    CoreTicket order1 = new CoreTicket(1L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY);
    CoreTicket order2 = new CoreTicket(2L, 420_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL);
    CoreTicket order3 = new CoreTicket(3L, 420_0000, 4_2000, UUID.randomUUID(), USD_CHF, SELL);
    ExchangeResult exchangeResult = new ExchangeResult(order1, order2);
    CoreTicket ex = new CoreTicket(4L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY);

    exchangeResult.setBuyExchange(ex);
    exchangeResult.setSellExchange(ex);
    exchangeResult.setBuyTicketAfterExchange(order3);
    ExchangeException exception = assertThrows(ExchangeException.class, exchangeResult::validate);
    assertThat(exception.getMessage()).isEqualTo(
        "Invalid orderTicketAfterExchange currency : 'EUR_PLN' should be 'USD_CHF'");
  }

  @Test
  public final void validate_should_generateException_when_wrongRatioForOrderTicketAfterExchange() {
    CoreTicket order1 = new CoreTicket(1L, 100_0000, 4_2000, UUID.randomUUID(), EUR_PLN, BUY);
    CoreTicket order2 = new CoreTicket(2L, 420_0000, 4_2000, UUID.randomUUID(), EUR_PLN, SELL);
    CoreTicket order3 = new CoreTicket(3L, 420_0000, 4_2200, UUID.randomUUID(), EUR_PLN, SELL);
    ExchangeResult exchangeResult = new ExchangeResult(order1, order2);
    CoreTicket ex = new CoreTicket(4L, 100_0000, 4_2200, UUID.randomUUID(), EUR_PLN, BUY);

    exchangeResult.setBuyExchange(ex);
    exchangeResult.setSellExchange(ex);
    exchangeResult.setBuyTicketAfterExchange(order3);
    ExchangeException exception = assertThrows(ExchangeException.class, exchangeResult::validate);
    assertThat(exception.getMessage()).isEqualTo(
        "Invalid orderTicketAfterExchange exchange ratio : '42000' should be '42200'");
  }

  @Test
  void fastValidate_should_validateTrue_when_bigAmount() {
    ExchangeService exchangeService = new ExchangeService(Pair.CHF_PLN,
        new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder().withAmount(444444_0000L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder().withAmount(444444_0000L).withDirection(
                Direction.SELL).withRatio(2_0000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());

    Optional<ExchangeResult> exchangeResult = exchangeService.doExchange();
    assertThat(exchangeResult.isPresent()).isTrue();
    assertThat(exchangeResult.get().fastValidate()).isTrue();
  }

  @Test
  void validate_should_validateTrue_when_amountIsLow() {
    ExchangeService exchangeService = new ExchangeService(Pair.CHF_PLN,
        new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder().withAmount(4_0000L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder().withAmount(4_0000L).withDirection(
                Direction.SELL).withRatio(2_0000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());

    Optional<ExchangeResult> exchangeResult = exchangeService.doExchange();
    assertThat(exchangeResult.isPresent()).isTrue();
    assertThat(exchangeResult.get().validate()).isTrue();
  }

  @Test
  void fastValidate_should_validateTrue_when_amountIsLow() {
    ExchangeService exchangeService = new ExchangeService(Pair.CHF_PLN,
        new FirstTicketRatioStrategy());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder().withAmount(40000L).withDirection(
                Direction.BUY).withRatio(20000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeService.addCoreTicket(
        CoreTicketBuilder.createBuilder().withAmount(40000L).withDirection(
                Direction.SELL).withRatio(20000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());

    Optional<ExchangeResult> exchangeResult = exchangeService.doExchange();
    assertThat(exchangeResult.isPresent()).isTrue();
    assertThat(exchangeResult.get().fastValidate()).isTrue();
  }

  @Test
  void fastValidate_should_generateException_when_OrderDifferencePositive() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setBuyTicket(
        CoreTicketBuilder.createBuilder().withAmount(4_0101L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setSellExchange(
        CoreTicketBuilder.createBuilder().withAmount(8_0101L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setBuyExchange(
        CoreTicketBuilder.createBuilder().withAmount(4_0000L).withDirection(
                Direction.SELL).withRatio(2_0000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    Exception exception = assertThrows(ExchangeException.class, exchangeResult::fastValidate
    );
    assertThat(exception.getMessage()).isEqualTo("Invalid validate transaction amount : 101");
  }

  @Test
  void fastValidate_should_generateException_when_OrderDifferenceNegative() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setBuyTicket(
        CoreTicketBuilder.createBuilder().withAmount(3_9899L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setSellExchange(
        CoreTicketBuilder.createBuilder().withAmount(7_9899L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setBuyExchange(
        CoreTicketBuilder.createBuilder().withAmount(4_0000L).withDirection(
                Direction.SELL).withRatio(2_0000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    Exception exception = assertThrows(ExchangeException.class, exchangeResult::fastValidate
    );
    assertThat(exception.getMessage()).isEqualTo("Invalid validate transaction amount : 101");
  }

  @Test
  void validate_should_generateException_when_OrderDifferencePositive() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setSellTicket(
        CoreTicketBuilder.createBuilder().withAmount(3_9899L).withDirection(
                Direction.SELL).withRatio(2_0000L).withId(4L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setBuyTicket(
        CoreTicketBuilder.createBuilder().withAmount(8_0101L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setSellExchange(
        CoreTicketBuilder.createBuilder().withAmount(7_9899L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setBuyExchange(
        CoreTicketBuilder.createBuilder().withAmount(4_0000L).withDirection(
                Direction.SELL).withRatio(2_0000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setBuyTicketAfterExchange(
        CoreTicketBuilder.createBuilder().withAmount(0L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setSellTicketAfterExchange(
        CoreTicketBuilder.createBuilder().withAmount(0L).withDirection(
                Direction.SELL).withRatio(2_0000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    Exception exception = assertThrows(ExchangeException.class, exchangeResult::validate
    );
    assertThat(exception.getMessage()).isEqualTo(
        "Invalid amount : buyTicket '80101' buyTicketAfterExchange: '0'  sellExchange: '79899'");
  }

  @Test
  void validate_should_generateException_when_OrderDifferenceIsNegative() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setSellTicket(
        CoreTicketBuilder.createBuilder().withAmount(3_9899L).withDirection(
                Direction.SELL).withRatio(2_0000L).withId(4L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setBuyTicket(
        CoreTicketBuilder.createBuilder().withAmount(3_9899L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setSellExchange(
        CoreTicketBuilder.createBuilder().withAmount(7_9899L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(9L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setBuyExchange(
        CoreTicketBuilder.createBuilder().withAmount(4_0000L).withDirection(
                Direction.SELL).withRatio(2_0000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setBuyTicketAfterExchange(
        CoreTicketBuilder.createBuilder().withAmount(0L).withDirection(
                Direction.BUY).withRatio(2_0000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    exchangeResult.setSellTicketAfterExchange(
        CoreTicketBuilder.createBuilder().withAmount(0L).withDirection(
                Direction.SELL).withRatio(2_0000L).withId(11L).withPair(Pair.CHF_PLN)
            .withUserId(USER_ID).build());
    Exception exception = assertThrows(ExchangeException.class, exchangeResult::validate
    );
    assertThat(exception.getMessage()).isEqualTo(
        "Invalid amount : buyTicket '39899' buyTicketAfterExchange: '0'  sellExchange: '79899'");
  }
}