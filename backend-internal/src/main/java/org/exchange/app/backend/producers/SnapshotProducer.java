package org.exchange.app.backend.producers;


import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class SnapshotProducer {

	private final KafkaTemplate<String, String> kafkaTemplate;

	public SnapshotProducer(
			@Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
		this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
				TopicToInternalBackend.SNAPSHOT, bootstrapServers, StringSerializer.class,
				StringSerializer.class);
	}

	public void sendMessage(String operation, LocalDateTime localDateTime) {
		String snapshotRequest = String.valueOf(localDateTime.toEpochSecond(ZoneOffset.UTC));
		CompletableFuture<SendResult<String, String>> future
				= kafkaTemplate.send(TopicToInternalBackend.FEE_CALCULATION, operation,
				snapshotRequest);
		future.whenComplete((result, ex) -> {
			if (ex != null) {
				log.error("{}", ex.getMessage());
			} else {
				log.info("Sent OK id={} topic={}",
						result.getProducerRecord().value(),
						TopicToInternalBackend.FEE_CALCULATION);
			}
		});
	}
}
