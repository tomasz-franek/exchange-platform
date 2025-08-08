package org.exchange.app.backend.admin.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.backend.db.entities.UserPropertyEntity;
import org.exchange.app.backend.db.repositories.UserPropertyRepository;
import org.exchange.app.backend.db.repositories.UserRepository;
import org.exchange.app.common.api.model.User;
import org.exchange.app.common.api.model.UserProperty;
import org.exchange.app.common.api.model.UserStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;


@SpringBootTest
@AutoConfigureMockMvc
class UserServiceImplTest {


	private final UUID EXISTING_UUID = UUID.fromString("00000000-0000-0000-0002-000000000001");

	@Autowired
	private UserPropertyRepository userPropertyRepository;

	@MockitoBean
	private AuthenticationFacade authenticationFacade;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserServiceImpl userService;


	@Test
	public void findById_should_returnUser_when_userExists() {
		Optional<User> result = userService.findById(EXISTING_UUID);

		assertTrue(result.isPresent());
		assertThat(result.get().getEmail()).isEqualTo("client1@exchange.com");
	}

	@Test
	public void findById_should_returnOptionalEmpty_when_userNotPresent() {
		Optional<User> result = userService.findById(UUID.randomUUID());

		assertFalse(result.isPresent());
	}

	@Test
	public void createUser_should_saveUser_when_correctUserData() {

		User user = new User();
		user.setEmail("testemail@company.com");
		user.setBlocked(false);
		user.setName("name");
		user.setLastName("lastname");
		user.setUserName("username");
		user.setVersion(0);
		User result = userService.createUser(UUID.randomUUID(), user);

		assertNotNull(result);
		assertThat(result.getEmail()).isEqualTo(user.getEmail());
		assertThat(result.getVersion()).isEqualTo(user.getVersion());
	}

	@Test
	public void saveUserProperty_should_throwsObjectWithIdNotFoundException_when_UserNotFound() {
		UUID userUUID = UUID.randomUUID();
		when(authenticationFacade.getUserUuid()).thenReturn(userUUID);
		UserProperty userProperty = new UserProperty("FR", "UTC", 0);

		ObjectWithIdNotFoundException exception = assertThrows(ObjectWithIdNotFoundException.class,
				() -> userService.saveUserProperty(userProperty));

		assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
				String.format("Object User with id=%s not found", userUUID));
	}

	@Test
	public void saveUserProperty_should_finish_withoutError_when_propertyRecordIsSaved() {
		UserEntity userEntity = new UserEntity();
		userEntity.setEmail("test");
		userEntity.setCreatedDateUTC(ExchangeDateUtils.currentLocalDateTime());
		userEntity.setStatus(UserStatus.ACTIVE);
		userEntity.setId(UUID.randomUUID());
		userEntity = userRepository.save(userEntity);
		when(authenticationFacade.getUserUuid()).thenReturn(userEntity.getId());
		UserProperty userProperty = new UserProperty("DE", "DE", "UTC", EXISTING_UUID, 0);
		userService.saveUserProperty(userProperty);
		UserPropertyEntity userPropertyEntity = userPropertyRepository.findById(userEntity.getId())
				.orElse(null);
		assertNotNull(userPropertyEntity);
		userPropertyRepository.delete(userPropertyEntity);
		userRepository.delete(userEntity);

	}

	@Test
	public void getUserProperty_should_generateException_when_UserNotFound() {
		UUID uuid = UUID.randomUUID();
		when(authenticationFacade.getUserUuid()).thenReturn(uuid);

		ObjectWithIdNotFoundException exception = assertThrows(ObjectWithIdNotFoundException.class,
				() -> userService.getUserProperty());

		assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
				String.format("Object User with id=%s not found", uuid));
	}

	@Test
	public void getUserProperty_should_returnUserPropertyData_when_userExists() {
		when(authenticationFacade.getUserUuid()).thenReturn(EXISTING_UUID);

		UserProperty result = userService.getUserProperty();

		assertNotNull(result);
		assertThat(result.getTimezone()).isEqualTo("UTC");
	}
}