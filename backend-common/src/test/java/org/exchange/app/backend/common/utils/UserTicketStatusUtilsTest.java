package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.Test;

public class UserTicketStatusUtilsTest {

  @Test
  public final void userTicketStatusToByteArray_should_getCorrectUserTicketStatus_when_inputIsCorrectByteArray() {
    for (UserTicketStatus userTicketStatus : UserTicketStatus.values()) {
      assertThat(UserTicketStatusUtils.byteArrayToUserTicketStatus(
          UserTicketStatusUtils.userTicketStatusToByteArray(userTicketStatus))).isEqualTo(
          userTicketStatus);
    }
  }

  @Test
  public final void byteArrayToUserTicketStatus_should_returnNullUserTicketStatus_when_inputIsNULL_BYTE() {
    assertThat(UserTicketStatusUtils.byteArrayToUserTicketStatus(new byte[]{NULL_BYTE})).isNull();

  }

  @Test
  public final void userTicketStatusToByteArray_should_returnNULL_BYTE_when_inputIsNullUserTicketStatus() {
    assertThat(UserTicketStatusUtils.userTicketStatusToByteArray(null)).isEqualTo(
        new byte[]{NULL_BYTE});

  }
}
