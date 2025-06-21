package org.exchange.app.backend.db.repositories;


import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.external.api.model.AccountBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccountEntity, UUID> {

  @Query("SELECT u FROM UserAccountEntity u WHERE u.user.id=:userId AND u.currency.code=:currency")
  Optional<UserAccountEntity> findByUserIdAndCurrency(@Param("userId") UUID userId,
      @Param("currency") Currency currency);


  @Query("SELECT uae FROM UserAccountEntity uae "
      + "JOIN FETCH uae.currency "
      + "JOIN FETCH uae.user u "
      + "WHERE u.id=:userId ")
  List<UserAccountEntity> findByUserId(@Param("userId") UUID userId);

  @Query("SELECT uae.id FROM UserAccountEntity uae "
      + "WHERE uae.user.id = :userId ")
  List<UUID> findAccountsForUser(@Param("userId") UUID userId);

  @Query("SELECT 1 "
      + "FROM UserAccountEntity uae "
      + "WHERE uae.id=:userAccountId "
      + "AND uae.user.id = :userId ")
  int existsUserIdAndUserAccountId(@Param("userId") UUID userId,
      @Param("userAccountId") UUID userAccountId);

  @Query("SELECT NEW org.exchange.app.external.api.model.AccountBalance( "
      + "CAST(uae.currency.code AS String), "
      + "CAST(COALESCE(SUM(ees.amount), 0) AS LONG), "
      + "uae.id "
      + ") "
      + "FROM UserAccountEntity uae "
      + "LEFT JOIN ExchangeEventSourceEntity ees ON uae.id = ees.userAccountId "
      + "WHERE uae.user.id = :userId "
      + "GROUP BY uae.currency.code, uae.id "
      + "ORDER BY uae.currency.code")
  List<AccountBalance> getAccountBalances(@Param("userId") UUID userId);

  @Query("SELECT uae.id, uae.user.id FROM UserAccountEntity uae WHERE uae.id IN (:userAccounts) ")
  List<UUID[]> getUserAccountMap(@Param("userAccounts") Set<UUID> userAccounts);
}
