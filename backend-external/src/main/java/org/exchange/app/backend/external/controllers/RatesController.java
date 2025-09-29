package org.exchange.app.backend.external.controllers;

import java.util.List;
import lombok.AllArgsConstructor;
import org.exchange.app.backend.external.services.RatesService;
import org.exchange.app.external.api.RatesApi;
import org.exchange.app.external.api.model.CurrencyRate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class RatesController implements RatesApi {

  private final RatesService ratesService;

  @Override
  public ResponseEntity<List<CurrencyRate>> loadCurrencyRates() {
    return ResponseEntity.ok(ratesService.loadCurrencyRates());
  }
}
