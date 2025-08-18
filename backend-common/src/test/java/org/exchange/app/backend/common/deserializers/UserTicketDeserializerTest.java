package org.exchange.app.backend.common.deserializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.security.SecureRandom;
import java.util.UUID;
import org.exchange.app.backend.common.serializers.UserTicketSerializer;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class UserTicketDeserializerTest {

  private UserTicketDeserializer deserializer = new UserTicketDeserializer();
  private UserTicketSerializer serializer = new UserTicketSerializer();
  private SecureRandom random = new SecureRandom(UUID.randomUUID().toString().getBytes());
  private ObjectMapper objectMapper = new ObjectMapper();

  @Test
  public void deserialize_should_deserializeData_when_validInput() throws JsonProcessingException {

    UserTicket userTicket = new UserTicket();
    userTicket.setUserId(UUID.randomUUID());
    userTicket.setDirection(Direction.BUY);
    userTicket.setPair(Pair.EUR_GBP);
    userTicket.setTicketStatus(UserTicketStatus.NEW);
    userTicket.setEventType(EventType.CANCEL);
    userTicket.setRatio(100L);
    userTicket.setAmount(300L);
    userTicket.setUserAccountId(UUID.randomUUID());
    userTicket.setEpochUtc(100L);
    userTicket.setUpdatedDateUtc(400L);

    byte[] data = objectMapper.writeValueAsBytes(userTicket);

    UserTicket result = deserializer.deserialize("test-topic", data);

    Assertions.assertNotNull(result);
    assertEquals(userTicket, result);
  }

  @Test
  public void deserialize_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() {
    String inputString = "";
    byte[] inputBytes = inputString.getBytes();

    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> deserializer.deserialize(inputString, inputBytes));

    assertThat(runtimeException.getMessage()).isEqualTo("Error deserializing UserTicket");

  }

  @Test
  public void deserialize_should_shouldReturnRuntimeException_when_inputBytesNull() {
    String inputString = null;
    byte[] inputBytes = null;

    RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
      deserializer.deserialize(inputString, inputBytes);
    });
    assertEquals("Error deserializing UserTicket", thrown.getMessage());
  }

  @Test
  public void deserializeCompact_should_returnSerialized_when_alsoSerializedCompact() {
    for (int i = 0; i < 100; i++) {
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

      UserTicket resultTicket = deserializer.deserializeCompact(
          serializer.serializeCompact(userTicket));

      assertThat(userTicket.getId()).isEqualTo(resultTicket.getId());
      assertThat(userTicket.getAmount()).isEqualTo(resultTicket.getAmount());
      assertThat(userTicket.getRatio()).isEqualTo(resultTicket.getRatio());
    }
  }
}