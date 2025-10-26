package org.exchange.app.backend.db.mappers;

import org.exchange.app.admin.api.model.UserBankAccount;
import org.exchange.app.backend.db.entities.UserBankAccountEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserBankAccountMapper {

  UserBankAccountMapper INSTANCE = Mappers.getMapper(UserBankAccountMapper.class);

  UserBankAccountEntity toEntity(UserBankAccount user);

  UserBankAccount toDto(UserBankAccountEntity entity);

}
