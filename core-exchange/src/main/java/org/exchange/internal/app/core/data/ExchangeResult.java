package org.exchange.internal.app.core.data;

import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.internal.app.core.builders.CoreTicketProperties.MAX_EXCHANGE_ERROR;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.ObjectUtils;
import org.exchange.app.backend.common.exceptions.ExchangeException;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.builders.CoreTicketProperties;


@Getter
@Setter
@NoArgsConstructor
@Log4j2
public final class ExchangeResult {

  //initial tickets
  private CoreTicket buyTicket;
  private CoreTicket sellTicket;

  //amount exchanged
  @Setter
  private CoreTicket sellExchange = null;
  @Setter
  private CoreTicket buyExchange = null;

  //rest of exchange - one of them if partial exchange or both are nulls when full exchange
  @Setter
  private CoreTicket buyTicketAfterExchange = null;
  @Setter
  private CoreTicket sellTicketAfterExchange = null;

  @Setter
  private CoreTicket cancelledTicket = null;

  private long exchangeEpochUTC;

  public ExchangeResult(final CoreTicket buyTicket, final CoreTicket sellTicket,
      final long exchangeEpochUTC) {
    this.exchangeEpochUTC = exchangeEpochUTC;
    this.buyTicket = buyTicket;
    this.sellTicket = sellTicket;
  }

  public ExchangeResult(final CoreTicket buyTicket, final CoreTicket sellTicket) {
    this.buyTicket = buyTicket;
    this.sellTicket = sellTicket;
    this.exchangeEpochUTC = System.currentTimeMillis();
  }

  private void checkTicketAndTicketAfterExchange(final CoreTicket ticket,
      final CoreTicket ticketAfterExchange)
      throws ExchangeException {
    if (!ticket.getPair().equals(ticketAfterExchange.getPair())) {
      throw new ExchangeException(
          String.format("Invalid orderTicketAfterExchange currency : '%s' should be '%s'",
              ticket.getPair(),
              ticketAfterExchange.getPair()));
    }
    if (ticket.getRatio() != ticketAfterExchange.getRatio()) {
      throw new ExchangeException(
          String.format("Invalid orderTicketAfterExchange exchange ratio : '%s' should be '%s'",
              ticket.getRatio(), ticketAfterExchange.getRatio()));
    }

    if (!sameDirection(ticket, ticketAfterExchange)) {
      throw new ExchangeException(
          String.format("Invalid orderTicketAfterExchange exchange A->B : '%s' should be '%s'",
              ticket.getDirection(), ticketAfterExchange.getDirection()));
    }
  }

  public boolean validate() throws ExchangeException {

    if (ObjectUtils.anyNull(sellTicket,
        buyTicket,
        sellExchange,
        buyExchange)) {
      return false;
    }

    if (SELL.equals(buyTicket.getDirection())) {
      return false;
    }

    if (BUY.equals(sellTicket.getDirection())) {
      return false;
    }

    if (buyTicketAfterExchange != null) {
      checkTicketAndTicketAfterExchange(buyTicket, buyTicketAfterExchange);
    }

    if (sellTicketAfterExchange != null) {
      checkTicketAndTicketAfterExchange(sellTicket, sellTicketAfterExchange);
    }

    validateDirection();
    validateValueAmount();

    return fastValidate();
  }

  private void validateValueAmount() throws ExchangeException {
    long exchange = sellExchange.getAmount();
    if (buyTicket.getAmount() - buyTicketAfterExchange.getAmount() != exchange) {
      throw new ExchangeException(String.format(
          "Invalid amount : buyTicket '%s' buyTicketAfterExchange: '%s'  sellExchange: '%s'",
          buyTicket.getAmount(), buyTicketAfterExchange.getAmount(), exchange));
    }

    exchange = buyExchange.getAmount();
    if (sellTicket.getAmount() - sellTicketAfterExchange.getAmount() != exchange) {
      throw new ExchangeException(String.format(
          "Invalid amount : sellTicket '%s' sellTicketAfterExchange: '%s'  buyExchange: '%s'",
          sellTicket.getAmount(), sellTicketAfterExchange.getAmount(), exchange));
    }
  }

  private void validateDirection() throws ExchangeException {
    if (sameDirection(buyTicket, sellTicket)) {
      throw new ExchangeException(
          String.format(
              "Invalid exchange A-B for buy ticket : '%s' sell ticket : '%s'",
              buyTicket.getPair(), sellTicket));
    }
    if (sameDirection(buyTicket, buyExchange)) {
      throw new ExchangeException(
          String.format(
              "Invalid exchange A-B for buy ticket : '%s' buy exchange: '%s'",
              buyTicket.getDirection(), buyExchange.getDirection()));
    }

    if (sameDirection(sellTicket, sellExchange)) {
      throw new ExchangeException(
          String.format(
              "Invalid exchange A-B for sell ticket : '%s' sell exchange: '%s'",
              sellTicket.getDirection(), sellExchange.getDirection()));
    }
  }

  private boolean sameDirection(CoreTicket first, CoreTicket second) {
    return first.getDirection().equals(second.getDirection());
  }

  public boolean fastValidate() throws ExchangeException {

    assert (BUY.equals(buyTicket.getDirection()));
    long buyAmount = buyExchange.getAmount() * buyExchange.getRatio();
    buyAmount /= CoreTicketProperties.ROUNDING;
    long sellAmount = sellExchange.getAmount();

    long orderDifference = sellAmount - buyAmount;
    orderDifference = Math.abs(orderDifference);

    if (orderDifference > MAX_EXCHANGE_ERROR) {
      log.error("{}", orderDifference);
      log.error(buyExchange.toString());
      log.error(sellExchange.toString());
      throw new ExchangeException(String.format(
          "Invalid validate transaction amount : %d", orderDifference));
    }
    return true;
  }

  @Override
  public String toString() {
    return String.format("%s %s -> %s %s\n", buyTicket.getPair(), buyTicket,
        sellTicket.getFinancialValue(),
        CurrencyUtils.pairToCurrency(sellTicket.getPair(), sellTicket.getDirection()))
        + " buyTicket "
        + buyTicket + " sellTicket " + sellTicket;
  }
}
