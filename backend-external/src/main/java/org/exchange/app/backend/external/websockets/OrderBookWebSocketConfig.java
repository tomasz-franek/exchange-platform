package org.exchange.app.backend.external.websockets;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class OrderBookWebSocketConfig implements WebSocketConfigurer {

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(orderBookWebSocketHandler(), "/order-book")
        .setAllowedOrigins("*");
  }

  @Bean
  public OrderBookWebSocketHandler orderBookWebSocketHandler() {
    return new OrderBookWebSocketHandler();
  }
}

