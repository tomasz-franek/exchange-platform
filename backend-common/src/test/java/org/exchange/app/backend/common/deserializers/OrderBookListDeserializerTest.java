package org.exchange.app.backend.common.deserializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.serializers.OrderBookListSerializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.common.api.model.OrderBookData;
import org.junit.jupiter.api.Test;

@Log4j2
class OrderBookListDeserializerTest {

  private final OrderBookListDeserializer deserializer = new OrderBookListDeserializer();
  private final OrderBookListSerializer serializer = new OrderBookListSerializer();

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Test
  public void deserializeStandard_should_deserializeData_when_validInput()
      throws JsonProcessingException {

    List<OrderBookData> orderBookDataList = generateRandomOrderBookDataList();

    byte[] data = objectMapper.writeValueAsBytes(orderBookDataList);

    List<OrderBookData> result = deserializer.deserializeStandard(data);

    assertThat(result).isNotNull();
    assertThat(result).isEqualTo(orderBookDataList);
    validateOrderBookDataList(orderBookDataList, result);
  }

  @Test
  public void deserializeStandard_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() {
    byte[] inputBytes = "".getBytes();

    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeStandard(inputBytes));

    assertThat(runtimeException.getMessage()).isEqualTo("Error deserializing List<OrderBookData>");

  }

  @Test
  public void deserializeCompact_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() {
    byte[] inputBytes = "".getBytes();

    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeCompact(inputBytes));

    assertThat(runtimeException.getMessage()).isEqualTo("Error deserializing List<OrderBookData>");

  }

  @Test
  public void deserializeStandard_should_shouldReturnRuntimeException_when_inputBytesNull() {
    RuntimeException thrown = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeStandard(null));
    assertThat(thrown.getMessage()).isEqualTo("Error deserializing List<OrderBookData>");
  }

  @Test
  public void deserializeCompact_should_shouldReturnRuntimeException_when_inputBytesNull() {
    RuntimeException thrown = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeCompact(new ByteArrayData(null)));
    assertThat(thrown.getMessage()).isEqualTo("Error deserializing List<OrderBookData>");
  }

  @Test
  public void deserializeCompact_should_returnSerialized_when_alsoSerializedCompact() {
    for (int i = 0; i < 100; i++) {
      List<OrderBookData> orderBookDataList = generateRandomOrderBookDataList();
      List<OrderBookData> resultOrderBookData = deserializer.deserializeCompact(
          serializer.serializeCompact(orderBookDataList));

      validateOrderBookDataList(orderBookDataList, resultOrderBookData);

    }
  }

  @Test
  public void deserializeCompact_should_returnSerialized_when_serializeEmptyObject() {
    List<OrderBookData> orderBookDataList = new ArrayList<>();
    List<OrderBookData> resultOrderBookData = deserializer.deserializeCompact(
        serializer.serializeCompact(orderBookDataList));

    validateOrderBookDataList(orderBookDataList, resultOrderBookData);
  }

  @Test
  public void deserializeStandard_should_returnSerialized_when_alsoSerializedCompact() {
    for (int i = 0; i < 100; i++) {
      List<OrderBookData> orderBookDataList = generateRandomOrderBookDataList();
      List<OrderBookData> resultOrderBookData = deserializer.deserializeStandard(
          serializer.serializeStandard(orderBookDataList));

      validateOrderBookDataList(orderBookDataList, resultOrderBookData);

    }
  }

  @Test
  public void serializeCompact_should_returnByteArrayWithCorrectSize_when_methodCalled() {
    for (int i = 0; i < 10; i++) {
      List<OrderBookData> orderBookDataList = generateRandomOrderBookDataList();
      byte[] array = serializer.serializeCompact(orderBookDataList);

      assertThat(array).isNotNull();

    }
  }

  @Test
  public void serializeStandard_should_returnByteArrayWithCorrectSize_when_methodCalled() {
    for (int i = 0; i < 10; i++) {
      List<OrderBookData> orderBookDataList = generateRandomOrderBookDataList();

      byte[] array = serializer.serializeStandard(orderBookDataList);

      assertThat(array).isNotNull();
      assertThat(array.length).isGreaterThan(100);

    }
  }


  @Test
  public void deserializeCompact_should_returnObject_when_allFieldsAreNulls() {
    List<OrderBookData> orderBookDataList = new ArrayList<>();
    orderBookDataList.add(new OrderBookData());

    List<OrderBookData> resultOrderBookData = deserializer.deserializeCompact(
        serializer.serializeCompact(orderBookDataList));

    validateOrderBookDataList(orderBookDataList, resultOrderBookData);
  }

  private void validateOrderBookDataList(List<OrderBookData> orderBookDataList,
      List<OrderBookData> resultOrderBookDataList) {
    int size = orderBookDataList.size();
    for (int i = 0; i < size; i++) {
      OrderBookDeserializerTest.validateOrderBookData(orderBookDataList.get(i),
          resultOrderBookDataList.get(i));
    }
  }

  public List<OrderBookData> generateRandomOrderBookDataList() {
    SecureRandom random = new SecureRandom(UUID.randomUUID().toString().getBytes());
    List<OrderBookData> orderBookDataList = new ArrayList<>();
    int size = random.nextInt(3, 20);
    for (int i = 0; i < size; i++) {
      orderBookDataList.add(OrderBookDeserializerTest.generateRandomOrderBookData());
    }
    return orderBookDataList;
  }
}