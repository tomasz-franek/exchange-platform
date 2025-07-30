package org.exchange.app.backend.admin.controllers;

import java.util.List;
import org.exchange.app.admin.api.UsersApi;
import org.exchange.app.admin.api.model.LoadUserRequest;
import org.exchange.app.admin.api.model.UpdateUserRequest;
import org.exchange.app.admin.api.model.UpdateUserResponse;
import org.exchange.app.backend.admin.services.AdminUserService;
import org.exchange.app.common.api.model.UserData;
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
    adminUserService.updateUserStatus(updateUserRequest);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<List<UserData>> loadUserList(LoadUserRequest loadUserRequest) {
    return ResponseEntity.ok(adminUserService.loadUserList(loadUserRequest));
  }
}
