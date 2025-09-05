package org.exchange.app.backend.common.deserializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.security.SecureRandom;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.serializers.UserTicketSerializer;
import org.exchange.app.backend.common.utils.ByteArrayData;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.Test;

@Log4j2
public class UserTicketDeserializerTest {

  private final UserTicketDeserializer deserializer = new UserTicketDeserializer();
  private final UserTicketSerializer serializer = new UserTicketSerializer();

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Test
  public void deserializeStandard_should_deserializeData_when_validInput()
      throws JsonProcessingException {

    UserTicket userTicket = generateRandomTicket();

    byte[] data = objectMapper.writeValueAsBytes(userTicket);

    UserTicket result = deserializer.deserializeStandard(data);

    assertThat(result).isNotNull();
    assertThat(result).isEqualTo(userTicket);
  }

  @Test
  public void deserializeStandard_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() {
    byte[] inputBytes = "".getBytes();

    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeStandard(inputBytes));

    assertThat(runtimeException.getMessage()).isEqualTo("Error deserializing UserTicket");

  }

  @Test
  public void deserializeCompact_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() {
    byte[] inputBytes = "".getBytes();

    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeCompact(inputBytes));

    assertThat(runtimeException.getMessage()).isEqualTo("Error deserializing UserTicket");

  }

  @Test
  public void deserializeStandard_should_shouldReturnRuntimeException_when_inputBytesNull() {
    RuntimeException thrown = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeStandard(null));
    assertThat(thrown.getMessage()).isEqualTo("Error deserializing UserTicket");
  }

  @Test
  public void deserializeCompact_should_shouldReturnRuntimeException_when_inputBytesNull() {
    RuntimeException thrown = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeCompact(new ByteArrayData(null)));
    assertThat(thrown.getMessage()).isEqualTo("Error deserializing UserTicket");
  }

  @Test
  public void deserializeCompact_should_returnSerialized_when_alsoSerializedCompact() {
    for (int i = 0; i < 100; i++) {
      UserTicket userTicket = generateRandomTicket();
      UserTicket resultTicket = deserializer.deserializeCompact(
          serializer.serializeCompact(userTicket));

      validateConsumedMessage(userTicket, resultTicket);

    }
  }

  @Test
  public void deserializeStandard_should_returnSerialized_when_alsoSerializedCompact() {
    for (int i = 0; i < 100; i++) {
      UserTicket userTicket = generateRandomTicket();
      UserTicket resultTicket = deserializer.deserializeStandard(
          serializer.serializeStandard(userTicket));

      validateConsumedMessage(userTicket, resultTicket);

    }
  }

  @Test
  public void serializeCompact_should_returnByteArrayWithCorrectSize_when_methodCalled() {
    for (int i = 0; i < 10; i++) {
      UserTicket userTicket = generateRandomTicket();

      byte[] array = serializer.serializeCompact(userTicket);

      assertThat(array).isNotNull();
      assertThat(array.length).isEqualTo(UserTicketSerializer.getSize());

    }
  }

  @Test
  public void serializeStandard_should_returnByteArrayWithCorrectSize_when_methodCalled() {
    for (int i = 0; i < 10; i++) {
      UserTicket userTicket = generateRandomTicket();

      byte[] array = serializer.serializeStandard(userTicket);

      assertThat(array).isNotNull();
      assertThat(array.length).isGreaterThan(245);

    }
  }


  @Test
  public void deserializeCompact_should_returnObject_when_allFieldsAreNulls() {
    UserTicket userTicket = new UserTicket();

    UserTicket resultTicket = deserializer.deserializeCompact(
        serializer.serializeCompact(userTicket));

    validateConsumedMessage(userTicket, resultTicket);
  }

  public static void validateConsumedMessage(UserTicket consumedMessage, UserTicket userTicket) {
    assertThat(consumedMessage).isNotNull();
    assertThat(userTicket.getId()).isEqualTo(consumedMessage.getId());
    assertThat(userTicket.getAmount()).isEqualTo(consumedMessage.getAmount());
    assertThat(userTicket.getRatio()).isEqualTo(consumedMessage.getRatio());
    assertThat(userTicket.getUserId()).isEqualTo(consumedMessage.getUserId());
    assertThat(userTicket.getUserAccountId()).isEqualTo(consumedMessage.getUserAccountId());
    assertThat(userTicket.getPair()).isEqualTo(consumedMessage.getPair());
    assertThat(userTicket.getEpochUtc()).isEqualTo(consumedMessage.getEpochUtc());
    assertThat(userTicket.getEventType()).isEqualTo(consumedMessage.getEventType());
    assertThat(userTicket.getDirection()).isEqualTo(consumedMessage.getDirection());
    assertThat(userTicket.getTicketStatus()).isEqualTo(consumedMessage.getTicketStatus());
    assertThat(userTicket.getUpdatedDateUtc()).isEqualTo(consumedMessage.getUpdatedDateUtc());
    assertThat(userTicket.getVersion()).isEqualTo(consumedMessage.getVersion());
  }

  public static UserTicket generateRandomTicket() {
    SecureRandom random = new SecureRandom(UUID.randomUUID().toString().getBytes());
    UserTicket userTicket = new UserTicket();
    userTicket.setId(random.nextLong());
    userTicket.setAmount(random.nextLong());
    userTicket.setRatio(random.nextLong());
    userTicket.setUserId(UUID.randomUUID());
    userTicket.setUserAccountId(UUID.randomUUID());
    userTicket.setPair(Pair.values()[random.nextInt(Pair.values().length)]);
    userTicket.setEpochUtc(random.nextLong());
    userTicket.setDirection(Direction.values()[random.nextInt(Direction.values().length)]);
    userTicket.setEventType(EventType.values()[random.nextInt(EventType.values().length)]);
    userTicket.setTicketStatus(
        UserTicketStatus.values()[random.nextInt(UserTicketStatus.values().length)]);
    userTicket.setUpdatedDateUtc(random.nextLong());
    userTicket.setVersion(random.nextInt());
    return userTicket;
  }

}