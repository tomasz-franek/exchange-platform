package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;
import static org.exchange.app.common.api.model.Direction.BUY;

import jakarta.validation.constraints.NotNull;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;

public class CurrencyUtils implements SerialisationUtils<String> {

  @Override
  public int getSize() {
    return 4;
  }

  @Override
  public byte[] toByteArray(String currency, ByteArrayData data) {
    byte[] current;
    if (currency == null) {
      current = new byte[]{NULL_BYTE, 0, 0, 0};
    } else {
      current = new byte[]{0,
          (byte) currency.charAt(0),
          (byte) currency.charAt(1),
          (byte) currency.charAt(2),
      };
    }
    if (data != null) {
      System.arraycopy(current, 0, data.bytes, data.position, getSize());
      data.position += getSize();
    }
    return current;
  }

  @Override
  public String toObject(byte[] bytes) {
    if (bytes[0] == NULL_BYTE) {
      return null;
    }
    if (bytes.length != getSize()) {
      throw new IllegalArgumentException("Byte array must be exactly 4 byte.");
    }
    return new String(bytes, 1, 3);
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
