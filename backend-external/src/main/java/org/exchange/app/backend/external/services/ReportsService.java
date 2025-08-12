package org.exchange.app.backend.external.services;

import java.util.UUID;

public interface ReportsService {

  byte[] loadExchangePdfDocument(UUID ticketId);
}
