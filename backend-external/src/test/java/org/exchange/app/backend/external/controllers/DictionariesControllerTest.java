package org.exchange.app.backend.external.controllers;

import static org.exchange.app.backend.external.utils.TestAuthenticationUtils.authority;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
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
public class DictionariesControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void loadTimezoneList_should_returnListOfTimeZones_when_endpointIsCalled()
      throws Exception {
    mockMvc.perform(get("/dictionaries/timezones")
            .with(authority("USER"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(603))));
  }

  @Test
  void loadUnicodeLocalesList_should_returnListOfUnicodeLocales_when_endpointIsCalled()
      throws Exception {
    mockMvc.perform(get("/dictionaries/unicodeLocales")
            .with(authority("USER"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(249))));
  }

  @Test
  void loadUnicodeLocalesList_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(get("/dictionaries/unicodeLocales")
            .with(authority("WRONG_AUTHORITY"))
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadTimezoneList_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(get("/dictionaries/timezones")
            .with(authority("WRONG_AUTHORITY"))
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }
}
