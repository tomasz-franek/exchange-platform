package org.exchange.app.backend.admin.services;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.keycloak.UserService;
import org.exchange.app.common.api.model.User;

public class AdminUserServiceImpl implements UserService {

  @Override
  public Optional<User> findById(UUID userUUID) {
    return Optional.empty();
  }

  @Override
  public User createUser(UUID userUUID, User user) {
    return user;
  }
}
