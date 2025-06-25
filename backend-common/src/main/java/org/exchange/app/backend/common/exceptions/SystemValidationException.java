package org.exchange.app.backend.common.exceptions;

import java.lang.reflect.Type;
import java.util.List;
import lombok.Getter;

@Getter
public class SystemValidationException extends RuntimeException {

  private final ExceptionResponse exceptionResponse;

  public SystemValidationException(Type type, List<String> errors) {
    this.exceptionResponse = new ExceptionResponse(ExceptionResponse.getClassName(type),
        String.format("Validation errors %s", errors.toString()));
  }
}
