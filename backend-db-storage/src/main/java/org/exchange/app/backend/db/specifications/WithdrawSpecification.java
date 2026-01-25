package org.exchange.app.backend.db.specifications;

import org.exchange.app.backend.db.entities.WithdrawEntity;
import org.exchange.app.common.api.model.Currency;
import org.springframework.data.jpa.domain.Specification;

public class WithdrawSpecification {

  public static Specification<WithdrawEntity> currency(Currency currency) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("currency").get("code"), currency);
  }
}
