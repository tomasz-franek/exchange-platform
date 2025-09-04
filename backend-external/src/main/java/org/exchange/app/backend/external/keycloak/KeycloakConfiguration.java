package org.exchange.app.backend.external.keycloak;


import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.cache.CacheConfiguration;
import org.exchange.app.backend.common.keycloak.KeycloakOAuth2AuthenticationEntryPoint;
import org.exchange.app.backend.common.keycloak.KeycloakOpaqueTokenIntrospector;
import org.exchange.app.backend.common.keycloak.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Log4j2
@Configuration
@EnableWebSecurity
@ConditionalOnProperty(name = "exchange-portal.security.active", havingValue = "true")
public class KeycloakConfiguration {

  private final static String[] allowedEndpoints = new String[]{
      "/swagger-ui/**",
      "/v3/api-docs/**",
      "/system/**",
      "/actuator/**",
      "/dictionaries/**",
      "/order-book/**"
  };

  private final List<String> allowedOrigins;
  private final String introspectionUri;
  private final String clientId;
  private final String clientSecret;
  private UserService userService;

  public KeycloakConfiguration(
      @Value("${exchange-portal.allowed-origins}") List<String> allowedOrigins,
      @Value("${spring.security.oauth2.resourceserver.opaquetoken.introspection-uri}") String introspectionUri,
      @Value("${spring.security.oauth2.resourceserver.opaquetoken.client-id}") String clientId,
      @Value("${spring.security.oauth2.resourceserver.opaquetoken.client-secret}") String clientSecret,
      @Autowired UserService userService) {
    this.allowedOrigins = allowedOrigins;
    this.introspectionUri = introspectionUri;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.userService = userService;
  }

  @Bean
  CacheManager cacheManager() {
    CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.registerCustomCache(CacheConfiguration.KEYCLOAK_TOKEN_CACHE,
        Caffeine.newBuilder().expireAfterAccess(Duration.ofSeconds(30)).build());
    return cacheManager;
  }

  @Bean
  public OpaqueTokenIntrospector keycloakOpaqueTokenIntrospector(UserService userService) {
    this.userService = userService;
    return new KeycloakOpaqueTokenIntrospector(introspectionUri, clientId, clientSecret,
        this.userService, cacheManager());
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors((cors) -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(authorization ->
            authorization
                .requestMatchers(allowedEndpoints).permitAll()
                .anyRequest().authenticated()
        ).oauth2ResourceServer(oauth2 ->
            oauth2.opaqueToken(configurer ->
                    configurer.introspector(keycloakOpaqueTokenIntrospector(this.userService)))
                .authenticationEntryPoint(customAuthenticationEntryPoint())
        );
    return http.build();
  }

  @Bean
  public AuthenticationEntryPoint customAuthenticationEntryPoint() {
    return new KeycloakOAuth2AuthenticationEntryPoint();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    log.info("External allowed origins {}", this.allowedOrigins);
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(this.allowedOrigins);
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(
        List.of("authorization", "content-type", "x-auth-token", "content-disposition"));
    configuration.setExposedHeaders(List.of("x-auth-token", "content-disposition"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
