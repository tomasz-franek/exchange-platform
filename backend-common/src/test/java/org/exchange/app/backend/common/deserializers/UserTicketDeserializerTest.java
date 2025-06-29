package org.exchange.app.backend.common.deserializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class UserTicketDeserializerTest {

	private UserTicketDeserializer deserializer = new UserTicketDeserializer();
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
		userTicket.setEpochUTC(100L);
		userTicket.setUpdatedDateUTC(400L);

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

}