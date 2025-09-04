package org.exchange.app.backend.common.validators;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lombok.Getter;
import org.exchange.app.backend.common.exceptions.SystemValidationException;
import org.springframework.stereotype.Service;

@Service
public class SystemValidator {

  @Getter
  private final List<String> errors = new ArrayList<>();

  private SystemValidator() {
  }

  public static SystemValidator validate(Validator... validatorList) {
    SystemValidator systemValidator = new SystemValidator();
    Arrays.stream(validatorList).forEach(v -> v.validate(systemValidator.getErrors()));
    return systemValidator;
  }

  public void throwValidationExceptionWhenErrors() {
    if (!errors.isEmpty()) {
      throw new SystemValidationException(SystemValidator.class, errors);
    }
  }
}
