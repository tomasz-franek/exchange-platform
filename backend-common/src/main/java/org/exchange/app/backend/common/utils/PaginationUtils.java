package org.exchange.app.backend.common.utils;

import org.exchange.app.common.api.model.Page;
import org.exchange.app.common.api.model.PagedSortedTimeRangeRequest;
import org.exchange.app.common.api.model.SortEnum;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

public class PaginationUtils {

  public static final int DEFAULT_PAGE_SIZE = 10;
  public static final int FIST_PAGE = 0;

  private PaginationUtils() {
  }

  public static PageRequest pageRequest(org.exchange.app.common.api.model.Sort sortModel, Page page,
      String defaultColumn, Direction defaultSortDirection) {
    Sort sort;
    if (sortModel == null) {
      sort = Sort.by(defaultSortDirection, defaultColumn);
    } else {
      if (sortModel.getField() != null && sortModel.getOrder() != null) {
        if (SortEnum.ASCENDING.equals(sortModel.getOrder())) {
          sort = Sort.by(Sort.Direction.ASC, sortModel.getField());
        } else {
          sort = Sort.by(Direction.DESC, sortModel.getField());
        }
      } else {
        sort = Sort.unsorted();
      }
    }
    if (page != null && page.getPage() != null && page.getRows() != null) {
      return PageRequest.of(page.getPage(), page.getRows(), sort);
    } else {
      return PageRequest.of(FIST_PAGE, DEFAULT_PAGE_SIZE, sort);
    }
  }

  public static PageRequest pageRequest(PagedSortedTimeRangeRequest request, String defaultColumn,
      Direction defaultSortDirection) {
    if (request == null) {
      if (defaultSortDirection == null) {
        return PageRequest.of(FIST_PAGE, DEFAULT_PAGE_SIZE, Sort.unsorted());
      }
      if (defaultColumn != null) {

        return PageRequest.of(0, DEFAULT_PAGE_SIZE, defaultSortDirection, defaultColumn);
      }
      return PageRequest.of(0, DEFAULT_PAGE_SIZE);
    }
    return pageRequest(request.getSort(), request.getPage(), defaultColumn, defaultSortDirection);
  }
}
