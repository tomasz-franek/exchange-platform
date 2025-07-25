package org.exchange.app.backend.db.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.sql.Timestamp;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.UserTicket;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

public class ExchangeEventMapperTest {

  private final ExchangeEventMapper mapper = Mappers.getMapper(ExchangeEventMapper.class);

  @Test
  void toDto_should_convertExchangeEntityToUserTicket_when_correctExchangeEntityData() {

    ExchangeEventEntity entity = new ExchangeEventEntity();
    entity.setDateUtc(Timestamp.valueOf("2025-07-24 12:00:00"));
    entity.setAmount(100L);
    entity.setDirection("S");

    UserTicket dto = mapper.toDto(entity);

    assertNotNull(dto);
    assertEquals(1753358400, dto.getEpochUTC());
    assertEquals(Direction.SELL, dto.getDirection());
    assertEquals(100L, dto.getAmount());

  }

  @Test
  void toEpochLong_should_convertTimestampToLong_when_called() {
    Timestamp timestamp = Timestamp.valueOf("2025-07-24 12:00:00");

    Long epochLong = mapper.toEpochLong(timestamp);

    assertNotNull(epochLong);
    assertEquals(1753358400, epochLong);
  }

  @Test
  void convertDirection_should_convertSingleCharacterToDirectionEnum_when_called() {
    Direction buyDirection = mapper.convertDirection("B");
    Direction sellDirection = mapper.convertDirection("S");

    assertEquals(Direction.BUY, buyDirection);
    assertEquals(Direction.SELL, sellDirection);
  }

  @Test
  void convertDirection_should_returnUnknownDirection_when_wrongSingleCharacterDirectionCode() {

    Exception exception = assertThrows(RuntimeException.class, () -> {
      mapper.convertDirection("X");
    });

    assertEquals("Unknown direction X", exception.getMessage());
  }
}
