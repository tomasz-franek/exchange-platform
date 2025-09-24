package org.exchange.app.backend.external.controllers;

import static org.exchange.app.backend.external.utils.TestAuthenticationUtils.authority;
import static org.hamcrest.Matchers.equalTo;
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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class SystemControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void loadBuildInfo_should_returnBuildInformation_when_methodCalled() throws Exception {
    mockMvc.perform(get("/system/buildInfo")
            .with(authority("USER"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.commitHash").isNotEmpty())
        .andExpect(jsonPath("$.versionNumber").isNotEmpty())
        .andExpect(jsonPath("$.buildTime").isNotEmpty())
        .andExpect(jsonPath("$.commitTime").isNotEmpty())
        .andExpect(jsonPath("$.moduleName").value("backend-external"))
        .andExpect(jsonPath("$.branchName").isNotEmpty());
  }

  @Test
  void loadSystemMessageList_should_returnAllActiveSystemMessages_when_methodCalled()
      throws Exception {
    mockMvc.perform(get("/system/messages")
            .with(authority("USER"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(1))))
        .andExpect(jsonPath("$[0].messageText").value("Test message"))
        .andExpect(jsonPath("$[0].priority").value("LOW"))
        .andExpect(jsonPath("$[0].id").value("72aa8932-5555-4d1b-1111-590a3e6ffa11"));
  }

  @Test
  void loadSystemCurrencyList_shouldReturnListOfCurrencies_when_called() throws Exception {
    mockMvc.perform(get("/system/currency/list")
            .with(authority("USER"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(5))))
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].currency").value("PLN"))
        .andExpect(jsonPath("$[1].id").value(2))
        .andExpect(jsonPath("$[1].currency").value("EUR"))
        .andExpect(jsonPath("$[2].id").value(3))
        .andExpect(jsonPath("$[2].currency").value("GBP"))
        .andExpect(jsonPath("$[3].id").value(4))
        .andExpect(jsonPath("$[3].currency").value("CHF"))
        .andExpect(jsonPath("$[4].id").value(5))
        .andExpect(jsonPath("$[4].currency").value("USD"));
  }

  @Test
  void loadSystemCurrencyList_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(get("/system/currency/list")
            .with(authority("WRONG_AUTHORITY"))
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadSystemMessageList_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(get("/system/messages")
            .with(authority("WRONG_AUTHORITY"))
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadBuildInfo_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(get("/system/buildInfo")
            .with(authority("WRONG_AUTHORITY"))
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }
}