package org.exchange.app.backend.common.exceptions;

import lombok.Getter;

@Getter
public class ExchangeException extends RuntimeException {

  private final ExceptionResponse exceptionResponse;

  public ExchangeException(final String exceptionText) {
    this.exceptionResponse = new ExceptionResponse("ExchangeException", exceptionText);
  }
}
