package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.UserBankAccountEntity;
import org.exchange.app.common.api.model.UserBankAccount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserBankAccountMapper {

  UserBankAccountMapper INSTANCE = Mappers.getMapper(UserBankAccountMapper.class);

  @Mapping(target = "modifiedDateUtc", ignore = true)
  @Mapping(target = "modifiedBy", ignore = true)
  @Mapping(target = "verifiedDateUtc", ignore = true)
  @Mapping(target = "verifiedBy", ignore = true)
  @Mapping(target = "createdBy", ignore = true)
  UserBankAccountEntity toEntity(UserBankAccount user);

  UserBankAccount toDto(UserBankAccountEntity entity);

}
