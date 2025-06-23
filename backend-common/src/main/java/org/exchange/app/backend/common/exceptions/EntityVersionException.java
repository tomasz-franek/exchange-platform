package org.exchange.app.backend.common.exceptions;

import lombok.Getter;

@Getter
public class EntityVersionException extends RuntimeException {

  private final ExceptionResponse exceptionResponse;

  public EntityVersionException(String typeName, int currentVersion, int newVersion) {
    this.exceptionResponse = new ExceptionResponse(typeName,
        String.format("Invalid version for entity row currentVersion=%d newVersion=%d",
            currentVersion, newVersion));
  }
}

