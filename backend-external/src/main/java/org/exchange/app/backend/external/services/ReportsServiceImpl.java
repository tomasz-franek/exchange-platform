package org.exchange.app.backend.external.services;

import static org.exchange.app.backend.common.config.SystemConfig.systemAddressId;

import java.util.UUID;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.pdfs.ExchangeDataResult;
import org.exchange.app.backend.common.pdfs.ExchangeReport;
import org.exchange.app.backend.db.entities.AddressEntity;
import org.exchange.app.backend.db.mappers.AddressMapper;
import org.exchange.app.backend.db.repositories.AddressRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportsServiceImpl implements ReportsService {

  private final AddressRepository addressRepository;
  private final ExchangeEventRepository exchangeEventRepository;
  private final AuthenticationFacade authenticationFacade;

  @Autowired
  public ReportsServiceImpl(AuthenticationFacade authenticationFacade,
      AddressRepository addressRepository,
      ExchangeEventRepository exchangeEventRepository) {
    this.authenticationFacade = authenticationFacade;
    this.addressRepository = addressRepository;
    this.exchangeEventRepository = exchangeEventRepository;
  }

  @Override
  public byte[] loadExchangePdfDocument(UUID ticketId) {
    UUID userId = authenticationFacade.getUserUuid();
    AddressEntity systemAddress = addressRepository.findById(systemAddressId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("SystemAddress", "system"));
    AddressEntity userAddress = addressRepository.findByUserId(userId).orElseThrow(
        () -> new ObjectWithIdNotFoundException("UserAddress", userId.toString()));

    ExchangeReport exchangeReport = new ExchangeReport();
    ExchangeDataResult exchangeDataResult = new ExchangeDataResult();
    exchangeDataResult.setSystemAddress(AddressMapper.INSTANCE.toDto(systemAddress));
    exchangeDataResult.setRecipientAddress(AddressMapper.INSTANCE.toDto(userAddress));
    //todo add exchange data for PDF
    return exchangeReport.generateExchangeReport(
        exchangeDataResult).toByteArray();
  }
}
