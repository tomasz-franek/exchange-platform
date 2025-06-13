package org.exchange.app.backend.db.validators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class EntityValidator {

	public static <T extends Entity> Function<T, List<String>> haveCorrectFieldTextValues() {
		return entity -> {
			List<String> errors = new ArrayList<>();
			Class<?> clazz = entity.getClass();

			if (!clazz.isAnnotationPresent(Entity.class)) {
				throw new IllegalArgumentException("Class is not an entity.");
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
								errors.add(
										"Field '" + field.getName() + "' exceeds maximum length of " + maxLength + ".");
							}
						} catch (IllegalAccessException e) {
							errors.add("Unable to access field: " + field.getName());
						}
					}
				}
			}
			return errors;
		};
	}

	public static <T extends Entity> Function<T, List<String>> haveNotNullValues() {
		return entity -> {
			List<String> errors = new ArrayList<>();
			Class<?> clazz = entity.getClass();

			if (!clazz.isAnnotationPresent(Entity.class)) {
				throw new IllegalArgumentException("Class is not an entity.");
			}

			for (Field field : clazz.getDeclaredFields()) {
				if (field.isAnnotationPresent(Column.class)) {
					Column column = field.getAnnotation(Column.class);
					if (column != null) {
						boolean nullable = column.nullable();

						field.setAccessible(true);
						try {
							Object value = field.get(entity);
							if (value == null) {
								errors.add(
										"Field '" + field.getName() + "' is null but column is marked as not null");
							}
						} catch (IllegalAccessException e) {
							errors.add("Unable to access field: " + field.getName());
						}
					}
				}
			}
			return errors;
		};
	}
}
