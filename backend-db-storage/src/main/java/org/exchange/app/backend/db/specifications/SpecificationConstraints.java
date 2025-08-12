package org.exchange.app.backend.db.specifications;

public class SpecificationConstraints {

  public static final char ESCAPE_CHAR = '\\';

  public static String prepareLikeParam(String param) {
    return param != null ? "%" + param.replace("_", ESCAPE_CHAR + "_")
        .toLowerCase() + "%" : null;
  }
}
