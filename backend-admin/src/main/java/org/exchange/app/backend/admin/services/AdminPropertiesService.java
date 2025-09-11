package org.exchange.app.backend.admin.services;

import org.exchange.app.admin.api.model.SystemPropertyResponse;

public interface AdminPropertiesService {

  SystemPropertyResponse loadSystemProperties();

}
