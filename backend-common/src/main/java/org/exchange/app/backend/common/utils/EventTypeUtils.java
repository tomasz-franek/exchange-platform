package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.EventType;

public class EventTypeUtils {

  public static byte[] eventTypeToByteArray(EventType eventType) {
    if (eventType != null) {
      switch (eventType) {
        case DEPOSIT -> {
          return new byte[]{(byte) 0};
        }
        case WITHDRAW -> {
          return new byte[]{(byte) 1};
        }
        case ORDER -> {
          return new byte[]{(byte) 2};
        }
        case EXCHANGE -> {
          return new byte[]{(byte) 3};
        }
        case CORRECTION -> {
          return new byte[]{(byte) 4};
        }
        case FEE -> {
          return new byte[]{(byte) 5};
        }
        case CANCEL -> {
          return new byte[]{(byte) 6};
        }
        default -> throw new IllegalStateException(
            String.format("Can't serialize object EventType: %s", eventType));
      }

    } else {
      return new byte[]{NULL_BYTE};
    }
  }

  public static EventType byteArrayToEventType(byte[] bytes) {
    if (bytes.length != 1) {
      throw new IllegalArgumentException("Byte array must be exactly 1 byte.");
    }
    if (bytes[0] == NULL_BYTE) {
      return null;
    }
    try {
      return EventType.values()[bytes[0]];
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing EventType", e);
    }
  }
}
