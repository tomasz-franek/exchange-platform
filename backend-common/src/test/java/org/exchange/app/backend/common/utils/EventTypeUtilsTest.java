package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.EventType;
import org.junit.jupiter.api.Test;

public class EventTypeUtilsTest {

  @Test
  public final void eventTypeToByteArray_should_returnCorrectEventType_when_parameterIsCorrectByteArray() {
    for (EventType eventType : EventType.values()) {
      assertThat(EventTypeUtils.byteArrayToEventType(
          EventTypeUtils.eventTypeToByteArray(eventType))).isEqualTo(
          eventType);
    }
  }

  @Test
  public final void eventTypeToByteArray_should_returnNULL_BYTE_when_calledWithNullDirection() {
    assertThat(EventTypeUtils.eventTypeToByteArray(null)).isEqualTo(new byte[]{NULL_BYTE});
  }

  @Test
  public final void byteArrayToEventType_should_nullEventType_when_calledWithNULL_BYTE() {
    assertThat(EventTypeUtils.byteArrayToEventType(new byte[]{NULL_BYTE})).isNull();
  }
}
