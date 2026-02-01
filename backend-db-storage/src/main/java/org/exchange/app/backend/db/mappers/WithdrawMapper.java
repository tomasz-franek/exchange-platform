package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.WithdrawEntity;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.Withdraw;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface WithdrawMapper {

  WithdrawMapper INSTANCE = Mappers.getMapper(WithdrawMapper.class);

  @Mapping(target = "currency", ignore = true)
  WithdrawEntity toEntity(Withdraw withdraw);

  Withdraw toDto(WithdrawEntity withdrawEntity);

  default Currency map(CurrencyEntity value) {
    if (value != null) {
      return Currency.valueOf(value.getCode().getValue());
    }
    return null;
  }

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "currency", ignore = true)
  @Mapping(target = "createdDateUtc", ignore = true)
  @Mapping(target = "createdBy", ignore = true)
  @Mapping(target = "modifiedDateUtc", ignore = true)
  @Mapping(target = "modifiedBy", ignore = true)
  @Mapping(target = "version", ignore = true)
  void updateWithDto(@MappingTarget WithdrawEntity entity, Withdraw dto);
}
