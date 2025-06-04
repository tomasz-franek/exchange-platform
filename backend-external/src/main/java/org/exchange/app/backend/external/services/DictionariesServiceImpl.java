package org.exchange.app.backend.external.services;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Locale.IsoCountryCode;
import org.exchange.app.external.api.model.DictionaryLocale;
import org.exchange.app.external.api.model.DictionaryTimezone;
import org.springframework.stereotype.Service;

@Service
public class DictionariesServiceImpl implements DictionariesService {

  @Override
  public List<DictionaryTimezone> loadTimezoneList() {
    List<DictionaryTimezone> dictionaryTimezoneList = new ArrayList<>();
    ZoneId.getAvailableZoneIds()
        .forEach((zone) -> dictionaryTimezoneList.add(new DictionaryTimezone(zone)));
    return dictionaryTimezoneList;
  }

  @Override
  public List<DictionaryLocale> loadUnicodeLocalesList() {
    List<String> dictionaryLocaleList = new ArrayList<>();
    Locale.getISOCountries(IsoCountryCode.PART1_ALPHA2)
        .forEach(
            (locale) ->
            {
              if (!locale.isEmpty()) {
                dictionaryLocaleList.add(locale);
              }
            });

    dictionaryLocaleList.sort(Comparator.naturalOrder());
    List<DictionaryLocale> localeList = new ArrayList<>();
    dictionaryLocaleList.stream().distinct()
        .forEach(item -> localeList.add(new DictionaryLocale(item)));
    return localeList;
  }
}
