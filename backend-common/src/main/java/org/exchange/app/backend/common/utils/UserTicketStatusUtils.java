package org.exchange.app.backend.common.utils;

import org.exchange.app.common.api.model.UserTicketStatus;

public class UserTicketStatusUtils {

  public static byte[] userTicketStatusToByteArray(UserTicketStatus userTicketStatus) {
    if (userTicketStatus != null) {
      switch (userTicketStatus) {

        case NEW -> {
          return new byte[]{(byte) 0};
        }
        case ACTIVE -> {
          return new byte[]{(byte) 1};
        }
        case PARTIAL_REALIZED -> {
          return new byte[]{(byte) 2};
        }
        case REALIZED -> {
          return new byte[]{(byte) 3};
        }
        case CANCELLED -> {
          return new byte[]{(byte) 4};
        }
        case PARTIAL_CANCELED -> {
          return new byte[]{(byte) 5};
        }
        default -> throw new IllegalStateException(
            String.format("Can't serialize object UserTicketStatus: %s", userTicketStatus));
      }

    } else {
      throw new IllegalStateException("Can't serialize object UserTicketStatus: null");
    }
  }

  public static UserTicketStatus byteArrayToUserTicketStatus(byte[] bytes) {
    if (bytes.length != 1) {
      throw new IllegalArgumentException("Byte array must be exactly 1 byte.");
    }
    try {
      return UserTicketStatus.values()[bytes[0]];
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing UserTicketStatus", e);
    }
  }
}
