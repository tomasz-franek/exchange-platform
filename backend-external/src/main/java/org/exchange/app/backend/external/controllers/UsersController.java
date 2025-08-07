package org.exchange.app.backend.external.controllers;

import lombok.AllArgsConstructor;
import org.exchange.app.backend.common.keycloak.UserService;
import org.exchange.app.common.api.UsersApi;
import org.exchange.app.common.api.model.Address;
import org.exchange.app.common.api.model.UserProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
public class UsersController implements UsersApi {

	private UserService userService;

	@Override
	public ResponseEntity<UserProperty> getUserProperty() {
		return ResponseEntity.ok(userService.getUserProperty());
	}

	@Override
	public ResponseEntity<UserProperty> saveUserProperty(UserProperty userProperty) {
		return ResponseEntity.ok(userService.saveUserProperty(userProperty));
	}

	@Override
	public ResponseEntity<Address> saveUserAddress(Address address) {
		return ResponseEntity.ok(userService.saveUserAddress(address));
	}

	@Override
	public ResponseEntity<Address> getUserAddress() {
		return ResponseEntity.ok(userService.getUserAddress());
	}
}
