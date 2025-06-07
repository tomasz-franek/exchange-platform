package org.exchange.app.backend.external.services;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.common.api.model.User;

public interface UserService {

  Optional<User> findById(UUID userUUID);

  User createUser(UUID userUUID, User user);
}
