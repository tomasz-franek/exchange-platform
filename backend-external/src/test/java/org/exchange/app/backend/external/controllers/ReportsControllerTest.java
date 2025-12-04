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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.SnapshotDataEntity;
import org.exchange.app.backend.db.entities.SystemSnapshotEntity;
import org.exchange.app.backend.db.repositories.SnapshotDataRepository;
import org.exchange.app.backend.db.repositories.SystemSnapshotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
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

  @Autowired
  private SystemSnapshotRepository systemSnapshotRepository;

  @Autowired
  private SnapshotDataRepository snapshotDataRepository;

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

    SystemSnapshotEntity systemSnapshotEntity = new SystemSnapshotEntity();
    systemSnapshotEntity.setLastEventSourceId(1L);
    systemSnapshotEntity.setDateUtc(LocalDate.of(2025, 1, 1));
    systemSnapshotEntity = systemSnapshotRepository.save(systemSnapshotEntity);
    LocalDateTime today = ExchangeDateUtils.currentLocalDateTime();
    SnapshotDataEntity snapshotDataEntity = new SnapshotDataEntity();
    snapshotDataEntity.setSystemSnapshotId(systemSnapshotEntity.getId());
    snapshotDataEntity.setUserAccountId(UUID.fromString("72aa8932-8798-4d1b-1111-590a3e6ffa11"));
    snapshotDataEntity.setAmount(0L);
    snapshotDataEntity = snapshotDataRepository.save(snapshotDataEntity);
    int year = today.getYear();
    int month = today.getMonthValue();
    SystemSnapshotEntity finalSystemSnapshotEntity = systemSnapshotEntity;
    SnapshotDataEntity finalSnapshotDataEntity = snapshotDataEntity;
    mockMvc.perform(post("/reports/financial")
            .with(authority("USER"))
            .contentType(APPLICATION_JSON)
            .content(String.format(
                """
                    {
                      "year":%d,
                      "month":%d,
                      "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa11",
                      "currency":"EUR"
                    }
                    """, year, month)))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_PDF))
        .andExpect(header().string("Content-Disposition",
            String.format("attachment; file=financialReport-%d-%d.pdf", year, month))).andDo(_ -> {
          snapshotDataRepository.delete(finalSnapshotDataEntity);
          systemSnapshotRepository.delete(finalSystemSnapshotEntity);
        });
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
                      "userAccountID":"72aa8932-8798-4d1b-1111-590a3e6ffa11",
                      "currency":"EUR"
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