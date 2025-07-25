package org.exchange.app.backend.db.mappers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.UUID;
import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.external.api.model.AccountBalance;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

public class UserAccountMapperTest {

  private UserAccountMapper mapper;

  @BeforeEach
  public void setUp() {
    mapper = Mappers.getMapper(UserAccountMapper.class);
  }

  @Test
  public void toDto_should_setUserAccountEntityFields_when_called() {
    UserAccount userAccount = new UserAccount();
    userAccount.setId(UUID.randomUUID());
    userAccount.setCurrency(Currency.USD);
    userAccount.setVersion(3);

    UserAccountEntity entity = mapper.toEntity(userAccount);

    assertThat(userAccount.getId()).isEqualTo(entity.getId());
    assertThat(userAccount.getVersion()).isEqualTo(entity.getVersion());
    assertNull(entity.getCurrency());
    assertNull(entity.getUser());
  }

  @Test
  public void toDto_should_mapCurrencyToString_when_called() {
    UserAccountEntity entity = new UserAccountEntity();
    entity.setId(UUID.randomUUID());
    entity.setUser(new UserEntity());
    CurrencyEntity currencyEntity = new CurrencyEntity();
    currencyEntity.setCode(Currency.GBP);
    entity.setCurrency(currencyEntity);

    UserAccount dto = mapper.toDto(entity);

    assertThat(dto.getId()).isEqualTo(entity.getId());
    assertThat(dto.getCurrency()).isEqualTo(currencyEntity.getCode());
  }

  @Test
  public void map_should_mapCurrencyToString_when_called() {

    CurrencyEntity currencyEntity = new CurrencyEntity();
    currencyEntity.setCode(Currency.GBP); // Assuming Currency is a simple class

    Currency currency = mapper.map(currencyEntity);

    assertThat(currencyEntity.getCode()).isEqualTo(currency);
  }

  @Test
  public void toAccountBalance_should_updateVersion_when_methodCalled() {
    // Given
    UserAccountEntity entity = new UserAccountEntity();
    entity.setId(UUID.randomUUID());
    CurrencyEntity currencyEntity = new CurrencyEntity();
    currencyEntity.setCode(Currency.USD);
    entity.setCurrency(currencyEntity);

    AccountBalance accountBalance = mapper.toAccountBalance(entity);

    assertThat(accountBalance.getCurrency()).isEqualTo(currencyEntity.getCode().toString());
    assertNull(accountBalance.getUserAccountId());
    assertNull(accountBalance.getAmount());
  }

  @Test
  public void updateWithDto_should_updateUserAccount_when_methodCalled() {
    UUID uuid = UUID.randomUUID();
    UserAccountEntity entityToUpdate = new UserAccountEntity();
    entityToUpdate.setId(uuid);
    entityToUpdate.setVersion(1);

    UserAccount userAccount = new UserAccount();
    userAccount.setVersion(2);

    mapper.updateWithDto(entityToUpdate, userAccount);

    assertThat(entityToUpdate.getId()).isEqualTo(uuid);
    assertThat(entityToUpdate.getVersion()).isEqualTo(2);
    assertNull(entityToUpdate.getCurrency());
    assertNull(entityToUpdate.getUser());
  }
}

