package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.OrderBookRow;

public class OrderBookRowUtils implements SerializationUtils<OrderBookRow> {

  private final LongUtils longUtils = new LongUtils();

  @Override
  public int getSize() {
    return 19;
  }

  @Override
  public byte[] toByteArray(OrderBookRow orderBookRow, ByteArrayData data) {
    byte[] current;
    if (orderBookRow == null) {
      current = new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
          NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
          NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE};
    } else {
      current = new byte[getSize()];
      current[0] = (byte) 1;
      ByteArrayData currentArrayData = new ByteArrayData(current);
      currentArrayData.position++;
      longUtils.toByteArray(orderBookRow.getA(), currentArrayData);
      longUtils.toByteArray(orderBookRow.getR(), currentArrayData);
    }
    if (data != null) {
      System.arraycopy(current, 0, data.bytes, data.position, getSize());
      data.position += getSize();
    }
    return current;
  }

  @Override
  public OrderBookRow toObject(ByteArrayData byteArrayData) {
    if (byteArrayData.bytes.length - byteArrayData.position < getSize()) {
      throw new IllegalArgumentException("Byte array must be 19 or more bytes long.");
    }
    if (byteArrayData.bytes[byteArrayData.position] == NULL_BYTE) {
      byteArrayData.position += getSize();
      return null;
    } else {
      byteArrayData.position++;
      OrderBookRow orderBookRow = new OrderBookRow();
      orderBookRow.setA(longUtils.toObject(byteArrayData));
      orderBookRow.setR(longUtils.toObject(byteArrayData));
      return orderBookRow;
    }
  }
}
