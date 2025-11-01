package org.exchange.app.backend.db.specifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import java.util.UUID;
import org.exchange.app.backend.db.entities.UserBankAccountEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class UserBankAccountSpecificationTest {
  @Mock
  private CriteriaBuilder criteriaBuilder;

  @Mock
  private Root<UserBankAccountEntity> root;

  @Mock
  private CriteriaQuery<?> query;
  private UUID id;
  private UUID userAccountId;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    id = UUID.randomUUID();
    userAccountId = UUID.randomUUID();
  }

  @Test
  void id() {
    var specification = UserBankAccountSpecification.id(id);
    when(criteriaBuilder.equal(root.get("id"), id)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(criteriaBuilder).equal(root.get("id"), id);
  }


  @Test
  void userAccountId() {
    var specification = UserBankAccountSpecification.userAccountId(userAccountId);
    when(criteriaBuilder.equal(root.get("userAccountId"), userAccountId)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(criteriaBuilder).equal(root.get("userAccountId"), userAccountId);
  }
}