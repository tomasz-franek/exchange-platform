package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.external.api.model.AccountBalance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;


@Mapper(componentModel = "spring")
public interface UserAccountMapper {

  UserAccountMapper INSTANCE = Mappers.getMapper(UserAccountMapper.class);


  @Mapping(target = "currency", ignore = true)
  @Mapping(target = "user", ignore = true)
  UserAccountEntity toEntity(UserAccount userAccount);

  @Mapping(target = "userId", source = "userAccountEntity.user.id")
  UserAccount toDto(UserAccountEntity userAccountEntity);

  default Currency map(CurrencyEntity currencyEntity) {
    return currencyEntity.getCode();
  }

  @Mapping(target = "amount", ignore = true)
  AccountBalance toAccountBalance(UserAccountEntity entity);

  @Mapping(target = "user", ignore = true)
  @Mapping(target = "id", ignore = true)
  void updateWithDto(@MappingTarget UserAccountEntity entityToUpdate, UserAccount userAccount);


}
