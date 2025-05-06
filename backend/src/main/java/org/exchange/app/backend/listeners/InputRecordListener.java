package org.exchange.app.backend.listeners;

import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.repositories.UserEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


@Log4j2
@Service
public class InputRecordListener {

  public static final String INPUT_RECORD_TOPIC_NAME = "input-record";
  private final UserEntityRepository userEntityRepository;

  public InputRecordListener(@Autowired UserEntityRepository userEntityRepository) {
    this.userEntityRepository = userEntityRepository;
  }

  @KafkaListener(id = "input-record-idw",
      topics = INPUT_RECORD_TOPIC_NAME,
      autoStartup = "${listen.auto.start:true}",
      concurrency = "${listen.concurrency:3}",
      containerFactory = "")
  public void consume(String message) {
    log.info("*** message received from broker, job id = '{}'", message);
    if (!message.isEmpty()) {
      saveMessage(message);
    }
  }

  private void saveMessage(String message) {
    userEntityRepository.count();
  }

}
