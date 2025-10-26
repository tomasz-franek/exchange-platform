package org.exchange.app.backend.db.specifications;

import java.util.UUID;
import org.exchange.app.backend.db.entities.UserBankAccountEntity;
import org.springframework.data.jpa.domain.Specification;

public class UserBankAccountSpecification {

  public static Specification<UserBankAccountEntity> id(UUID id) {
    return (root, _, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("id"), id);
  }

  public static Specification<UserBankAccountEntity> userAccountId(UUID userAccountId) {
    return (root, _, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("userAccountId"), userAccountId);
  }
}
