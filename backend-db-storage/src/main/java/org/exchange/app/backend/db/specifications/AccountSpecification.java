package org.exchange.app.backend.db.specifications;

import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.springframework.data.jpa.domain.Specification;

public class AccountSpecification {

  public static Specification<UserAccountEntity> userAccountIDs(
      List<UUID> userAccountIdList) {
    return (root, query, criteriaBuilder) ->
        root.get("id").in(userAccountIdList);
  }

  public static Specification<UserAccountEntity> userId(UUID userId) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("user").get("id"), userId);
  }
}
