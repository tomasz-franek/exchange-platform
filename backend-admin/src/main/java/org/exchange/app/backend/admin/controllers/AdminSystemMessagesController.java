package org.exchange.app.backend.admin.controllers;

import org.exchange.app.admin.api.MessagesApi;
import org.exchange.app.backend.admin.services.AdminSystemMessagesService;
import org.exchange.app.common.api.model.SystemMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
public class AdminSystemMessagesController implements MessagesApi {

  private final AdminSystemMessagesService adminSystemMessagesService;

  @Autowired
  public AdminSystemMessagesController(AdminSystemMessagesService adminSystemMessagesService) {
    this.adminSystemMessagesService = adminSystemMessagesService;
  }

  @Override
  public ResponseEntity<Void> saveSystemMessage(SystemMessage systemMessage) {
    adminSystemMessagesService.saveSystemMessage(systemMessage);
    return ResponseEntity.created(null).build();
  }

  @Override
  public ResponseEntity<Void> updateSystemMessage(SystemMessage systemMessage) {
    adminSystemMessagesService.updateSystemMessage(systemMessage);
    return ResponseEntity.noContent().build();
  }
}
