package org.exchange.app.backend.external.services;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Locale.IsoCountryCode;
import org.springframework.stereotype.Service;

@Service
public class DictionariesServiceImpl implements DictionariesService {

  @Override
  public List<String> loadTimezoneList() {
    return new ArrayList<>(ZoneId.getAvailableZoneIds());
  }

  @Override
  public List<String> loadUnicodeLocalesList() {
    List<String> localeList = new ArrayList<>();
    Locale.getISOCountries(IsoCountryCode.PART1_ALPHA2)
        .forEach(
            (locale) ->
            {
              if (!locale.isEmpty()) {
                localeList.add(locale);
              }
            });

    localeList.sort(Comparator.naturalOrder());
    return localeList;
  }
}
