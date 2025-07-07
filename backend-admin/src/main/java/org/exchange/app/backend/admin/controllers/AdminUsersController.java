package org.exchange.app.backend.admin.controllers;

import org.exchange.app.admin.api.UsersApi;
import org.exchange.app.admin.api.model.UpdateUserRequest;
import org.exchange.app.admin.api.model.UpdateUserResponse;
import org.exchange.app.backend.admin.services.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4100")
@RestController
public class AdminUsersController implements UsersApi {

  private final AdminUserService adminUserService;

  @Autowired
  public AdminUsersController(AdminUserService adminUserService) {
    this.adminUserService = adminUserService;
  }

  @Override
  public ResponseEntity<UpdateUserResponse> updateUserStatus(UpdateUserRequest updateUserRequest) {
    return ResponseEntity.ok(adminUserService.updateUserStatus(updateUserRequest));
  }
}
