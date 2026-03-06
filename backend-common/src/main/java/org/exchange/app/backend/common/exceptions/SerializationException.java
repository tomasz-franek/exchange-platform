package org.exchange.app.backend.common.exceptions;

import java.util.UUID;
import lombok.Getter;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.common.api.model.ErrorObjectResponse;

@Getter
public class SerializationException extends RuntimeException {

  private final transient ErrorObjectResponse exceptionRecord;

  public SerializationException(String message) {
    this.exceptionRecord = new ErrorObjectResponse(
        ErrorCodesEnum.SERIALIZATION_ERROR.name(),
        UUID.randomUUID(),
        String.format("SerializationException : %s", message),
        ExchangeDateUtils.currentLocalDateTime());
  }

  public SerializationException(String message, Throwable cause) {
    this.exceptionRecord = new ErrorObjectResponse(
        ErrorCodesEnum.SERIALIZATION_ERROR.name(),
        UUID.randomUUID(),
        String.format("SerializationException : %s %s", message, cause.getMessage()),
        ExchangeDateUtils.currentLocalDateTime());
  }

}
