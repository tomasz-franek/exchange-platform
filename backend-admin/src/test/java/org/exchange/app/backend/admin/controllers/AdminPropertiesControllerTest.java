package org.exchange.app.backend.admin.controllers;

import static org.exchange.app.backend.admin.utils.TestAuthenticationUtils.authority;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.entities.WithdrawEntity;
import org.exchange.app.backend.db.repositories.WithdrawRepository;
import org.exchange.app.common.api.model.Currency;
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
class AdminPropertiesControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private WithdrawRepository withdrawRepository;

  @MockitoBean
  private AuthenticationFacade authenticationFacade;

  @Test
  void updateSystemCurrency_should_updateMinimumExchangeAmount_when_calledWithNewValue()
      throws Exception {
    mockMvc.perform(put("/properties/currency")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "id":1,
                  "currency":"PLN",
                  "minimumExchange":10
                }
                """))
        .andExpect(status().isNoContent());
  }

  @Test
  void updateSystemCurrency_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(put("/properties/currency")
            .contentType(APPLICATION_JSON)
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                 {
                  "id":1,
                  "currency":"PLN",
                  "minimumExchange":10
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void saveWithdrawLimit_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(put("/properties/withdraw")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "currency":"PLN",
                  "amount":10,
                  "version":10
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void saveWithdrawLimit_should_returnFound_when_definitionForCurrencyExists() throws Exception {
    mockMvc.perform(put("/properties/withdraw")
            .with(authority("ADMIN"))
            .content("""
                {
                  "currency":"USD",
                  "amount":10,
                  "version":10
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("Withdraw"))
        .andExpect(jsonPath("$.message").value(
            "Object already exists='USD'"));
  }

  @Test
  void saveWithdrawLimit_should_saveWithdrawDefinition_when_notExists() throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.randomUUID());
    mockMvc.perform(put("/properties/withdraw")
            .with(authority("ADMIN"))
            .content("""
                {
                  "currency":"PLN",
                  "amount":10,
                  "version":0
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent())
        .andDo(_ -> {
          List<WithdrawEntity> all = withdrawRepository.findAll();
          all.stream().filter(x -> x.getCurrency().getCode().equals(Currency.PLN))
              .forEach(x -> withdrawRepository.delete(x));
        });
  }

  @Test
  void updateWithdrawLimit_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(patch("/properties/withdraw")
            .with(authority("WRONG_AUTHORITY"))
            .contentType(APPLICATION_JSON)
            .content("""
                 {
                  "id":1,
                  "currency":"PLN",
                  "amount":10,
                  "version":10
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void updateWithdrawLimit_should_returnBadRequest_when_wrongCurrencyForEditedEntity()
      throws Exception {
    mockMvc.perform(patch("/properties/withdraw")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                 {
                  "id":1,
                  "currency":"PLN",
                  "amount":10,
                  "version":10
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("Withdraw"))
        .andExpect(jsonPath("$.message").value(
            "Validation errors [Wrong currency for entity]"));
  }

  @Test
  void updateWithdrawLimit_should_returnObjectNotFound_when_wrongId()
      throws Exception {
    mockMvc.perform(patch("/properties/withdraw")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                 {
                  "id":-999,
                  "currency":"USD",
                  "amount":10,
                  "version":10
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"))
        .andExpect(jsonPath("$.message").value(
            "Object Withdraw with id=-999 not found"));
  }

  @Test
  void updateWithdrawLimit_should_returnConflict_when_wrongVersion()
      throws Exception {
    mockMvc.perform(patch("/properties/withdraw")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                 {
                  "id":1,
                  "currency":"USD",
                  "amount":10,
                  "version":10
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isConflict())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("WithdrawEntity"))
        .andExpect(jsonPath("$.message").value(
            "Invalid version for entity row currentVersion=0 newVersion=10"));
  }
}