package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.Direction;
import org.junit.jupiter.api.Test;

public class DirectionUtilsTest {

  @Test
  public final void byteArrayToDirection_should_returnDirection_when_calledWithByteArrayDirectionRepresentation() {
    for (Direction direction : Direction.values()) {
      assertThat(DirectionUtils.byteArrayToDirection(
          DirectionUtils.directionToByteArray(direction))).isEqualTo(
          direction);
    }
  }

  @Test
  public final void directionToByteArray_should_returnNULL_BYTE_when_calledWithNullDirection() {
    assertThat(DirectionUtils.directionToByteArray(null)).isEqualTo(new byte[]{NULL_BYTE});
  }

  @Test
  public final void byteArrayToDirection_should_nullDirection_when_calledWithNULL_BYTE() {
    assertThat(DirectionUtils.byteArrayToDirection(new byte[]{NULL_BYTE})).isNull();
  }
}
