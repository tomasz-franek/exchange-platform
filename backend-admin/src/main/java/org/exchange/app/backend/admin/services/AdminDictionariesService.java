package org.exchange.app.backend.admin.services;

import java.util.List;

public interface AdminDictionariesService {

  List<String> loadTimezoneList();

  List<String> loadUnicodeLocalesList();

}
