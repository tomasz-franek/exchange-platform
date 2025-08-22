package org.exchange.app.backend.common.serializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.UUID;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UserAccountOperationSerializerTest {

  private UserAccountOperationSerializer serializer;
  private ObjectMapper objectMapper;

  @BeforeEach
  public void setUp() {
    serializer = new UserAccountOperationSerializer();
    objectMapper = new ObjectMapper();
  }

  @Test
  public void serialize_should_serializeSuccess_when_correctObject() throws IOException {

    UserAccountOperation operation = new UserAccountOperation();
    operation.setAmount(100L);
    operation.setUserAccountId(UUID.randomUUID());
    operation.setUserId(UUID.randomUUID());

    byte[] result = serializer.serialize("test-topic", operation);

    assertThat(result).isNotNull();
    assertTrue(result.length > 0);

    UserAccountOperation deserializedOperation = objectMapper.readValue(result,
        UserAccountOperation.class);
    assertThat(deserializedOperation).isEqualTo(operation);
  }

  @Test
  public void serialize_should_ThrowsRuntimeException_when_wrongObject()
      throws JsonProcessingException {
    UserAccountOperation operation = new UserAccountOperation();
    operation.setAmount(100L);
    operation.setUserAccountId(UUID.randomUUID());
    operation.setUserId(UUID.randomUUID());

    ObjectMapper mockObjectMapper = mock(ObjectMapper.class);
    when(mockObjectMapper.writeValueAsBytes(any())).thenThrow(
        new JsonProcessingException("Mock exception") {
        });

    serializer = new UserAccountOperationSerializer() {
      @Override
      public byte[] serialize(String topic, UserAccountOperation data) {
        try {
          return mockObjectMapper.writeValueAsBytes(data);
        } catch (JsonProcessingException e) {
          throw new RuntimeException("Error serializing UserAccountOperation", e);
        }
      }
    };

    RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
      serializer.serialize("test-topic", operation);
    });
    assertThat(thrown.getMessage()).isEqualTo("Error serializing UserAccountOperation");
  }
}
