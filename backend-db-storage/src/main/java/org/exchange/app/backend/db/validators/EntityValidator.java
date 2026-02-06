package org.exchange.app.backend.db.validators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;
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
  public static final String CLASS = "class";

  private EntityValidator() {
  }
  public static Validator haveCorrectFieldTextValues(Object entity) {
    return result -> {
      Class<?> clazz = entity.getClass();

      checkClassAnnotationEntity(clazz);

      for (Field field : clazz.getDeclaredFields()) {
        if (field.isAnnotationPresent(Column.class)) {
          Column column = field.getAnnotation(Column.class);
          if (column != null) {
            int maxLength = column.length();

            getPropertyDescriptor(clazz, field).ifPresent(propertyDescriptor -> {
              try {
                Object object = propertyDescriptor.getReadMethod().invoke(entity);
                checkMaximumLengthForField(field.getName(), object, maxLength, result);
              } catch (IllegalAccessException | InvocationTargetException _) {
                result.add(String.format(UNABLE_TO_ACCESS_FIELD, field.getName()));
              }
            });

          }
        }
      }
      return result;
    };
  }

  static void checkMaximumLengthForField(String fieldName, Object value, int maxLength,
      List<String> result) {
    if (value != null && value.toString().length() > maxLength) {
      result.add(String.format(FIELD_EXCEEDS_MAXIMUM_LENGTH, fieldName, maxLength));
    }
  }

  static void checkClassAnnotationEntity(Class<?> clazz) {
    if (!clazz.isAnnotationPresent(Entity.class)) {
      throw new IllegalArgumentException(OBJECT_IS_NOT_AN_ENTITY);
    }
  }

  public static Validator haveNotNullValues(Object entity) {
    return result -> {
      Class<?> clazz = entity.getClass();

      checkClassAnnotationEntity(clazz);

      for (Field field : clazz.getDeclaredFields()) {
        if (field.isAnnotationPresent(Column.class)) {
          Column column = field.getAnnotation(Column.class);
          checkColumNullValue(clazz, entity, result, field, column);
        }
      }
      return result;
    };
  }

  private static void checkColumNullValue(Class<?> clazz, Object entity, List<String> result,
      Field field, Column column) {
    if (column != null) {
      boolean nullable = column.nullable();
      if (!nullable) {
        getPropertyDescriptor(clazz, field).ifPresent(propertyDescriptor -> {
          Object object = null;
          try {
            object = propertyDescriptor.getReadMethod().invoke(entity);
          } catch (IllegalAccessException | InvocationTargetException _) {
            result.add(String.format(UNABLE_TO_ACCESS_FIELD, field.getName()));
          }
          if (object == null) {
            result.add(
                String.format(FIELD_IS_NULL_BUT_COLUMN_MARKED_AS_NOT_NULL, field.getName()));
          }
        });
      }
    }
  }


  static Optional<PropertyDescriptor> getPropertyDescriptor(Class<?> clazz, Field field) {
    try {
      for (PropertyDescriptor pd : Introspector.getBeanInfo(clazz)
          .getPropertyDescriptors()) {
        if (pd.getName().equals(field.getName()) && pd.getReadMethod() != null
            && !CLASS.equals(pd.getName())) {
          return Optional.of(pd);
        }
      }
    } catch (IntrospectionException _) {
      return Optional.empty();
    }
    return Optional.empty();
  }

  public static Validator haveValidChecksum(Object entity) {
    return result -> {

      if (entity instanceof ExchangeEventSourceEntity exchangeEventSource
          && !exchangeEventSource.getChecksum()
          .equals(ChecksumUtil.checksum(exchangeEventSource))) {
        result.add(
            String.format(INVALID_CHECKSUM_FOR_EXCHANGE_EVENT, exchangeEventSource.getId()));
      }
      return result;
    };
  }

  public static Validator haveEmptyField(Object entity, String fieldName) {
    return result -> {
      Class<?> clazz = entity.getClass();

      checkClassAnnotationEntity(clazz);

      for (final Field field : clazz.getDeclaredFields()) {
        if (field.isAnnotationPresent(Column.class) && field.getName().equals(fieldName)) {
          Column column = field.getAnnotation(Column.class);
          checkColumEmptyField(entity, result, field, column, clazz);
        }
      }
      return result;
    };
  }

  private static void checkColumEmptyField(Object entity, List<String> result, Field field,
      Column column,
      Class<?> clazz) {
    if (column != null) {

      getPropertyDescriptor(clazz, field).ifPresent(propertyDescriptor -> {
        try {
          Object object = propertyDescriptor.getReadMethod().invoke(entity);
          checkFiledIsBlank(result, field, object);
        } catch (IllegalAccessException | InvocationTargetException _) {
          result.add(String.format(UNABLE_TO_ACCESS_FIELD, field.getName()));
        }
      });
    }
  }

  private static void checkFiledIsBlank(List<String> result, Field field, Object object) {
    if (object == null || object.toString().isBlank()) {
      result.add(
          String.format(FIELD_IS_EMPTY, field.getName()));
    }
  }
}
