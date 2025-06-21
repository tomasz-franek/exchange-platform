package org.exchange.app.backend.db.mappers;

import java.sql.Timestamp;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.UserTicket;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ExchangeEventMapper {

  ExchangeEventMapper INSTANCE = Mappers.getMapper(ExchangeEventMapper.class);

  @Mapping(target = "userId", ignore = true)
  @Mapping(target = "epochUTC", source = "dateUtc")
  UserTicket toDto(ExchangeEventEntity entity);

  default Long toEpochLong(Timestamp timestamp) {
    return ExchangeDateUtils.toEpochUtc(timestamp);
  }


  default Direction convertDirection(String direction) {
    return switch (direction) {
      case "B" -> Direction.BUY;
      case "S" -> Direction.SELL;
      default -> throw new RuntimeException("Unknown direction " + direction);
    };
  }
}
