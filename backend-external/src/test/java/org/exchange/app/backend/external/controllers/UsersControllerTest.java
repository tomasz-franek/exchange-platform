package org.exchange.app.backend.external.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.repositories.AddressRepository;
import org.exchange.app.common.api.model.Address;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class UsersControllerTest {

	public static final String REAL_USER_ACCOUNT_1 = "00000000-0000-0000-0002-000000000001";
	public static final String REAL_USER_ACCOUNT_2 = "00000000-0000-0000-0002-000000000002";
	public static final String FAKE_USER_ACCOUNT = "00000000-8888-8888-0002-000000000001";

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private AuthenticationFacade authenticationFacade;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private AddressRepository addressRepository;

	@Test
	void saveUserAddress_should_returnConflict_when_wrongVersionDuringUpdate() throws Exception {
		Mockito.when(authenticationFacade.getUserUuid())
				.thenReturn(UUID.fromString(REAL_USER_ACCOUNT_1));
		mockMvc.perform(post("/users/address")
						.contentType(APPLICATION_JSON)
						.accept(APPLICATION_JSON)
						.content("""
								{
								"name": "Name updated",
								"countryCode": "IT",
								"version": 999
								}
								"""))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.errorCode").value("AddressEntity"))
				.andExpect(jsonPath("$.message").value(
						"Invalid version for entity row currentVersion=0 newVersion=999"));
	}

	@Test
	void saveUserAddress_should_saveAddress_when_noAddressInDatabase() throws Exception {
		Mockito.when(authenticationFacade.getUserUuid())
				.thenReturn(UUID.fromString(REAL_USER_ACCOUNT_2));
		mockMvc.perform(post("/users/address")
						.contentType(APPLICATION_JSON)
						.accept(APPLICATION_JSON)
						.content("""
								{
								"name": "New name",
								"countryCode": "FR",
								"phone":"123",
								"taxID":"678",
								"vatID":"276",
								"version": 0
								}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("New name"))
				.andExpect(jsonPath("$.countryCode").value("FR"))
				.andExpect(jsonPath("$.phone").value("123"))
				.andExpect(jsonPath("$.taxID").value("678"))
				.andExpect(jsonPath("$.vatID").value("276"))
				.andExpect(jsonPath("$.version").value(0))
				.andExpect(jsonPath("$.userId").value(
						"00000000-0000-0000-0002-000000000002"))
				.andDo(result -> {
					String json = result.getResponse().getContentAsString();
					Address address = objectMapper.readValue(json, Address.class);
					assertThat(address).isNotNull();
					assertThat(address.getId()).isNotNull();
					addressRepository.deleteById(address.getId());
				});
	}

	@Test
	void saveUserAddress_should_updateAddress_when_existsAddressForUserInDatabase() throws Exception {
		Mockito.when(authenticationFacade.getUserUuid())
				.thenReturn(UUID.fromString(REAL_USER_ACCOUNT_1));
		mockMvc.perform(post("/users/address")
						.contentType(APPLICATION_JSON)
						.accept(APPLICATION_JSON)
						.content("""
								{
								"name": "Name updated",
								"countryCode": "AT",
								"phone": "phone",
								"street": "street",
								"zipCode":"zip",
								"city":"city",
								"taxID":"tax",
								"vatID":"vat",
								"version": 0
								}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value("7b461bfa-7a05-42e9-8bb0-e226f8a2e840"))
				.andExpect(jsonPath("$.name").value("Name updated"))
				.andExpect(jsonPath("$.countryCode").value("AT"))
				.andExpect(jsonPath("$.street").value("street"))
				.andExpect(jsonPath("$.zipCode").value("zip"))
				.andExpect(jsonPath("$.city").value("city"))
				.andExpect(jsonPath("$.taxID").value("tax"))
				.andExpect(jsonPath("$.vatID").value("vat"))
				.andExpect(jsonPath("$.version").value(1))
				.andExpect(jsonPath("$.userId").value("00000000-0000-0000-0002-000000000001"));
	}

	@Test
	void saveUserAddress_should_returnBadRequest_when_valuesInUpdatedFieldsAreTooLong()
			throws Exception {
		Mockito.when(authenticationFacade.getUserUuid())
				.thenReturn(UUID.fromString(REAL_USER_ACCOUNT_1));
		mockMvc.perform(post("/users/address")
						.contentType(APPLICATION_JSON)
						.accept(APPLICATION_JSON)
						.content("""
								{
								"name": "string",
								"countryCode": "string",
								"version": 0
								}
								"""))
				.andExpect(status().isBadRequest())
				.andExpect(content().contentType(APPLICATION_JSON))
				.andExpect(jsonPath("$.errorCode").value(
						"SystemValidator"))
				.andExpect(jsonPath("$.message").value(
						"Validation errors [Field 'countryCode' exceeds maximum length of 2.]"));
	}

	@Test
	void getUserAddress_should_returnNotFound_when_userHasNoAddressStored() throws Exception {
		Mockito.when(authenticationFacade.getUserUuid())
				.thenReturn(UUID.fromString(FAKE_USER_ACCOUNT));
		mockMvc.perform(get("/users/address")
						.accept(APPLICATION_JSON))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"))
				.andExpect(jsonPath("$.message").value(
						"Object User with id=00000000-8888-8888-0002-000000000001 not found"));
	}

	@Test
	void getUserAddress_should_returnAddressForUser_when_addressIsInDatabase() throws Exception {
		Mockito.when(authenticationFacade.getUserUuid())
				.thenReturn(UUID.fromString(REAL_USER_ACCOUNT_1));
		mockMvc.perform(get("/users/address")
						.accept(APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentType(APPLICATION_JSON))
				.andExpect(jsonPath("$.name").value("Client Company"))
				.andExpect(jsonPath("$.id").value("7b461bfa-7a05-42e9-8bb0-e226f8a2e840"))
				.andExpect(jsonPath("$.countryCode").value("US"));
	}
}