package org.exchange.app.backend.admin.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.UserEntity;
import org.exchange.app.backend.db.repositories.UserRepository;
import org.exchange.app.common.api.model.UserStatus;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminUsersControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private AuthenticationFacade authenticationFacade;


  @Autowired
  private UserRepository userRepository;

  @Test
  void updateUserStatus_should_returnNoContent_whenCallWithCorrectUserId() throws Exception {
    Mockito.when(authenticationFacade.getCurrentUserName())
        .thenReturn(Optional.of("admin"));
    UserEntity userEntity = new UserEntity();
    userEntity.setEmail("test@test.com");
    userEntity.setStatus(UserStatus.ACTIVE);
    userEntity.setId(UUID.randomUUID());
    userEntity.setVersion(0);
    userEntity.setCreatedDateUTC(ExchangeDateUtils.currentLocalDateTime());
    userEntity = userRepository.save(userEntity);

    UserEntity finalUserEntity = userEntity;
    mockMvc.perform(post("/users/block")
            .contentType(APPLICATION_JSON)
            .content(
                String.format(
                    """
                        {
                          "userId": "%s",
                          "version":0,
                          "status": "DISABLED"
                        }
                        """, userEntity.getId())))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.userId").value(userEntity.getId().toString()))
        .andExpect(jsonPath("$.version").value(1))
        .andExpect(jsonPath("$.status").value("DISABLED"))
        .andExpect(jsonPath("$.modifiedBy").value("admin"))
        .andExpect(jsonPath("$.email").value("test@test.com"))
        .andDo(result -> {
          UserEntity changedUserEntity = userRepository.findById(finalUserEntity.getId())
              .orElseThrow(() ->
                  new RuntimeException("user not found"));
          assertThat(changedUserEntity.getStatus()).isEqualTo(UserStatus.DISABLED);
          userRepository.delete(changedUserEntity);
        });
  }

  @Test
  void updateUserStatus_should_returnIsConflict_whenCallWithWrongVersionNumber() throws Exception {
    Mockito.when(authenticationFacade.getCurrentUserName())
        .thenReturn(Optional.of("admin"));
    mockMvc.perform(post("/users/block")
            .contentType(APPLICATION_JSON)
            .content(
                """
                    {
                     "userId": "00000000-2222-0000-0001-000000000001",
                      "version":999,
                      "status": "DISABLED"
                    }
                    """))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.errorCode").value("UserEntity"))
        .andExpect(jsonPath("$.message").value(
            "Invalid version for entity row currentVersion=0 newVersion=999"));
  }

  @Test
  void updateUserStatus_should_returnBadRequest_whenWrongCredentials() throws Exception {
    Mockito.when(authenticationFacade.getCurrentUserName())
        .thenReturn(Optional.empty());
    mockMvc.perform(post("/users/block")
            .contentType(APPLICATION_JSON)
            .content(
                """
                    {
                      "userId": "00000000-0000-0000-0002-000000000002",
                      "version": 0,
                      "status": "DISABLED"
                    }
                    """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errorCode").value("AdminUserService"))
        .andExpect(jsonPath("$.message").value("Invalid admin"));
  }

  @Test
  void updateUserStatus_should_returnNotFound_whenCallWithWrongUserId()
      throws Exception {
    Mockito.when(authenticationFacade.getCurrentUserName())
        .thenReturn(Optional.of("admin"));
    mockMvc.perform(post("/users/block")
            .contentType(APPLICATION_JSON)
            .content(
                """
                    {
                      "userId": "99999999-9999-0000-0002-000000000002",
                      "version": 0,
                      "status": "DISABLED"
                    }
                    """))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"))
        .andExpect(jsonPath("$.message").value(
            "Object User with id=99999999-9999-0000-0002-000000000002 not found"));
  }

  @Test
  void saveUserProperty_should_createUserProperty_when_PropertiesAreNotCreated() throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-2222-0000-0001-000000000001"));
    mockMvc.perform(post("/users/property")
            .contentType(APPLICATION_JSON)
            .characterEncoding(StandardCharsets.UTF_8)
            .content("""
                {
                  "language": "DE_de",
                  "locale": "DE",
                  "timezone": "UTC",
                  "version": 0,
                  "userId": null
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.version").value(0))
        .andExpect(jsonPath("$.language").value("DE_de"))
        .andExpect(jsonPath("$.locale").value("DE"))
        .andExpect(jsonPath("$.userId").isNotEmpty())
        .andExpect(jsonPath("$.timezone").value("UTC"));
  }

  @Test
  void saveUserProperty_should_returnNotFound_when_UserNotFound() throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-4444-4444-0002-000000000001"));
    mockMvc.perform(post("/users/property")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "language": "DE_de",
                  "locale": "DE",
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
        .thenReturn(UUID.fromString("00000000-2222-0000-0002-000000000001"));
    mockMvc.perform(post("/users/property")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "language": "DE_de",
                  "locale": "DE",
                  "timezone": "UTC",
                  "version": 0
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.version").value(1))
        .andExpect(jsonPath("$.language").value("DE_de"))
        .andExpect(jsonPath("$.locale").value("DE"))
        .andExpect(jsonPath("$.userId").isNotEmpty())
        .andExpect(jsonPath("$.timezone").value("UTC"));
  }

  @Test
  void saveUserProperty_should_returnOptimisticLockException_when_notTheSameVersionInRequestAsInEntity()
      throws Exception {
    Mockito.when(authenticationFacade.getUserUuid())
        .thenReturn(UUID.fromString("00000000-0000-0000-0002-000000000001"));
    mockMvc.perform(post("/users/property")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "language": "DE_de",
                  "locale": "DE",
                  "timezone": "UTC",
                  "version": 999
                }
                """))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.errorCode").value("UserPropertyEntity"))
        .andExpect(jsonPath("$.message").value(
            "Invalid version for entity row currentVersion=0 newVersion=999"));
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
