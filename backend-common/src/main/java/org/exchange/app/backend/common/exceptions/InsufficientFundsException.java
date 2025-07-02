package org.exchange.app.backend.common.exceptions;

import java.lang.reflect.Type;
import lombok.Getter;

@Getter
public class InsufficientFundsException extends RuntimeException {

  private final ExceptionResponse exceptionResponse;

  public InsufficientFundsException(Type type, String currency) {
    this.exceptionResponse = new ExceptionResponse(ExceptionResponse.getClassName(type),
        String.format("Insufficient fund for currency='%s'", currency));
    this.exceptionResponse.setErrorCode("INSUFFICIENT_FUNDS");
  }
}
