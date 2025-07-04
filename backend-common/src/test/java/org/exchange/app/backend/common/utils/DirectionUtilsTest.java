package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.exchange.app.common.api.model.Direction;
import org.junit.jupiter.api.Test;

public class DirectionUtilsTest {

  @Test
  public final void byteArrayToDirection() {
    for (Direction direction : Direction.values()) {
      assertThat(DirectionUtils.byteArrayToDirection(
          DirectionUtils.directionToByteArray(direction))).isEqualTo(
          direction);
    }
  }
}
