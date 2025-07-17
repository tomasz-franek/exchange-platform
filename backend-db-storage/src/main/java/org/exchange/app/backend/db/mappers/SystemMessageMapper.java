package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.SystemMessageEntity;
import org.exchange.app.common.api.model.SystemMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring" )
public interface SystemMessageMapper {

  SystemMessageMapper INSTANCE = Mappers.getMapper(SystemMessageMapper.class);

  SystemMessage toDto(SystemMessageEntity entity);

  SystemMessageEntity toEntity(SystemMessage systemMessage);

  @Mapping(target = "id", ignore = true)
  void updateWithDto(@MappingTarget SystemMessageEntity messageEntityToUpdate,
      SystemMessage systemMessage);
}
