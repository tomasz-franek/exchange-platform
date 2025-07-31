package org.exchange.app.backend.admin.services;


import java.util.List;
import org.exchange.app.admin.api.model.LoadUserRequest;
import org.exchange.app.admin.api.model.UpdateUserRequest;
import org.exchange.app.admin.api.model.UpdateUserResponse;
import org.exchange.app.common.api.model.UserData;
import org.exchange.app.common.api.model.UserProperty;

public interface AdminUserService {

  UpdateUserResponse updateUserStatus(UpdateUserRequest updateUserRequest);

  List<UserData> loadUserList(LoadUserRequest loadUserRequest);

  UserProperty getUserProperty();

  UserProperty saveUserProperty(UserProperty userProperty);
}
