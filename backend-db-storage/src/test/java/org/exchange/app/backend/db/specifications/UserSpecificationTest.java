package org.exchange.app.backend.db.specifications;

import static org.exchange.app.backend.db.specifications.SpecificationConstraints.ESCAPE_CHAR;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import org.exchange.app.backend.db.entities.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

class UserSpecificationTest {

	@Mock
	private CriteriaBuilder criteriaBuilder;

	@Mock
	private Root<UserEntity> root;

	@Mock
	private CriteriaQuery<?> query;

	private String email;

	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		email = "tesT@emaiL.COM";
	}

	@Test
	public void emailLike_should_selectLowerEmailLike_when_called() {
		var specification = UserSpecification.emailLike(email);
		Path loweredEmailExpression = Mockito.mock(Path.class);
		when(root.get("email")).thenReturn(loweredEmailExpression);
		when(criteriaBuilder.lower(loweredEmailExpression)).thenReturn(loweredEmailExpression);
		when(criteriaBuilder.like(loweredEmailExpression, email,
				ESCAPE_CHAR)).thenReturn(null);

		var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertNull(predicate);
		verify(criteriaBuilder).equal(criteriaBuilder.like(criteriaBuilder.lower(root.get("email")),
				"%" + email.toLowerCase() + "%", ESCAPE_CHAR), email);
	}

	@Test
	public void emailLike_should_selectLowerEmailLike_when_calledWithPartialEmail() {
		String partEmail = "ST@";
		var specification = UserSpecification.emailLike(partEmail);
		Path loweredEmailExpression = Mockito.mock(Path.class);
		when(root.get("email")).thenReturn(loweredEmailExpression);
		when(criteriaBuilder.lower(loweredEmailExpression)).thenReturn(loweredEmailExpression);
		when(criteriaBuilder.like(loweredEmailExpression, email,
				ESCAPE_CHAR)).thenReturn(null);

		var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertNull(predicate);
		verify(criteriaBuilder).equal(criteriaBuilder.like(criteriaBuilder.lower(root.get("email")),
				"%" + partEmail.toLowerCase() + "%", ESCAPE_CHAR), "st@");
	}
}