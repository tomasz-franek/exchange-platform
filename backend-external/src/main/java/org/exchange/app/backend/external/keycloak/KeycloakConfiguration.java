package org.exchange.app.backend.external.keycloak;


import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import java.util.List;
import org.exchange.app.backend.common.cache.CacheConfiguration;
import org.exchange.app.backend.common.keycloak.KeycloakOAuth2AuthenticationEntryPoint;
import org.exchange.app.backend.common.keycloak.KeycloakOpaqueTokenIntrospector;
import org.exchange.app.backend.common.keycloak.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

@Configuration
@EnableWebSecurity
public class KeycloakConfiguration {

  private final static String[] allowedEndpoints = new String[]{
      "/swagger-ui/**",
      "/v3/api-docs/**",
      "/dictionaries/**"
  };

  @Value("${exchange-portal.allowed-origins}")
  private List<String> allowedOrigins;
  @Value("${spring.security.oauth2.resourceserver.opaquetoken.introspection-uri}")
  private String introspectionUri;
  @Value("${spring.security.oauth2.resourceserver.opaquetoken.client-id}")
  private String clientId;
  @Value("${spring.security.oauth2.resourceserver.opaquetoken.client-secret}")
  private String clientSecret;
  @Autowired
  private UserService userService;

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
        .cors((cors) -> corsConfigurationSource())
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
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(allowedOrigins);
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(
        List.of("authorization", "content-type", "x-auth-token", "content-disposition"));
    configuration.setExposedHeaders(List.of("x-auth-token", "content-disposition"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
