package org.exchange.app.backend.admin.controllers;

import static org.exchange.app.backend.admin.utils.TestAuthenticationUtils.authority;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.SystemMessageEntity;
import org.exchange.app.backend.db.repositories.SystemMessageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AdminSystemMessagesControllerTest {

  @Autowired
  private SystemMessageRepository systemMessageRepository;

  @Autowired
  private MockMvc mockMvc;

  @Test
  void saveSystemMessage_should_returnOk_whenCorrectData() throws Exception {
    mockMvc.perform(post("/messages/message")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "messageText":"test",
                  "priority":"LOW",
                  "active":true,
                  "dateFromUtc":"2025-01-01T03:17:32.009Z",
                  "dateToUtc":"2050-01-01T12:53:17.734Z"
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.id").isNotEmpty())
        .andExpect(jsonPath("$.version").value(0))
        .andExpect(jsonPath("$.priority").value("LOW"))
        .andDo((mvcResult) -> {
          UUID id = UUID.fromString(JsonPath.compile("$.id")
              .read(mvcResult.getResponse().getContentAsString()).toString());
          systemMessageRepository.deleteById(id);
        });
  }

  @Test
  void saveSystemMessage_should_returnBadRequest_whenMissingMandatoryFields() throws Exception {
    mockMvc.perform(post("/messages/message")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "priority":"LOW",
                  "active":true
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("SystemValidator"))
        .andExpect(jsonPath("$.message").value(
            "Validation errors [Field 'messageText' is null but column is marked as not null]"));
  }


  @Test
  void saveSystemMessage_should_returnBadRequest_whenValueTooLong() throws Exception {
    mockMvc.perform(post("/messages/message")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "messageText":"%s",
                  "priority":"LOW",
                  "active":true
                }
                """, StringUtils.repeat('x', 300))))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("SystemValidator"))
        .andExpect(jsonPath("$.message").value(
            "Validation errors [Field 'messageText' exceeds maximum length of 255.]"));
  }

  @Test
  void updateSystemMessage_should_returnNoContent_when_recordUpdated() throws Exception {
    SystemMessageEntity systemMessageEntity = new SystemMessageEntity();
    systemMessageEntity.setMessageText("text");
    systemMessageEntity.setId(UUID.randomUUID());
    systemMessageEntity.setCreateDateUtc(ExchangeDateUtils.currentLocalDateTime());
    systemMessageEntity.setVersion(0);
    systemMessageEntity = systemMessageRepository.save(systemMessageEntity);
    SystemMessageEntity finalSystemMessageEntity = systemMessageEntity;
    mockMvc.perform(put("/messages/message")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "id":"%s",
                  "messageText":"modifiedText",
                  "priority":"LOW",
                  "active":true,
                  "version":0
                }
                """, systemMessageEntity.getId())))
        .andExpect(status().isNoContent())
        .andDo((mvcResult) -> systemMessageRepository.deleteById(finalSystemMessageEntity.getId()));
  }

  @Test
  void updateSystemMessage_should_returnNotFound_when_notFoundSystemMessageWithId()
      throws Exception {
    UUID id = UUID.randomUUID();
    mockMvc.perform(put("/messages/message")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "id":"%s",
                  "messageText":"modifiedText",
                  "priority":"LOW",
                  "active":true,
                  "version":0
                }
                """, id)))
        .andExpect(status().isNotFound())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("OBJECT_WITH_ID_NOT_FOUND"))
        .andExpect(jsonPath("$.message").value(
            String.format("Object SystemMessage with id=%s not found", id)));
  }

  @Test
  void updateSystemMessage_should_returnBadRequest_when_whenValueTooLong() throws Exception {
    SystemMessageEntity systemMessageEntity = new SystemMessageEntity();
    systemMessageEntity.setMessageText("text");
    systemMessageEntity.setId(UUID.randomUUID());
    systemMessageEntity.setCreateDateUtc(ExchangeDateUtils.currentLocalDateTime());
    systemMessageEntity.setVersion(0);
    systemMessageEntity = systemMessageRepository.save(systemMessageEntity);
    SystemMessageEntity finalSystemMessageEntity = systemMessageEntity;
    mockMvc.perform(put("/messages/message")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "id":"%s",
                  "messageText":"%s",
                  "priority":"LOW",
                  "active":true,
                  "version":0
                }
                """, systemMessageEntity.getId(), StringUtils.repeat('x', 400))))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("SystemValidator"))
        .andExpect(jsonPath("$.message").value(
            "Validation errors [Field 'messageText' exceeds maximum length of 255.]"))
        .andDo((mvcResult) -> systemMessageRepository.deleteById(finalSystemMessageEntity.getId()));
  }

  @Test
  void updateSystemMessage_should_returnBadRequest_when_whenMandatoryFieldNull() throws Exception {
    SystemMessageEntity systemMessageEntity = new SystemMessageEntity();
    systemMessageEntity.setMessageText("text");
    systemMessageEntity.setId(UUID.randomUUID());
    systemMessageEntity.setCreateDateUtc(ExchangeDateUtils.currentLocalDateTime());
    systemMessageEntity.setVersion(0);
    systemMessageEntity = systemMessageRepository.save(systemMessageEntity);
    SystemMessageEntity finalSystemMessageEntity = systemMessageEntity;
    mockMvc.perform(put("/messages/message")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "id":"%s",
                  "priority":"MEDIUM",
                  "active":true,
                  "version":0
                }
                """, systemMessageEntity.getId())))
        .andExpect(status().isBadRequest())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("SystemValidator"))
        .andExpect(jsonPath("$.message").value(
            "Validation errors [Field 'messageText' is null but column is marked as not null]"))
        .andDo((mvcResult) -> systemMessageRepository.deleteById(finalSystemMessageEntity.getId()));
  }

  @Test
  void updateSystemMessage_should_returnConflict_when_wrongVersionNumber() throws Exception {
    SystemMessageEntity systemMessageEntity = new SystemMessageEntity();
    systemMessageEntity.setMessageText("text");
    systemMessageEntity.setId(UUID.randomUUID());
    systemMessageEntity.setCreateDateUtc(ExchangeDateUtils.currentLocalDateTime());
    systemMessageEntity.setVersion(0);
    systemMessageEntity = systemMessageRepository.save(systemMessageEntity);
    SystemMessageEntity finalSystemMessageEntity = systemMessageEntity;
    mockMvc.perform(put("/messages/message")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "id":"%s",
                  "messageText":"modifiedText",
                  "priority":"HIGH",
                  "active":true,
                  "version":2
                }
                """, systemMessageEntity.getId())))
        .andExpect(status().isConflict())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.errorCode").value("SystemMessageEntity"))
        .andExpect(jsonPath("$.message").value(
            "Invalid version for entity row currentVersion=0 newVersion=2"))
        .andDo((mvcResult) -> systemMessageRepository.deleteById(finalSystemMessageEntity.getId()));
  }

  @Test
  public void loadSystemMessageList_should_loadMessages_when_methodCalled()
      throws Exception {
    mockMvc.perform(get("/messages/list")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(2))))
        .andExpect(jsonPath("$[0].messageText").value("Test message"))
        .andExpect(jsonPath("$[0].priority").value("LOW"))
        .andExpect(jsonPath("$[0].active").value(true))
        .andExpect(jsonPath("$[1].messageText").value("Not active Test message"))
        .andExpect(jsonPath("$[1].priority").value("MEDIUM"))
        .andExpect(jsonPath("$[1].active").value(false));
  }

  @Test
  void saveSystemMessage_should_returnForbidden_when_wrongAuthority()
      throws Exception {
    mockMvc.perform(post("/messages/message")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "messageText":"x",
                  "priority":"LOW",
                  "active":true
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void updateSystemMessage_should_returnForbidden_when_wrongAuthority()
      throws Exception {
    mockMvc.perform(put("/messages/message")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "id":"00000000-0000-0000-0002-000000000001",
                  "messageText":"modifiedText",
                  "priority":"LOW",
                  "active":true,
                  "version":0
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void loadSystemMessageList_should_returnForbidden_when_wrongAuthority()
      throws Exception {
    mockMvc.perform(get("/messages/list")
            .with(authority("WRONG_AUTHORITY"))
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }
}