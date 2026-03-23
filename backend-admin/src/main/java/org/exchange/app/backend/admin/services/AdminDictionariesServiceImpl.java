package org.exchange.app.backend.admin.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Locale.IsoCountryCode;
import org.exchange.app.external.api.model.TimezoneData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class AdminDictionariesServiceImpl implements AdminDictionariesService {

  private final ObjectMapper objectMapper;

  @Autowired
  public AdminDictionariesServiceImpl(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @Override
  public List<TimezoneData> loadTimezoneList() {
    String list =
        """
            [
              {
                "id": 1,
                "offset": -12,
                "name": "(UTC -12:00) International Date Line West"
              },
              {
                "id": 2,
                "offset": -11,
                "name": "(UTC -11:00) Coordinated Universal Time-11"
              },
              {
                "id": 3,
                "offset": -10,
                "name": "(UTC -10:00) Hawaii"
              },
              {
                "id": 4,
                "offset": -8,
                "name": "(UTC -09:00) Alaska"
              },
              {
                "id": 5,
                "offset": -7,
                "name": "(UTC -08:00) Baja California"
              },
              {
                "id": 6,
                "offset": -7,
                "name": "(UTC -07:00) Pacific Daylight Time (US & Canada)"
              },
              {
                "id": 7,
                "offset": -8,
                "name": "(UTC -08:00) Pacific Standard Time (US & Canada)"
              },
              {
                "id": 8,
                "offset": -7,
                "name": "(UTC -07:00) Arizona"
              },
              {
                "id": 9,
                "offset": -6,
                "name": "(UTC -07:00) Chihuahua, La Paz, Mazatlan"
              },
              {
                "id": 10,
                "offset": -6,
                "name": "(UTC -07:00) Mountain Time (US & Canada)"
              },
              {
                "id": 11,
                "offset": -6,
                "name": "(UTC -06:00) Central America"
              },
              {
                "id": 12,
                "offset": -5,
                "name": "(UTC -06:00) Central Time (US & Canada)"
              },
              {
                "id": 13,
                "offset": -5,
                "name": "(UTC -06:00) Guadalajara, Mexico City, Monterrey"
              },
              {
                "id": 14,
                "offset": -6,
                "name": "(UTC -06:00) Saskatchewan"
              },
              {
                "id": 15,
                "offset": -5,
                "name": "(UTC -05:00) Bogota, Lima, Quito"
              },
              {
                "id": 16,
                "offset": -5,
                "name": "(UTC -05:00) Eastern Time (US & Canada)"
              },
              {
                "id": 17,
                "offset": -4,
                "name": "(UTC -04:00) Eastern Daylight Time (US & Canada)"
              },
              {
                "id": 18,
                "offset": -5,
                "name": "(UTC -05:00) Indiana (East)"
              },
              {
                "id": 19,
                "offset": -4.5,
                "name": "(UTC -04:30) Caracas"
              },
              {
                "id": 20,
                "offset": -4,
                "name": "(UTC -04:00) Asuncion"
              },
              {
                "id": 21,
                "offset": -3,
                "name": "(UTC -04:00) Atlantic Time (Canada)"
              },
              {
                "id": 22,
                "offset": -4,
                "name": "(UTC -04:00) Cuiaba"
              },
              {
                "id": 23,
                "offset": -4,
                "name": "(UTC -04:00) Georgetown, La Paz, Manaus, San Juan"
              },
              {
                "id": 24,
                "offset": -4,
                "name": "(UTC -04:00) Santiago"
              },
              {
                "id": 25,
                "offset": -2.5,
                "name": "(UTC -03:30) Newfoundland"
              },
              {
                "id": 26,
                "offset": -3,
                "name": "(UTC -03:00) Brasilia"
              },
              {
                "id": 27,
                "offset": -3,
                "name": "(UTC -03:00) Buenos Aires"
              },
              {
                "id": 28,
                "offset": -3,
                "name": "(UTC -03:00) Cayenne, Fortaleza"
              },
              {
                "id": 29,
                "offset": -3,
                "name": "(UTC -03:00) Greenland"
              },
              {
                "id": 30,
                "offset": -3,
                "name": "(UTC -03:00) Montevideo"
              },
              {
                "id": 31,
                "offset": -3,
                "name": "(UTC -03:00) Salvador"
              },
              {
                "id": 32,
                "offset": -2,
                "name": "(UTC -02:00) Coordinated Universal Time-02"
              },
              {
                "id": 33,
                "offset": -1,
                "name": "(UTC -02:00) Mid-Atlantic - Old"
              },
              {
                "id": 34,
                "offset": 0,
                "name": "(UTC -01:00) Azores"
              },
              {
                "id": 35,
                "offset": -1,
                "name": "(UTC -01:00) Cape Verde Is."
              },
              {
                "id": 36,
                "offset": 1,
                "name": "(UTC ) Casablanca"
              },
              {
                "id": 37,
                "offset": 0,
                "name": "(UTC ) Coordinated Universal Time"
              },
              {
                "id": 38,
                "offset": 0,
                "name": "(UTC ) Edinburgh, London"
              },
              {
                "id": 39,
                "offset": 1,
                "name": "(UTC +01:00) Edinburgh, London"
              },
              {
                "id": 40,
                "offset": 1,
                "name": "(UTC ) Dublin, Lisbon"
              },
              {
                "id": 41,
                "offset": 0,
                "name": "(UTC ) Monrovia, Reykjavik"
              },
              {
                "id": 42,
                "offset": 2,
                "name": "(UTC +01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna"
              },
              {
                "id": 43,
                "offset": 2,
                "name": "(UTC +01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague"
              },
              {
                "id": 44,
                "offset": 2,
                "name": "(UTC +01:00) Brussels, Copenhagen, Madrid, Paris"
              },
              {
                "id": 45,
                "offset": 2,
                "name": "(UTC +01:00) Sarajevo, Skopje, Warsaw, Zagreb"
              },
              {
                "id": 46,
                "offset": 1,
                "name": "(UTC +01:00) West Central Africa"
              },
              {
                "id": 47,
                "offset": 1,
                "name": "(UTC +01:00) Windhoek"
              },
              {
                "id": 48,
                "offset": 3,
                "name": "(UTC +02:00) Athens, Bucharest"
              },
              {
                "id": 49,
                "offset": 3,
                "name": "(UTC +02:00) Beirut"
              },
              {
                "id": 50,
                "offset": 2,
                "name": "(UTC +02:00) Cairo"
              },
              {
                "id": 51,
                "offset": 3,
                "name": "(UTC +02:00) Damascus"
              },
              {
                "id": 52,
                "offset": 3,
                "name": "(UTC +02:00) E. Europe"
              },
              {
                "id": 53,
                "offset": 2,
                "name": "(UTC +02:00) Harare, Pretoria"
              },
              {
                "id": 54,
                "offset": 3,
                "name": "(UTC +02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius"
              },
              {
                "id": 55,
                "offset": 3,
                "name": "(UTC +03:00) Istanbul"
              },
              {
                "id": 56,
                "offset": 3,
                "name": "(UTC +02:00) Jerusalem"
              },
              {
                "id": 57,
                "offset": 2,
                "name": "(UTC +02:00) Tripoli"
              },
              {
                "id": 58,
                "offset": 3,
                "name": "(UTC +03:00) Amman"
              },
              {
                "id": 59,
                "offset": 3,
                "name": "(UTC +03:00) Baghdad"
              },
              {
                "id": 60,
                "offset": 3,
                "name": "(UTC +02:00) Kaliningrad"
              },
              {
                "id": 61,
                "offset": 3,
                "name": "(UTC +03:00) Kuwait, Riyadh"
              },
              {
                "id": 62,
                "offset": 3,
                "name": "(UTC +03:00) Nairobi"
              },
              {
                "id": 63,
                "offset": 3,
                "name": "(UTC +03:00) Moscow, St. Petersburg, Volgograd, Minsk"
              },
              {
                "id": 64,
                "offset": 4,
                "name": "(UTC +04:00) Samara, Ulyanovsk, Saratov"
              },
              {
                "id": 65,
                "offset": 4.5,
                "name": "(UTC +03:30) Tehran"
              },
              {
                "id": 66,
                "offset": 4,
                "name": "(UTC +04:00) Abu Dhabi, Muscat"
              },
              {
                "id": 67,
                "offset": 5,
                "name": "(UTC +04:00) Baku"
              },
              {
                "id": 68,
                "offset": 4,
                "name": "(UTC +04:00) Port Louis"
              },
              {
                "id": 69,
                "offset": 4,
                "name": "(UTC +04:00) Tbilisi"
              },
              {
                "id": 70,
                "offset": 4,
                "name": "(UTC +04:00) Yerevan"
              },
              {
                "id": 71,
                "offset": 4.5,
                "name": "(UTC +04:30) Kabul"
              },
              {
                "id": 72,
                "offset": 5,
                "name": "(UTC +05:00) Ashgabat, Tashkent"
              },
              {
                "id": 73,
                "offset": 5,
                "name": "(UTC +05:00) Yekaterinburg"
              },
              {
                "id": 74,
                "offset": 5,
                "name": "(UTC +05:00) Islamabad, Karachi"
              },
              {
                "id": 75,
                "offset": 5.5,
                "name": "(UTC +05:30) Chennai, Kolkata, Mumbai, New Delhi"
              },
              {
                "id": 76,
                "offset": 5.5,
                "name": "(UTC +05:30) Sri Jayawardenepura"
              },
              {
                "id": 77,
                "offset": 5.75,
                "name": "(UTC +05:45) Kathmandu"
              },
              {
                "id": 78,
                "offset": 6,
                "name": "(UTC +06:00) Nur-Sultan (Astana)"
              },
              {
                "id": 79,
                "offset": 6,
                "name": "(UTC +06:00) Dhaka"
              },
              {
                "id": 80,
                "offset": 6.5,
                "name": "(UTC +06:30) Yangon (Rangoon)"
              },
              {
                "id": 81,
                "offset": 7,
                "name": "(UTC +07:00) Bangkok, Hanoi, Jakarta"
              },
              {
                "id": 82,
                "offset": 7,
                "name": "(UTC +07:00) Novosibirsk"
              },
              {
                "id": 83,
                "offset": 8,
                "name": "(UTC +08:00) Beijing, Chongqing, Hong Kong, Urumqi"
              },
              {
                "id": 84,
                "offset": 8,
                "name": "(UTC +08:00) Krasnoyarsk"
              },
              {
                "id": 85,
                "offset": 8,
                "name": "(UTC +08:00) Kuala Lumpur, Singapore"
              },
              {
                "id": 86,
                "offset": 8,
                "name": "(UTC +08:00) Perth"
              },
              {
                "id": 87,
                "offset": 8,
                "name": "(UTC +08:00) Taipei"
              },
              {
                "id": 88,
                "offset": 8,
                "name": "(UTC +08:00) Ulaanbaatar"
              },
              {
                "id": 89,
                "offset": 8,
                "name": "(UTC +08:00) Irkutsk"
              },
              {
                "id": 90,
                "offset": 9,
                "name": "(UTC +09:00) Osaka, Sapporo, Tokyo"
              },
              {
                "id": 91,
                "offset": 9,
                "name": "(UTC +09:00) Seoul"
              },
              {
                "id": 92,
                "offset": 9.5,
                "name": "(UTC +09:30) Adelaide"
              },
              {
                "id": 93,
                "offset": 9.5,
                "name": "(UTC +09:30) Darwin"
              },
              {
                "id": 94,
                "offset": 10,
                "name": "(UTC +10:00) Brisbane"
              },
              {
                "id": 95,
                "offset": 10,
                "name": "(UTC +10:00) Canberra, Melbourne, Sydney"
              },
              {
                "id": 96,
                "offset": 10,
                "name": "(UTC +10:00) Guam, Port Moresby"
              },
              {
                "id": 97,
                "offset": 10,
                "name": "(UTC +10:00) Hobart"
              },
              {
                "id": 98,
                "offset": 9,
                "name": "(UTC +09:00) Yakutsk"
              },
              {
                "id": 99,
                "offset": 11,
                "name": "(UTC +11:00) Solomon Is., New Caledonia"
              },
              {
                "id": 100,
                "offset": 10,
                "name": "(UTC +10:00) Vladivostok"
              },
              {
                "id": 101,
                "offset": 11,
                "name": "(UTC +11:00) Sakhalin"
              },
            
              {
                "id": 102,
                "offset": 12,
                "name": "(UTC +12:00) Auckland, Wellington"
              },
              {
                "id": 103,
                "offset": 12,
                "name": "(UTC +12:00) Coordinated Universal Time+12"
              },
              {
                "id": 104,
                "offset": 12,
                "name": "(UTC +12:00) Fiji"
              },
              {
                "id": 105,
                "offset": 12,
                "name": "(UTC +12:00) Magadan"
              },
              {
                "id": 106,
                "offset": 13,
                "name": "(UTC +12:00) Petropavlovsk-Kamchatsky - Old"
              },
              {
                "id": 107,
                "offset": 13,
                "name": "(UTC +13:00) Nuku'alofa"
              },
              {
                "id": 108,
                "offset": 13,
                "name": "(UTC +13:00) Samoa"
              }
            ]
            """;
    return List.of(objectMapper.readValue(list, TimezoneData[].class));
  }

  @Override
  public List<String> loadUnicodeLocalesList() {
    List<String> localeList = new ArrayList<>();
    Locale.getISOCountries(IsoCountryCode.PART1_ALPHA2)
        .forEach(
            locale ->
            {
              if (!locale.isEmpty()) {
                localeList.add(locale);
              }
            });

    localeList.sort(Comparator.naturalOrder());
    return localeList;
  }
}
