package org.exchange.app.backend.db.specifications;

import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.springframework.data.jpa.domain.Specification;

public class ExchangeEventSpecification {

  public static Specification<ExchangeEventEntity> fromDate(Long dateUtc) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.greaterThanOrEqualTo(root.get("dateUtc"), dateUtc);
  }

  public static Specification<ExchangeEventEntity> userAccountID(List<UUID> userAccounts) {
    return (root, query, criteriaBuilder) ->
        root.get("userAccountId").in(userAccounts);
  }

  public static Specification<ExchangeEventEntity> onlyActive() {
    return (root, query, criteriaBuilder) ->
        root.get("ticketStatus")
            .in(
                UserTicketStatus.NEW,
                UserTicketStatus.ACTIVE,
                UserTicketStatus.PARTIAL_REALIZED);
  }
}
