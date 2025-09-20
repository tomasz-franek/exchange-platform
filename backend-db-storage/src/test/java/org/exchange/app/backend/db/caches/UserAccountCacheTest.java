package org.exchange.app.backend.db.caches;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.jpa.domain.Specification;

class UserAccountCacheTest {

  @Mock
  private UserAccountRepository userAccountRepository;

  private UserAccountCache userAccountCache;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    userAccountCache = new UserAccountCache(userAccountRepository);
  }

  @Test
  public void getUserAccount_should_returnEmptyOption_when_calledWithNullCoreTicket() {
    Optional<UserAccountEntity> result = userAccountCache.getUserAccount(null);
    assertThat(result).isEmpty();
    result = userAccountCache.getUserAccount(null);
    assertThat(result).isEmpty();
  }

  @Test
  public void getUserAccount_should_returnUserAccount_when_calledWithPreparedCoreTicket() {
    UUID userId = UUID.randomUUID();
    CoreTicket coreTicket = new CoreTicket(1L,1L,1,userId, Pair.CHF_PLN, Direction.BUY);
    UserAccountEntity response = new UserAccountEntity();
    when(userAccountRepository.findOne(any(Specification.class))).thenReturn(Optional.of(response));

    Optional<UserAccountEntity> result = userAccountCache.getUserAccount(coreTicket);
    assertThat(result).isPresent();
    assertThat(result.get()).isEqualTo(response);
  }

  @Test
  public void getUserAccount_should_returnValueFromCache_when_whenObjectIsInCache() {
    UUID userId = UUID.randomUUID();
    CoreTicket coreTicket = new CoreTicket(1L,1L,1,userId, Pair.CHF_PLN, Direction.BUY);
    UserAccountEntity response = new UserAccountEntity();
    response.setId(UUID.randomUUID());
    when(userAccountRepository.findOne(any(Specification.class))).thenReturn(Optional.of(response));

    Optional<UserAccountEntity> result = userAccountCache.getUserAccount(coreTicket);
    assertThat(result).isPresent();
    assertThat(result.get()).isEqualTo(response);
    verify(userAccountRepository, times(1)).findOne(any(Specification.class));
    when(userAccountRepository.findOne(any(Specification.class))).thenReturn(Optional.empty());
    result = userAccountCache.getUserAccount(coreTicket);
    assertThat(result).isPresent();
    assertThat(result.get()).isEqualTo(response);
  }

  @Test
  public void getUserAccount_should_returnUserAccount_when_calledWithCurrency() {
    UserAccountEntity response = new UserAccountEntity();
    when(userAccountRepository.findOne(any(Specification.class))).thenReturn(Optional.of(response));

    Optional<UserAccountEntity> result = userAccountCache.getUserAccount(UUID.randomUUID(),"USD");
    assertThat(result).isPresent();
    assertThat(result.get()).isEqualTo(response);
  }

  @Test
  public void getUserAccount_should_returnValueFromCacheForUserIdAndCurrency_when_whenObjectIsInCache() {
    UUID userId = UUID.randomUUID();
    UserAccountEntity response = new UserAccountEntity();

    when(userAccountRepository.findOne(any(Specification.class))).thenReturn(Optional.of(response));

    Optional<UserAccountEntity> result = userAccountCache.getUserAccount(userId,"EUR");
    assertThat(result).isPresent();
    assertThat(result.get()).isEqualTo(response);
    verify(userAccountRepository, times(1)).findOne(any(Specification.class));
    when(userAccountRepository.findOne(any(Specification.class))).thenReturn(Optional.empty());
    result = userAccountCache.getUserAccount(userId,"EUR");
    assertThat(result).isPresent();
    assertThat(result.get()).isEqualTo(response);
  }

}