package org.exchange.app.backend.admin.controllers;

import static org.exchange.app.backend.admin.utils.TestAuthenticationUtils.authority;
import static org.hamcrest.Matchers.containsInRelativeOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
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
public class AdminTransactionsControllerTest {


  @Autowired
  private ExchangeEventSourceRepository exchangeEventSourceRepository;
  @Autowired
  private MockMvc mockMvc;
  @MockitoBean
  private AuthenticationFacade authenticationFacade;

  @Test
  void loadTransactionList_should_returnOk_whenCorrectData() throws Exception {
    mockMvc.perform(post("/transactions/list")
            .contentType(APPLICATION_JSON)
            .with(authority("ADMIN"))
            .content("""
                {
                  "dateFromUtc":"2025-05-01T00:00:00Z",
                  "dateToUtc":"2050-01-01T00:00:00Z"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(6))))
        .andExpect(jsonPath("$[*].amount",
            containsInRelativeOrder(10000_0000, 40000_0000, 37000_0000, -25_0000, 100, -48_0000)));
  }

  @Test
  void loadSystemAccountTransactionList_should_returnOk_whenCorrectData() throws Exception {
    mockMvc.perform(post("/transactions/system/list")
            .contentType(APPLICATION_JSON)
            .with(authority("ADMIN"))
            .content("""
                {
                  "dateFromUtc":"2025-05-01T00:00:00Z",
                  "dateToUtc":"2050-01-01T00:00:00Z"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(1))))
        .andExpect(jsonPath("$[0].amount").value("-250000"));
  }

  @Test
  void loadExchangeAccountTransactionList_should_returnOk_whenCorrectData() throws Exception {
    mockMvc.perform(post("/transactions/exchange/list")
            .contentType(APPLICATION_JSON)
            .with(authority("ADMIN"))
            .content("""
                {
                  "dateFromUtc":"2025-05-01T00:00:00Z",
                  "dateToUtc":"2050-01-01T00:00:00Z"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(1))))
        .andExpect(jsonPath("$[0].amount").value("100"));
  }

  @Test
  void loadTransactionList_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(post("/transactions/list")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "dateFromUtc":"2025-05-01T00:00:00Z",
                  "dateToUtc":"2050-01-01T00:00:00Z"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadSystemAccountTransactionList_should_returnForbidden_when_wrongAuthority()
      throws Exception {
    mockMvc.perform(post("/transactions/system/list")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "dateFromUtc":"2025-05-01T00:00:00Z",
                  "dateToUtc":"2050-01-01T00:00:00Z"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadExchangeAccountTransactionList_should_returnForbidden_when_wrongAuthority()
      throws Exception {
    mockMvc.perform(post("/transactions/exchange/list")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "dateFromUtc":"2025-05-01T00:00:00Z",
                  "dateToUtc":"2050-01-01T00:00:00Z"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void saveCorrectionRequest_should_returnForbidden_when_wrongAuthority()
      throws Exception {
    mockMvc.perform(post("/transactions/correction")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "amount":50000000,
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void saveCorrectionRequest_should_returnNotFound_when_wrongUserAccountId()
      throws Exception {
    mockMvc.perform(post("/transactions/correction")
            .with(authority("ADMIN"))
            .content("""
                {
                  "amount":50000000,
                  "userAccountId":"00000000-0000-9999-0002-000000000001"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"))
        .andExpect(jsonPath("$.message").value(
            "Object UserAccount with value userAccountId=00000000-0000-9999-0002-000000000001 not found"));
  }

  @Test
  void saveCorrectionRequest_should_returnCreated_when_correctUserAccountId()
      throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-0000-0002-000000000003"));
    mockMvc.perform(post("/transactions/correction")
            .with(authority("ADMIN"))
            .content("""
                {
                  "amount":50000000,
                  "userAccountId":"72aa8932-8798-4d1b-1111-590a3e6ffa22",
                  "userId":"00000000-0000-0000-0002-000000000001"
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andDo(mvcResult -> {
          Long id = Long.valueOf(JsonPath.compile("$.id")
              .read(mvcResult.getResponse().getContentAsString()).toString());
          exchangeEventSourceRepository.deleteById(id);
        });
  }
}
