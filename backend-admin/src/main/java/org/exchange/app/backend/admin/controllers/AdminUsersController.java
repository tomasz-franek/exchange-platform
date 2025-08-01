package org.exchange.app.backend.admin.controllers;

import java.util.List;
import java.util.Optional;
import org.exchange.app.admin.api.model.LoadUserRequest;
import org.exchange.app.admin.api.model.UpdateUserRequest;
import org.exchange.app.admin.api.model.UpdateUserResponse;
import org.exchange.app.backend.admin.services.AdminUserService;
import org.exchange.app.common.api.model.UserData;
import org.exchange.app.common.api.model.UserProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

@CrossOrigin(origins = "http://localhost:4100")
@RestController
public class AdminUsersController implements
    org.exchange.app.admin.api.UsersApi,
    org.exchange.app.common.api.UsersApi {

  private final AdminUserService adminUserService;

  @Autowired
  public AdminUsersController(AdminUserService adminUserService) {
    this.adminUserService = adminUserService;
  }

  @Override
  public Optional<NativeWebRequest> getRequest() {
    return Optional.empty();
  }

  @Override
  public ResponseEntity<UpdateUserResponse> updateUserStatus(UpdateUserRequest updateUserRequest) {
    return ResponseEntity.ok(adminUserService.updateUserStatus(updateUserRequest));
  }

  @Override
  public ResponseEntity<List<UserData>> loadUserList(LoadUserRequest loadUserRequest) {
    return ResponseEntity.ok(adminUserService.loadUserList(loadUserRequest));
  }

  @Override
  public ResponseEntity<UserProperty> getUserProperty() {
    return ResponseEntity.ok(adminUserService.getUserProperty());
  }

  @Override
  public ResponseEntity<UserProperty> saveUserProperty(UserProperty userProperty) {
    return ResponseEntity.ok(adminUserService.saveUserProperty(userProperty));
  }

}
