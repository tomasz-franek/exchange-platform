package org.exchange.app.backend.admin.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AdminPropertiesControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void updateSystemCurrency_should_updateMinimumExchangeAmount_when_calledWithNewValue()
      throws Exception {
    mockMvc.perform(put("/properties/currency")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "id":1,
                  "currency":"PLN",
                  "minimumExchange":10
                }
                """))
        .andExpect(status().isNoContent());
  }
}