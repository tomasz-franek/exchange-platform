package org.exchange.app.backend.producers;

import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class InputRecordExecutor {

  private final TaskExecutor taskExecutor;
  private final ApplicationContext applicationContext;

  public InputRecordExecutor(
      @Autowired TaskExecutor taskExecutor,
      @Autowired ApplicationContext applicationContext) {
    this.taskExecutor = taskExecutor;
    this.applicationContext = applicationContext;
  }

  @PostConstruct
  public void atStartup() {
    log.info("###### Startup BulkEventProducer");
    BulkEventProducer bulkEventProducer = applicationContext.getBean(BulkEventProducer.class);
    taskExecutor.execute(bulkEventProducer);
    log.info("###### Startup ok");
  }
}
