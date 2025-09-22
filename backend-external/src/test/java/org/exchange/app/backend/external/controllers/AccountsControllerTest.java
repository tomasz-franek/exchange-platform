package org.exchange.app.backend.external.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.external.producers.WithdrawProducer;
import org.junit.jupiter.api.BeforeEach;
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

  @MockitoBean
  private WithdrawProducer withdrawProducer;

  @BeforeEach
  public void beforeEach() {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-0000-0002-000000000001"));
    Mockito.doNothing().when(withdrawProducer).sendMessage("", null);

  }

  @Test
  void updateUserAccount_should_returnBadRequest_when_accountIsForDifferentCurrency()
      throws Exception {
    mockMvc.perform(put("/accounts/user/account")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                	"id": "72aa8932-8798-4d1b-1111-590a3e6ffa22",
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
                	"id": "72aa8932-8798-4d1b-1111-590a3e6ffa11",
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
  void updateUserAccount_should_returnBadRequest_when_userNotExists() throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-9999-0002-000000000001"));
    mockMvc.perform(put("/accounts/user/account")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                	"id": "72aa8932-8798-4d1b-1111-590a3e6ffa11",
                	"currency": "PLN",
                	"version": 999
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("UserAccount"))
        .andExpect(jsonPath("$.message").value(
            "Not found account with currency PLN for current user"));
  }

  @Test
  void updateUserAccount_should_returnCreated_whenCorrectRequest() throws Exception {
    mockMvc.perform(put("/accounts/user/account")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                	"id": "72aa8932-8798-4d1b-1111-590a3e6ffa11",
                	"currency": "PLN",
                	"version": 0
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.id").value("72aa8932-8798-4d1b-1111-590a3e6ffa11"))
        .andExpect(jsonPath("$.version").value(0))
        .andExpect(jsonPath("$.currency").value("PLN"));
  }

  @Test
  void createUserAccount_should_returnNotFoundResponse_when_wrongUserId() throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-9999-0002-000000000001"));
    mockMvc.perform(post("/accounts/user/account")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                	"id": "72aa8932-8798-4d1b-1111-590a3e6ffa11",
                	"currency": "PLN",
                	"version": 0
                }
                """))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"))
        .andExpect(jsonPath("$.message").value(
            "Object User with id=00000000-0000-9999-0002-000000000001 not found"));
  }

  @Test
  void createUserAccount_should_returnFound_when_correctUserIdButExistingAccountForCurrency()
      throws Exception {
    mockMvc.perform(post("/accounts/user/account")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                	"id": "72aa8932-8798-4d1b-1111-590a3e6ffa11",
                	"currency": "PLN",
                	"version": 0
                }
                """))
        .andExpect(status().isFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("UserAccount"))
        .andExpect(jsonPath("$.message").value(
            "Object already exists='currency: PLN'"));
  }

  @Test
  void createUserAccount_should_createAccount_when_correctUserIdAndNotExistingAccountCurrency()
      throws Exception {
    mockMvc.perform(post("/accounts/user/account")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                	"currency": "GBP",
                	"version": 0
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.currency").value("GBP"))
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.version").value(0));
  }


  @Test
  void loadUserOperationList_should_returnOperationList_when_methodCalled()
      throws Exception {
    mockMvc.perform(post("/accounts/operations")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "currency": "EUR",
                  "dateFrom": "2025-06-01T00:00:00.000Z",
                  "dateTo": "2055-01-01T00:00:00.000Z",
                  "page": 0,
                  "size": 10
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(6))))
        .andExpect(jsonPath("$[0].currency").value(nullValue()))
        .andExpect(jsonPath("$[0].userId").value("00000000-0000-0000-0002-000000000001"))
        .andExpect(jsonPath("$[0].amount").value(10000_0000))
        .andExpect(jsonPath("$[0].eventType").value("DEPOSIT"))
        .andExpect(jsonPath("$[5].currency").value(nullValue()))
        .andExpect(jsonPath("$[5].userId").value("00000000-0000-0000-0002-000000000001"))
        .andExpect(jsonPath("$[5].amount").value(-480000))
        .andExpect(jsonPath("$[5].eventType").value("WITHDRAW"));
  }

  @Test
  void loadUserOperationList_should_returnNotFound_when_methodCalledWithCurrencyWhatUserNotHaveAccount()
      throws Exception {
    mockMvc.perform(post("/accounts/operations")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "currency": "CHF",
                  "dateFrom": "2025-06-01T00:00:00.000Z",
                  "dateTo": "2055-01-01T00:00:00.000Z",
                  "page": 0,
                  "size": 10
                }
                """))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"))
        .andExpect(jsonPath("$.message").value(
            "Object UserAccount.currency with id=CHF not found"));

  }


  @Test
  void loadAccountBalanceList_should_returnBalanceList_when_methodCalled()
      throws Exception {
    mockMvc.perform(get("/accounts/list")
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(3))))
        .andExpect(jsonPath("$[0].currency").value("EUR"))
        .andExpect(jsonPath("$[0].userAccountId").value("72aa8932-8798-4d1b-1111-590a3e6ffa22"))
        .andExpect(jsonPath("$[0].amount").value(400000000));
  }

  @Test
  void saveWithdrawRequest_should_returnNoContent_when_methodCalledWithCorrectParameters()
      throws Exception {
    mockMvc.perform(post("/accounts/withdraw")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "currency": "PLN",
                  "userAccountId": "72aa8932-8798-4d1b-1111-590a3e6ffa11",
                  "amount": 100000
                }
                """))
        .andExpect(status().isNoContent());
  }

  @Test
  void saveWithdrawRequest_should_returnBadRequest_when_methodCalledWithAmountGreaterThenAccountValue()
      throws Exception {
    mockMvc.perform(post("/accounts/withdraw")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "currency": "PLN",
                  "userAccountId": "72aa8932-8798-4d1b-1111-590a3e6ffa11",
                  "amount": 1000000000000
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value(
            "INSUFFICIENT_FUNDS"))
        .andExpect(jsonPath("$.message").value("Insufficient fund for currency='PLN'"));
  }
}