package org.exchange.app.backend.db.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccountEntity, UUID> {

  @Query("SELECT u FROM UserAccountEntity u WHERE u.user.id=:userId AND u.currency.code=:currency")
  Optional<UserAccountEntity> findByUserIdAndCurrency(@Param("userId") UUID userId,
      @Param("currency") String currency);


  @Query("SELECT uae FROM UserAccountEntity uae "
      + "JOIN FETCH uae.currency "
      + "JOIN FETCH uae.user u "
      + "WHERE u.id=:userId ")
  List<UserAccountEntity> findByUserId(@Param("userId") UUID userId);

  @Query("SELECT uae.id FROM UserAccountEntity uae "
      + "WHERE uae.user.id = :userId ")
  List<UUID> findAccountsForUser(@Param("userId") UUID userId);
}
