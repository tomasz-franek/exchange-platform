package org.exchange.app.backend.admin.services;

import java.util.List;
import org.exchange.app.external.api.model.TimezoneData;

public interface AdminDictionariesService {

  List<TimezoneData> loadTimezoneList();

  List<String> loadUnicodeLocalesList();

}
