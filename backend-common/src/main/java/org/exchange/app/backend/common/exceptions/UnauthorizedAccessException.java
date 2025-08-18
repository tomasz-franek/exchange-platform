package org.exchange.app.backend.common.exceptions;

import java.lang.reflect.Type;
import lombok.Getter;

@Getter
public class UnauthorizedAccessException extends RuntimeException {

  private final ExceptionResponse exceptionResponse;

  public UnauthorizedAccessException(Type type, String login) {
    this.exceptionResponse = new ExceptionResponse(ExceptionResponse.getClassName(type),
        String.format("Unauthorized access for user='%s'", login));
  }
}
