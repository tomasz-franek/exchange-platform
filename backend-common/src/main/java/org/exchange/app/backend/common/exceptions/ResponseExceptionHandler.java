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
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {

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

  @ExceptionHandler(UserAccountException.class)
  protected ResponseEntity<Object> userAccountExceptionHandler(
      UserAccountException exception,
      WebRequest webRequest
  ) {
    return handleExceptionInternal(exception, exception.getExceptionResponse(),
        new HttpHeaders(), HttpStatus.BAD_REQUEST, webRequest);
  }

  @ExceptionHandler(ObjectAlreadyExistsException.class)
  protected ResponseEntity<Object> objectAlreadyExistsExceptionHandler(
      ObjectAlreadyExistsException exception,
      WebRequest webRequest
  ) {
    return handleExceptionInternal(exception, exception.getExceptionResponse(),
        new HttpHeaders(), HttpStatus.FOUND, webRequest);
  }

  @ExceptionHandler(SystemValidationException.class)
  protected ResponseEntity<Object> objectSystemValidationExceptionHandler(
      SystemValidationException exception,
      WebRequest webRequest
  ) {
    return handleExceptionInternal(exception, exception.getExceptionResponse(), new HttpHeaders(),
        HttpStatus.BAD_REQUEST, webRequest);
  }

  @ExceptionHandler(EntityVersionException.class)
  protected ResponseEntity<Object> entityVersionExceptionErrorHandler(
      EntityVersionException exception,
      WebRequest webRequest
  ) {
    return handleExceptionInternal(exception, exception.getExceptionResponse(),
        new HttpHeaders(), HttpStatus.CONFLICT, webRequest);
  }

  @ExceptionHandler(ObjectWithIdNotFoundException.class)
  protected ResponseEntity<Object> objectWithIdNotFoundErrorHandler(
      ObjectWithIdNotFoundException exception,
      WebRequest webRequest
  ) {
    return handleExceptionInternal(exception, exception.getExceptionRecord(),
        new HttpHeaders(), HttpStatus.NOT_FOUND, webRequest);
  }
}
