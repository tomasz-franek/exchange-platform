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

  @ParameterizedTest
  @CsvSource(value = {
      "PLN;00000000-0000-0000-0002-000000000001;0;0;0;100000000",
      "EUR;00000000-0000-0000-0002-000000000001;0;0;0;400000000",
      "USD;00000000-0000-0000-0002-000000000001;1;1;-250000;369520000",
  }, delimiter = ';')
  public void loadUsersStatistic_should_returnOk_when_methodCalledWithCorrectParameters(
      String currency, String userId, Integer allTickets, Integer activeTickets,
      Integer amountInTickets, Integer amountTotal)
      throws Exception {
    mockMvc.perform(post("/statistics/users")
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "userId": "%s",
                  "currency": "%s"
                }
                """, userId, currency)))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.allTickets").value(allTickets))
        .andExpect(jsonPath("$.activeTickets").value(activeTickets))
        .andExpect(jsonPath("$.amountInTickets").value(amountInTickets))
        .andExpect(jsonPath("$.amountTotal").value(amountTotal));
  }

  @ParameterizedTest
  @CsvSource(value = {
      "PLN;100000000;0",
      "EUR;400000000;0",
      "GBP;0;0",
      "CHF;0;0",
      "USD;369520000;-250000",
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
