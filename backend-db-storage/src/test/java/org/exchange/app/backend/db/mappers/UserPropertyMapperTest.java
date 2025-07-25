package org.exchange.app.backend.db.mappers;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;
import org.exchange.app.backend.db.entities.UserPropertyEntity;
import org.exchange.app.common.api.model.UserProperty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

public class UserPropertyMapperTest {

  private UserPropertyMapper mapper;

  @BeforeEach
  public void setUp() {
    mapper = Mappers.getMapper(UserPropertyMapper.class);
  }

  @Test
  public void toEntity_should_setEntityFields_when_called() {

    UserProperty userProperty = new UserProperty();
    userProperty.setUserId(UUID.randomUUID());
    userProperty.setLocale("Test Locale");
    userProperty.setTimezone("Test Timezone");
    userProperty.setLanguage("Test Language");

    UserPropertyEntity entity = mapper.toEntity(userProperty);

    assertThat(userProperty.getUserId()).isEqualTo(entity.getUserId());
    assertThat(userProperty.getLocale()).isEqualTo(entity.getLocale());
    assertThat(userProperty.getTimezone()).isEqualTo(entity.getTimezone());
  }

  @Test
  public void toEntity_should_setDtoFields_when_called() {

    UserPropertyEntity entity = new UserPropertyEntity();
    entity.setUserId(UUID.randomUUID());
    entity.setLocale("Test Locale");
    entity.setTimezone("Test Timezone");
    entity.setLanguage("Test Language");

    UserProperty dto = mapper.toDto(entity);

    assertThat(dto.getUserId()).isEqualTo(entity.getUserId());
    assertThat(dto.getLocale()).isEqualTo(entity.getLocale());
    assertThat(dto.getTimezone()).isEqualTo(entity.getTimezone());
  }

  @Test
  public void updateWithDto_should_updateEntityFields_when_called() {

    UserPropertyEntity entityToUpdate = new UserPropertyEntity();
    UUID uuid = UUID.randomUUID();
    entityToUpdate.setUserId(uuid);
    entityToUpdate.setLocale("Test Locale");
    entityToUpdate.setTimezone("Test Timezone");
    entityToUpdate.setLanguage("Test Language");
    entityToUpdate.setVersion(8);

    UserProperty userProperty = new UserProperty();
    userProperty.setVersion(3);
    userProperty.setLocale("Updated Locale");
    userProperty.setTimezone("Updated Timezone");
    userProperty.setLanguage("Updated Language");

    mapper.updateWithDto(entityToUpdate, userProperty);

    assertThat(entityToUpdate.getUserId()).isEqualTo(uuid);
    assertThat(entityToUpdate.getLocale()).isEqualTo("Updated Locale");
    assertThat(entityToUpdate.getTimezone()).isEqualTo("Updated Timezone");
    assertThat(entityToUpdate.getLanguage()).isEqualTo("Updated Language");
  }
}

