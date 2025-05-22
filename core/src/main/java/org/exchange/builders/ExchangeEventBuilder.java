package org.exchange.builders;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.internal.api.model.ExchangeEvent;
import org.exchange.enums.ExchangeFieldEnum;

@Log4j2
public class ExchangeEventBuilder {

  private String event;
  private final Map<String, String> map = new HashMap<>();

  public ExchangeEventBuilder(String event) {
    this.event = event;
  }

  public ExchangeEventBuilder() {

  }

  public ExchangeEventBuilder from(String message) {
    this.event = message;
    return this;
  }

  public final ExchangeEvent build() {
    ExchangeEvent exchangeEvent = new ExchangeEvent();
    return build(exchangeEvent);
  }

  public final ExchangeEvent build(ExchangeEvent exchangeEvent) {
    try {
      exchangeEvent.setEvent(this.event);
      String[] fields = this.event.split("\\|");
      if (fields.length > 0) {
        fillMap(fields);
      } else {
        return exchangeEvent;
      }
      if (map.containsKey(ExchangeFieldEnum.USER.name())) {
        exchangeEvent.setIdUser(UUID.fromString(map.get(ExchangeFieldEnum.USER.name())));
      }
      if (map.containsKey(ExchangeFieldEnum.ACTION.name())) {
        exchangeEvent.setAction(map.get(ExchangeFieldEnum.ACTION.name()));
      }
      if ("D".equalsIgnoreCase(exchangeEvent.getAction())) {
        if (map.containsKey(ExchangeFieldEnum.ID.name())) {
          exchangeEvent.setId(Long.valueOf(map.get(ExchangeFieldEnum.ID.name())));
        }
      } else {
        exchangeEvent.setPair(Pair.valueOf(map.get(ExchangeFieldEnum.PAIR.name())));
        exchangeEvent.setValue(new BigDecimal(map.get(ExchangeFieldEnum.VALUE.name())));
        exchangeEvent.setDirection(
            Direction.fromValue(map.get(ExchangeFieldEnum.DIRECTION.name())));
        exchangeEvent.setRatio(new BigDecimal(map.get(ExchangeFieldEnum.RATIO.name())));
        exchangeEvent.setHash(Long.valueOf(map.get(ExchangeFieldEnum.HASH.name())));
      }
      return exchangeEvent;
    } catch (NullPointerException e) {
      log.error("NPE", e);
    }
    return null;
  }

  private void fillMap(String[] fields) {
    map.clear();
    for (String string : fields) {
      String[] value = string.split("=");
      if (value.length == 2) {
        map.put(value[0], value[1]);
      }
    }
  }
}
