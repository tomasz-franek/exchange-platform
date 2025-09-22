package org.exchange.app.backend.db.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDateTime;
import java.util.UUID;
import org.exchange.app.backend.common.exceptions.SystemValidationException;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.DbStorageConfig;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.common.api.model.EventType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;

@SpringBootTest
@ContextConfiguration(classes = {DbStorageConfig.class})
class ExchangeEventSourceEntityServiceImplTest {

  @Autowired
  private ExchangeEventSourceEntityServiceImpl exchangeEventSourceEntityServiceImpl;

  @Test
  void validate_should_throwException_when_columnNulls() {
    SystemValidationException systemValidationException = assertThrows(
        SystemValidationException.class,
        () -> ExchangeEventSourceEntityServiceImpl.validate(new ExchangeEventSourceEntity()));

    assertThat(systemValidationException.getExceptionResponse().getMessage()).isEqualTo(
        "Validation errors ["
            + "Field 'eventType' is null but column is marked as not null, "
            + "Field 'currency' is null but column is marked as not null, "
            + "Field 'createdBy' is null but column is marked as not null, "
            + "Field 'createdDateUtc' is null but column is marked as not null"
            + "]");
  }

  @Test
  void validate_should_throwException_when_columnValueLongerThanExpected() {
    ExchangeEventSourceEntity entity = new ExchangeEventSourceEntity();
    entity.setCurrency("1234567890");
    entity.setEventType(EventType.CANCEL);
    entity.setCreatedBy(UUID.randomUUID());
    entity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    SystemValidationException systemValidationException = assertThrows(
        SystemValidationException.class,
        () -> ExchangeEventSourceEntityServiceImpl.validate(entity));

    assertThat(systemValidationException.getExceptionResponse().getMessage()).isEqualTo(
        "Validation errors [Field 'currency' exceeds maximum length of 3.]");
  }

  @Test
  void createEntity_should_createEntityObject_when_correctFieldValues() {
    ExchangeEventSourceEntity entity = ExchangeEventSourceEntityServiceImpl.createEntity(1L,
        UUID.fromString("b99d26c9-ea90-4b86-83bc-3b8f89263e31"),
        LocalDateTime.of(2025, 9, 18, 18, 41, 16),
        EventType.FEE, "USD", 1L, 1L,
        UUID.fromString("b1209fdd-f7d1-4f70-8f1b-109cda46a153"));
    assertThat(entity).isNotNull();
    assertThat(entity.getUserAccountId().toString()).isEqualTo(
        "b99d26c9-ea90-4b86-83bc-3b8f89263e31");
    assertThat(entity.getCreatedBy().toString()).isEqualTo(
        "b1209fdd-f7d1-4f70-8f1b-109cda46a153");
  }

  @Test
  void getExchangeAccountEventSourceEntity_should_getExchangeEventSourceEntityWithNegativeAmountAndSystemExchangeAccountId_when_methodCalled() {
    String currency = "USD";
    Long amount = 100L;
    ExchangeEventSourceEntity baseEntity = new ExchangeEventSourceEntity();
    baseEntity.setAmount(amount);
    baseEntity.setUserAccountId(UUID.randomUUID());
    baseEntity.setCurrency(currency);
    baseEntity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    ExchangeEventSourceEntity entity = exchangeEventSourceEntityServiceImpl.getExchangeAccountEventSourceEntity(
        baseEntity);
    assertThat(entity).isNotNull();
    assertThat(entity.getAmount()).isEqualTo(-amount);
    assertThat(entity.getUserAccountId()).isEqualTo(
        UUID.fromString("921467e9-6fde-46e7-a329-000000000005"));
    assertThat(entity.getCurrency()).isEqualTo(currency);
    ;
  }
}