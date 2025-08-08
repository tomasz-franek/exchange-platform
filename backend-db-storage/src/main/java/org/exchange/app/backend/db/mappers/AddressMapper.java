package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.AddressEntity;
import org.exchange.app.common.api.model.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AddressMapper {

	AddressMapper INSTANCE = Mappers.getMapper(AddressMapper.class);

	Address toDto(AddressEntity entity);

	AddressEntity toEntity(Address address);

	@Mapping(target = "userId", ignore = true)
	@Mapping(target = "id", ignore = true)
	void updateWithDto(@MappingTarget AddressEntity addressEntity, Address address);
}
