package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.UserPropertyEntity;
import org.exchange.app.common.api.model.UserProperty;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserPropertyMapper {

  UserPropertyMapper INSTANCE = Mappers.getMapper(UserPropertyMapper.class);

  UserPropertyEntity toEntity(UserProperty userAccount);

  UserProperty toDto(UserPropertyEntity userPropertyEntity);

  @Mapping(target = "userId", ignore = true)
  void updateWithDto(@MappingTarget UserPropertyEntity userPropertyEntity,
      UserProperty userProperty);
}
