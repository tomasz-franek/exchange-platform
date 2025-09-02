package org.exchange.app.backend.listeners;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.InternalGroups;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.config.KafkaConfig.TopicsToExternalBackend;
import org.exchange.app.backend.common.exceptions.ExchangeException;
import org.exchange.app.backend.common.serializers.ExchangeResultSerializer;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.services.PlatformAccountService;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.OrderBookData;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.exchange.internal.app.core.services.ExchangeService;
import org.exchange.internal.app.core.strategies.ratio.RatioStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "topic-exchange-listener",
    topics = TopicToInternalBackend.EXCHANGE,
    groupId = InternalGroups.EXCHANGE,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=" + Deserializers.PAIR,
        "value.deserializer=" + Deserializers.USER_TICKET
    },
    concurrency = "1")
public class ExchangeTicketListener {

  private final RatioStrategy ratioStrategy;
  final ConcurrentHashMap<Pair, ExchangeService> exchangeServiceConcurrentHashMap;
  private final KafkaTemplate<String, ExchangeResult> kafkaExchangeResultTemplate;
  private final KafkaTemplate<String, String> kafkaOrderBookTemplate;
  private final ObjectMapper objectMapper;
  private final ExchangeEventRepository exchangeEventRepository;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final PlatformAccountService platformAccountService;
  private final UserAccountRepository userAccountRepository;

