package org.exchange.app.backend.common.validators;

import java.util.List;

public interface Validator {

  List<String> validate(List<String> result);
}
