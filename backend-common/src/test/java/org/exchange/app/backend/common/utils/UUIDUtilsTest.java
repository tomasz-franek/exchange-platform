package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.util.UUID;
import org.junit.jupiter.api.Test;

class UUIDUtilsTest {

  @Test
  void uuidToByteArray() {
    for (int i = 0; i < 1000; i++) {
      UUID randomUUid = UUID.randomUUID();
      assertThat(UUIDUtils.byteArrayToUUID(UUIDUtils.uuidToByteArray(randomUUid))).isEqualTo(
          randomUUid);
    }
  }
}