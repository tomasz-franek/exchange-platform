package org.exchange.app.backend.common.utils;

import java.util.Objects;
import org.exchange.app.common.api.model.Page;
import org.exchange.app.common.api.model.PagedSortedTimeRangeRequest;
import org.exchange.app.common.api.model.SortEnum;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import static org.assertj.core.api.Assertions.assertThat;

class PaginationUtilsTest {

  @Test
  void pageRequest_should_returnDefaultValues_when_nullRequestAndNullSort() {
    PageRequest result = PaginationUtils.pageRequest(null, null, null);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isZero();
    assertThat(result.getPageSize()).isEqualTo(10);
    assertThat(result.getSort()).isEqualTo(Sort.unsorted());
  }

  @Test
  void pageRequest_should_returnDefaultValues_when_nullRequestAndNotNullDirection() {
    PageRequest result = PaginationUtils.pageRequest(null, null, Direction.ASC);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isZero();
    assertThat(result.getPageSize()).isEqualTo(10);
    assertThat(result.getSort()).isEqualTo(Sort.unsorted());
  }

  @Test
  void pageRequest_should_returnDefaultValues_when_nullRequestAndDefaultColumn() {
    PageRequest result = PaginationUtils.pageRequest(null, "id", Direction.ASC);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isZero();
    assertThat(result.getPageSize()).isEqualTo(10);
    assertThat(result.getSort().isSorted()).isTrue();
    assertThat(result.getSort().getOrderFor("id")).isNotNull();
    assertThat(Objects.requireNonNull(result.getSort().getOrderFor("id")).getDirection()).isEqualTo(
        Direction.ASC);
  }

  @Test
  void pageRequest_should_returnDefaultValues_when_requestWithNullSortAndPage() {
    PageRequest result = PaginationUtils.pageRequest(
        new PagedSortedTimeRangeRequest(null, null, null, null), "id", Direction.ASC);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isZero();
    assertThat(result.getPageSize()).isEqualTo(10);
    assertThat(result.getSort().isSorted()).isTrue();
    assertThat(Objects.requireNonNull(result.getSort().getOrderFor("id")).getDirection()).isEqualTo(
        Direction.ASC);
  }

  @Test
  void pageRequest_should_returnCorrectPageSize_when_requestWithPreparedPage() {
    PageRequest result = PaginationUtils.pageRequest(
        new PagedSortedTimeRangeRequest(new Page(2, 12), null, null, null), "name", Direction.DESC);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isEqualTo(12);
    assertThat(result.getPageSize()).isEqualTo(2);
    assertThat(result.getSort().isSorted()).isTrue();
    assertThat(
        Objects.requireNonNull(result.getSort().getOrderFor("name")).getDirection()).isEqualTo(
        Direction.DESC);
  }

  @Test
  void pageRequest_should_returnCorrectPageSizeAndSort_when_requestWithPreparedPageAndSortAscending() {
    PageRequest result = PaginationUtils.pageRequest(
        new PagedSortedTimeRangeRequest(new Page(2, 12),
            new org.exchange.app.common.api.model.Sort("id",
                SortEnum.ASCENDING), null, null), "name", Direction.DESC);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isEqualTo(12);
    assertThat(result.getPageSize()).isEqualTo(2);
    assertThat(result.getSort().isSorted()).isTrue();
    assertThat(
        Objects.requireNonNull(result.getSort().getOrderFor("id")).getDirection()).isEqualTo(
        Direction.ASC);
  }

  @Test
  void pageRequest_should_returnCorrectPageSizeAndSort_when_requestWithPreparedPageAndSortDescending() {
    PageRequest result = PaginationUtils.pageRequest(
        new PagedSortedTimeRangeRequest(new Page(2, 12),
            new org.exchange.app.common.api.model.Sort("id",
                SortEnum.DESCENDING), null, null), "name", Direction.DESC);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isEqualTo(12);
    assertThat(result.getPageSize()).isEqualTo(2);
    assertThat(result.getSort().isSorted()).isTrue();
    assertThat(
        Objects.requireNonNull(result.getSort().getOrderFor("id")).getDirection()).isEqualTo(
        Direction.DESC);
  }

  @Test
  void pageRequest_should_returnCorrectPageSizeAndSort_when_requestWithPreparedPageAndSortFieldNull() {
    PageRequest result = PaginationUtils.pageRequest(
        new PagedSortedTimeRangeRequest(new Page(2, 12),
            new org.exchange.app.common.api.model.Sort(null,
                SortEnum.DESCENDING), null, null), "name", Direction.DESC);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isEqualTo(12);
    assertThat(result.getPageSize()).isEqualTo(2);
    assertThat(result.getSort().isSorted()).isFalse();
  }

  @Test
  void pageRequest_should_returnCorrectPageSizeAndSort_when_requestWithPreparedPageAndSortOrderNull() {
    PageRequest result = PaginationUtils.pageRequest(
        new PagedSortedTimeRangeRequest(new Page(2, 12),
            new org.exchange.app.common.api.model.Sort("id",
                null), null, null), "name", Direction.DESC);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isEqualTo(12);
    assertThat(result.getPageSize()).isEqualTo(2);
    assertThat(result.getSort().isSorted()).isFalse();
  }

  @Test
  void pageRequest_should_returnCorrectPageSizeAndSort_when_requestWithPageFieldRowsNull() {
    PageRequest result = PaginationUtils.pageRequest(
        new PagedSortedTimeRangeRequest(new Page(null, null),
            new org.exchange.app.common.api.model.Sort("id",
                null), null, null), "name", Direction.DESC);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isZero();
    assertThat(result.getPageSize()).isEqualTo(10);
    assertThat(result.getSort().isSorted()).isFalse();
  }

  @Test
  void pageRequest_should_returnCorrectPageSizeAndSort_when_requestWithPageFieldPageNull() {
    PageRequest result = PaginationUtils.pageRequest(
        new PagedSortedTimeRangeRequest(new Page(null, 0),
            new org.exchange.app.common.api.model.Sort("id",
                null), null, null), "name", Direction.DESC);
    assertThat(result).isNotNull();
    assertThat(result.getPageNumber()).isZero();
    assertThat(result.getPageSize()).isEqualTo(10);
    assertThat(result.getSort().isSorted()).isFalse();
  }
}