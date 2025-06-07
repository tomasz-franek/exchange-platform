package org.exchange.app.backend.external.keycloak;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

@Log4j2
public class KeycloakOAuth2AuthenticationEntryPoint implements AuthenticationEntryPoint {

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException authException) {

    log.error(authException);
    HttpStatus status = HttpStatus.UNAUTHORIZED;
    response.addHeader(HttpHeaders.WWW_AUTHENTICATE, "Bearer");
    response.setStatus(status.value());
    ThreadContext.clearAll();
  }
}
