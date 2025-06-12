package org.exchange.internal.app.core.exceptions;

public class ExchangeException extends Exception {

  public ExchangeException(final String exceptionText) {
    super(exceptionText);
  }

  public ExchangeException(String message, Throwable cause) {

    super(message, cause);
  }

  public ExchangeException(Throwable throwable) {
    super(throwable);
  }
}
