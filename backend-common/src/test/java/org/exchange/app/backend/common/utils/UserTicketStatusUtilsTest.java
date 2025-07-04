package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.Test;

public class UserTicketStatusUtilsTest {

  @Test
  public final void byteArrayToEventType() {
    for (UserTicketStatus userTicketStatus : UserTicketStatus.values()) {
      assertThat(UserTicketStatusUtils.byteArrayToUserTicketStatus(
          UserTicketStatusUtils.userTicketStatusToByteArray(userTicketStatus))).isEqualTo(
          userTicketStatus);
    }
  }
}
