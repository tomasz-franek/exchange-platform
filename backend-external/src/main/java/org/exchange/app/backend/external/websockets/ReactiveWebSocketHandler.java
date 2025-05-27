package org.exchange.app.backend.external.websockets;

public class ReactiveWebSocketHandler {
  //implements WebSocketHandler {
//
//  private static final ObjectMapper json = new ObjectMapper();
//
//  @Autowired()
//  KafkaService kafkaService;
//
//  @Override
//  public Mono<Void> handle(WebSocketSession webSocketSession) {
//    return webSocketSession.send(kafkaService.getOrderBookStream()
//            .map(record -> {
//              OrderBookData message = new OrderBookData("[Kafka] Add message", record.value());
//              String response;
//              try {
//                return json.writeValueAsString(message);
//              } catch (JsonProcessingException e) {
//                return "Error while serializing to JSON";
//              }
//            })
//            .map(webSocketSession::textMessage))
//        .and(webSocketSession.receive()
//            .map(WebSocketMessage::getPayloadAsText).log());
//  }

}
