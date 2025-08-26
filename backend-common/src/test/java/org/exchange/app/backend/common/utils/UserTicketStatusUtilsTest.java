package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.Test;

public class UserTicketStatusUtilsTest {

  UserTicketStatusUtils userTicketStatusUtils = new UserTicketStatusUtils();
  @Test
  public final void userTicketStatusToByteArray_should_getCorrectUserTicketStatus_when_inputIsCorrectByteArray() {
    for (UserTicketStatus userTicketStatus : UserTicketStatus.values()) {
      assertThat(userTicketStatusUtils.toObject(
          new ByteArrayData(userTicketStatusUtils.toByteArray(userTicketStatus, null)))).isEqualTo(
          userTicketStatus);
    }
  }

  @Test
  public final void byteArrayToUserTicketStatus_should_returnNullUserTicketStatus_when_inputIsNULL_BYTE() {
    assertThat(userTicketStatusUtils.toObject(new ByteArrayData(new byte[]{NULL_BYTE}))).isNull();

  }

  @Test
  public final void userTicketStatusToByteArray_should_returnNULL_BYTE_when_inputIsNullUserTicketStatus() {
    assertThat(userTicketStatusUtils.toByteArray(null, null)).isEqualTo(
        new byte[]{NULL_BYTE});

  }
}
