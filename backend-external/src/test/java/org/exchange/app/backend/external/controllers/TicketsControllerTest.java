package org.exchange.app.backend.external.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class TicketsControllerTest {

  @Autowired
  private MockMvc mockMvc;


  @MockitoBean
  private AuthenticationFacade authenticationFacade;

  @BeforeEach
  public void beforeEach() {
    when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-0000-0002-000000000001"));
  }

  @Test
  void loadUserTicketList_should_returnListOfTicketForUser_when_called()
      throws Exception {
    mockMvc.perform(get("/tickets/list")
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(1))))
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].amount").value(100000))
        .andExpect(jsonPath("$[0].pair").value("EUR_USD"))
        .andExpect(jsonPath("$[0].direction").value("BUY"))
        .andExpect(jsonPath("$[0].userAccountId").value("72aa8932-8798-4d1b-aaf0-590a3e6ffa22"))
        .andExpect(jsonPath("$[0].ticketStatus").value("NEW"))
        .andExpect(jsonPath("$[0].ratio").value("10312"))
        .andExpect(jsonPath("$[0].version").value("0"))
        .andExpect(jsonPath("$[0].eventType").value("ORDER"));
  }

  @Test
  void saveUserTicket_should_returnNotFound_when_missingAccountWithCurrency()
      throws Exception {

    mockMvc.perform(post("/tickets/create")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                	"id": 2,
                	"amount": 43000,
                	"ratio": 290000,
                	"pair" : "EUR_CHF",
                	"epochUtc": 222,
                	"direction" : "BUY",
                	"ticketStatus" : "NEW",
                	"eventType": "EXCHANGE",
                	"version": 0
                }
                """))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"))
        .andExpect(jsonPath("$.message").value(
            "Object UserAccount with id=Not found account for currency CHF not found"));
  }
}
