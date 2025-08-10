package org.exchange.app.backend.db.specifications;

import static org.exchange.app.backend.db.specifications.SpecificationConstraints.ESCAPE_CHAR;

import org.exchange.app.backend.db.entities.UserEntity;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

	public static Specification<UserEntity> emailLike(String email) {
		return (root, query, criteriaBuilder) ->
				criteriaBuilder.like(criteriaBuilder.lower(root.get("email")),
						"%" + email.toLowerCase() + "%", ESCAPE_CHAR);
	}
}
