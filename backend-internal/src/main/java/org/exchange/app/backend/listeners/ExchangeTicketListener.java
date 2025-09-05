package org.exchange.app.backend.listeners;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.InternalGroups;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.exceptions.ExchangeException;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.senders.ExchangeResultSender;
import org.exchange.app.backend.senders.OrderBookSender;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.OrderBookData;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.exchange.internal.app.core.services.ExchangeService;
import org.exchange.internal.app.core.strategies.ratio.RatioStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
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

  private final OrderBookSender orderBookSender;
  private final ExchangeResultSender exchangeResultSender;
  private final ExchangeEventRepository exchangeEventRepository;
  private final UserAccountRepository userAccountRepository;

  @Autowired
  ExchangeTicketListener(RatioStrategy ratioStrategy,
      ExchangeEventRepository exchangeEventRepository,
      UserAccountRepository userAccountRepository,
      OrderBookSender orderBookSender,
      ExchangeResultSender exchangeResultSender) {
    this.exchangeServiceConcurrentHashMap = new ConcurrentHashMap<>(Pair.values().length);
    this.ratioStrategy = ratioStrategy;
    this.userAccountRepository = userAccountRepository;
    this.exchangeEventRepository = exchangeEventRepository;
    this.orderBookSender = orderBookSender;
    this.exchangeResultSender = exchangeResultSender;
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
      case CANCEL -> doCancelTicket(ticket).ifPresent(exchangeResultSender::sendExchangeResult);
      case null, default -> log.error("Unknown exchange ticket event type {}", ticket.toString());
    }
  }


  Optional<ExchangeResult> doCancelTicket(UserTicket ticket) {
    ExchangeService exchangeService = this.exchangeServiceConcurrentHashMap.getOrDefault(
        ticket.getPair(), null);
    if (exchangeService != null) {
      try {
        Optional<CoreTicket> currentTicket = exchangeService.removeOrder(ticket.getId(),
            ticket.getDirection());
        if (currentTicket.isEmpty()) {
          return Optional.empty();
        }
        ExchangeResult exchangeResult = new ExchangeResult();
        exchangeResult.setCancelledTicket(currentTicket.get());
        exchangeService.removeCancelled(currentTicket.get());

        Optional<ExchangeEventEntity> optionalExchangeEventEntity = exchangeEventRepository.findById(
            ticket.getId());
        if (optionalExchangeEventEntity.isPresent()) {
          ExchangeEventEntity exchangeEventEntity = optionalExchangeEventEntity.get();
          if (exchangeEventEntity.getTicketStatus().equals(UserTicketStatus.PARTIAL_REALIZED)) {
            exchangeEventEntity.setTicketStatus(UserTicketStatus.PARTIAL_CANCELED);
            exchangeResult.setUserTicketStatus(UserTicketStatus.PARTIAL_CANCELED);
          } else {
            exchangeEventEntity.setTicketStatus(UserTicketStatus.CANCELLED);
            exchangeResult.setUserTicketStatus(UserTicketStatus.CANCELLED);
          }

          exchangeEventEntity.setModifiedDateUtc(ExchangeDateUtils.currentLocalDateTime());
          exchangeEventRepository.save(exchangeEventEntity);
        }
        exchangeResult.setExchangeEpochUTC(ExchangeDateUtils.currentLocalDateTime());

        return Optional.of(exchangeResult);
      } catch (ExchangeException e) {
        throw new RuntimeException(
            "Unable to cancel Core Ticket from exchange controller ", e);
      }
    }
    return Optional.empty();
  }

  void doExchange(UserTicket ticket) {
    try {
      ExchangeService exchangeService = this.exchangeServiceConcurrentHashMap.getOrDefault(
          ticket.getPair(), new ExchangeService(ticket.getPair(), this.ratioStrategy));
      exchangeService.addCoreTicket(new CoreTicket(ticket.getId(), ticket.getAmount(),
          ticket.getRatio(), ticket.getUserId(), ticket.getPair(),
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
        orderBookSender.sendOrderBookData(exchangeService.getOrderBookData(false));
        updateTicketStatus(result);
        exchangeResultSender.sendExchangeResult(result);
      }
    } while (exchangeResult.isPresent());
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
    orderBookSender.sendOrderBookData(fullOrderBook);
  }
}
