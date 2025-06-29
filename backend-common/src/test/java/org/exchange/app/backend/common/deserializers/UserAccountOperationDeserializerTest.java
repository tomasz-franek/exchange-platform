package org.exchange.app.backend.common.deserializers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UserAccountOperationDeserializerTest {

	private UserAccountOperationDeserializer deserializer;
	private ObjectMapper objectMapper;

	@BeforeEach
	public void setUp() {
		deserializer = new UserAccountOperationDeserializer();
		objectMapper = mock(ObjectMapper.class);
		setObjectMapper(deserializer, objectMapper);
	}

	private void setObjectMapper(UserAccountOperationDeserializer deserializer, ObjectMapper objectMapper) {
		try {
			java.lang.reflect.Field field = UserAccountOperationDeserializer.class.getDeclaredField("objectMapper");
			field.setAccessible(true);
			field.set(deserializer, objectMapper);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void testDeserialize_ValidInput() throws Exception {

		String topic = "test-topic";
		UUID userAccountId = UUID.randomUUID();
		UserAccountOperation expectedOperation = new UserAccountOperation(111L,userAccountId);
		byte[] inputData = ("{\"amount\":111,\"userAccountId\":" + userAccountId + "}").getBytes();

		when(objectMapper.readValue(inputData, UserAccountOperation.class)).thenReturn(expectedOperation);

		UserAccountOperation result = deserializer.deserialize(topic, inputData);

		assertNotNull(result);
		assertNotNull(result);
		assertEquals(expectedOperation.getAmount(), result.getAmount());
		assertEquals(expectedOperation.getUserAccountId(), result.getUserAccountId());
	}

	@Test
	public void deserialize_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() throws Exception {

		String topic = "test-topic";
		byte[] inputData = "".getBytes();

		when(objectMapper.readValue(inputData, UserAccountOperation.class)).thenThrow(new Exception("Empty input"));

		RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
			deserializer.deserialize(topic, inputData);
		});
		assertEquals("Error deserializing UserTicket", thrown.getMessage());
	}

	@Test
	public void deserialize_should_shouldReturnRuntimeException_when_inputBytesNull() {

		String topic = "test-topic";
		byte[] inputData = null;

		RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
			deserializer.deserialize(topic, inputData);
		});
		assertEquals("Error deserializing UserTicket", thrown.getMessage());
	}

	@Test
	public void testDeserialize_InvalidJson() throws Exception {
		String topic = "test-topic";
		byte[] inputData = "invalid json".getBytes();

		when(objectMapper.readValue(inputData, UserAccountOperation.class)).thenThrow(new Exception("Invalid JSON"));

		RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
			deserializer.deserialize(topic, inputData);
		});
		assertEquals("Error deserializing UserTicket", thrown.getMessage());
	}

	@Test
	public void deserialize_should_shouldReturnRuntimeException_when_invalidJSON() throws Exception {
		String topic = "test-topic";
		byte[] inputData = "{\"userId\":\"user123\",\"operationId\":\"operation123\"}".getBytes();

		when(objectMapper.readValue(inputData, UserAccountOperation.class)).thenThrow(new Exception("Some error"));

		RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
			deserializer.deserialize(topic, inputData);
		});
		assertEquals("Error deserializing UserTicket", thrown.getMessage());
	}
}
