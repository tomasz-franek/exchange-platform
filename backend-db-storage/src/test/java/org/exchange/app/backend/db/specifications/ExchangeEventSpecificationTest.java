package org.exchange.app.backend.db.specifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class ExchangeEventSpecificationTest {

  @Mock
  private CriteriaBuilder criteriaBuilder;

  @Mock
  private Root<ExchangeEventEntity> root;

  @Mock
  private CriteriaQuery<?> query;

  @Mock
  private Path<Object> ticketStatusPath;
  @Mock
  private Path<Object> userAccountIdPath;

  private Long testDate;
  private List<UUID> testUserAccounts;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    testDate = System.currentTimeMillis();
    testUserAccounts = Arrays.asList(UUID.randomUUID(), UUID.randomUUID());
  }

  @Test
  public void fromDate_should_selectDateUtcGreaterThanOrEqualTo_when_called() {

    var specification = ExchangeEventSpecification.fromDate(testDate);
    when(criteriaBuilder.greaterThanOrEqualTo(root.get("dateUtc"), testDate)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertThat(predicate).isNull();
    verify(criteriaBuilder).greaterThanOrEqualTo(root.get("dateUtc"), testDate);
  }

  @Test
  public void toDate_should_selectDateUtcLessThanOrEqualTo_when_called() {

    var specification = ExchangeEventSpecification.toDate(testDate);
    when(criteriaBuilder.lessThanOrEqualTo(root.get("dateUtc"), testDate)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertThat(predicate).isNull();
    verify(criteriaBuilder).lessThanOrEqualTo(root.get("dateUtc"), testDate);
  }

  @Test
  public void userAccountID_should_setInUserAccountId_when_called() {

    var specification = ExchangeEventSpecification.userAccountID(testUserAccounts);
    when(root.get("userAccountId")).thenReturn(userAccountIdPath);
    when(userAccountIdPath.in(testUserAccounts)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertThat(predicate).isNull();
    verify(root.get("userAccountId")).in(testUserAccounts);
  }

  @Test
  public void onlyActive_should_selectTicketStatusNewActiveOrPartialRealized_when_called() {
    var specification = ExchangeEventSpecification.onlyActive();
    when(root.get("ticketStatus")).thenReturn(ticketStatusPath);
    when(ticketStatusPath.in(UserTicketStatus.NEW, UserTicketStatus.ACTIVE,
        UserTicketStatus.PARTIAL_REALIZED)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

		assertThat(predicate).isNull();
    verify(root.get("ticketStatus")).in(UserTicketStatus.NEW, UserTicketStatus.ACTIVE,
        UserTicketStatus.PARTIAL_REALIZED);
  }

  @Test
  public void realized_should_selectTicketStatusRealized_when_called() {
    var specification = ExchangeEventSpecification.realized();
    when(root.get("ticketStatus")).thenReturn(ticketStatusPath);
    when(ticketStatusPath.in(UserTicketStatus.REALIZED)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(root.get("ticketStatus")).in(UserTicketStatus.REALIZED);
  }
}

