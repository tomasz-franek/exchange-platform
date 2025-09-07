package org.exchange.app.backend.admin.controllers;

import static org.hamcrest.Matchers.containsInRelativeOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminTransactionsControllerTest {


  @Autowired
  private MockMvc mockMvc;

  @Test
  void loadTransactionList_should_returnOk_whenCorrectData() throws Exception {
    mockMvc.perform(post("/transactions/list")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "dateFromUtc":"2025-05-01T00:00:00Z",
                  "dateToUtc":"2050-01-01T00:00:00Z"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(5))))
        .andExpect(jsonPath("$[*].amount",
            containsInRelativeOrder(100000000, 400000000, 370000000, 250000, 100)));
  }

  @Test
  void loadSystemAccountTransactionList_should_returnOk_whenCorrectData() throws Exception {
    mockMvc.perform(post("/transactions/system/list")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "dateFromUtc":"2025-05-01T00:00:00Z",
                  "dateToUtc":"2050-01-01T00:00:00Z"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(1))))
        .andExpect(jsonPath("$[0].amount").value("250000"));
  }

  @Test
  void loadExchangeAccountTransactionList_should_returnOk_whenCorrectData() throws Exception {
    mockMvc.perform(post("/transactions/exchange/list")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "dateFromUtc":"2025-05-01T00:00:00Z",
                  "dateToUtc":"2050-01-01T00:00:00Z"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(1))))
        .andExpect(jsonPath("$[0].amount").value("100"));
  }
}
