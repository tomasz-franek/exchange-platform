package org.exchange.app.backend.external.websockets;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Log4j2
public class OrderBookWebSocketHandler extends TextWebSocketHandler {

  private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) throws Exception {
    sessions.add(session);
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    this.sessions.remove(session);
  }

  public void publishMessage(String message) {
    TextMessage textMessage = new TextMessage(message);
    sessions.forEach(session -> {
      try {
        session.sendMessage(textMessage);
      } catch (IOException e) {
        log.error(e);
      }
    });
  }
}
