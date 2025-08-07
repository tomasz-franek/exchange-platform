package org.exchange.app.backend.common.keycloak;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.common.api.model.Address;
import org.exchange.app.common.api.model.User;
import org.exchange.app.common.api.model.UserProperty;

public interface UserService {

	Optional<User> findById(UUID userUUID);

	User createUser(UUID userUUID, User user);

	UserProperty saveUserProperty(UserProperty userProperty);

	UserProperty getUserProperty();

	Address getUserAddress();

	Address saveUserAddress(Address address);
}
