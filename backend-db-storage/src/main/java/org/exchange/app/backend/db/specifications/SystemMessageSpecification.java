package org.exchange.app.backend.db.specifications;

import java.time.LocalDateTime;
import org.exchange.app.backend.db.entities.SystemMessageEntity;
import org.springframework.data.jpa.domain.Specification;

public class SystemMessageSpecification {

  private SystemMessageSpecification() {
  }
  public static Specification<SystemMessageEntity> active(boolean active) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("active"), active);
  }

  public static Specification<SystemMessageEntity> activeAtDate(LocalDateTime date) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.and(
            criteriaBuilder.lessThanOrEqualTo(root.get("dateFromUtc"), date),
            criteriaBuilder.greaterThanOrEqualTo(root.get("dateToUtc"), date)
        );
  }
}
