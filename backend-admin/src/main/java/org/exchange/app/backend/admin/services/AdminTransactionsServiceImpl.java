package org.exchange.app.backend.admin.services;

import jakarta.transaction.Transactional;
import jakarta.transaction.Transactional.TxType;
import java.util.List;
import org.exchange.app.admin.api.model.CorrectionId;
import org.exchange.app.admin.api.model.CorrectionRequest;
import org.exchange.app.admin.api.model.SelectTransactionRequest;
import org.exchange.app.admin.api.model.SelectUserTransactionRequest;
import org.exchange.app.admin.api.model.Transaction;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.specifications.AccountSpecification;
import org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class AdminTransactionsServiceImpl implements AdminTransactionsService {

  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final UserAccountRepository userAccountRepository;
  private final AuthenticationFacade authenticationFacade;

  @Autowired
  public AdminTransactionsServiceImpl(ExchangeEventSourceRepository exchangeEventSourceRepository,
      UserAccountRepository userAccountRepository, AuthenticationFacade authenticationFacade) {
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.userAccountRepository = userAccountRepository;
    this.authenticationFacade = authenticationFacade;
  }

  @Override
  public List<Transaction> loadTransactionList(SelectTransactionRequest selectTransactionRequest) {
    //authenticationFacade.checkIsAdmin(Transaction.class);
    Specification<ExchangeEventSourceEntity> exchangeEventSourceSpecification =
        ExchangeEventSourceSpecification.fromDateUtc(
            selectTransactionRequest.getDateFromUtc());
    if (selectTransactionRequest.getDateToUtc() != null) {
      exchangeEventSourceSpecification = exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.toDateUtc(
              selectTransactionRequest.getDateToUtc()
          )
      );
    }
    return getTransactions(exchangeEventSourceSpecification);
  }

  @Override
  public List<Transaction> loadExchangeAccountTransactionList(
      SelectTransactionRequest selectTransactionRequest) {
    //authenticationFacade.checkIsAdmin(Transaction.class);
    Specification<ExchangeEventSourceEntity> exchangeEventSourceSpecification =
        ExchangeEventSourceSpecification.fromDateUtc(
            selectTransactionRequest.getDateFromUtc());
    if (selectTransactionRequest.getDateToUtc() != null) {
      exchangeEventSourceSpecification = exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.toDateUtc(
              selectTransactionRequest.getDateToUtc()
          )
      );
      exchangeEventSourceSpecification = exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.eventType(EventType.FEE)
      );
    }
    return getTransactions(exchangeEventSourceSpecification);
  }

  @Override
  public List<Transaction> loadSystemAccountTransactionList(
      SelectTransactionRequest selectTransactionRequest) {
    //authenticationFacade.checkIsAdmin(Transaction.class);
    Specification<ExchangeEventSourceEntity> exchangeEventSourceSpecification =
        ExchangeEventSourceSpecification.fromDateUtc(
            selectTransactionRequest.getDateFromUtc());
    if (selectTransactionRequest.getDateToUtc() != null) {
      exchangeEventSourceSpecification = exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.toDateUtc(
              selectTransactionRequest.getDateToUtc()
          )
      );
      exchangeEventSourceSpecification = exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.eventType(EventType.EXCHANGE)
      );
    }
    return getTransactions(exchangeEventSourceSpecification);
  }

  private List<Transaction> getTransactions(
      Specification<ExchangeEventSourceEntity> specification) {
    //authenticationFacade.checkIsAdmin(Transaction.class);
    return exchangeEventSourceRepository.findAll(specification,
            Sort.by(new Order(Direction.ASC, "dateUtc")))
        .stream().map(exchangeEventSourceEntity ->
                new Transaction(
                    exchangeEventSourceEntity.getDateUtc(),
                    exchangeEventSourceEntity.getAmount(),
                    Currency.fromValue(exchangeEventSourceEntity.getCurrency()))
        ).toList();
  }

  @Override
  @Transactional(TxType.REQUIRED)
  public CorrectionId saveCorrectionRequest(CorrectionRequest correctionRequest) {
    //authenticationFacade.checkIsAdmin(Transaction.class);
    Specification<UserAccountEntity> accountEntitySpecification = Specification.allOf(
        AccountSpecification.userAccountIDs(List.of(correctionRequest.getUserAccountId())),
        AccountSpecification.userId(correctionRequest.getUserId())
    );
    List<UserAccountEntity> list = userAccountRepository.findAll(accountEntitySpecification);

    if (list.size() != 1) {
      throw new ObjectWithIdNotFoundException("UserAccount", "userAccountId",
          correctionRequest.getUserAccountId().toString());
    }
    UserAccountEntity userAccountEntity = list.getFirst();

    ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();
    exchangeEventSourceEntity.setCurrency(userAccountEntity.getCurrency().getCode().getValue());
    exchangeEventSourceEntity.setCreatedBy(authenticationFacade.getUserUuid());
    exchangeEventSourceEntity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    exchangeEventSourceEntity.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    exchangeEventSourceEntity.setAmount(correctionRequest.getAmount());
    exchangeEventSourceEntity.setUserAccountId(userAccountEntity.getId());
    exchangeEventSourceEntity.setEventType(EventType.CORRECTION);
    exchangeEventSourceEntity.setChecksum(ChecksumUtil.checksum(exchangeEventSourceEntity));
    exchangeEventSourceEntity = exchangeEventSourceRepository.save(exchangeEventSourceEntity);
    return new CorrectionId(exchangeEventSourceEntity.getId());
  }

  @Override
  public List<Transaction> loadUserTransactionList(
      SelectUserTransactionRequest request) {
    //authenticationFacade.checkIsAdmin(Transaction.class);
    userAccountRepository.findOne(
            AccountSpecification.userAccountIDs(
                    List.of(request.getUserAccountId()))
                .and(AccountSpecification.userId(request.getUserId())))
        .orElseThrow(() -> new ObjectWithIdNotFoundException("UserAccount", "userAccountId",
            request.getUserAccountId().toString()));

    Specification<ExchangeEventSourceEntity> exchangeEventSourceSpecification =
        ExchangeEventSourceSpecification.userAccountID(
            request.getUserAccountId());
    return getTransactions(exchangeEventSourceSpecification);
  }
}
