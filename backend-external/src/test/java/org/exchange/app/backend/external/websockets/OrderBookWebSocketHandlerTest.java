package org.exchange.app.backend.external.websockets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.io.IOException;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

class OrderBookWebSocketHandlerTest {

  private OrderBookWebSocketHandler handler;
  private WebSocketSession session1;
  private WebSocketSession session2;

  @BeforeEach
  public void setUp() {
    handler = new OrderBookWebSocketHandler();
    session1 = mock(WebSocketSession.class);
    session2 = mock(WebSocketSession.class);
  }

  @Test
  public void afterConnectionEstablished_should_holdAllSessions_when_called() {
    handler.afterConnectionEstablished(session1);
    handler.afterConnectionEstablished(session2);

    assertThat(handler.sessions.size()).isEqualTo(2);
  }

  @Test
  public void afterConnectionClosed_should_removeSessionFromSessionList_when_methodCalled() {
    handler.afterConnectionEstablished(session1);
    handler.afterConnectionEstablished(session2);

    handler.afterConnectionClosed(session1, CloseStatus.NORMAL);

    assertThat(handler.sessions.size()).isEqualTo(1);
    assertThat(handler.sessions.contains(session1)).isFalse();
    assertThat(handler.sessions.contains(session2)).isTrue();
  }

  @Test
  public void publishMessage_should_sendMessageToAllSessions_when_methodCalled() throws Exception {
    handler.afterConnectionEstablished(session1);
    handler.afterConnectionEstablished(session2);

    String message = "Test Message";
    handler.publishMessage(message);

    ArgumentCaptor<TextMessage> messageCaptor = ArgumentCaptor.forClass(TextMessage.class);
    verify(session1, times(1)).sendMessage(messageCaptor.capture());
    verify(session2, times(1)).sendMessage(messageCaptor.capture());

    List<TextMessage> capturedMessages = messageCaptor.getAllValues();
		assertThat(capturedMessages.size()).isEqualTo(2);
		assertThat(capturedMessages.get(0).getPayload()).isEqualTo(message);
		assertThat(capturedMessages.get(1).getPayload()).isEqualTo(message);
  }

  @Test
  public void publishMessage_shouldHandleException_when_exceptionThrownDuringSendingMessageToClient()
      throws Exception {
    handler.afterConnectionEstablished(session1);
    doThrow(new IOException("Test Exception")).when(session1).sendMessage(any(TextMessage.class));

    handler.publishMessage("Test Message");

    verify(session1, times(1)).sendMessage(any(TextMessage.class));
  }
}