package org.exchange.app.backend.common.builders;

public class CoreTicketProperties {

  private CoreTicketProperties() {
  }

  public static final int DECIMAL_PLACES = 4;
  public static final int ONE_CENT_PLACES = DECIMAL_PLACES - 2;
  public static final long ROUNDING = 1_0000;
  public static final long MAX_EXCHANGE_ERROR = ROUNDING / 100; //one cent
}
