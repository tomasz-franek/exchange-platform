package org.exchange.app.backend.external.keycloak;

import java.util.List;
import org.exchange.app.backend.common.keycloak.KeycloakOpaqueTokenIntrospector;
import org.exchange.app.backend.common.keycloak.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
@SpringBootTest
class KeycloakConfigurationTest {

  @Mock
  private UserService userService;

  private final List<String> allowedOrigins = List.of("http://localhost:8080");

  @InjectMocks
  private KeycloakConfiguration keycloakConfiguration;

  @BeforeEach
  void setUp() {
    String introspectionUri = "http://localhost:8080/introspect";
    String clientId = "test-client-id";
    String clientSecret = "test-client-secret";
    keycloakConfiguration = new KeycloakConfiguration(allowedOrigins, introspectionUri, clientId,
        clientSecret, userService);
  }

  @Test
  void cacheManager_should_createManager_when_methodCalled() {
    CacheManager cacheManager = keycloakConfiguration.cacheManager();
    assertThat(cacheManager).isNotNull().isInstanceOf(CaffeineCacheManager.class);
  }

  @Test
  void keycloakOpaqueTokenIntrospector_should_createOpaqueTokenIntrospector_when_methodCalled() {
    OpaqueTokenIntrospector introspector = keycloakConfiguration.keycloakOpaqueTokenIntrospector(
        userService);
    assertThat(introspector).isNotNull().isInstanceOf(KeycloakOpaqueTokenIntrospector.class);
  }

  @Test
  void filterChain_should_createSecurityFilterChain_when_methodCalled() {

    HttpSecurity http = mock(HttpSecurity.class);
    DefaultSecurityFilterChain defaultSecurityFilterChain = mock(DefaultSecurityFilterChain.class);
    when(http.cors(any())).thenReturn(http);
    when(http.authorizeHttpRequests(any())).thenReturn(http);
    when(http.oauth2ResourceServer(any())).thenReturn(http);
    when(http.build()).thenReturn(defaultSecurityFilterChain);

    SecurityFilterChain filterChain = keycloakConfiguration.filterChain(http);

		assertThat(filterChain).isNotNull();
    verify(http).cors(any());
    verify(http).authorizeHttpRequests(any());
    verify(http).oauth2ResourceServer(any());
  }

  @Test
  void customAuthenticationEntryPoint_should_createSecurityFilterChain_when_methodCalled() {
    AuthenticationEntryPoint entryPoint = keycloakConfiguration.customAuthenticationEntryPoint();
    assertThat(entryPoint).isNotNull().isInstanceOf(AuthenticationEntryPoint.class);
  }

  @Test
  void corsConfigurationSource_should_createCorsConfigurationSource_when_methodCalled() {
    CorsConfigurationSource corsSource = keycloakConfiguration.corsConfigurationSource();
		assertThat(corsSource).isNotNull();
  }
}