package org.exchange.app.backend.common.keycloak;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class KeycloakProperties {

  private final String introspectionUri;
  private final String clientId;
  private final String clientSecret;
  private final String portalClientName;

  public KeycloakProperties(
      @Value("${spring.security.oauth2.resourceserver.opaquetoken.introspection-uri}") String introspectionUri,
      @Value("${spring.security.oauth2.resourceserver.opaquetoken.client-id}") String clientId,
      @Value("${spring.security.oauth2.resourceserver.opaquetoken.client-secret}") String clientSecret,
      @Value("${exchange-portal.security.keycloak.client-name}") String portalClientName) {
    this.introspectionUri = introspectionUri;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.portalClientName = portalClientName;
  }
}
