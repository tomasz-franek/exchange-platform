package org.exchange.app.backend.common.deserializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.junit.jupiter.api.Test;

public class UserAccountOperationDeserializerTest {

	private UserAccountOperationDeserializer deserializer = new UserAccountOperationDeserializer();
	private ObjectMapper objectMapper = new ObjectMapper();


	@Test
	public void deserialize_should_deserializeData_when_validInput() throws JsonProcessingException {

		UserAccountOperation operation = new UserAccountOperation();

		byte[] data = objectMapper.writeValueAsBytes(operation);

		UserAccountOperation result = deserializer.deserialize("test-topic", data);

		assertNotNull(result);
		assertEquals(operation, result);
	}

	@Test
	public void deserialize_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() {
		String inputString = "";
		byte[] inputBytes = inputString.getBytes();

		RuntimeException runtimeException = assertThrows(RuntimeException.class,
				() -> deserializer.deserialize(inputString, inputBytes));

		assertThat(runtimeException.getMessage()).isEqualTo("Error deserializing UserAccountOperation");

	}

	@Test
	public void deserialize_should_shouldReturnRuntimeException_when_inputBytesNull() {
		String inputString = null;
		byte[] inputBytes = null;

		RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
			deserializer.deserialize(inputString, inputBytes);
		});
		assertEquals("Error deserializing UserAccountOperation", thrown.getMessage());
	}
}
