package org.exchange.app.backend.db.mappers;

import org.exchange.app.backend.db.entities.AddressEntity;
import org.exchange.app.common.api.model.Address;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AddressMapper {

	AddressMapper INSTANCE = Mappers.getMapper(AddressMapper.class);

	Address toDto(AddressEntity entity);

}
