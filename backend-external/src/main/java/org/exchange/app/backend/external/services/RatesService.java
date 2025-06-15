package org.exchange.app.backend.external.services;

import java.util.List;
import org.exchange.app.external.api.model.CurrencyRate;

public interface RatesService {

	List<CurrencyRate> loadCurrencyRates();
}
