package org.exchange.app.backend.db.services;

import java.util.UUID;

public interface PlatformAccountService {

  UUID getExchangeAccountId(String currency);

  UUID getSystemAccountId(String currency);

  boolean systemAccountIdsContain(UUID accountId);
}
