package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;
import static org.exchange.app.common.api.model.Direction.BUY;

import jakarta.validation.constraints.NotNull;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;

public class CurrencyUtils implements SerializationUtils<Currency> {

  public static int getSize() {
    return 1;
  }

  @Override
  public byte[] toByteArray(Currency currency, ByteArrayData data) {
    byte[] current;
    if (currency == null) {
      current = new byte[]{NULL_BYTE};
    } else {
      switch (currency) {
        case EUR -> current = new byte[]{(byte) 0};
        case USD -> current = new byte[]{(byte) 1};
        case GBP -> current = new byte[]{(byte) 2};
        case CHF -> current = new byte[]{(byte) 3};
        case PLN -> current = new byte[]{(byte) 4};
        default -> throw new IllegalStateException(
            String.format("Can't serialize object EventType: %s", currency));
      }
    }
    if (data != null) {
      System.arraycopy(current, 0, data.bytes, data.position, getSize());
      data.position += getSize();
    }
    return current;
  }

  @Override
  public Currency toObject(ByteArrayData data) {
    if (data.bytes.length - data.position < getSize()) {
      throw new IllegalArgumentException("Byte array must be 1 or more bytes.");
    }
    if (data.bytes[data.position] == NULL_BYTE) {
      data.position += getSize();
      return null;
    }

    try {
      return Currency.values()[data.bytes[data.position++]];
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing Currency", e);
    }
  }

  public static String pairToCurrency(final @NotNull CoreTicket coreTicket) {
    return pairToCurrency(coreTicket.getPair(), coreTicket.getDirection());
  }

  public static String pairToCurrency(final @NotNull UserTicket userTicket) {
    return pairToCurrency(userTicket.getPair(), userTicket.getDirection());
  }

  public static String pairToCurrency(final @NotNull Pair currencyChange,
      final @NotNull Direction direction) {
    if (currencyChange == null || direction == null) {
      return "";
    }
    if (BUY.equals(direction)) {
      return currencyChange.name().split("_")[1];
    } else {
      return currencyChange.name().split("_")[0];
    }
  }

  public static String pairReverseCurrencyString(final @NotNull CoreTicket coreTicket) {
    return pairReverseCurrencyString(coreTicket.getPair(), coreTicket.getDirection());
  }

  public static String pairReverseCurrencyString(final @NotNull UserTicket userTicket) {
    return pairReverseCurrencyString(userTicket.getPair(), userTicket.getDirection());
  }

  public static String pairReverseCurrencyString(final @NotNull Pair currencyChange,
      final @NotNull Direction direction) {
    if (currencyChange == null || direction == null) {
      return "";
    }
    if (BUY.equals(direction)) {
      return currencyChange.name().split("_")[0];
    } else {
      return currencyChange.name().split("_")[1];
    }
  }

  public static Currency pairReverseCurrency(final @NotNull Pair currencyChange,
      final @NotNull Direction direction) {
    if (currencyChange == null || direction == null) {
      return null;
    }
    if (BUY.equals(direction)) {
      return Currency.valueOf(currencyChange.name().split("_")[0]);
    } else {
      return Currency.valueOf(currencyChange.name().split("_")[1]);
    }
  }

}
