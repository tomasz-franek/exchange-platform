package org.exchange.data;

import static org.exchange.app.common.api.model.Direction.BUY;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.ObjectUtils;
import org.exchange.builders.CoreTicket;
import org.exchange.builders.CoreTicketProperties;
import org.exchange.exceptions.ExchangeException;
import org.exchange.utils.CurrencyUtils;


@Getter
@Log4j2
public final class ExchangeResult {

  private final CoreTicket orderTicket;
  private final CoreTicket oppositeTicket;
  @Setter
  private CoreTicket orderTicketAfterExchange = null;
  @Setter
  private CoreTicket oppositeTicketAfterExchange = null;
  @Setter
  private CoreTicket oppositeExchange = null;
  @Setter
  private CoreTicket orderExchange = null;
  private final long exchangeEpochUTC;

  public ExchangeResult(final CoreTicket orderTicket, final CoreTicket oppositeTicket,
      final long exchangeEpochUTC) {
    this.exchangeEpochUTC = exchangeEpochUTC;
    this.orderTicket = orderTicket;
    this.oppositeTicket = oppositeTicket;
  }

  public ExchangeResult(final CoreTicket orderTicket, final CoreTicket oppositeTicket) {
    this.orderTicket = orderTicket;
    this.oppositeTicket = oppositeTicket;
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

    if (ObjectUtils.anyNull(oppositeTicket,
        orderTicket,
        oppositeExchange,
        orderExchange)) {
      return false;
    }

    if (!BUY.equals(orderTicket.getDirection())) {
      return false;
    }

    if (BUY.equals(oppositeTicket.getDirection())) {
      return false;
    }

    if (orderTicketAfterExchange != null) {
      checkTicketAndTicketAfterExchange(orderTicket, orderTicketAfterExchange);
    }

    if (oppositeTicketAfterExchange != null) {
      checkTicketAndTicketAfterExchange(oppositeTicket, oppositeTicketAfterExchange);
    }

    validateDirection();
    validateValueAmount();

    return fastValidate();
  }

  private void validateValueAmount() throws ExchangeException {
    long exchange = oppositeExchange.getValue();
    if (orderTicket.getValue() - orderTicketAfterExchange.getValue() != exchange) {
      throw new ExchangeException(String.format(
          "Invalid amount : orderTicket '%s' orderTicketAfterExchange: '%s'  oppositeExchange: '%s'",
          orderTicket.getValue(), orderTicketAfterExchange.getValue(), exchange));
    }

    exchange = orderExchange.getValue();
    if (oppositeTicket.getValue() - oppositeTicketAfterExchange.getValue() != exchange) {
      throw new ExchangeException(String.format(
          "Invalid amount : oppositeTicket '%s' oppositeTicketAfterExchange: '%s'  orderExchange: '%s'",
          oppositeTicket.getValue(), oppositeTicketAfterExchange.getValue(), exchange));
    }
  }

  private void validateDirection() throws ExchangeException {
    if (sameDirection(orderTicket, oppositeTicket)) {
      throw new ExchangeException(
          String.format(
              "Invalid exchange A-B for opposite order ticket : '%s' opposite order : '%s'",
              orderTicket.getPair(), oppositeTicket));
    }
    if (sameDirection(orderTicket, orderExchange)) {
      throw new ExchangeException(
          String.format(
              "Invalid exchange A-B for opposite order ticket : '%s' order exchange: '%s'",
              orderTicket.getDirection(), orderExchange.getDirection()));
    }

    if (sameDirection(oppositeTicket, oppositeExchange)) {
      throw new ExchangeException(
          String.format(
              "Invalid exchange A-B for opposite opposite ticket : '%s' opposite exchange: '%s'",
              oppositeTicket.getDirection(), oppositeExchange.getDirection()));
    }
  }

  private boolean sameDirection(CoreTicket first, CoreTicket second) {
    return first.getDirection().equals(second.getDirection());
  }

  public boolean fastValidate() throws ExchangeException {

    assert (BUY.equals(orderTicket.getDirection()));
    long orderValueAmount = orderExchange.getValue() * orderExchange.getRatio();
    orderValueAmount /= CoreTicketProperties.ROUNDING * CoreTicketProperties.ROUNDING;
    long oppositeOrderValueAmount = oppositeExchange.getValue();

    long orderDifference = oppositeOrderValueAmount - orderValueAmount;
    orderDifference = Math.abs(orderDifference);

    final long maxExchangeError = CoreTicketProperties.ROUNDING * orderExchange.getRatio();
    if (maxExchangeError < orderDifference) {
      log.error("{}", orderDifference);
      log.error(orderExchange.toString());
      log.error(oppositeExchange.toString());
      throw new ExchangeException(String.format(
          "Invalid validate transaction orderValueAmount : %d", orderDifference));
    }
    return true;
  }

  @Override
  public String toString() {
    return String.format("%s %s -> %s %s\n", orderTicket.getPair(), orderTicket,
        oppositeTicket.getFinancialValue(),
        CurrencyUtils.pairToCurrency(oppositeTicket.getPair(), oppositeTicket.getDirection()))
        + "orderTicket"
        + orderTicket + "oppositeTicket" + oppositeTicket;
  }
}
