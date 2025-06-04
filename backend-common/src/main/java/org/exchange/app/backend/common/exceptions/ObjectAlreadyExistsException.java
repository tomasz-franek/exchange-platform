package org.exchange.app.backend.common.exceptions;

import java.lang.reflect.Type;
import lombok.Getter;

@Getter
public class ObjectAlreadyExistsException extends RuntimeException {

  private final ExceptionResponse exceptionResponse;

  public ObjectAlreadyExistsException(Type type, String id) {
    this.exceptionResponse = new ExceptionResponse(ExceptionResponse.getClassName(type),
        String.format("Object already exists='%s'", id));
  }
}
