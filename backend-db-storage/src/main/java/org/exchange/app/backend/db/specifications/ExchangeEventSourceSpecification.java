package org.exchange.app.backend.db.specifications;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.common.api.model.EventType;
import org.springframework.data.jpa.domain.Specification;

public class ExchangeEventSourceSpecification {

  public static Specification<ExchangeEventSourceEntity> fromDateUtc(LocalDateTime dateUtc) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.greaterThanOrEqualTo(root.get("dateUtc"), dateUtc);
  }

  public static Specification<ExchangeEventSourceEntity> toDateUtc(LocalDateTime dateUtc) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.lessThanOrEqualTo(root.get("dateUtc"), dateUtc);
  }

  public static Specification<ExchangeEventSourceEntity> userAccountID(UUID userAccountId) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("userAccountId"), userAccountId);
  }

  public static Specification<ExchangeEventSourceEntity> userAccountIDs(
      List<UUID> userAccountIdList) {
    return (root, query, criteriaBuilder) ->
        root.get("userAccountId").in(userAccountIdList);
  }

  public static Specification<ExchangeEventSourceEntity> eventId(Long eventId) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("eventId"), eventId);
  }

  public static Specification<ExchangeEventSourceEntity> eventType(EventType eventType) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("eventType"), eventType);
  }

  public static Specification<ExchangeEventSourceEntity> eventTypes(List<EventType> eventTypes) {
    return (root, query, criteriaBuilder) ->
        root.get("eventType").in(eventTypes);
  }

  public static Specification<ExchangeEventSourceEntity> reverseEventId(Long reverseEventId) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("reverseEventId"), reverseEventId);
  }
}
