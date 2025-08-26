package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;
import org.junit.jupiter.api.Test;

class UUIDUtilsTest {

  private final UUIDUtils uuidUtils = new UUIDUtils();
  @Test
  void toObject_should_returnUuidAreSameAsOriginal_when_methodCalled() {
    for (int i = 0; i < 1000; i++) {
      UUID randomUUid = UUID.randomUUID();
      assertThat(
          uuidUtils.toObject(new ByteArrayData(uuidUtils.toByteArray(randomUUid, null)))).isEqualTo(
          randomUUid);
    }
  }

  @Test
  void toByteArray_should_returnArrayWithZeros_when_methodCalledWithNullUuid() {
    byte[] serializedPair = uuidUtils.toByteArray(null, null);
		assertThat(serializedPair.length).isEqualTo(17);
    for (byte b : serializedPair) {
			assertThat(b).isEqualTo(NULL_BYTE);
    }

  }

  @Test
  public final void toByteArray_should_returnNULL_BYTE_when_calledWithNullUUID() {
    assertThat(uuidUtils.toByteArray(null, null)).isEqualTo(
        new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
            NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
            NULL_BYTE, NULL_BYTE});
  }

  @Test
  public final void toObject_should_nullUUID_when_calledWithNULL_BYTE() {
    assertThat(
        uuidUtils.toObject(
            new ByteArrayData(
                new byte[]{NULL_BYTE, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}))).isNull();
  }

  @Test
  public final void toObject_should_throwException_when_calledWithLengthLessThan17Bytes() {
    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> uuidUtils.toObject(new ByteArrayData(new byte[]{1, 2, 3, 4}))
    );

    assertThat(runtimeException.getMessage())
        .isEqualTo("Byte array must be 17 or more bytes long.");
  }
}