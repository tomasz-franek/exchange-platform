package org.exchange.app.backend.external.services;

import java.util.List;

public interface DictionariesService {

  List<String> loadTimezoneList();

  List<String> loadUnicodeLocalesList();

}
