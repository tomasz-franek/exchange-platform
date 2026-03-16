package org.exchange.app.backend.admin.services;


import org.exchange.app.common.api.model.Page;
import org.exchange.app.common.api.model.SortEnum;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

public class PaginationUtils {

  private PaginationUtils() {
  }

  public static PageRequest pageRequest(org.exchange.app.common.api.model.Sort sortModel, Page page,
      String defaultColumn) {
    Sort sort;
    if (sortModel == null) {
      sort = Sort.by(Sort.Direction.DESC, defaultColumn);
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
    return PageRequest.of(page.getPage(), page.getRows(), sort);
  }
}
