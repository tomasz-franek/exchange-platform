package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.EventType;

public class EventTypeUtils implements SerializationUtils<EventType> {

  public static int getSize() {
    return 1;
  }

  @Override
  public byte[] toByteArray(EventType eventType, ByteArrayData data) {
    byte[] current;
    if (eventType != null) {
      switch (eventType) {
        case DEPOSIT -> current = new byte[]{(byte) 0};
        case WITHDRAW -> current = new byte[]{(byte) 1};
        case ORDER -> current = new byte[]{(byte) 2};
        case EXCHANGE -> current = new byte[]{(byte) 3};
        case CORRECTION -> current = new byte[]{(byte) 4};
        case FEE -> current = new byte[]{(byte) 5};
        case CANCEL -> current = new byte[]{(byte) 6};
        default -> throw new IllegalStateException(
            String.format("Can't serialize object EventType: %s", eventType));
      }

    } else {
      current = new byte[]{NULL_BYTE};
    }
    if (data != null) {
      System.arraycopy(current, 0, data.bytes, data.position, getSize());
      data.position += getSize();
    }
    return current;
  }

  @Override
  public EventType toObject(ByteArrayData data) {
    if (data.bytes.length - data.position < getSize()) {
      throw new IllegalArgumentException("Byte array must be 1 or more bytes.");
    }
    if (data.bytes[data.position] == NULL_BYTE) {
      data.position += getSize();
      return null;
    }
    try {
      return EventType.values()[data.bytes[data.position++]];
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing EventType", e);
    }
  }
}
