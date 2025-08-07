package org.exchange.app.backend.db.specifications;

import org.exchange.app.backend.db.entities.AddressEntity;
import org.springframework.data.jpa.domain.Specification;

public class AddressSpecification {

	public static Specification<AddressEntity> country(String country) {
		return (root, query, criteriaBuilder) ->
				criteriaBuilder.equal(root.get("country"), country);
	}

	public static Specification<AddressEntity> zipCode(String zipCode) {
		return (root, query, criteriaBuilder) ->
				criteriaBuilder.equal(root.get("zipCode"), zipCode);
	}
}
