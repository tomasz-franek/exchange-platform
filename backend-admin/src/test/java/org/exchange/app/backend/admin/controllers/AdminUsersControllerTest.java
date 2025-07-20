package org.exchange.app.backend.admin.controllers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
        .andExpect(status().isNoContent())
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
                     "userId": "00000000-0000-0000-0002-000000000002",
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
}
