package org.exchange.app.backend.db.mappers;

import org.exchange.app.admin.api.model.AccountOperation;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ExchangeEventSourceMapper {

  ExchangeEventSourceMapper INSTANCE = Mappers.getMapper(ExchangeEventSourceMapper.class);


  AccountOperation toDto(ExchangeEventSourceEntity entity);
}
