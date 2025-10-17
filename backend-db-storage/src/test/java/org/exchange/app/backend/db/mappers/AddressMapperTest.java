package org.exchange.app.backend.db.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.UUID;
import org.exchange.app.backend.db.entities.AddressEntity;
import org.exchange.app.common.api.model.Address;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

class AddressMapperTest {


  private AddressMapper addressMapper;

  @BeforeEach
  public void setUp() {
    addressMapper = Mappers.getMapper(AddressMapper.class);
  }

  @Test
  public void testToDto() {

    AddressEntity entity = new AddressEntity();
    entity.setStreet("Main St");
    entity.setCity("Anytown");
    entity.setZipCode("12345");


    Address address = addressMapper.toDto(entity);


    assertEquals("Main St", address.getStreet());
    assertEquals("Anytown", address.getCity());
    assertEquals("12345", address.getZipCode());
  }

  @Test
  public void testToEntity() {

    Address address = new Address();
    address.setStreet("Main St");
    address.setCity("Anytown");
    address.setZipCode("12345");


    AddressEntity entity = addressMapper.toEntity(address);


    assertEquals("Main St", entity.getStreet());
    assertEquals("Anytown", entity.getCity());
    assertEquals("12345", entity.getZipCode());
  }

  @Test
  public void testUpdateWithDto() {

    AddressEntity entity = new AddressEntity();
    UUID id = UUID.randomUUID();
    UUID userId = UUID.randomUUID();
    entity.setId(id);
    entity.setUserId(userId);
    entity.setStreet("Old St");
    entity.setCity("Oldtown");
    entity.setZipCode("54321");
    entity.setPhone("phone");
    entity.setVatID("vatid");
    entity.setTaxID("taxid");

    Address address = new Address();
    address.setId(UUID.randomUUID());
    address.setUserId(UUID.randomUUID());
    address.setStreet("Main St");
    address.setCity("Anytown");
    address.setZipCode("12345");
    address.setVatID("vat2");
    address.setTaxID("tax2");

    addressMapper.updateWithDto(entity, address);

    assertEquals("Main St", entity.getStreet());
    assertEquals("Anytown", entity.getCity());
    assertEquals("12345", entity.getZipCode());
    assertEquals(id, entity.getId());
    assertEquals(userId, entity.getUserId());
    assertEquals("vat2",entity.getVatID());
    assertEquals("tax2",entity.getTaxID());
  }
}