package org.exchange.internal.app.core.data;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import org.exchange.app.internal.api.model.ExchangeTicket;
import org.exchange.app.internal.api.model.OrderTicket;
import org.junit.jupiter.api.Test;

class ExchangeFeeCalculatorTest {


  @Test
  void calculateTransactionFee_shouldCalculateTransactionFee_when_validInput() {
    // Arrange
    ExchangeTicket ticket1 = new ExchangeTicket();
    ticket1.setAmount(5_0000L);
    ExchangeTicket ticket2 = new ExchangeTicket();
    ticket2.setAmount(3_0000L);

    long feePercent = 200L; // 0.2%
    OrderTicket orderTicket = new OrderTicket();
    List<ExchangeTicket> ticketList = new ArrayList<>();
    ticketList.add(ticket1);
    ticketList.add(ticket2);
    OrderSummary orderSummary = new OrderSummary(orderTicket, ticketList);
    ExchangeFee exchangeFee = new ExchangeFee(orderSummary, feePercent);

    // Act
    long fee = ExchangeFeeCalculator.calculateTransactionFee(exchangeFee);

    // Assert
    assertThat(fee).isEqualTo(1600L); // (5000 + 3000) * 200 / 1_0000
  }

  @Test
  void calculateTransactionFee_should_returnWrongFee_when_zeroAmountOfExchangeTicket() {
    // Arrange
    ExchangeTicket ticket = new ExchangeTicket();
    ticket.setAmount(0L);

    long feePercent = 200L; // 0.2%
    OrderTicket orderTicket = new OrderTicket();
    List<ExchangeTicket> ticketList = new ArrayList<>();
    ticketList.add(ticket);
    OrderSummary orderSummary = new OrderSummary(orderTicket, ticketList);
    ExchangeFee exchangeFee = new ExchangeFee(orderSummary, feePercent);
    // Act
    long fee = ExchangeFeeCalculator.calculateTransactionFee(exchangeFee);

    // Assert
    assertThat(fee).isEqualTo(-1);
  }

  @Test
  void calculateTransactionFee_should_returnWrongFee_when_negativeAmount() {
    // Arrange
    ExchangeTicket ticket = new ExchangeTicket();
    ticket.setAmount(-1000L);

    long feePercent = 200L; // 0.2%
    OrderTicket orderTicket = new OrderTicket();
    List<ExchangeTicket> ticketList = new ArrayList<>();
    ticketList.add(ticket);
    OrderSummary orderSummary = new OrderSummary(orderTicket, ticketList);
    ExchangeFee exchangeFee = new ExchangeFee(orderSummary, feePercent);

    // Act
    long fee = ExchangeFeeCalculator.calculateTransactionFee(exchangeFee);

    // Assert
    assertThat(fee).isEqualTo(-1);
  }

  @Test
  void calculateTransactionFee_should_returnZeroFee_when_emptyTicketList() {
    // Arrange
    long feePercent = 200L; // 0.2%
    OrderTicket orderTicket = new OrderTicket();
    List<ExchangeTicket> ticketList = new ArrayList<>();
    OrderSummary orderSummary = new OrderSummary(orderTicket, ticketList);
    ExchangeFee exchangeFee = new ExchangeFee(orderSummary, feePercent);

    // Act
    long fee = ExchangeFeeCalculator.calculateTransactionFee(exchangeFee);

    // Assert
    assertThat(fee).isEqualTo(0);
  }

  @Test
  void calculateTransactionFee_should_returnWrongFee_when_nullTicketAmount() {
    // Arrange
    ExchangeTicket ticket = new ExchangeTicket();
    ticket.setAmount(null);

    long feePercent = 200L; // 0.2%
    OrderTicket orderTicket = new OrderTicket();
    List<ExchangeTicket> ticketList = new ArrayList<>();
    ticketList.add(ticket);
    OrderSummary orderSummary = new OrderSummary(orderTicket, ticketList);
    ExchangeFee exchangeFee = new ExchangeFee(orderSummary, feePercent);

    // Act
    long fee = ExchangeFeeCalculator.calculateTransactionFee(exchangeFee);

    // Assert
    assertThat(fee).isEqualTo(-1);
  }

  @Test
  void calculateTransactionFee_should_returnMinimumFee_when_calculatedFeeLessThanMinimumFee() {
    // Arrange
    ExchangeTicket ticket1 = new ExchangeTicket();
    ticket1.setAmount(1000L);

    long feePercent = 50L; // 0.05%
    OrderTicket orderTicket = new OrderTicket();
    List<ExchangeTicket> ticketList = new ArrayList<>();
    ticketList.add(ticket1);
    OrderSummary orderSummary = new OrderSummary(orderTicket, ticketList);
    ExchangeFee exchangeFee = new ExchangeFee(orderSummary, feePercent);

    // Act
    long fee = ExchangeFeeCalculator.calculateTransactionFee(exchangeFee);

    // Assert
    assertThat(fee).isEqualTo(100);
  }

  @Test
  void calculateTransactionFee_should_returnWrongFee_whenExchangeTicketOnListIsNullObject() {
    // Arrange
    long feePercent = 200L; // 0.2%
    OrderTicket orderTicket = new OrderTicket();
    List<ExchangeTicket> ticketList = new ArrayList<>();
    ticketList.add(null);
    OrderSummary orderSummary = new OrderSummary(orderTicket, ticketList);
    ExchangeFee exchangeFee = new ExchangeFee(orderSummary, feePercent);

    // Act
    long fee = ExchangeFeeCalculator.calculateTransactionFee(exchangeFee);

    // Assert
    assertThat(fee).isEqualTo(-1);
  }
}