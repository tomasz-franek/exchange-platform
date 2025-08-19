package org.exchange.app.backend.db.mappers;

import org.exchange.app.admin.api.model.SystemAccountOperation;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ExchangeEventSourceMapper {

  ExchangeEventSourceMapper INSTANCE = Mappers.getMapper(ExchangeEventSourceMapper.class);


  SystemAccountOperation toDto(ExchangeEventSourceEntity entity);
}
