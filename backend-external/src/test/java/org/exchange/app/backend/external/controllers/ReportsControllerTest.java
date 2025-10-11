package org.exchange.app.backend.external.controllers;

import static org.exchange.app.backend.external.utils.TestAuthenticationUtils.authority;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.MediaType.APPLICATION_PDF;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ReportsControllerTest {

  @Autowired
  private MockMvc mockMvc;


  @MockitoBean
  private AuthenticationFacade authenticationFacade;

  @BeforeEach
  public void beforeEach() {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-0000-0002-000000000001"));

  }

  @Test
  void loadExchangePdfDocument_should_returnNotFound_when_wrongTicketId()
      throws Exception {
    mockMvc.perform(get("/reports/exchange-pdf/{ticketId}", 999)
            .with(authority("USER"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value("Object Ticket with id=999 not found"))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"));

  }

  @Test
  void loadExchangePdfDocument_should_returnOkAndPdfReport_when_correctTicketId() throws Exception {
    mockMvc.perform(get("/reports/exchange-pdf/{ticketId}", 1)
            .with(authority("USER"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_PDF))
        .andExpect(header().string("Content-Disposition",
            "attachment; file=exchangeReport-1.pdf"));
  }

  @Test
  void loadFinancialReportPdfDocument_should_returnOkAndGetPdfDocument_when_calledWithCorrectData()
      throws Exception {
    LocalDateTime today = ExchangeDateUtils.currentLocalDateTime();
    int year = today.getYear();
    int month = today.getMonthValue();
    mockMvc.perform(post("/reports/financial")
            .with(authority("USER"))
            .contentType(APPLICATION_JSON)
            .content(String.format(
                """
                    {
                      "year":%d,
                      "month":%d,
                      "userAccountIDs":["72aa8932-8798-4d1b-1111-590a3e6ffa11"]
                    }
                    """, year, month)))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_PDF))
        .andExpect(header().string("Content-Disposition",
            String.format("attachment; file=exchangeReport-%d-%d.pdf", year, month)));
  }

  @Test
  void loadFinancialReportPdfDocument_should_returnForbidden_when_wrongAuthority()
      throws Exception {
    mockMvc.perform(post("/reports/financial")
            .with(authority("WRONG_AUTHORITY"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                      "year": 2025,
                      "month": 9,
                      "userAccountIDs":["72aa8932-8798-4d1b-1111-590a3e6ffa11"]
                    }
                """))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadExchangePdfDocument_should_returnForbidden_when_wrongAuthority()
      throws Exception {
    mockMvc.perform(get("/reports/exchange-pdf/{ticketId}", 1)
            .with(authority("WRONG_AUTHORITY"))
            .accept(APPLICATION_PDF)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }
}