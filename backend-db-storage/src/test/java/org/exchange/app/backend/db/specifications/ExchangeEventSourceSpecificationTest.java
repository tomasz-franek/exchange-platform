package org.exchange.app.backend.db.specifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.common.api.model.EventType;
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
  private Path<Object> userAccountIdPath;
  @Mock
  private Path<Object> evevnTypesPath;

  @Mock
  private CriteriaQuery<?> query;

  private LocalDateTime testDate;
  private UUID testUserAccountId;
  private Long eventId;
  private Long reverseEventId;
  private EventType eventType;
  private List<UUID> testUserAccounts;
  private List<EventType> eventTypes;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.openMocks(this);
    testDate = ExchangeDateUtils.currentLocalDateTime();
    testUserAccountId = UUID.randomUUID();
    testUserAccounts = Arrays.asList(UUID.randomUUID(), UUID.randomUUID());
    eventTypes = Arrays.asList(EventType.CANCEL, EventType.DEPOSIT);
    eventId = 10L;
    reverseEventId = 20L;
    eventType = EventType.CORRECTION;
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

  @Test
  public void eventId_should_selectEqualEventIdEqual_when_called() {
    var specification = ExchangeEventSourceSpecification.eventId(eventId);
    when(criteriaBuilder.equal(root.get("eventId"), eventId)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(criteriaBuilder).equal(root.get("eventId"), eventId);
  }

  @Test
  public void eventType_should_selectEventTypeEqual_when_called() {
    var specification = ExchangeEventSourceSpecification.eventType(eventType);
    when(criteriaBuilder.equal(root.get("eventType"), eventType)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(criteriaBuilder).equal(root.get("eventType"), eventType);
  }

  @Test
  public void reverseEventId_should_selectReverseEventIdEqual_when_called() {
    var specification = ExchangeEventSourceSpecification.reverseEventId(reverseEventId);
    when(criteriaBuilder.equal(root.get("reverseEventId"), reverseEventId)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(criteriaBuilder).equal(root.get("reverseEventId"), reverseEventId);
  }

  @Test
  public void userAccountIDs_should_selectUserAccountIds_when_called() {

    var specification = ExchangeEventSourceSpecification.userAccountIDs(testUserAccounts);
    when(root.get("userAccountId")).thenReturn(userAccountIdPath);
    when(userAccountIdPath.in(testUserAccounts)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(root.get("userAccountId")).in(testUserAccounts);
  }

  @Test
  public void eventTypes_should_selectSelectEventTypesInList_when_called() {
    var specification = ExchangeEventSourceSpecification.eventTypes(eventTypes);
    when(root.get("eventType")).thenReturn(evevnTypesPath);
    when(evevnTypesPath.in(eventTypes)).thenReturn(null);

    var predicate = specification.toPredicate(root, query, criteriaBuilder);

    assertThat(predicate).isNull();
    verify(root.get("eventType")).in(eventTypes);
  }
}
