package org.exchange.app.backend.db.specifications;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import java.util.UUID;
import org.exchange.app.backend.db.entities.AddressEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class AddressSpecificationTest {

	@Mock
	private CriteriaBuilder criteriaBuilder;

	@Mock
	private Root<AddressEntity> root;

	@Mock
	private CriteriaQuery<?> query;

	private String country;
	private String zipCode;

	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		country = "GR";
		zipCode = UUID.randomUUID().toString();
	}

	@Test
	public void country_should_selectCountryCodeEqualTo_when_called() {
		var specification = AddressSpecification.country(country);
		when(criteriaBuilder.equal(root.get("country"), country)).thenReturn(null);

		var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertNull(predicate);
		verify(criteriaBuilder).equal(root.get("country"), country);
	}

	@Test
	public void zipCode_should_selectCountryCodeEqualTo_when_called() {
		var specification = AddressSpecification.zipCode(zipCode);
		when(criteriaBuilder.equal(root.get("zipCode"), zipCode)).thenReturn(null);

		var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertNull(predicate);
		verify(criteriaBuilder).equal(root.get("zipCode"), zipCode);
	}
}