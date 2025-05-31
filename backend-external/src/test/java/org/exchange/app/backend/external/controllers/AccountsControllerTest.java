package org.exchange.app.backend.external.controllers;

import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

class AccountsControllerTest {

	@Autowired
	private UserAccountRepository userAccountRepository;
	@Autowired
	private MockMvc mockMvc;

	@Test
	@Disabled
	void updateUserAccount_when_notExistingCurrency_then_badRequest() throws Exception {
//		mockMvc.perform(post("/accounts/user/account/{accountId}",
//						"72aa8932-8798-4d1b-aaf0-590a3e6ffaa5").accept(APPLICATION_JSON).content("""
//						{
//							"idUserAccount":"72aa8932-8798-4d1b-aaf0-590a3e6ffa11",
//							"idUser":"72aa8932-8798-4d1b-aaf0-590a3e6ffaa5",
//							"idCurrency":999
//						"""))
//				.andExpect(status().isBadRequest())
//				.andExpect(content().contentType(APPLICATION_JSON))
//				.andExpect(jsonPath("$").isArray())
//				.andExpect(jsonPath("$[0].idProduct").value(1))
//				.andExpect(jsonPath("$[0].idShopping").value(1));
	}

	@Test
	@Disabled
	void updateUserAccount_when_notExistingUserId_then_badRequest() {

	}

	@Test
	@Disabled
	void updateUserAccount_when_correctDate_then_updatedResponse() {
	}

	@Test
	@Disabled
	void createUserAccount_when_wrongUserId_then_notFoundResponse() {
	}

	@Test
	@Disabled
	void createUserAccount_when_correctUserIdButExistingAccountCurrency_then_badRequest() {
	}
	@Test
	@Disabled
	void createUserAccount_when_correctUserIdAndNotExistingAccountCurrency_then_accountIsCreated() {
	}
}