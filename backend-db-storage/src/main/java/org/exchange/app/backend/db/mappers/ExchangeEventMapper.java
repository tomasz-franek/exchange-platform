package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.UserTicket;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ExchangeEventMapper {

  ExchangeEventMapper INSTANCE = Mappers.getMapper(ExchangeEventMapper.class);

  UserTicket toDto(ExchangeEventEntity entity);

  default Direction convertDirection(String direction) {
    return switch (direction) {
      case "B" -> Direction.BUY;
      case "S" -> Direction.SELL;
      default -> throw new RuntimeException("Unknown direction " + direction);
    };
  }
}
