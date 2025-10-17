package org.exchange.app.backend.db.mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.SystemCurrency;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class CurrencyMapperTest {

  private CurrencyMapper currencyMapper;

  @BeforeEach
  public void setUp() {
    currencyMapper = new CurrencyMapperImpl();
  }

  @Test
  public void testToDto() {

    CurrencyEntity entity = new CurrencyEntity();
    entity.setId(1L);
    entity.setMinimumExchange(100L);
    entity.setCode(Currency.CHF);

    SystemCurrency systemCurrency = currencyMapper.toDto(entity);

    assertNotNull(systemCurrency);
    assertEquals(1L, systemCurrency.getId());
    assertEquals(100, systemCurrency.getMinimumExchange());
    assertEquals("USD", systemCurrency.getCurrency());
  }

  @Test
  public void testToDto_NullEntity() {

    SystemCurrency systemCurrency = currencyMapper.toDto(null);

    assertNull(systemCurrency);
  }

  @Test
  public void testUpdateWithDto() {
    CurrencyEntity entity = new CurrencyEntity();
    entity.setId(1L);
    entity.setMinimumExchange(100L);

    SystemCurrency systemCurrency = new SystemCurrency();
    systemCurrency.setMinimumExchange(150L);

    currencyMapper.updateWithDto(entity, systemCurrency);

    assertEquals(150, entity.getMinimumExchange());
  }

  @Test
  public void testUpdateWithDto_NullDto() {
    CurrencyEntity entity = new CurrencyEntity();
    entity.setId(1L);
    entity.setMinimumExchange(100L);

    currencyMapper.updateWithDto(entity, null);

    assertEquals(100, entity.getMinimumExchange());
  }
}
