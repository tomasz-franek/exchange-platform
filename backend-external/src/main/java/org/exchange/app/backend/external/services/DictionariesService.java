package org.exchange.app.backend.external.services;

import java.util.List;
import org.exchange.app.external.api.model.DictionaryLocale;
import org.exchange.app.external.api.model.DictionaryTimezone;

public interface DictionariesService {

  List<DictionaryTimezone> loadTimezoneList();

  List<DictionaryLocale> loadUnicodeLocalesList();
  
}
