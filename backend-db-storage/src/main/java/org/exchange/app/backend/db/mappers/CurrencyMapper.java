package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.common.api.model.SystemCurrency;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CurrencyMapper {

  CurrencyMapper INSTANCE = Mappers.getMapper(CurrencyMapper.class);

  SystemCurrency toDto(CurrencyEntity entity);
}
