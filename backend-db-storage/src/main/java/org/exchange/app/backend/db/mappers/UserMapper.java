package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.common.api.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

  UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);


  UserEntity toEntity(User user);

  User toDto(UserEntity userEntity);
}
