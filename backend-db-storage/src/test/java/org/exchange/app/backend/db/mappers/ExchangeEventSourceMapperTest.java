package org.exchange.app.backend.db.mappers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.LocalDateTime;
import org.exchange.app.admin.api.model.SystemAccountOperation;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

public class ExchangeEventSourceMapperTest {

  private final ExchangeEventSourceMapper mapper = Mappers.getMapper(
      ExchangeEventSourceMapper.class);

  @Test
  void toDto_should_convertExchangeEventSourceEntity_when_correctExchangeEventSourceData() {

    LocalDateTime dateTime = LocalDateTime.of(2025, 7, 24, 12, 0, 0);
    ExchangeEventSourceEntity entity = new ExchangeEventSourceEntity();
    entity.setDateUtc(dateTime);
    entity.setAmount(100L);

    SystemAccountOperation dto = mapper.toDto(entity);

    assertNotNull(dto);
    assertThat(dto.getDateUtc()).isEqualTo(dateTime);
    assertThat(dto.getAmount()).isEqualTo(100L);

  }
}
