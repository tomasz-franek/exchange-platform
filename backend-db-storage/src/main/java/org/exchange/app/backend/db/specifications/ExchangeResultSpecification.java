package org.exchange.app.backend.db.specifications;

import org.exchange.app.backend.db.entities.ExchangeResultEntity;
import org.springframework.data.jpa.domain.Specification;

public class ExchangeResultSpecification {

  public static Specification<ExchangeResultEntity> buyTicketId(Long buyTicketId) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("buyTicketId"), buyTicketId);
  }

  public static Specification<ExchangeResultEntity> sellTicketId(Long sellTicketId) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.equal(root.get("sellTicketId"), sellTicketId);
  }
}
