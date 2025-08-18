package org.exchange.app.backend.admin.controllers;

import static org.hamcrest.Matchers.nullValue;
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
public class AdminReportsControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  public void generateAccountsReport_should_returnOk_when_methodCalledWithUserIdOnly()
      throws Exception {
    mockMvc.perform(post("/reports/accounts")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "userId": "00000000-0000-0000-0002-000000000001"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.reportDateUtc").value(nullValue()));
  }
}
