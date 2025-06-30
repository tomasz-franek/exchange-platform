package org.exchange.app.backend.admin.services;


import org.exchange.app.admin.api.model.UpdateUserRequest;
import org.exchange.app.admin.api.model.UpdateUserResponse;

public interface AdminUserService {

  UpdateUserResponse updateUserStatus(UpdateUserRequest updateUserRequest);
}
