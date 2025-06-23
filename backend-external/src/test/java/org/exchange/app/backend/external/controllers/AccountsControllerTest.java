package org.exchange.app.backend.external.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AccountsControllerTest {

  @Autowired
  private UserAccountRepository userAccountRepository;

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private AuthenticationFacade authenticationFacade;

  @BeforeEach
  public void beforeEach() {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-0000-0002-000000000001"));

  }

  @Test
  void updateUserAccount_should_returnBadRequest_when_accountIsForDifferentCurrency()
      throws Exception {
    mockMvc.perform(put("/accounts/user/account")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                	"id": "72aa8932-8798-4d1b-aaf0-590a3e6ffa22",
                	"currency": "GBP",
                	"version": 0
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("UserAccount"))
        .andExpect(jsonPath("$.message")
            .value("Not found account with currency GBP for current user"));
  }

  @Test
  void updateUserAccount_should_returnBadRequest_when_requestCurrencyNotMatchAccountCurrency()
      throws Exception {
    mockMvc.perform(put("/accounts/user/account")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                	"id": "72aa8932-8798-4d1b-aaf0-590a3e6ffa99",
                	"currency": "PLN",
                	"version": 0
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("UserAccount"))
        .andExpect(jsonPath("$.message").value(
            "Currency PLN is not correct currency for account 72aa8932-8798-4d1b-aaf0-590a3e6ffa99"));
  }

  @Test
  void updateUserAccount_should_returnConflict_when_wrongVersionNumber()
      throws Exception {
    mockMvc.perform(put("/accounts/user/account")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                	"id": "72aa8932-8798-4d1b-aaf0-590a3e6ffa11",
                	"currency": "PLN",
                	"version": 999
                }
                """))
        .andExpect(status().isConflict())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("UserAccountEntity"))
        .andExpect(jsonPath("$.message").value(
            "Invalid version for entity row currentVersion=0 newVersion=999"));
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