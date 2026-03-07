package org.exchange.app.backend.common.utils;

import org.exchange.app.common.api.model.EventType;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

class EventTypeUtilsTest {

  private final EventTypeUtils eventTypeUtils = new EventTypeUtils();
  @Test
  final void toObject_should_returnCorrectEventType_when_parameterIsCorrectByteArray() {
    for (EventType eventType : EventType.values()) {
      assertThat(
          eventTypeUtils.toObject(new ByteArrayData(eventTypeUtils.toByteArray(eventType, null))))
          .isEqualTo(eventType);
    }
  }

  @Test
  final void toByteArray_should_returnNULL_BYTE_when_calledWithNullDirection() {
    assertThat(eventTypeUtils.toByteArray(null, null)).isEqualTo(new byte[]{NULL_BYTE});
  }

  @Test
  final void toObject_should_nullEventType_when_calledWithNULL_BYTE() {
    assertThat(eventTypeUtils.toObject(new ByteArrayData(new byte[]{NULL_BYTE}))).isNull();
  }
}
