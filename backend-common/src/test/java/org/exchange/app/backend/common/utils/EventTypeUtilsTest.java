package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.exchange.app.common.api.model.EventType;
import org.junit.jupiter.api.Test;

public class EventTypeUtilsTest {

  @Test
  public final void byteArrayToEventType() {
    for (EventType eventType : EventType.values()) {
      assertThat(EventTypeUtils.byteArrayToEventType(
          EventTypeUtils.eventTypeToByteArray(eventType))).isEqualTo(
          eventType);
    }
  }
}
