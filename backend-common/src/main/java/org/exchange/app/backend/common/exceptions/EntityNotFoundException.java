package org.exchange.app.backend.common.exceptions;

import java.lang.reflect.Type;
import lombok.Getter;

@Getter
public class EntityNotFoundException extends RuntimeException {

  private final ExceptionResponse exceptionResponse;

  public EntityNotFoundException(Type type, String id) {
    this.exceptionResponse = new ExceptionResponse(ExceptionResponse.getClassName(type),
        String.format("Object with ID='%s' not found", id));
  }
}
