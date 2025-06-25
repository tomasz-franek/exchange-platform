package org.exchange.app.backend.common.exceptions;

public class ExchangeException extends RuntimeException {

  public ExchangeException(final String exceptionText) {
    super(exceptionText);
  }
}
