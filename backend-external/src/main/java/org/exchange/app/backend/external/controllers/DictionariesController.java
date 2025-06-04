package org.exchange.app.backend.external.controllers;

import java.util.List;
import lombok.AllArgsConstructor;
import org.exchange.app.backend.external.services.DictionariesService;
import org.exchange.app.external.api.DictionariesApi;
import org.exchange.app.external.api.model.DictionaryLocale;
import org.exchange.app.external.api.model.DictionaryTimezone;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class DictionariesController implements DictionariesApi {

  private final DictionariesService dictionariesService;

  @Override
  public ResponseEntity<List<DictionaryTimezone>> loadTimezoneList() {
    return ResponseEntity.ok(dictionariesService.loadTimezoneList());
  }

  @Override
  public ResponseEntity<List<DictionaryLocale>> loadUnicodeLocalesList() {
    return ResponseEntity.ok(dictionariesService.loadUnicodeLocalesList());
  }
}
