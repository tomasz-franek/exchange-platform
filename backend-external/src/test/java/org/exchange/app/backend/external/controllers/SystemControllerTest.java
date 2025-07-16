package org.exchange.app.backend.external.controllers;

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
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class SystemControllerTest {

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
        .andExpect(jsonPath("$.moduleName").value("backend-external"))
        .andExpect(jsonPath("$.branchName").isNotEmpty());
  }

  @Test
  void loadSystemMessageList_should_returnAllActiveSystemMessages_when_methodCalled()
      throws Exception {
    mockMvc.perform(get("/system/messages")
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(1))))
        .andExpect(jsonPath("$[0].messageText").value("Test message"))
        .andExpect(jsonPath("$[0].priority").value(1))
        .andExpect(jsonPath("$[0].id").value("72aa8932-5555-4d1b-aaf0-590a3e6ffa11"));
  }
}