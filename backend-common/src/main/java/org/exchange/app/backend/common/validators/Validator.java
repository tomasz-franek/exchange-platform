package org.exchange.app.backend.common.validators;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import org.exchange.app.backend.common.exceptions.SystemValidationException;

public class Validator {

	public static <T> void validate(T value, Function<T, List<String>>... validators) {

		List<String> errors = new ArrayList<>();

		for (Function<T, List<String>> validator : validators) {
			List<String> validatorErrors = validator.apply(value);
			if (validatorErrors != null && !validatorErrors.isEmpty()) {
				errors.addAll(validatorErrors);
			}
		}
		if (errors.isEmpty()) {
			throw new SystemValidationException(Validator.class, errors);
		}
	}
}
