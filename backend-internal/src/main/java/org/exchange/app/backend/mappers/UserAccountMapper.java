package org.exchange.app.backend.mappers;

import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.external.api.model.AccountBalance;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserAccountMapper {

  UserAccountMapper INSTANCE = Mappers.getMapper(UserAccountMapper.class);

  UserAccount toDto(UserAccountEntity entity);

  AccountBalance toAccountBalanceDto(UserAccountEntity entity);

  UserAccountEntity toEntity(UserAccount user);

  default Currency map(CurrencyEntity value) {
    return Currency.fromValue(value.getCode());
  }

  default Currency toCurrency(String currencyString) {
    return Currency.fromValue(currencyString);
  }

  default String toString(Currency currency) {
    return currency.toString();
  }
}
