package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.UserTicketStatus;

public class UserTicketStatusUtils implements SerializationUtils<UserTicketStatus> {

  @Override
  public int getSize() {
    return 1;
  }

  @Override
  public byte[] toByteArray(UserTicketStatus userTicketStatus, ByteArrayData data) {
    byte[] current;
    if (userTicketStatus != null) {
      switch (userTicketStatus) {

        case NEW -> current = new byte[]{(byte) 0};
        case ACTIVE -> current = new byte[]{(byte) 1};
        case PARTIAL_REALIZED -> current = new byte[]{(byte) 2};
        case REALIZED -> current = new byte[]{(byte) 3};
        case CANCELLED -> current = new byte[]{(byte) 4};
        case PARTIAL_CANCELED -> current = new byte[]{(byte) 5};
        default -> throw new IllegalStateException(
            String.format("Can't serialize object UserTicketStatus: %s", userTicketStatus));
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
  public UserTicketStatus toObject(ByteArrayData data) {
    if (data.bytes.length - data.position < getSize()) {
      throw new IllegalArgumentException("Byte array must be 1 or more bytes.");
    }
    if (data.bytes[data.position] == NULL_BYTE) {
      data.position += getSize();
      return null;
    }
    try {
      return UserTicketStatus.values()[data.bytes[data.position++]];
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing UserTicketStatus", e);
    }
  }
}
