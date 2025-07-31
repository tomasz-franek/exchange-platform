package org.exchange.app.backend.admin.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.oneOf;
import static org.springframework.http.MediaType.APPLICATION_JSON;
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
@EmbeddedKafka(partitions = 1, brokerProperties = {"listeners=PLAINTEXT://localhost:8882",
    "port=8882"})
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
                  "userId":"00000000-0000-0000-0002-000000000001"
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
                  "userId":"00000000-0000-0000-0002-000000000001"
                }
                """))
        .andExpect(status().isNoContent());
  }
}
