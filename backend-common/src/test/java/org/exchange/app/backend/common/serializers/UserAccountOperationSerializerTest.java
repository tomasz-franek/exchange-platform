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
import java.security.SecureRandom;
import java.util.UUID;
import org.exchange.app.backend.common.deserializers.UserAccountOperationDeserializer;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UserAccountOperationSerializerTest {

  private UserAccountOperationSerializer serializer;
  private UserAccountOperationDeserializer deserializer;
  private ObjectMapper objectMapper;
  private final SecureRandom secureRandom = new SecureRandom(
      UUID.randomUUID().toString().getBytes());

  @BeforeEach
  public void setUp() {
    serializer = new UserAccountOperationSerializer();
    deserializer = new UserAccountOperationDeserializer();
    objectMapper = new ObjectMapper();
  }

  @Test
  public void serializeStandard_should_serializeSuccess_when_correctObject() throws IOException {

    UserAccountOperation operation = getUserAccountOperationRandom();

    byte[] result = serializer.serializeStandard(operation);

    assertThat(result).isNotNull();
    assertTrue(result.length > 0);

    UserAccountOperation deserializedOperation = objectMapper.readValue(result,
        UserAccountOperation.class);
    assertThat(deserializedOperation).isEqualTo(operation);
  }

  private UserAccountOperation getUserAccountOperationRandom() {
    UserAccountOperation operation = new UserAccountOperation();
    operation.setAmount(secureRandom.nextLong());
    operation.setCurrency(
        Currency.values()[secureRandom.nextInt(Currency.values().length)]);
    operation.setUserAccountId(UUID.randomUUID());
    operation.setUserId(UUID.randomUUID());
    return operation;
  }

  @Test
  public void serialize_should_ThrowsRuntimeException_when_wrongObject()
      throws JsonProcessingException {
    UserAccountOperation operation = getUserAccountOperationRandom();

    ObjectMapper mockObjectMapper = mock(ObjectMapper.class);
    when(mockObjectMapper.writeValueAsBytes(any())).thenThrow(
        new JsonProcessingException("Mock exception") {
        });

    serializer = new UserAccountOperationSerializer() {
      @Override
      public byte[] serializeStandard(UserAccountOperation data) {
        try {
          return mockObjectMapper.writeValueAsBytes(data);
        } catch (JsonProcessingException e) {
          throw new RuntimeException("Error serializing UserAccountOperation", e);
        }
      }
    };

    RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
      serializer.serializeStandard(operation);
    });
    assertThat(thrown.getMessage()).isEqualTo("Error serializing UserAccountOperation");
  }

  @Test
  public void deserializeCompact_should_returnSerialized_when_alsoSerializedCompact() {
    for (int i = 0; i < 10000; i++) {
      UserAccountOperation userAccountOperation = getUserAccountOperationRandom();
      UserAccountOperation resultUserAccountOperation = deserializer.deserializeCompact(
          serializer.serializeCompact(userAccountOperation));

      validateUserAccountOperation(userAccountOperation, resultUserAccountOperation);
    }
  }

  @Test
  public void deserializeCompact_should_returnCorrectUserAccountOperation_when_allFieldsNotInitialized() {
    UserAccountOperation userAccountOperation = new UserAccountOperation();
    UserAccountOperation resultUserAccountOperation = deserializer.deserializeCompact(
        serializer.serializeCompact(userAccountOperation));

    validateUserAccountOperation(userAccountOperation, resultUserAccountOperation);
  }

  private void validateUserAccountOperation(UserAccountOperation original,
      UserAccountOperation result) {
    assertThat(original.getAmount()).isEqualTo(result.getAmount());
    assertThat(original.getUserAccountId()).isEqualTo(result.getUserAccountId());
    assertThat(original.getUserId()).isEqualTo(result.getUserId());
    assertThat(original.getCurrency()).isEqualTo(result.getCurrency());
  }
}
