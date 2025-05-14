package org.exchange.exceptions;

import java.io.Serial;

public class ExchangeException extends Exception {

  @Serial
  private static final long serialVersionUID = 8183110675140595418L;

  public ExchangeException() {
    super();
  }

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
