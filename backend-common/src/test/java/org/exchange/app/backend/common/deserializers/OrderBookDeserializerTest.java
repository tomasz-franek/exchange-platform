package org.exchange.app.backend.common.deserializers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.security.SecureRandom;
import java.util.UUID;
import org.exchange.app.backend.common.serializers.OrderBookSerializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.backend.common.utils.IntegerUtils;
import org.exchange.app.backend.common.utils.OrderBookRowUtils;
import org.exchange.app.common.api.model.OrderBookData;
import org.exchange.app.common.api.model.OrderBookRow;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class OrderBookDeserializerTest {

  private final OrderBookDeserializer deserializer = new OrderBookDeserializer();
  private final OrderBookSerializer serializer = new OrderBookSerializer();

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Test
  void deserializeStandard_should_deserializeData_when_validInput()
      throws JsonProcessingException {

    OrderBookData orderBookData = generateRandomOrderBookData();

    byte[] data = objectMapper.writeValueAsBytes(orderBookData);

    OrderBookData result = deserializer.deserializeStandard(data);

    assertThat(result).isNotNull().isEqualTo(orderBookData);
  }

  @Test
  void deserializeStandard_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() {
    byte[] inputBytes = "".getBytes();

    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeStandard(inputBytes));

    assertThat(runtimeException.getMessage()).isEqualTo("Error deserializing OrderBookData");

  }

  @Test
  void deserializeCompact_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() {
    byte[] inputBytes = "".getBytes();

    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeCompact(inputBytes));

    assertThat(runtimeException.getMessage()).isEqualTo("Error deserializing OrderBookData");

  }

  @Test
  void deserializeStandard_should_shouldReturnRuntimeException_when_inputBytesNull() {
    RuntimeException thrown = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeStandard(null));
    assertThat(thrown.getMessage()).isEqualTo("Error deserializing OrderBookData");
  }

  @Test
  void deserializeCompact_should_shouldReturnRuntimeException_when_inputBytesNull() {
    ByteArrayData data = new ByteArrayData(null);
    RuntimeException thrown = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeCompact(data));
    assertThat(thrown.getMessage()).isEqualTo("Error deserializing OrderBookData");
  }

  @Test
  void deserializeCompact_should_returnSerialized_when_alsoSerializedCompact() {
    for (int i = 0; i < 100; i++) {
      OrderBookData orderBookData = generateRandomOrderBookData();
      OrderBookData resultOrderBookData = deserializer.deserializeCompact(
          serializer.serializeCompact(orderBookData));

      validateOrderBookData(orderBookData, resultOrderBookData);

    }
  }

  @Test
  void deserializeCompact_should_returnSerialized_when_serializeEmptyObject() {
    OrderBookData orderBookData = new OrderBookData();
    OrderBookData resultOrderBookData = deserializer.deserializeCompact(
        serializer.serializeCompact(orderBookData));

    validateOrderBookData(orderBookData, resultOrderBookData);
  }

  @Test
  void deserializeStandard_should_returnSerialized_when_alsoSerializedCompact() {
    for (int i = 0; i < 100; i++) {
      OrderBookData orderBookData = generateRandomOrderBookData();
      OrderBookData resultOrderBookData = deserializer.deserializeStandard(
          serializer.serializeStandard(orderBookData));

      validateOrderBookData(orderBookData, resultOrderBookData);

    }
  }

  @Test
  void serializeCompact_should_returnByteArrayWithCorrectSize_when_methodCalled() {
    for (int i = 0; i < 10; i++) {
      OrderBookData orderBookData = generateRandomOrderBookData();
      int size = 1 + 1 + 2 * new IntegerUtils().getSize()
          + (orderBookData.getB().size() + orderBookData.getS().size())
          * new OrderBookRowUtils().getSize();
      byte[] array = serializer.serializeCompact(orderBookData);

      assertThat(array).isNotNull();
      assertThat(array).hasSize(size);

    }
  }

  @Test
  void serializeStandard_should_returnByteArrayWithCorrectSize_when_methodCalled() {
    for (int i = 0; i < 10; i++) {
      OrderBookData orderBookData = generateRandomOrderBookData();

      byte[] array = serializer.serializeStandard(orderBookData);

      assertThat(array).isNotNull();
      assertThat(array).hasSizeGreaterThan(100);

    }
  }


  public static void validateOrderBookData(OrderBookData consumedMessage,
      OrderBookData orderBookData) {
    assertThat(consumedMessage).isNotNull();
    assertThat(consumedMessage.getF()).isEqualTo(orderBookData.getF());
    assertThat(consumedMessage.getP()).isEqualTo(orderBookData.getP());
    assertThat(consumedMessage.getB()).hasSameSizeAs(orderBookData.getB());
    assertThat(consumedMessage.getS()).hasSameSizeAs(orderBookData.getS());
    for (int i = 0; i < consumedMessage.getB().size(); i++) {
      assertThat(consumedMessage.getB().get(i).getA())
          .isEqualTo(orderBookData.getB().get(i).getA());
      assertThat(consumedMessage.getB().get(i).getR())
          .isEqualTo(orderBookData.getB().get(i).getR());
    }
    for (int i = 0; i < consumedMessage.getS().size(); i++) {
      assertThat(consumedMessage.getS().get(i).getA())
          .isEqualTo(orderBookData.getS().get(i).getA());
      assertThat(consumedMessage.getS().get(i).getR())
          .isEqualTo(orderBookData.getS().get(i).getR());
    }
  }

  public static OrderBookData generateRandomOrderBookData() {
    SecureRandom random = new SecureRandom(UUID.randomUUID().toString().getBytes());
    OrderBookData orderBookData = new OrderBookData();
    int size = random.nextInt(1, 20);
    for (int i = 0; i < size; i++) {
      orderBookData.getB().add(new OrderBookRow(random.nextLong(), random.nextLong()));
    }
    size = random.nextInt(1, 20);
    for (int i = 0; i < size; i++) {
      orderBookData.getS().add(new OrderBookRow(random.nextLong(), random.nextLong()));
    }
    orderBookData.setP(Pair.values()[random.nextInt(Pair.values().length)]);
    orderBookData.setF(random.nextBoolean());
    return orderBookData;
  }
}