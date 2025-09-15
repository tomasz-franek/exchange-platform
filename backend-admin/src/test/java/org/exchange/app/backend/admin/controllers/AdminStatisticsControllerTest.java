package org.exchange.app.backend.admin.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminStatisticsControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void loadUsersStatistic_should_returnOk_when_methodCalledWithCorrectParameters()
      throws Exception {
    mockMvc.perform(post("/statistics/users")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "userId": "00000000-0000-0000-0002-000000000002",
                  "currency": "EUR"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.allTickets").value(1))
        .andExpect(jsonPath("$.activeTickets").value(2))
        .andExpect(jsonPath("$.amountInTickets").value(3))
        .andExpect(jsonPath("$.amountTotal").value(4));
  }

  @ParameterizedTest
  @CsvSource(value = {
      "PLN;100000000;0",
      "EUR;400250100;250000",
      "GBP;0;0",
      "CHF;0;0",
      "USD;370000000;0",
  }, delimiter = ';')
  public void loadCurrencyStatistics_should_returnOk_when_methodCalledWithCorrectParameters(
      String currency, Long amountTotal, Long amountInTickets)
      throws Exception {
    mockMvc.perform(get("/statistics/currency/{currency}", currency)
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.amountTotal").value(amountTotal))
        .andExpect(jsonPath("$.amountInTickets").value(amountInTickets))
        .andExpect(jsonPath("$.currency").value(currency));
  }

  @Test
  public void loadPairStatistics_should_returnOk_when_methodCalledWithCorrectParameters()
      throws Exception {
    mockMvc.perform(get("/statistics/pair/{pair}", Pair.EUR_USD.toString())
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "userId": "00000000-0000-0000-0002-000000000002"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.amountTicketsSell").value(200))
        .andExpect(jsonPath("$.amountTicketsBuy").value(30));
  }
}
