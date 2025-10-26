package org.exchange.app.backend.admin.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.admin.utils.TestAuthenticationUtils.authority;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.oneOf;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.entities.UserBankAccountEntity;
import org.exchange.app.backend.db.repositories.UserBankAccountRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedKafka(partitions = 1)
public class AdminAccountsControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private UserBankAccountRepository userBankAccountRepository;

  @MockitoBean
  private AuthenticationFacade authenticationFacade;

  @Test
  public void loadAccounts_should_returnOk_when_methodCalledWithCorrectParameters()
      throws Exception {
    mockMvc.perform(post("/accounts/list")
            .contentType(APPLICATION_JSON)
            .with(authority("ADMIN"))
            .content("""
                {
                  "userId": "00000000-0000-0000-0002-000000000001"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(3))))
        .andExpect(jsonPath("$[*].id", everyItem(oneOf(
            "72aa8932-8798-4d1b-1111-590a3e6ffa11",
            "72aa8932-8798-4d1b-1111-590a3e6ffa22",
            "72aa8932-8798-4d1b-1111-590a3e6ffa55"))))
        .andExpect(jsonPath("$[*].currency", everyItem(oneOf("PLN", "EUR", "USD"))));
  }

  @Test
  public void saveAccountDeposit_should_returnNoContent_when_methodCalledWithCorrectParameters()
      throws Exception {
    mockMvc.perform(post("/accounts/deposit")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "amount":50000000,
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22",
                  "userId":"00000000-0000-0000-0002-000000000001",
                  "currency":"EUR"
                }
                """))
        .andExpect(status().isNoContent());
  }

  @Test
  public void saveWithdrawRequest_should_returnNoContent_when_methodCalledWithCorrectParameters()
      throws Exception {
    mockMvc.perform(post("/accounts/withdraw")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "amount":50000000,
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22",
                  "userId":"00000000-0000-0000-0002-000000000001",
                  "currency":"EUR"
                }
                """))
        .andExpect(status().isNoContent());
  }

  @Test
  public void loadSystemAccountOperationList_should_returnOk_when_selectedAccountOperations()
      throws Exception {
    mockMvc.perform(post("/accounts/operations")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "dateFromUtc":"2025-01-01",
                  "systemAccountId":"8d8a228a-19a4-4f71-9f69-000000000003"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(2))))
        .andExpect(jsonPath("$[0].dateUtc").value("2025-01-13T21:51:46.331025"))
        .andExpect(jsonPath("$[0].amount").value(-1000))
        .andExpect(jsonPath("$[1].dateUtc").value("2025-04-18T11:36:21.094"))
        .andExpect(jsonPath("$[1].amount").value(1000));

  }

  @Test
  public void loadSystemAccountOperationList_should_returnOkWithFilteredData_when_setDateToUtc()
      throws Exception {
    mockMvc.perform(post("/accounts/operations")
            .contentType(APPLICATION_JSON)
            .with(authority("ADMIN"))
            .content("""
                {
                  "dateFromUtc":"2025-01-01",
                  "dateToUtc":"2025-03-01",
                  "systemAccountId":"8d8a228a-19a4-4f71-9f69-000000000003"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(1))))
        .andExpect(jsonPath("$[0].dateUtc").value("2025-01-13T21:51:46.331025"))
        .andExpect(jsonPath("$[0].amount").value(-1000));
  }

  @Test
  public void loadSystemAccountOperationList_should_returnNotFound_when_wrongSystemAccountId()
      throws Exception {
    mockMvc.perform(post("/accounts/operations")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "dateFromUtc":"2025-01-01",
                  "systemAccountId":"AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
                }
                """))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value(
            "Object SystemAccount with id=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa not found"))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"));
  }


  @Test
  public void loadExchangeAccountList_should_returnListOfExchangeAccounts_when_methodCalled()
      throws Exception {
    mockMvc.perform(get("/accounts/exchange/list")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(5))))
        .andExpect(jsonPath("$[*].id", containsInAnyOrder(
            "921467e9-6fde-46e7-a329-000000000001",
            "921467e9-6fde-46e7-a329-000000000002",
            "921467e9-6fde-46e7-a329-000000000003",
            "921467e9-6fde-46e7-a329-000000000004",
            "921467e9-6fde-46e7-a329-000000000005"
        )));
  }

  @Test
  public void loadSystemAccountList_should_returnListOfExchangeAccounts_when_methodCalled()
      throws Exception {
    mockMvc.perform(get("/accounts/system/list")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(5))))
        .andExpect(jsonPath("$[*].id", containsInAnyOrder(
            "8d8a228a-19a4-4f71-9f69-000000000001",
            "8d8a228a-19a4-4f71-9f69-000000000002",
            "8d8a228a-19a4-4f71-9f69-000000000003",
            "8d8a228a-19a4-4f71-9f69-000000000004",
            "8d8a228a-19a4-4f71-9f69-000000000005"
        )));
  }

  @Test
  void saveAccountDeposit_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(post("/accounts/deposit")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "amount":50000000,
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22",
                  "userId":"00000000-0000-0000-0002-000000000001",
                  "currency":"EUR"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void saveWithdrawRequest_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(post("/accounts/withdraw")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "amount":50000000,
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22",
                  "userId":"00000000-0000-0000-0002-000000000001",
                  "currency":"EUR"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadAccounts_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(post("/accounts/list")
            .with(authority("WRONG_AUTHORITY"))
            .content("{}")
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadSystemAccountList_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(get("/accounts/system/list")
            .with(authority("WRONG_AUTHORITY"))
            .content("{}")
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadExchangeAccountList_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(get("/accounts/exchange/list")
            .with(authority("WRONG_AUTHORITY"))
            .content("{}")
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadAccountOperationList_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(post("/accounts/operations")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "dateFromUtc":"2025-01-01",
                  "systemAccountId":"AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadBankAccountList_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(post("/accounts/bank")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22",
                  "userId":"99999999-0000-0000-0002-000000000001"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadBankAccountList_should_returnNotFound_when_wrongAccountId() throws Exception {
    mockMvc.perform(post("/accounts/bank")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22",
                  "userId":"99999999-0000-0000-0002-000000000001"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value(
            "Object userAccountId with id=72aa8932-8798-4d1b-1111-590a3e6ffa22 not found"))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"));
  }

  @Test
  void loadBankAccountList_should_returnOk_when_correctRequest() throws Exception {
    mockMvc.perform(post("/accounts/bank")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22",
                  "userId":"00000000-0000-0000-0002-000000000001"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(1))))
        .andExpect(jsonPath("$[0].countryCode").value("CZ"))
        .andExpect(jsonPath("$[0].accountNumber").value("72aa****fa22"))
        .andExpect(jsonPath("$[0].verifiedDateUtc").value(nullValue()));
  }

  @Test
  void validateBankAccount_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(post("/accounts/bank/validate")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22",
                  "id":"99999999-0000-0000-0002-000000000001",
                  "version":0,
                  "countryCode":"CZ",
                  "accountNumber":"xx",
                  "createdDateUtc":"2025-01-01T03:17:32.009Z"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void validateBankAccount_should_returnNotFound_when_wrongAccountId() throws Exception {
    mockMvc.perform(post("/accounts/bank/validate")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22",
                  "id":"99999999-0000-0000-0002-000000000001",
                  "version":0,
                  "countryCode":"CZ",
                  "accountNumber":"xx",
                  "createdDateUtc":"2025-01-01T03:17:32.009Z"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value(
            "Object userAccountId with id=72aa8932-8798-4d1b-1111-590a3e6ffa22 not found"))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"));
  }

  @Test
  void validateBankAccount_should_returnConflict_when_wrongVersion() throws Exception {

    UserBankAccountEntity bankAccount = new UserBankAccountEntity();
    bankAccount.setId(UUID.randomUUID());
    bankAccount.setAccountNumber(UUID.randomUUID().toString());
    bankAccount.setCountryCode("ES");
    bankAccount.setCreatedDateUtc(LocalDateTime.now());
    bankAccount.setUserAccountId(UUID.fromString("72aa8932-8798-4d1b-1111-590a3e6ffa22"));
    bankAccount.setCreatedBy("test");
    bankAccount.setVersion(0);
    bankAccount = userBankAccountRepository.save(bankAccount);
    UserBankAccountEntity finalBankAccount = bankAccount;

    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.randomUUID());

    mockMvc.perform(post("/accounts/bank/validate")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content(String.format(
                """
                    {
                      "userAccountId":"%s",
                      "id":"%s",
                      "version":%d,
                      "countryCode":"%s",
                      "accountNumber":"%s",
                      "createdDateUtc":"2025-01-01T03:17:32.009Z"
                    }
                    """,
                bankAccount.getUserAccountId(),
                bankAccount.getId(),
                bankAccount.getVersion() + 1,
                bankAccount.getCountryCode(),
                bankAccount.getAccountNumber()
            ))
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isConflict())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value(
            "Invalid version for entity row currentVersion=0 newVersion=1"))
        .andExpect(jsonPath("$.errorCode").value("UserBankAccountEntity"))
        .andDo(_ -> userBankAccountRepository.delete(finalBankAccount));
  }

  @Test
  void validateBankAccount_should_returnNoContent_when_accountValidated() throws Exception {
    UserBankAccountEntity bankAccount = new UserBankAccountEntity();
    bankAccount.setId(UUID.randomUUID());
    bankAccount.setAccountNumber(UUID.randomUUID().toString());
    bankAccount.setCountryCode("ES");
    bankAccount.setCreatedDateUtc(LocalDateTime.now());
    bankAccount.setUserAccountId(UUID.fromString("72aa8932-8798-4d1b-1111-590a3e6ffa22"));
    bankAccount.setCreatedBy("test");
    bankAccount.setVersion(0);
    bankAccount = userBankAccountRepository.save(bankAccount);
    UserBankAccountEntity finalBankAccount = bankAccount;

    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.randomUUID());

    mockMvc.perform(post("/accounts/bank/validate")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content(String.format(
                """
                    {
                      "userAccountId":"%s",
                      "id":"%s",
                      "version":%d,
                      "countryCode":"%s",
                      "accountNumber":"%s",
                      "createdDateUtc":"2025-01-01T03:17:32.009Z"
                    }
                    """,
                bankAccount.getUserAccountId(),
                bankAccount.getId(),
                bankAccount.getVersion(),
                bankAccount.getCountryCode(),
                bankAccount.getAccountNumber()
            ))
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent())
        .andDo(_ -> {
          UserBankAccountEntity modifiedEntity = userBankAccountRepository.getReferenceById(
              finalBankAccount.getId());
          assertThat(modifiedEntity.getVerifiedDateUtc()).isNotNull();
          assertThat(modifiedEntity.getVerifiedBy()).isNotNull();
          userBankAccountRepository.delete(modifiedEntity);
        });
  }
}
