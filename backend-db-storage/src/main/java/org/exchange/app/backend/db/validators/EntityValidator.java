package org.exchange.app.backend.db.validators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.lang.reflect.Field;
import org.exchange.app.backend.common.validators.Validator;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.utils.ChecksumUtil;

public class EntityValidator {

  public static final String FIELD_EXCEEDS_MAXIMUM_LENGTH = "Field '%s' exceeds maximum length of %d.";
  public static final String OBJECT_IS_NOT_AN_ENTITY = "Object is not an entity.";
  public static final String INVALID_CHECKSUM_FOR_EXCHANGE_EVENT = "Invalid checksum for ExchangeEventSourceEntity with id=%d";
  public static final String FIELD_IS_NULL_BUT_COLUMN_MARKED_AS_NOT_NULL = "Field '%s' is null but column is marked as not null";
  public static final String FIELD_IS_EMPTY = "Field '%s' is empty but column is should not be empty";
  public static final String UNABLE_TO_ACCESS_FIELD = "Unable to access field: %s";

  public static Validator haveCorrectFieldTextValues(Object entity) {
    return result -> {
      Class<?> clazz = entity.getClass();

      if (!clazz.isAnnotationPresent(Entity.class)) {
        throw new IllegalArgumentException(OBJECT_IS_NOT_AN_ENTITY);
      }

      for (Field field : clazz.getDeclaredFields()) {
        if (field.isAnnotationPresent(Column.class)) {
          Column column = field.getAnnotation(Column.class);
          if (column != null) {
            int maxLength = column.length();

            field.setAccessible(true);
            try {
              Object object = field.get(entity);
              if (object instanceof String value) {
                if (value.length() > maxLength) {
                  result.add(
                      String.format(FIELD_EXCEEDS_MAXIMUM_LENGTH, field.getName(), maxLength));
                }
              } else {
                if (object != null) {
                  String value = object.toString();
                  if (value != null && value.length() > maxLength) {
                    result.add(
                        String.format(FIELD_EXCEEDS_MAXIMUM_LENGTH, field.getName(), maxLength));
                  }
                }
              }
            } catch (IllegalAccessException e) {
              result.add(String.format(UNABLE_TO_ACCESS_FIELD, field.getName()));
            }
          }
        }
      }
      return result;
    };
  }

  public static Validator haveNotNullValues(Object entity) {
    return result -> {
      Class<?> clazz = entity.getClass();

      if (!clazz.isAnnotationPresent(Entity.class)) {
        throw new IllegalArgumentException(OBJECT_IS_NOT_AN_ENTITY);
      }

      for (Field field : clazz.getDeclaredFields()) {
        if (field.isAnnotationPresent(Column.class)) {
          Column column = field.getAnnotation(Column.class);
          if (column != null) {
            boolean nullable = column.nullable();
            if (!nullable) {
              field.setAccessible(true);
              try {
                Object value = field.get(entity);
                if (value == null) {
                  result.add(
                      String.format(FIELD_IS_NULL_BUT_COLUMN_MARKED_AS_NOT_NULL, field.getName()));
                }
              } catch (IllegalAccessException e) {
                result.add(String.format(UNABLE_TO_ACCESS_FIELD, field.getName()));
              }
            }
          }
        }
      }
      return result;
    };
  }

  public static Validator haveValidChecksum(Object entity) {
    return result -> {

      if (entity instanceof ExchangeEventSourceEntity exchangeEventSource) {
        if (!exchangeEventSource.getChecksum().equals(ChecksumUtil.checksum(exchangeEventSource))) {
          result.add(
              String.format(INVALID_CHECKSUM_FOR_EXCHANGE_EVENT, exchangeEventSource.getId()));
        }
      }
      return result;
    };
  }

  public static Validator haveEmptyField(Object entity, String fieldName) {
    return result -> {
      Class<?> clazz = entity.getClass();

      if (!clazz.isAnnotationPresent(Entity.class)) {
        throw new IllegalArgumentException(OBJECT_IS_NOT_AN_ENTITY);
      }

      for (Field field : clazz.getDeclaredFields()) {
        if (field.isAnnotationPresent(Column.class) && field.getName().equals(fieldName)) {
          Column column = field.getAnnotation(Column.class);
          if (column != null) {
            field.setAccessible(true);
            try {
              Object object = field.get(entity);
              if (object instanceof String value) {
                if (value.isBlank()) {
                  result.add(
                      String.format(FIELD_IS_EMPTY, field.getName()));
                }
              } else {
                if (object != null) {
                  String value = object.toString();
                  if (value.isBlank()) {
                    result.add(
                        String.format(FIELD_IS_EMPTY, field.getName()));
                  }
                }
              }
            } catch (IllegalAccessException e) {
              result.add(String.format(UNABLE_TO_ACCESS_FIELD, field.getName()));
            }
          }
        }
      }
      return result;
    };
  }
}
