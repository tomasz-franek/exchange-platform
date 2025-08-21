package org.exchange.app.backend.admin.services;

import java.util.List;
import org.exchange.app.admin.api.model.ErrorListRequest;
import org.exchange.app.admin.api.model.ErrorMessage;

public interface AdminErrorsService {

  void deleteError(Long id);

  List<ErrorMessage> loadErrorList(ErrorListRequest errorListRequest);
}
