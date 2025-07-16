package org.exchange.app.backend.external.services;

import java.util.List;
import org.exchange.app.common.api.model.SystemMessage;

public interface SystemService {

  List<SystemMessage> loadSystemMessages();
}
