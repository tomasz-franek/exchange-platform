package org.exchange.app.backend.admin.controllers;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
class AdminSystemControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void loadBuildInfo_should_returnBuildInformation_when_methodCalled() throws Exception {
    mockMvc.perform(get("/system/buildInfo")
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.commitHash").isNotEmpty())
        .andExpect(jsonPath("$.versionNumber").isNotEmpty())
        .andExpect(jsonPath("$.buildTime").isNotEmpty())
        .andExpect(jsonPath("$.commitTime").isNotEmpty())
        .andExpect(jsonPath("$.moduleName").value("backend-admin"))
        .andExpect(jsonPath("$.branchName").isNotEmpty());
  }

  @Test
  void loadSystemCurrencyList_should_returnCurrencyList_when_methodCalled() throws Exception {
    mockMvc.perform(get("/system/currency/list")
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(5))))
        .andExpect(jsonPath("$[0].currency").value("PLN"))
        .andExpect(jsonPath("$[1].currency").value("EUR"))
        .andExpect(jsonPath("$[2].currency").value("GBP"))
        .andExpect(jsonPath("$[3].currency").value("CHF"))
        .andExpect(jsonPath("$[4].currency").value("USD"));
  }
}