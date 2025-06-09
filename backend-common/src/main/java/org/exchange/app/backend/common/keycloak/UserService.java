package org.exchange.app.backend.common.keycloak;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.common.api.model.User;

public interface UserService {

  Optional<User> findById(UUID userUUID);

  User createUser(UUID userUUID, User user);
}
