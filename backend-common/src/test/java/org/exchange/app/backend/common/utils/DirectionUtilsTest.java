package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.Direction;
import org.junit.jupiter.api.Test;

public class DirectionUtilsTest {

  DirectionUtils directionUtils = new DirectionUtils();
  @Test
  public final void toObject_should_returnDirection_when_calledWithByteArrayDirectionRepresentation() {
    for (Direction direction : Direction.values()) {
      assertThat(directionUtils.toObject(
          new ByteArrayData(directionUtils.toByteArray(direction, null)))).isEqualTo(
          direction);
    }
  }

  @Test
  public final void toObject_should_returnNULL_BYTE_when_calledWithNullDirection() {
    assertThat(directionUtils.toByteArray(null, null)).isEqualTo(new byte[]{NULL_BYTE});
  }

  @Test
  public final void toObject_should_nullDirection_when_calledWithNULL_BYTE() {
    assertThat(directionUtils.toObject(new ByteArrayData(new byte[]{NULL_BYTE}))).isNull();
  }
}
