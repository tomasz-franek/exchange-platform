package org.exchange.app.backend.admin.controllers;

import static org.exchange.app.backend.admin.utils.TestAuthenticationUtils.authority;
import static org.hamcrest.Matchers.containsInRelativeOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;
import org.exchange.app.admin.api.model.ErrorMessage;
import org.exchange.app.backend.admin.listeners.ErrorListener;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedKafka(partitions = 1)
class AdminErrorsControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private ErrorListener errorListener;

  @Test
  void loadErrorList_should_returnErrors_when_methodCalled() throws Exception {
    List<ErrorMessage> messageList = new ArrayList<>();
    messageList.add(new ErrorMessage("1", "aa", 1L, 1L));
    messageList.add(new ErrorMessage("2", "bb", 1L, 1L));
    messageList.add(new ErrorMessage("3", "cc", 1L, 1L));
    messageList.add(new ErrorMessage("4", "dd", 1L, 1L));
    messageList.add(new ErrorMessage("5", "ee", 1L, 1L));
    when(errorListener.loadErrorList(0)).thenReturn(messageList);
    mockMvc.perform(post("/errors/list")
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON)
            .content("""
                {
                  "offset":0
                }
                """))
        .andExpect(status().isOk())
        .andExpect(content().contentType(APPLICATION_JSON))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$", hasSize(equalTo(5))))
        .andExpect(jsonPath("$[*].id", containsInRelativeOrder("1", "2", "3", "4", "5")))
        .andExpect(jsonPath("$[*].message", containsInRelativeOrder("aa", "bb", "cc", "dd", "ee")));
  }

  @Test
  void deleteError_should_ReturnOk_when_calledWithCorrectRequest() throws Exception {
    doNothing().when(errorListener).deleteErrorById(12);
    mockMvc.perform(delete("/errors/{id}", 12)
            .with(authority("ADMIN"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isNoContent());
  }

  @Test
  void loadErrorList_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(post("/errors/list")
            .with(authority("WRONG_AUTHORITY"))
            .content("""
                {
                  "offset":0
                }
                """)
            .accept(APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }

  @Test
  void deleteError_should_returnForbidden_when_wrongAuthority() throws Exception {
    mockMvc.perform(delete("/errors/{id}", 1)
            .with(authority("WRONG_AUTHORITY"))
            .contentType(APPLICATION_JSON))
        .andExpect(status().isForbidden());
  }
}