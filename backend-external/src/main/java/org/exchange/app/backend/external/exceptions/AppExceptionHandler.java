package org.exchange.app.backend.external.exceptions;

import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.exceptions.EntityVersionException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Log4j2
@ControllerAdvice
public class AppExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(ObjectWithIdNotFoundException.class)
  protected ResponseEntity<Object> objectWithIdNotFoundErrorHandler(
      ObjectWithIdNotFoundException exception,
      WebRequest webRequest
  ) {
    return handleExceptionInternal(exception, exception.getExceptionRecord(),
        new HttpHeaders(), HttpStatus.NOT_FOUND, webRequest);
  }

  @ExceptionHandler(EntityVersionException.class)
  protected ResponseEntity<Object> entityVersionExceptionErrorHandler(
      EntityVersionException exception,
      WebRequest webRequest
  ) {
    return handleExceptionInternal(exception, exception.getExceptionResponse(),
        new HttpHeaders(), HttpStatus.CONFLICT, webRequest);
  }
}
