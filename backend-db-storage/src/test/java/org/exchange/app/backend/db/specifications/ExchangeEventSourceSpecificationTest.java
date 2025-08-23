package org.exchange.app.backend.db.specifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import java.time.LocalDateTime;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class ExchangeEventSourceSpecificationTest {

  @Mock
  private CriteriaBuilder criteriaBuilder;

  @Mock
  private Root<ExchangeEventSourceEntity> root;

  @Mock
  private CriteriaQuery<?> query;

  private LocalDateTime testDate;
  private UUID testUserAccountId;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    testDate = LocalDateTime.now();
    testUserAccountId = UUID.randomUUID();
  }

  @Test
  public void fromDateUtc_should_selectDateUtcGreaterThanOrEqualTo_when_called() {
    var specification = ExchangeEventSourceSpecification.fromDateUtc(testDate);
    when(criteriaBuilder.greaterThanOrEqualTo(root.get("dateUtc"), testDate)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertThat(predicate).isNull();
    verify(criteriaBuilder).greaterThanOrEqualTo(root.get("dateUtc"), testDate);
  }

  @Test
  public void toDateUtc_should_selectDateUtcLessThanOrEqualTo_when_called() {
    var specification = ExchangeEventSourceSpecification.toDateUtc(testDate);
    when(criteriaBuilder.lessThanOrEqualTo(root.get("dateUtc"), testDate)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertThat(predicate).isNull();
    verify(criteriaBuilder).lessThanOrEqualTo(root.get("dateUtc"), testDate);
  }

  @Test
  public void userAccountID_should_setInUserAccountId_when_called() {
    var specification = ExchangeEventSourceSpecification.userAccountID(testUserAccountId);
    when(criteriaBuilder.equal(root.get("userAccountId"), testUserAccountId)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertThat(predicate).isNull();
    verify(criteriaBuilder).equal(root.get("userAccountId"), testUserAccountId);
  }
}
