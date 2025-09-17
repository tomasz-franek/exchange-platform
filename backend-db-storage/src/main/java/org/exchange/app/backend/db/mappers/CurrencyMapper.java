package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.common.api.model.SystemCurrency;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CurrencyMapper {

  CurrencyMapper INSTANCE = Mappers.getMapper(CurrencyMapper.class);

  @Mapping(target = "currency", source = "code")
  SystemCurrency toDto(CurrencyEntity entity);

  @Mapping(target = "code", ignore = true)
  @Mapping(target = "id", ignore = true)
  void updateWithDto(@MappingTarget CurrencyEntity addressEntity, SystemCurrency systemCurrency);
}
