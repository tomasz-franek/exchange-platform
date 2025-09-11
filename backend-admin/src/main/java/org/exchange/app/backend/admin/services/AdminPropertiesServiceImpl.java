package org.exchange.app.backend.admin.services;

import org.exchange.app.admin.api.model.SystemPropertyResponse;
import org.springframework.stereotype.Service;

@Service
public class AdminPropertiesServiceImpl implements AdminPropertiesService {


  @Override
  public SystemPropertyResponse loadSystemProperties() {
    // todo: implement method- read from internal backend
    return new SystemPropertyResponse("", "");
  }
}
