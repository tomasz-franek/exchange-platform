package org.exchange.app.backend.common.deserializers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.AssertionsKt.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.UserTicket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UserTicketDeserializerTest {

	private UserTicketDeserializer deserializer;
	private ObjectMapper objectMapper;

	@BeforeEach
	public void setUp() {
		deserializer = new UserTicketDeserializer();
		objectMapper = mock(ObjectMapper.class);
		// Use reflection to set the mocked ObjectMapper into the deserializer
		setObjectMapper(deserializer, objectMapper);
	}

	private void setObjectMapper(UserTicketDeserializer deserializer, ObjectMapper objectMapper) {
		try {
			java.lang.reflect.Field field = UserTicketDeserializer.class.getDeclaredField("objectMapper");
			field.setAccessible(true);
			field.set(deserializer, objectMapper);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	@Test
	public void deserialize_should_deserializeData_when_validInput() throws Exception {
		// Arrange
		String topic = "test-topic";
		UserTicket expectedTicket = new UserTicket();
		expectedTicket.setAmount(120L);
		expectedTicket.setDirection(Direction.BUY);
		expectedTicket.setEpochUTC(100L);
		byte[] inputData = "{\"amount\":\"120\",\"direction\":\"BUY\",\"epochUTC\":100}".getBytes();

		when(objectMapper.readValue(inputData, UserTicket.class)).thenReturn(expectedTicket);

		// Act
		UserTicket result = deserializer.deserialize(topic, inputData);

		// Assert
		assertNotNull(result);
		assertEquals(expectedTicket.getAmount(), result.getAmount());
		assertEquals(expectedTicket.getDirection(), result.getDirection());
		assertEquals(expectedTicket.getEpochUTC(), result.getEpochUTC());
	}

	@Test
	public void deserialize_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() throws Exception {
		// Arrange
		String topic = "test-topic";
		byte[] inputData = "".getBytes();

		when(objectMapper.readValue(inputData, UserTicket.class)).thenThrow(new Exception("Empty input"));

		// Act & Assert
		RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
			deserializer.deserialize(topic, inputData);
		});
		assertEquals("Error deserializing UserTicket", thrown.getMessage());
	}

	@Test
	public void deserialize_should_shouldReturnRuntimeException_when_inputBytesNull() {
		// Arrange
		String topic = "test-topic";
		byte[] inputData = null;

		// Act & Assert
		RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
			deserializer.deserialize(topic, inputData);
		});
		assertEquals("Error deserializing UserTicket", thrown.getMessage());
	}

	@Test
	public void deserialize_should_shouldReturnRuntimeException_when_invalidJSON() throws Exception {
		// Arrange
		String topic = "test-topic";
		byte[] inputData = "invalid json".getBytes();

		when(objectMapper.readValue(inputData, UserTicket.class)).thenThrow(new Exception("Invalid JSON"));

		// Act & Assert
		RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
			deserializer.deserialize(topic, inputData);
		});
		assertEquals("Error deserializing UserTicket", thrown.getMessage());
	}

}