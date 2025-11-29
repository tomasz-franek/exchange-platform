package org.exchange.app.backend.services;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class StrategiesEndpointTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void strategies_should_returnStrategiesConfiguration_when_called() throws Exception {
    mockMvc.perform(get("/actuator/strategies"))
        .andExpect(status().isOk())
        .andExpect(content().contentType("application/vnd.spring-boot.actuator.v3+json"))
        .andExpect(jsonPath("$.ratioStrategy").value("FirstTicketRatioStrategy"))
        .andExpect(jsonPath("$.feePercentage").value("0.1"))
        .andExpect(jsonPath("$.feeStrategy").value("PercentageFeeStrategy"));
  }

}