package org.exchange.app.backend.admin.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON;
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
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "messageText":"test",
                  "priority":1,
                  "active":true
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$.id").isNotEmpty())
        .andExpect(jsonPath("$.version").value(0))
        .andExpect(jsonPath("$.priority").value(1))
        .andDo((mvcResult) -> {
          UUID id = UUID.fromString(JsonPath.compile("$.id")
              .read(mvcResult.getResponse().getContentAsString()).toString());
          systemMessageRepository.deleteById(id);
        });
  }

  @Test
  void saveSystemMessage_should_returnBadRequest_whenMissingMandatoryFields() throws Exception {
    mockMvc.perform(post("/messages/message")
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "priority":1,
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
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "messageText":"%s",
                  "priority":1,
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
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "id":"%s",
                  "messageText":"modifiedText",
                  "priority":1,
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
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "id":"%s",
                  "messageText":"modifiedText",
                  "priority":1,
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
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "id":"%s",
                  "messageText":"%s",
                  "priority":1,
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
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "id":"%s",
                  "priority":1,
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
            .contentType(APPLICATION_JSON)
            .content(String.format("""
                {
                  "id":"%s",
                  "messageText":"modifiedText",
                  "priority":1,
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
}