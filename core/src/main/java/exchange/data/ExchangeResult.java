package exchange.data;

import static exchange.app.api.model.Direction.BUY;

import exchange.builders.CoreTicket;
import exchange.builders.CoreTicketProperties;
import exchange.exceptions.ExchangeException;
import exchange.utils.CurrencyUtils;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;


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
  private final LocalDateTime exchangeTimeUTC;

  public ExchangeResult(final CoreTicket orderTicket, final CoreTicket oppositeTicket,
      final LocalDateTime exchangeTimeUTC) {
    this.exchangeTimeUTC = exchangeTimeUTC;
    this.orderTicket = orderTicket;
    this.oppositeTicket = oppositeTicket;
  }

  public ExchangeResult(final CoreTicket orderTicket, final CoreTicket oppositeTicket) {
    this.orderTicket = orderTicket;
    this.oppositeTicket = oppositeTicket;
    this.exchangeTimeUTC = LocalDateTime.now(ZoneOffset.UTC);
  }

  private void checkTicketAndTicketAfterExchange(final CoreTicket ticket,
      final CoreTicket ticketAfterExchange)
      throws ExchangeException {
    if (ticket.getPair() != ticketAfterExchange.getPair()) {
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
    if (ticket.getDirection() != ticketAfterExchange.getDirection()) {
      throw new ExchangeException(
          String.format("Invalid orderTicketAfterExchange exchange A->B : '%s' should be '%s'",
              ticket.getDirection(), ticketAfterExchange.getDirection()));
    }
  }

  public boolean validate() throws ExchangeException {

    if (oppositeTicket == null || orderTicket == null || oppositeExchange == null
        || orderExchange == null) {
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
    if (orderTicket.getDirection().equals(oppositeTicket.getDirection())) {
      throw new ExchangeException(
          String.format(
              "Invalid exchange A-B for opposite order ticket : '%s' opposite order : '%s'",
              orderTicket.getPair(), oppositeTicket));
    }

    if (orderTicket.getDirection().equals(orderExchange.getDirection())) {
      throw new ExchangeException(
          String.format(
              "Invalid exchange A-B for opposite order ticket : '%s' order exchange: '%s'",
              orderTicket.getDirection(), orderExchange.getDirection()));
    }

    if (oppositeTicket.getDirection().equals(oppositeExchange.getDirection())) {
      throw new ExchangeException(
          String.format(
              "Invalid exchange A-B for opposite opposite ticket : '%s' opposite exchange: '%s'",
              oppositeTicket.getDirection(), oppositeExchange.getDirection()));
    }
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
      log.error(String.format("%s", orderDifference));
      log.error(orderExchange.toString());
      log.error(oppositeExchange.toString());
      throw new ExchangeException(
          "Invalid validate transaction orderValueAmount :" + orderDifference);
    }
    return true;
  }

  @Override
  public String toString() {
    return String.format("%s %s -> %s %s\n", orderTicket.getPair(), orderTicket,
        oppositeTicket.getValue(),
        CurrencyUtils.pairToCurrency(oppositeTicket.getPair(), oppositeTicket.getDirection()))
        + "orderTicket"
        + orderTicket + "oppositeTicket" + oppositeTicket;
  }
}
