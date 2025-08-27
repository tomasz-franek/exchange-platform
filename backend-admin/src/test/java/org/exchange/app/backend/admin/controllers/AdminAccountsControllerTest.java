package org.exchange.app.backend.admin.controllers;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.oneOf;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedKafka(partitions = 1)
public class AdminAccountsControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void loadAccounts_should_returnOk_when_methodCalledWithCorrectParameters()
      throws Exception {
    mockMvc.perform(post("/accounts/list")
            .contentType(APPLICATION_JSON)
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
            "72aa8932-8798-4d1b-aaf0-590a3e6ffa11",
            "72aa8932-8798-4d1b-aaf0-590a3e6ffa22",
            "72aa8932-8798-4d1b-aaf0-590a3e6ffa55"))))
        .andExpect(jsonPath("$[*].currency", everyItem(oneOf("PLN", "EUR", "USD"))));
  }

  @Test
  public void saveAccountDeposit_should_returnNoContent_when_methodCalledWithCorrectParameters()
      throws Exception {
    mockMvc.perform(post("/accounts/deposit")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "amount":50000000,
                  "userAccountId":"72aa8932-8798-4d1b-aaf0-590a3e6ffa22",
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
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "amount":50000000,
                  "userAccountId":"72aa8932-8798-4d1b-aaf0-590a3e6ffa22",
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
}
