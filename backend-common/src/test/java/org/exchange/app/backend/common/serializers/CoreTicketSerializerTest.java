package org.exchange.app.backend.common.serializers;

import static org.assertj.core.api.Assertions.assertThat;

import java.security.SecureRandom;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.deserializers.CoreTicketDeserializer;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class CoreTicketSerializerTest {

	private final CoreTicketDeserializer deserializer = new CoreTicketDeserializer();
	private final CoreTicketSerializer serializer = new CoreTicketSerializer();

	@Test
	void serializeCompact() {
		for (int i = 0; i < 10000; i++) {
			CoreTicket coreTicket = generateRandomCoreTicket();

			CoreTicket resultTicket = deserializer.deserializeCompact(
					serializer.serializeCompact(coreTicket));

			validateConsumedMessage(resultTicket, resultTicket);
		}
	}

	public static void validateConsumedMessage(CoreTicket result, CoreTicket source) {
		assertThat(result).isNotNull();
		assertThat(source.getId()).isEqualTo(result.getId());
		assertThat(source.getAmount()).isEqualTo(result.getAmount());
		assertThat(source.getRatio()).isEqualTo(result.getRatio());
		assertThat(source.getUserId()).isEqualTo(result.getUserId());
		assertThat(source.getPair()).isEqualTo(result.getPair());
		assertThat(source.getDirection()).isEqualTo(result.getDirection());
		assertThat(source.getEpochUtc()).isEqualTo(result.getEpochUtc());
	}

	public static CoreTicket generateRandomCoreTicket() {
		SecureRandom random = new SecureRandom(UUID.randomUUID().toString().getBytes());
		CoreTicket coreTicket = new CoreTicket();
		coreTicket.setId(random.nextLong());
		coreTicket.setAmount(random.nextLong());
		coreTicket.setRatio(random.nextLong());
		coreTicket.setUserId(UUID.randomUUID());
		coreTicket.setPair(Pair.values()[random.nextInt(Pair.values().length)]);
		coreTicket.setEpochUtc(random.nextLong());
		coreTicket.setDirection(Direction.values()[random.nextInt(Direction.values().length)]);
		return coreTicket;
	}
}