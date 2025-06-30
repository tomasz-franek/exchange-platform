package org.exchange.app.backend.db.validators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.apache.commons.lang3.StringUtils;
import org.exchange.app.backend.common.exceptions.SystemValidationException;
import org.exchange.app.backend.common.validators.SystemValidator;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.common.api.model.UserStatus;
import org.junit.jupiter.api.Test;

class EntityValidatorTest {

  @Test
  void haveCorrectFieldTextValues_should_generateSystemValidationException_when_fieldStringValueLongerThanDefined() {
    UserEntity userEntity = new UserEntity();
    userEntity.setEmail(StringUtils.repeat("1", 300));
    SystemValidationException exception = assertThrows(SystemValidationException.class, () ->
        SystemValidator.validate(EntityValidator.haveCorrectFieldTextValues(userEntity))
            .throwValidationExceptionWhenErrors());
    String expectedMessage = "Validation errors [Field 'email' exceeds maximum length of 256.]";
    String actualMessage = exception.getExceptionResponse().getMessage();

    assertThat(actualMessage).isEqualTo(expectedMessage);
  }

  @Test
  void haveCorrectFieldTextValues_should_validateWithoutException_when_fieldStringValuesAreCorrect() {
    UserEntity userEntity = new UserEntity();
    userEntity.setEmail(StringUtils.repeat("1", 256));
    SystemValidator.validate(EntityValidator.haveCorrectFieldTextValues(userEntity))
        .throwValidationExceptionWhenErrors();
  }

  @Test
  void haveCorrectFieldTextValues_should_generateIllegalArgumentException_when_fieldStringValueLongerThanDefined() {
    UserEntity userEntity = new UserEntity();
    userEntity.setEmail(StringUtils.repeat("1", 300));
    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
        SystemValidator.validate(EntityValidator.haveCorrectFieldTextValues(""))
            .throwValidationExceptionWhenErrors());
    String expectedMessage = "Object is not an entity.";
    String actualMessage = exception.getMessage();

    assertThat(actualMessage).isEqualTo(expectedMessage);
  }

  @Test
  void haveNotNullValues_should_generateSystemValidationException_when_fieldMarkedAsNullableFalseIsNull() {
    UserEntity userEntity = new UserEntity();
    SystemValidationException exception = assertThrows(SystemValidationException.class, () ->
        SystemValidator.validate(EntityValidator.haveNotNullValues(userEntity))
            .throwValidationExceptionWhenErrors());
    String expectedMessage = "Validation errors [Field 'email' is null but column is marked as not null, Field 'status' is null but column is marked as not null]";
    String actualMessage = exception.getExceptionResponse().getMessage();

    assertThat(actualMessage).isEqualTo(expectedMessage);
  }

  @Test
  void haveNotNullValues_should_generateIllegalArgumentException_when_parameterIsNotEntity() {
    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
        SystemValidator.validate(EntityValidator.haveNotNullValues(""))
            .throwValidationExceptionWhenErrors());
    String expectedMessage = "Object is not an entity.";
    String actualMessage = exception.getMessage();

    assertThat(actualMessage).isEqualTo(expectedMessage);
  }

  @Test
  void haveNotNullValues_should_validateWithoutException_when_fieldStringValuesAreCorrect() {
    UserEntity userEntity = new UserEntity();
    userEntity.setEmail("x@x.com");
    userEntity.setStatus(UserStatus.ACTIVE);
    SystemValidator.validate(EntityValidator.haveNotNullValues(userEntity))
        .throwValidationExceptionWhenErrors();
  }
}