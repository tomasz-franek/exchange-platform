package org.exchange.app.backend.external.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class UserServiceImplTest {

  @MockitoBean
  private AuthenticationFacade authenticationFacade;

  @Autowired
  private MockMvc mockMvc;

  @BeforeEach
  public void beforeEach() {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-0000-0002-000000000001"));

  }


  @Test
  void saveUserProperty_should_createUserProperty_when_PropertiesAreNotCreated() throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-0000-0002-000000000002"));
    mockMvc.perform(post("/users/property")
            .contentType(APPLICATION_JSON)
            .characterEncoding(StandardCharsets.UTF_8)
            .content("""
                {
                  "language": "DE",
                  "timezone": "UTC",
                  "version": 0,
                  "userId": null
                }
                """))
        .andExpect(status().isCreated());
  }

  @Test
  void saveUserProperty_should_returnNotFound_when_UserNotFound() throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-4444-4444-0002-000000000001"));
    mockMvc.perform(post("/users/property")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "language": "DE",
                  "timezone": "UTC",
                  "version": 0
                }
                """))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value(
            "Object User with id=00000000-4444-4444-0002-000000000001 not found"))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"));
  }

  @Test
  void saveUserProperty_should_updateUserProperty_when_propertiesExists() throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-0000-0002-000000000001"));
    mockMvc.perform(post("/users/property")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "language": "DE",
                  "timezone": "UTC",
                  "version": 0
                }
                """))
        .andExpect(status().isCreated());
  }

  @Test
  void getUserProperty_should_shouldGetUserProperty_when_propertiesAreCreated() throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-0000-0002-000000000001"));
    mockMvc.perform(get("/users/property")
            .accept(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.language").value(
            "EN"))
        .andExpect(jsonPath("$.timezone").value("UTC"));
  }

  @Test
  void getUserProperty_should_shouldReturnNotFound_when_propertiesAreCreated() throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-9999-9999-0002-000000000001"));
    mockMvc.perform(get("/users/property")
            .accept(APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value(
            "Object User with id=00000000-9999-9999-0002-000000000001 not found"))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"));
  }
}