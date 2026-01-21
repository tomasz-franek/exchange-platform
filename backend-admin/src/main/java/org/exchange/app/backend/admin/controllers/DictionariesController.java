package org.exchange.app.backend.admin.controllers;

import java.util.List;
import lombok.AllArgsConstructor;
import org.exchange.app.backend.admin.services.AdminDictionariesService;
import org.exchange.app.external.api.DictionariesApi;
import org.exchange.app.external.api.model.TimezoneData;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class DictionariesController implements DictionariesApi {

  private final AdminDictionariesService dictionariesService;

  @Override
  public ResponseEntity<List<TimezoneData>> loadTimezoneList() {
    return ResponseEntity.ok(dictionariesService.loadTimezoneList());
  }

  @Override
  public ResponseEntity<List<String>> loadUnicodeLocalesList() {
    return ResponseEntity.ok(dictionariesService.loadUnicodeLocalesList());
  }
}
