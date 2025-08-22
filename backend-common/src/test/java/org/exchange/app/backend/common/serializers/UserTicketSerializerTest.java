package org.exchange.app.backend.common.serializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
    ticket.setEpochUtc(30L);
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

    assertThat(result).isNotNull();
    assertThat(result.length > 0).isTrue();

    UserTicket deserializedTicket = objectMapper.readValue(result, UserTicket.class);
    assertThat(deserializedTicket).isEqualTo(ticket);
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
    assertThat(thrown.getMessage()).isEqualTo("Error serializing UserTicket");
  }
}
