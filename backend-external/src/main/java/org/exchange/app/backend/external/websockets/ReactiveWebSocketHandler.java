package org.exchange.app.backend.external.websockets;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.exchange.app.backend.common.ws.OrderBookData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Mono;

public class ReactiveWebSocketHandler implements WebSocketHandler {

  private static final ObjectMapper json = new ObjectMapper();

  @Autowired()
  KafkaService kafkaService;

  @Override
  public Mono<Void> handle(WebSocketSession webSocketSession) {
    return webSocketSession.send(kafkaService.getTestTopicFlux()
            .map(record -> {
              OrderBookData message = new OrderBookData("[Kafka] Add message", record.value());
              String response;
              try {
                return json.writeValueAsString(message);
              } catch (JsonProcessingException e) {
                return "Error while serializing to JSON";
              }
            })
            .map(webSocketSession::textMessage))
        .and(webSocketSession.receive()
            .map(WebSocketMessage::getPayloadAsText).log());
  }

}
