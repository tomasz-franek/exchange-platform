package org.exchange.app.backend.common.serializers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.UUID;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UserTicketSerializerTest {

  private UserTicketSerializer serializer;
  private ObjectMapper objectMapper;

  @BeforeEach
  public void setUp() {
    serializer = new UserTicketSerializer();
    objectMapper = new ObjectMapper();
  }

  @Test
  public void serialize_should_serializeSuccess_when_correctObject() throws IOException {

    UserTicket ticket = new UserTicket();
    ticket.setEpochUTC(30L);
    ticket.setDirection(Direction.BUY);
    ticket.setAmount(100L);
    ticket.setPair(Pair.EUR_GBP);
    ticket.setEventType(EventType.CANCEL);
    ticket.setRatio(300L);
    ticket.setId(329L);
    ticket.setTicketStatus(UserTicketStatus.NEW);
    ticket.setUserAccountId(UUID.randomUUID());
    ticket.setUserId(UUID.randomUUID());

    byte[] result = serializer.serialize("test-topic", ticket);

    assertNotNull(result);
    assertTrue(result.length > 0);

    UserTicket deserializedTicket = objectMapper.readValue(result, UserTicket.class);
    assertEquals(ticket, deserializedTicket);
  }

  @Test
  public void serialize_should_ThrowsRuntimeException_when_wrongUserTicketData()
      throws JsonProcessingException {
    UserTicket ticket = new UserTicket();

    ObjectMapper mockObjectMapper = mock(ObjectMapper.class);
    when(mockObjectMapper.writeValueAsBytes(any())).thenThrow(
        new JsonProcessingException("Mock exception") {
        });

    serializer = new UserTicketSerializer() {
      @Override
      public byte[] serialize(String topic, UserTicket data) {
        try {
          return mockObjectMapper.writeValueAsBytes(data);
        } catch (JsonProcessingException e) {
          throw new RuntimeException("Error serializing UserTicket", e);
        }
      }
    };
    RuntimeException thrown = assertThrows(RuntimeException.class,
        () -> serializer.serialize("test-topic", ticket));
    assertEquals("Error serializing UserTicket", thrown.getMessage());
  }
}
