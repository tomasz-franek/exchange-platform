package org.exchange.app.backend.db.specifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import java.time.LocalDateTime;
import org.exchange.app.backend.db.entities.SystemMessageEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class SystemMessageSpecificationTest {

  @Mock
  private CriteriaBuilder criteriaBuilder;

  @Mock
  private Root<SystemMessageEntity> root;

  @Mock
  private CriteriaQuery<?> query;
  private boolean active;
  private LocalDateTime localDateTime;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    active = true;
    localDateTime = LocalDateTime.now();
  }

  @Test
  void active_should_selectOnlyActiveSystemMessages_when_called() {
    var specification = SystemMessageSpecification.active(true);
    when(criteriaBuilder.equal(root.get("active"), active)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(criteriaBuilder).equal(root.get("active"), active);
  }

  @Test
  void activeAtDate_should_selectOnlyMessagesWhenSelectedDateIsBetweenDateFromAndDateToUTC_when_called() {
    var specification = SystemMessageSpecification.activeAtDate(localDateTime);
    when(criteriaBuilder.lessThanOrEqualTo(root.get("dateFromUtc"), localDateTime)).thenReturn(
        null);
    when(criteriaBuilder.greaterThanOrEqualTo(root.get("dateToUtc"), localDateTime)).thenReturn(
        null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(criteriaBuilder).lessThanOrEqualTo(root.get("dateFromUtc"), localDateTime);
    verify(criteriaBuilder).greaterThanOrEqualTo(root.get("dateToUtc"), localDateTime);
  }
}