package org.exchange.app.backend.db.specifications;

import java.time.LocalDateTime;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.springframework.data.jpa.domain.Specification;

public class ExchangeEventSourceSpecification {

  public static Specification<ExchangeEventSourceEntity> fromDate(LocalDateTime dateUtc) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.greaterThanOrEqualTo(root.get("dateUtc"), dateUtc);
  }

  public static Specification<ExchangeEventSourceEntity> toDate(LocalDateTime dateUtc) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.lessThanOrEqualTo(root.get("dateUtc"), dateUtc);
  }

  public static Specification<ExchangeEventSourceEntity> userAccountID(UUID userAccountId) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("userAccountId"), userAccountId);
  }
}
