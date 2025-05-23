package org.exchange.app.backend.common.exceptions;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import org.exchange.app.common.api.model.ErrorObjectResponse;

public class ExceptionResponse extends ErrorObjectResponse {

  private static final String DOT = ".";

  ExceptionResponse(String errorCode, String message) {
    super(errorCode, UUID.randomUUID(), message, LocalDateTime.now(ZoneOffset.UTC));
  }

  public static String getClassName(Type type) {
    String className = type.getTypeName();
    if (className.contains(DOT)) {
      className = className.substring(className.lastIndexOf(DOT) + 1);
    }
    return className;
  }
}
