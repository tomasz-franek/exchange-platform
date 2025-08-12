package org.exchange.app.backend.external.services;

public interface ReportsService {

  byte[] loadExchangePdfDocument(Long ticketId);
}
