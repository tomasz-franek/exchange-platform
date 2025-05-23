package org.exchange.app.backend.common.exceptions;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Log4j2
@ControllerAdvice
public class CommonResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(EntityNotFoundException.class)
  protected ResponseEntity<Object> entityNotFoundExceptionHandler(
      EntityNotFoundException exception,
      WebRequest webRequest
  ) {
    return handleExceptionInternal(exception, exception.getExceptionResponse(),
        new HttpHeaders(), HttpStatus.NOT_FOUND, webRequest);
  }

  @ExceptionHandler(InsufficientFundsException.class)
  protected ResponseEntity<Object> insufficientFundsExceptionHandler(
      InsufficientFundsException exception,
      WebRequest webRequest
  ) {
    return handleExceptionInternal(exception, exception.getExceptionResponse(),
        new HttpHeaders(), HttpStatus.BAD_REQUEST, webRequest);
  }
}