  @Autowired
  ExchangeTicketListener(RatioStrategy ratioStrategy,
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      ObjectMapper objectMapper,
      ExchangeEventRepository exchangeEventRepository,
      UserAccountRepository userAccountRepository,
      PlatformAccountService platformAccountService,
      ExchangeEventSourceRepository exchangeEventSourceRepository) {
    this.exchangeServiceConcurrentHashMap = new ConcurrentHashMap<>(Pair.values().length);
    this.ratioStrategy = ratioStrategy;
    this.objectMapper = objectMapper;
    this.userAccountRepository = userAccountRepository;
    this.exchangeEventRepository = exchangeEventRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.platformAccountService = platformAccountService;
    this.kafkaExchangeResultTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.EXCHANGE_RESULT, bootstrapServers,
        StringSerializer.class,
        ExchangeResultSerializer.class);
    this.kafkaOrderBookTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicsToExternalBackend.ORDER_BOOK, bootstrapServers,
        StringSerializer.class,
        StringSerializer.class);
  }

  @PostConstruct
  public void loadOrderBook() {
    List<ExchangeEventEntity> exchangeEventEntityList = exchangeEventRepository.loadAllActiveOrders();
    Set<UUID> userAccounts = new HashSet<>();
    exchangeEventEntityList.forEach(entity -> userAccounts.add(entity.getUserAccountId()));
    Map<UUID, UUID> userAccountMap = new HashMap<>();
    userAccountRepository.getUserAccountMap(userAccounts).forEach(
        entity -> userAccountMap.put(entity[0], entity[1])
    );
    exchangeEventEntityList.forEach(entity -> {
      ExchangeService exchangeService = this.exchangeServiceConcurrentHashMap.getOrDefault(
          entity.getPair(), new ExchangeService(entity.getPair(), this.ratioStrategy));
      try {
        exchangeService.addCoreTicket(
            new CoreTicket(entity.getId(), entity.getAmount() - entity.getAmountRealized(),
                entity.getRatio(),
                ExchangeDateUtils.toEpochUtc(entity.getDateUtc()),
                userAccountMap.get(entity.getUserAccountId()),
                entity.getPair(),
                entity.getDirection().equals("B") ? Direction.BUY : Direction.SELL));
      } catch (ExchangeException e) {
        throw new RuntimeException(e);
      }
      this.exchangeServiceConcurrentHashMap.put(entity.getPair(), exchangeService);
      doAllPossibleExchanges(entity.getPair(), exchangeService);
    });
  }

  @KafkaHandler
  public void listen(@Payload UserTicket ticket) {
    log.info("*** Received exchange messages {}", ticket.toString());
    switch (ticket.getEventType()) {
      case ORDER -> doExchange(ticket);
      case CANCEL -> doCancelTicket(ticket);
      case null, default -> log.error("Unknown exchange ticket event type {}", ticket.toString());
    }
  }


  private void doCancelTicket(UserTicket ticket) {
    ExchangeService exchangeService = this.exchangeServiceConcurrentHashMap.getOrDefault(
        ticket.getPair(), null);
    if (exchangeService != null) {
      try {
        Optional<CoreTicket> currentTicket = exchangeService.removeOrder(ticket.getId(),
            ticket.getDirection());
        if (currentTicket.isEmpty()) {
          return;
        }
        ExchangeResult exchangeResult = new ExchangeResult();
        exchangeResult.setCancelledTicket(currentTicket.get());
        exchangeService.removeCancelled(currentTicket.get());

        exchangeEventRepository.findById(ticket.getId()).ifPresent(exchangeEventEntity -> {
          if (exchangeEventEntity.getTicketStatus().equals(UserTicketStatus.PARTIAL_REALIZED)) {
            exchangeEventEntity.setTicketStatus(UserTicketStatus.PARTIAL_CANCELED);
          } else {
            exchangeEventEntity.setTicketStatus(UserTicketStatus.CANCELLED);
          }
          exchangeEventEntity.setModifiedDateUtc(ExchangeDateUtils.currentLocalDateTime());
          exchangeEventRepository.save(exchangeEventEntity);

          ExchangeEventSourceEntity ticketData = new ExchangeEventSourceEntity();
          UUID exchangeAccount = platformAccountService.getExchangeAccountId(
              CurrencyUtils.pairToCurrency(exchangeEventEntity.getPair(),
                  "B".equals(exchangeEventEntity.getDirection()) ? Direction.BUY : Direction.SELL));
          ticketData.setUserAccountId(exchangeAccount);
          ticketData.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
          ticketData.setEventType(EventType.CANCEL);
          ticketData.setAmount(
              -exchangeEventEntity.getAmount() + exchangeEventEntity.getAmountRealized());
          ticketData.setCreatedBy(ticket.getUserId());
          ticketData.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
          ticketData.setChecksum(ChecksumUtil.checksum(ticketData));
          ticketData.setCurrency(
              CurrencyUtils.pairToCurrency(ticket.getPair(), ticket.getDirection()));
          ticketData.setEventId(exchangeEventEntity.getId());

          ExchangeEventSourceEntity userData = new ExchangeEventSourceEntity();

          userData.setUserAccountId(exchangeEventEntity.getUserAccountId());
          userData.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
          userData.setEventType(EventType.CANCEL);
          userData.setAmount(
              exchangeEventEntity.getAmount() + exchangeEventEntity.getAmountRealized());
          userData.setCreatedBy(ticket.getUserId());
          userData.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
          userData.setChecksum(ChecksumUtil.checksum(userData));
          userData.setCurrency(
              CurrencyUtils.pairToCurrency(ticket.getPair(), ticket.getDirection()));
          userData.setEventId(exchangeEventEntity.getId());
          exchangeEventSourceRepository.saveAll(List.of(ticketData, userData));
        });

        sendExchangeResult(exchangeResult);
      } catch (ExchangeException e) {
        throw new RuntimeException(
            "Unable to cancel Core Ticket from exchange controller ", e);
      }
    }
  }

  void doExchange(UserTicket ticket) {
    try {
      ExchangeService exchangeService = this.exchangeServiceConcurrentHashMap.getOrDefault(
          ticket.getPair(), new ExchangeService(ticket.getPair(), this.ratioStrategy));
      exchangeService.addCoreTicket(new CoreTicket(ticket.getId(), ticket.getAmount(),
          ticket.getRatio(), ticket.getEpochUtc(), ticket.getUserId(), ticket.getPair(),
          ticket.getDirection()));
      doAllPossibleExchanges(ticket.getPair(), exchangeService);
    } catch (ExchangeException e) {
      throw new RuntimeException(
          "Unable to add Core Ticket to exchange controller ", e);
    }
  }

  private void doAllPossibleExchanges(Pair pair, ExchangeService exchangeService) {
    Optional<ExchangeResult> exchangeResult;
    do {
      exchangeResult = exchangeService.doExchange();

      this.exchangeServiceConcurrentHashMap.put(pair, exchangeService);
      if (exchangeResult.isPresent()) {
        ExchangeResult result = exchangeResult.get();
        sendOrderBookData(exchangeService);
        updateTicketStatus(result);
        sendExchangeResult(result);
      }
    } while (exchangeResult.isPresent());
  }

  private void sendOrderBookData(ExchangeService exchangeService) {
    OrderBookData orderBookData = exchangeService.getOrderBookData(false);
    try {
      String json = objectMapper.writeValueAsString(orderBookData);
      this.kafkaOrderBookTemplate.send(TopicsToExternalBackend.ORDER_BOOK, json);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
  }


  private void sendExchangeResult(ExchangeResult exchangeResult) {
    CompletableFuture<SendResult<String, ExchangeResult>> futureOrderBook =
        kafkaExchangeResultTemplate.send(TopicToInternalBackend.EXCHANGE_RESULT,
            exchangeResult);

    futureOrderBook.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent Order Book OK");
      }
    });
  }

  void updateTicketStatus(ExchangeResult exchangeResult) {
    List<ExchangeEventEntity> toPersist = new ArrayList<>();

    exchangeEventRepository.findById(exchangeResult.getBuyTicket().getId())
        .ifPresent(exchangeEventEntity -> {
          updateStatusAndAmount(exchangeResult.getBuyTicketAfterExchange(), exchangeEventEntity);
          toPersist.add(exchangeEventEntity);
        });

    exchangeEventRepository.findById(exchangeResult.getSellTicket().getId())
        .ifPresent(exchangeEventEntity -> {
          updateStatusAndAmount(exchangeResult.getSellTicketAfterExchange(), exchangeEventEntity);
          toPersist.add(exchangeEventEntity);
        });

    exchangeEventRepository.findById(exchangeResult.getSellExchange().getId())
        .ifPresent(exchangeEventEntity -> {
          updateStatusAndAmount(exchangeResult.getSellTicketAfterExchange(), exchangeEventEntity);
          toPersist.add(exchangeEventEntity);
        });
    exchangeEventRepository.findById(exchangeResult.getBuyExchange().getId())
        .ifPresent(exchangeEventEntity -> {
          updateStatusAndAmount(exchangeResult.getBuyTicketAfterExchange(), exchangeEventEntity);
          toPersist.add(exchangeEventEntity);
        });
    exchangeEventRepository.saveAll(toPersist);
  }

  private static void updateStatusAndAmount(CoreTicket exchangeResult,
      ExchangeEventEntity entityToUpdate) {
    if (exchangeResult.isFinishOrder()) {
      entityToUpdate.setTicketStatus(UserTicketStatus.REALIZED);
      entityToUpdate.setAmountRealized(entityToUpdate.getAmount());
    } else {
      entityToUpdate.setTicketStatus(UserTicketStatus.PARTIAL_REALIZED);
      entityToUpdate.setAmountRealized(entityToUpdate.getAmount() -
          exchangeResult.getAmount()
      );
    }
    entityToUpdate.setModifiedDateUtc(ExchangeDateUtils.currentLocalDateTime());
  }

  @Scheduled(fixedDelay = 2_000)
  public void getFullOrderBook() {
    List<OrderBookData> fullOrderBook = new ArrayList<>(exchangeServiceConcurrentHashMap.size());
    this.exchangeServiceConcurrentHashMap.forEach((pair, exchangeService) ->
        fullOrderBook.add(exchangeService.getOrderBookData(true)));
    try {
      String json = objectMapper.writeValueAsString(fullOrderBook);
      this.kafkaOrderBookTemplate.send(TopicsToExternalBackend.ORDER_BOOK, json);
    } catch (JsonProcessingException e) {
      log.error(e);
    }
  }
}
