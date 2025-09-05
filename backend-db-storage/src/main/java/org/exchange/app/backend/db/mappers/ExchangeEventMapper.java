package org.exchange.app.backend.db.mappers;

import java.time.LocalDateTime;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.ExchangeEvent;
import org.exchange.app.common.api.model.UserTicket;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ExchangeEventMapper {

  ExchangeEventMapper INSTANCE = Mappers.getMapper(ExchangeEventMapper.class);

  @Mapping(target = "userId", ignore = true)
  @Mapping(target = "epochUtc", source = "dateUtc")
  @Mapping(target = "updatedDateUtc", ignore = true)
  UserTicket toDto(ExchangeEventEntity entity);

  ExchangeEvent toExchangeEvent(ExchangeEventEntity entity);

  default Long toEpochLong(LocalDateTime dateTime) {
    if (dateTime != null) {
      return ExchangeDateUtils.toEpochUtc(dateTime);
    } else {
      return -1L;
    }
  }


  default Direction convertDirection(String direction) {
    return switch (direction) {
      case "B" -> Direction.BUY;
      case "S" -> Direction.SELL;
      default -> throw new RuntimeException("Unknown direction " + direction);
    };
  }
}
