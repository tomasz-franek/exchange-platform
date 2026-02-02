package org.exchange.app.backend.db.mappers;

import static org.assertj.core.api.Assertions.assertThat;

import org.exchange.app.backend.db.entities.WithdrawEntity;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.Withdraw;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

class WithdrawMapperTest {

  private WithdrawMapper mapper;

  @BeforeEach
  public void setUp() {
    mapper = Mappers.getMapper(WithdrawMapper.class);
  }

  @Test
  public void toEntity_should_setEntityFields_when_called() {

    Withdraw withdraw = new Withdraw();
    withdraw.setId(15L);
    withdraw.setVersion(42);
    withdraw.setCurrency(Currency.USD);
    withdraw.setAmount(55986L);

    WithdrawEntity entity = mapper.toEntity(withdraw);

    assertThat(withdraw.getId()).isEqualTo(entity.getId());
    assertThat(withdraw.getVersion()).isEqualTo(entity.getVersion());
    assertThat(withdraw.getAmount()).isEqualTo(entity.getAmount());
  }

  @Test
  public void toEntity_should_setDtoFields_when_called() {

    WithdrawEntity entity = new WithdrawEntity();
    entity.setId(43L);
    entity.setVersion(443);
    entity.setAmount(8559L);
    Withdraw dto = mapper.toDto(entity);

    assertThat(dto.getId()).isEqualTo(entity.getId());
    assertThat(dto.getAmount()).isEqualTo(entity.getAmount());
    assertThat(dto.getVersion()).isEqualTo(entity.getVersion());
  }

  @Test
  public void updateWithDto_should_updateEntityFields_when_called() {

    WithdrawEntity entityToUpdate = new WithdrawEntity();
    entityToUpdate.setId(43L);
    entityToUpdate.setVersion(443);
    entityToUpdate.setAmount(8559L);

    Withdraw withdraw = new Withdraw();
    withdraw.setId(15L);
    withdraw.setVersion(42);
    withdraw.setCurrency(Currency.USD);
    withdraw.setAmount(55986L);

    mapper.updateWithDto(entityToUpdate, withdraw);

    assertThat(entityToUpdate.getId()).isEqualTo(entityToUpdate.getId());
    assertThat(entityToUpdate.getAmount()).isEqualTo(withdraw.getAmount());
    assertThat(entityToUpdate.getVersion()).isEqualTo(entityToUpdate.getVersion());
  }
}