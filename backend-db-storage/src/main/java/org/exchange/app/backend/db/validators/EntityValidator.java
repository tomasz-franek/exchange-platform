package org.exchange.app.backend.db.validators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.lang.reflect.Field;
import org.exchange.app.backend.common.validators.Validator;

public class EntityValidator {

  public static Validator haveCorrectFieldTextValues(Object entity) {
    return result -> {
      Class<?> clazz = entity.getClass();

      if (!clazz.isAnnotationPresent(Entity.class)) {
        throw new IllegalArgumentException("Object is not an entity.");
      }

      for (Field field : clazz.getDeclaredFields()) {
        if (field.isAnnotationPresent(Column.class)) {
          Column column = field.getAnnotation(Column.class);
          if (column != null) {
            int maxLength = column.length();

            field.setAccessible(true);
            try {
              String value = (String) field.get(entity);
              if (value != null && value.length() > maxLength) {
                result.add(
                    "Field '" + field.getName() + "' exceeds maximum length of " + maxLength + ".");
              }
            } catch (IllegalAccessException e) {
              result.add("Unable to access field: " + field.getName());
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
        throw new IllegalArgumentException("Object is not an entity.");
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
                      "Field '" + field.getName() + "' is null but column is marked as not null");
                }
              } catch (IllegalAccessException e) {
                result.add("Unable to access field: " + field.getName());
              }
            }
          }
        }
      }
      return result;
    };
  }
}
