package org.exchange.app.backend.external.services;

import java.util.List;
import org.exchange.app.external.api.model.TimezoneData;

public interface DictionariesService {

  List<TimezoneData> loadTimezoneList();

  List<String> loadUnicodeLocalesList();

}
