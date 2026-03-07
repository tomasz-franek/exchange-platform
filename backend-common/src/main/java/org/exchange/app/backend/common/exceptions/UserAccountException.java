package org.exchange.app.backend.common.exceptions;

import java.lang.reflect.Type;
import lombok.Getter;

@Getter
public class UserAccountException extends RuntimeException {

  private final transient ExceptionResponse exceptionResponse;

  public UserAccountException(Type type, String message) {
    this.exceptionResponse = new ExceptionResponse(ExceptionResponse.getClassName(type),
        message);
  }

  public UserAccountException(String type, Throwable throwable) {
    this.exceptionResponse = new ExceptionResponse(type, throwable.getMessage());
  }
}
