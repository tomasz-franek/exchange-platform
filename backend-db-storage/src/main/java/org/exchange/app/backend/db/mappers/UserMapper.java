package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.common.api.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

  UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);


  @Mapping(target = "id", ignore = true)
  @Mapping(target = "status", ignore = true)
  @Mapping(target = "modifiedBy", ignore = true)
  @Mapping(target = "modifiedDateUTC", ignore = true)
  @Mapping(target = "createdDateUTC", ignore = true)
  UserEntity toEntity(User user);

  @Mapping(target = "userName", ignore = true)
  @Mapping(target = "name", ignore = true)
  @Mapping(target = "lastName", ignore = true)
  @Mapping(target = "blocked", ignore = true)
  User toDto(UserEntity userEntity);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "modifiedBy", ignore = true)
  @Mapping(target = "modifiedDateUTC", ignore = true)
  @Mapping(target = "createdDateUTC", ignore = true)
  @Mapping(target = "status", ignore = true)
  void updateWithDto(@MappingTarget UserEntity entityToUpdate, User user);
}
