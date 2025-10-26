package org.exchange.app.backend.common.exceptions;

import java.util.UUID;
import lombok.Getter;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.common.api.model.ErrorObjectResponse;

@Getter
public class ObjectWithIdNotFoundException extends RuntimeException {

  private final ErrorObjectResponse exceptionRecord;

  public ObjectWithIdNotFoundException(String object, String id) {
    this.exceptionRecord = new ErrorObjectResponse(
        ErrorCodesEnum.OBJECT_WITH_ID_NOT_FOUND.name(),
        UUID.randomUUID(), String.format("Object %s with id=%s not found", object, id),
        ExchangeDateUtils.currentLocalDateTime());
  }

  public ObjectWithIdNotFoundException(String object, String field, String id) {
    this.exceptionRecord = new ErrorObjectResponse(
        ErrorCodesEnum.OBJECT_WITH_ID_NOT_FOUND.name(),
        UUID.randomUUID(), String.format("Object %s with value %s=%s not found", object, field, id),
        ExchangeDateUtils.currentLocalDateTime());
  }
}
