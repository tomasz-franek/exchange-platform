package org.exchange.app.backend.db.specifications;


import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class AccountSpecificationTest {

  @Mock
  private CriteriaBuilder criteriaBuilder;

  @Mock
  private Root<UserAccountEntity> root;

  @Mock
  private CriteriaQuery<?> query;
  private UUID userId;
  private List<UUID> userAccountIds;

  @Mock
  private Path<Object> userAccountIdsPath;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    userId = UUID.randomUUID();
    userAccountIds = List.of(UUID.randomUUID(), UUID.randomUUID());
  }

  @Test
  void userAccountIDs() {
    var specification = AccountSpecification.userAccountIDs(userAccountIds);
    Path idPath = mock(Path.class);
    when(root.get("id")).thenReturn(idPath);
    when(idPath.in(userAccountIds)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(root.get("id")).in(userAccountIds);
  }

  @Test
  void userId() {
    var specification = AccountSpecification.userId(userId);
    Path userPath = mock(Path.class);
    when(root.get("user")).thenReturn(userPath);
    when(userPath.get("id")).thenReturn(mock(Path.class));
    when(criteriaBuilder.equal(any(), any())).thenReturn(mock(Predicate.class));

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(root).get("user");
    verify(userPath).get("id");
    verify(criteriaBuilder).equal(any(), eq(userId));
  }
}