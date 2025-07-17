package org.exchange.app.backend.admin.services;

import org.exchange.app.common.api.model.SystemMessage;

public interface AdminSystemMessagesService {

  SystemMessage saveSystemMessage(SystemMessage systemMessage);

  void updateSystemMessage(SystemMessage systemMessage);
}
