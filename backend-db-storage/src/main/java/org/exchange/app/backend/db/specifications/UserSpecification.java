package org.exchange.app.backend.db.specifications;

import static org.exchange.app.backend.db.specifications.SpecificationConstraints.ESCAPE_CHAR;
import static org.exchange.app.backend.db.specifications.SpecificationConstraints.prepareLikeParam;

import org.exchange.app.backend.db.entities.UserEntity;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

  private UserSpecification() {
  }
  public static Specification<UserEntity> emailLike(String email) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")),
            prepareLikeParam(email), ESCAPE_CHAR);
  }
}
