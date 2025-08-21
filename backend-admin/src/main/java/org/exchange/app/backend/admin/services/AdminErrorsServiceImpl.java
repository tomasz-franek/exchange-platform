package org.exchange.app.backend.admin.services;

import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.admin.api.model.ErrorListRequest;
import org.exchange.app.admin.api.model.ErrorMessage;
import org.exchange.app.backend.admin.listeners.ErrorListener;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class AdminErrorsServiceImpl implements AdminErrorsService {

  private final ErrorListener errorListener;

  public AdminErrorsServiceImpl(ErrorListener errorListener) {
    this.errorListener = errorListener;
  }

  @Override
  public void deleteError(Long id) {
    errorListener.deleteErrorById(id);
  }

  @Override
  public List<ErrorMessage> loadErrorList(ErrorListRequest errorListRequest) {
    return errorListener.loadErrorList(errorListRequest.getOffset());
  }
}
