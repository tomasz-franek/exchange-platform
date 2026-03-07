package org.exchange.app.backend.common.utils;

import org.exchange.app.common.api.model.Direction;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

class DirectionUtilsTest {

  DirectionUtils directionUtils = new DirectionUtils();
  @Test
  final void toObject_should_returnDirection_when_calledWithByteArrayDirectionRepresentation() {
    for (Direction direction : Direction.values()) {
      assertThat(directionUtils.toObject(
          new ByteArrayData(directionUtils.toByteArray(direction, null)))).isEqualTo(
          direction);
    }
  }

  @Test
  final void toObject_should_returnNULL_BYTE_when_calledWithNullDirection() {
    assertThat(directionUtils.toByteArray(null, null)).isEqualTo(new byte[]{NULL_BYTE});
  }

  @Test
  final void toObject_should_nullDirection_when_calledWithNULL_BYTE() {
    assertThat(directionUtils.toObject(new ByteArrayData(new byte[]{NULL_BYTE}))).isNull();
  }
}
