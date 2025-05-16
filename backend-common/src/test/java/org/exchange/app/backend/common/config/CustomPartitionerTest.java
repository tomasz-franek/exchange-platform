package org.exchange.app.backend.common.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class CustomPartitionerTest {

  @Test
  public void partition_should_returnCorrectNumber_when_correctPair() {
    try (CustomPartitioner customPartitioner = new CustomPartitioner()) {
      for (Pair pair : Pair.values()) {
        assertThat(customPartitioner.partition("", pair, null, null, null, null)).isNotEqualTo(
            CustomPartitioner.WRONG_PARTITION);
      }
    }
  }

  @Test
  public void partition_should_returnWrongPartitionNumber_when_nullPairKey() {
    try (CustomPartitioner customPartitioner = new CustomPartitioner()) {
      Pair pair = null;
      assertThat(customPartitioner.partition("", pair, null, null, null, null)).isEqualTo(
          CustomPartitioner.WRONG_PARTITION);
    }
  }

  @Test
  public void partition_should_returnCorrectNumber_when_correctPairString() {
    try (CustomPartitioner customPartitioner = new CustomPartitioner()) {
      for (Pair pair : Pair.values()) {
        assertThat(
            customPartitioner.partition("", pair.toString(), null, null, null, null)).isNotEqualTo(
            CustomPartitioner.WRONG_PARTITION);
      }
    }
  }

  @Test
  public void partition_should_returnWrongPartitionNumber_when_emptyStringKey() {
    try (CustomPartitioner customPartitioner = new CustomPartitioner()) {
      assertThat(customPartitioner.partition("", "", null, null, null, null)).isEqualTo(
          CustomPartitioner.WRONG_PARTITION);
    }
  }

  @Test
  public void partition_should_returnWrongPartitionNumber_when_wrongKey() {
    try (CustomPartitioner customPartitioner = new CustomPartitioner()) {
      assertThat(customPartitioner.partition("", "EUR_EUR", null, null, null, null)).isEqualTo(
          CustomPartitioner.WRONG_PARTITION);
    }
  }
}