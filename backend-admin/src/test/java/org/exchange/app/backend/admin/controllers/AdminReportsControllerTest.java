package org.exchange.app.backend.admin.controllers;

import static org.exchange.app.backend.admin.utils.TestAuthenticationUtils.authority;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.MediaType.APPLICATION_PDF;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
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
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "userId": "00000000-0000-0000-0002-000000000001",
                  "dateFromUtc": "2024-01-01T00:00:00.0Z"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(3))))
        .andExpect(jsonPath("$[0].reportDateUtc").value(notNullValue()))
        .andExpect(jsonPath("$[0].amountDeposits").value(100000000))
        .andExpect(jsonPath("$[0].amountWithdraws").value(0))
        .andExpect(jsonPath("$[0].amountExchanges").value(0))
        .andExpect(jsonPath("$[0].amountFees").value(0))
        .andExpect(jsonPath("$[0].amountCorrections").value(0))
        .andExpect(jsonPath("$[0].amountCancellations").value(0))
        .andExpect(jsonPath("$[0].currency").value("PLN"))
        .andExpect(jsonPath("$[1].reportDateUtc").value(notNullValue()))
        .andExpect(jsonPath("$[1].amountDeposits").value(400000000))
        .andExpect(jsonPath("$[1].amountWithdraws").value(0))
        .andExpect(jsonPath("$[1].amountExchanges").value(0))
        .andExpect(jsonPath("$[1].amountFees").value(0))
        .andExpect(jsonPath("$[1].amountCorrections").value(0))
        .andExpect(jsonPath("$[1].amountCancellations").value(0))
        .andExpect(jsonPath("$[1].currency").value("EUR"))
        .andExpect(jsonPath("$[2].reportDateUtc").value(notNullValue()))
        .andExpect(jsonPath("$[2].amountDeposits").value(370000000))
        .andExpect(jsonPath("$[2].amountWithdraws").value(-480000))
        .andExpect(jsonPath("$[2].amountExchanges").value(0))
        .andExpect(jsonPath("$[2].amountFees").value(0))
        .andExpect(jsonPath("$[2].amountCorrections").value(0))
        .andExpect(jsonPath("$[2].amountCancellations").value(0))
        .andExpect(jsonPath("$[2].currency").value("USD"));
  }

  @Test
  public void loadOperationPdfDocument_should_returnOk_when_methodCalledWithCorrectRequest()
      throws Exception {
    mockMvc.perform(post("/reports/operations-pdf")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "systemAccountId": "8d8a228a-19a4-4f71-9f69-000000000003",
                  "dateFromUtc": "2025-01-01T00:00:00.000Z"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_PDF))
        .andExpect(header().string("Content-Disposition",
            "attachment; file=systemOperationsReport.pdf"));
  }

  @Test
  void generateAccountsReport_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(post("/reports/accounts")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "userId": "00000000-0000-0000-0002-000000000001",
                  "dateFromUtc": "2024-01-01T00:00:00.0Z"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadOperationPdfDocument_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(post("/reports/operations-pdf")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "systemAccountId": "8d8a228a-19a4-4f71-9f69-000000000003",
                  "dateFromUtc": "2025-01-01T00:00:00.000Z"
                }
                """)
            .accept(APPLICATION_PDF)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }
}
