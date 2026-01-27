package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.WithdrawEntity;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.Withdraw;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface WithdrawMapper {

  WithdrawMapper INSTANCE = Mappers.getMapper(WithdrawMapper.class);

  WithdrawEntity toEntity(Withdraw withdraw);

  Withdraw toDto(WithdrawEntity withdrawEntity);

  default Currency map(CurrencyEntity value) {
    if (value != null) {
      return Currency.valueOf(value.getCode().getValue());
    }
    return null;
  }
}
