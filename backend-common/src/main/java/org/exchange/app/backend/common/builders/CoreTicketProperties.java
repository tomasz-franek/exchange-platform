package org.exchange.app.backend.common.builders;

public class CoreTicketProperties {

  public static int DECIMAL_PLACES = 4;
  public static int ONE_CENT_PLACES = DECIMAL_PLACES - 2;
  public static long ROUNDING = 1_0000;
  public static long MAX_EXCHANGE_ERROR = ROUNDING / 100; //one cent
}
