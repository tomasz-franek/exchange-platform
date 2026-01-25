package org.exchange.app.backend.db.validators;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;
import org.exchange.app.backend.common.exceptions.SystemValidationException;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.common.validators.SystemValidator;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserStatus;
import org.junit.jupiter.api.Test;

class EntityValidatorTest {

  public final UUID EXISTING_UUID = UUID.fromString("00000000-0000-0000-0002-000000000001");

  @Test
  void haveCorrectFieldTextValues_should_generateSystemValidationException_when_fieldStringValueLongerThanDefined() {
    UserEntity userEntity = new UserEntity();
    userEntity.setEmail("1".repeat(300));
    SystemValidationException exception = assertThrows(SystemValidationException.class, () ->
        SystemValidator.validate(EntityValidator.haveCorrectFieldTextValues(userEntity))
            .throwValidationExceptionWhenErrors());
    String expectedMessage = "Validation errors [Field 'email' exceeds maximum length of 256.]";
    String actualMessage = exception.getExceptionResponse().getMessage();

    assertThat(actualMessage).isEqualTo(expectedMessage);
  }

  @Test
  void haveCorrectFieldTextValues_should_validateColumn_when_typeIsEnumString() {
    ExchangeEventSourceEntity entity = new ExchangeEventSourceEntity();
    entity.setEventType(EventType.EXCHANGE);
    assertDoesNotThrow(() ->
        SystemValidator.validate(EntityValidator.haveCorrectFieldTextValues(entity))
            .throwValidationExceptionWhenErrors()
    );
  }

  @Test
  void haveCorrectFieldTextValues_should_validateColumn_when_typeIsNullEnumString() {
    ExchangeEventSourceEntity entity = new ExchangeEventSourceEntity();
    assertDoesNotThrow(() ->
        SystemValidator.validate(EntityValidator.haveCorrectFieldTextValues(entity))
            .throwValidationExceptionWhenErrors()
    );
  }

  @Test
  void haveCorrectFieldTextValues_should_validateWithoutException_when_fieldStringValuesAreCorrect() {
    UserEntity userEntity = new UserEntity();
    userEntity.setEmail("1".repeat(256));
    assertDoesNotThrow(() ->
        SystemValidator.validate(EntityValidator.haveCorrectFieldTextValues(userEntity))
            .throwValidationExceptionWhenErrors()
    );
  }

  @Test
  void haveCorrectFieldTextValues_should_generateIllegalArgumentException_when_fieldStringValueLongerThanDefined() {
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
    String expectedMessage = "Validation errors ["
        + "Field 'email' is null but column is marked as not null, "
        + "Field 'status' is null but column is marked as not null, "
        + "Field 'createdDateUtc' is null but column is marked as not null]";
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
    userEntity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    assertDoesNotThrow(() -> SystemValidator.validate(EntityValidator.haveNotNullValues(userEntity))
        .throwValidationExceptionWhenErrors());
  }

  @Test
  void checksumIsCorrect_should_validateWithoutException_when_ValueInObjectChecksumColumnIsCorrect() {
    ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();
    exchangeEventSourceEntity.setAmount(23400L);
    exchangeEventSourceEntity.setUserAccountId(UUID.randomUUID());
    exchangeEventSourceEntity.setEventType(EventType.DEPOSIT);
    exchangeEventSourceEntity.setCreatedBy(EXISTING_UUID);
    exchangeEventSourceEntity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    exchangeEventSourceEntity.setChecksum(ChecksumUtil.checksum(exchangeEventSourceEntity));
    assertDoesNotThrow(
        () -> SystemValidator.validate(EntityValidator.haveValidChecksum(exchangeEventSourceEntity))
            .throwValidationExceptionWhenErrors());
  }

  @Test
  void checksumIsCorrect_should_validateWithException_when_ValueInObjectChecksumColumnIsWrong() {
    ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();
    exchangeEventSourceEntity.setAmount(23400L);
    exchangeEventSourceEntity.setId(12L);
    exchangeEventSourceEntity.setUserAccountId(UUID.randomUUID());
    exchangeEventSourceEntity.setEventType(EventType.DEPOSIT);
    exchangeEventSourceEntity.setCreatedBy(EXISTING_UUID);
    exchangeEventSourceEntity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    exchangeEventSourceEntity.setChecksum(ChecksumUtil.checksum(exchangeEventSourceEntity) + 1L);
    SystemValidationException exception = assertThrows(SystemValidationException.class,
        () -> SystemValidator.validate(EntityValidator.haveValidChecksum(exchangeEventSourceEntity))
            .throwValidationExceptionWhenErrors());
    String expectedMessage = "Validation errors [Invalid checksum for ExchangeEventSourceEntity with id=12]";
    String actualMessage = exception.getExceptionResponse().getMessage();

    assertThat(actualMessage).isEqualTo(expectedMessage);
  }
}